import json
import time
from typing import AsyncGenerator, Optional
import httpx

from .base import BaseProvider, ProviderRegistry


class OpenAIProvider(BaseProvider):
    DEFAULT_URL = "https://api.openai.com/v1"

    @property
    def _base_url(self):
        return (self.channel.get("api_url") or self.DEFAULT_URL).rstrip("/")

    @property
    def _headers(self):
        return {
            "Authorization": f"Bearer {self.channel['api_key']}",
            "Content-Type": "application/json",
        }

    def _build_payload(self, request: dict) -> dict:
        payload = {k: v for k, v in request.items() if v is not None}
        payload.pop("stream", None)
        return payload

    async def chat_completion(self, request: dict, user: Optional[dict] = None) -> dict:
        payload = self._build_payload(request)
        async with httpx.AsyncClient(timeout=120) as client:
            resp = await client.post(
                f"{self._base_url}/chat/completions",
                headers=self._headers,
                json=payload,
            )
            if resp.status_code != 200:
                raise Exception(f"OpenAI API error {resp.status_code}: {resp.text}")
            return resp.json()

    async def chat_completion_stream(
        self, request: dict, user: Optional[dict] = None
    ) -> AsyncGenerator[bytes, None]:
        payload = self._build_payload(request)
        payload["stream"] = True
        payload["stream_options"] = {"include_usage": True}
        async with httpx.AsyncClient(timeout=300) as client:
            async with client.stream(
                "POST",
                f"{self._base_url}/chat/completions",
                headers=self._headers,
                json=payload,
            ) as resp:
                if resp.status_code != 200:
                    error_body = await resp.aread()
                    yield json.dumps({"error": f"Upstream {resp.status_code}: {error_body.decode()}"}).encode()
                    return
                async for line in resp.aiter_lines():
                    if line.startswith("data: "):
                        yield (line + "\n\n").encode()
                yield b"data: [DONE]\n\n"

    def get_model_list(self) -> list:
        models_str = self.channel.get("models")
        if models_str:
            return [m.strip() for m in models_str.split(",") if m.strip()]
        return [
            "gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-4",
            "gpt-3.5-turbo", "o1", "o1-mini", "o3-mini",
        ]


ProviderRegistry.register("openai", OpenAIProvider)
ProviderRegistry.register("azure", OpenAIProvider)
