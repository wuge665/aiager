import json
from typing import AsyncGenerator, Optional, List, Dict, Any
import httpx

from .base import BaseProvider, ProviderRegistry


ANTHROPIC_API = "https://api.anthropic.com/v1"


class AnthropicProvider(BaseProvider):
    @property
    def _headers(self):
        return {
            "x-api-key": self.channel["api_key"],
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        }

    def _convert_messages(self, messages: List[Dict]) -> list:
        system = None
        converted = []
        for msg in messages:
            role = msg["role"]
            content = msg["content"]
            if role == "system":
                system = content if isinstance(content, str) else content
                continue
            if role == "assistant":
                converted.append({"role": "assistant", "content": content})
            else:
                converted.append({"role": "user", "content": content})
        return system, converted

    def _to_openai_response(self, raw: dict, model: str) -> dict:
        content = ""
        for block in raw.get("content", []):
            if block.get("type") == "text":
                content += block.get("text", "")
        usage = raw.get("usage", {})
        return {
            "id": raw.get("id", ""),
            "object": "chat.completion",
            "model": model,
            "choices": [{
                "index": 0,
                "message": {"role": "assistant", "content": content},
                "finish_reason": raw.get("stop_reason", "stop"),
            }],
            "usage": {
                "prompt_tokens": usage.get("input_tokens", 0),
                "completion_tokens": usage.get("output_tokens", 0),
                "total_tokens": usage.get("input_tokens", 0) + usage.get("output_tokens", 0),
            },
        }

    async def chat_completion(self, request: dict, user: Optional[dict] = None) -> dict:
        system, messages = self._convert_messages(request.get("messages", []))
        payload = {
            "model": request.get("model", "claude-3-opus-20240229"),
            "messages": messages,
            "max_tokens": request.get("max_tokens", 4096),
        }
        if system:
            payload["system"] = system
        if request.get("temperature") is not None:
            payload["temperature"] = request["temperature"]
        if request.get("top_p") is not None:
            payload["top_p"] = request["top_p"]
        if request.get("stop"):
            payload["stop_sequences"] = request["stop"] if isinstance(request["stop"], list) else [request["stop"]]

        async with httpx.AsyncClient(timeout=120) as client:
            resp = await client.post(
                f"{ANTHROPIC_API}/messages",
                headers=self._headers,
                json=payload,
            )
            if resp.status_code != 200:
                raise Exception(f"Claude API error {resp.status_code}: {resp.text}")
            raw = resp.json()
            return self._to_openai_response(raw, request.get("model", ""))

    async def chat_completion_stream(self, request: dict, user: Optional[dict] = None) -> AsyncGenerator[bytes, None]:
        system, messages = self._convert_messages(request.get("messages", []))
        payload = {
            "model": request.get("model", "claude-3-opus-20240229"),
            "messages": messages,
            "max_tokens": request.get("max_tokens", 4096),
            "stream": True,
        }
        if system:
            payload["system"] = system
        if request.get("temperature") is not None:
            payload["temperature"] = request["temperature"]

        async with httpx.AsyncClient(timeout=300) as client:
            async with client.stream(
                "POST",
                f"{ANTHROPIC_API}/messages",
                headers=self._headers,
                json=payload,
            ) as resp:
                if resp.status_code != 200:
                    error_body = await resp.aread()
                    yield json.dumps({"error": f"Claude upstream {resp.status_code}: {error_body.decode()}"}).encode()
                    return
                buffer = ""
                async for chunk in resp.aiter_bytes():
                    buffer += chunk.decode()
                    while "\n" in buffer:
                        line, buffer = buffer.split("\n", 1)
                        line = line.strip()
                        if line.startswith("data: "):
                            yield (line + "\n\n").encode()
                yield b"data: [DONE]\n\n"

    def get_model_list(self) -> list:
        models_str = self.channel.get("models")
        if models_str:
            return [m.strip() for m in models_str.split(",") if m.strip()]
        return [
            "claude-3-opus-20240229", "claude-3-sonnet-20240229",
            "claude-3-haiku-20240307", "claude-3-5-sonnet-20241022",
            "claude-3-5-haiku-20241022",
        ]


ProviderRegistry.register("anthropic", AnthropicProvider)
ProviderRegistry.register("claude", AnthropicProvider)
