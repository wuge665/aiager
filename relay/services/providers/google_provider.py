import json
from typing import AsyncGenerator, Optional, Dict, Any
import httpx

from .base import BaseProvider, ProviderRegistry


GEMINI_API = "https://generativelanguage.googleapis.com/v1beta"


class GoogleProvider(BaseProvider):
    @property
    def _api_key(self):
        return self.channel["api_key"]

    def _convert_messages(self, messages: list) -> list:
        contents = []
        for msg in messages:
            role = msg["role"]
            content = msg.get("content", "")
            gemini_role = "model" if role == "assistant" else "user"
            if isinstance(content, list):
                parts = []
                for p in content:
                    if p.get("type") == "text":
                        parts.append({"text": p["text"]})
                    elif p.get("type") == "image_url":
                        parts.append({"inline_data": {"mime_type": "image/jpeg", "data": p["image_url"]["url"]}})
                contents.append({"role": gemini_role, "parts": parts})
            else:
                contents.append({"role": gemini_role, "parts": [{"text": content}]})
        return contents

    def _to_openai_response(self, raw: dict, model: str) -> dict:
        candidates = raw.get("candidates", [])
        choices = []
        for c in candidates:
            parts = c.get("content", {}).get("parts", [])
            text = "".join(p.get("text", "") for p in parts)
            choices.append({
                "index": c.get("index", 0),
                "message": {"role": "assistant", "content": text},
                "finish_reason": c.get("finishReason", "stop"),
            })
        usage = raw.get("usageMetadata", {})
        return {
            "id": raw.get("id", ""),
            "object": "chat.completion",
            "model": model,
            "choices": choices,
            "usage": {
                "prompt_tokens": usage.get("promptTokenCount", 0),
                "completion_tokens": usage.get("candidatesTokenCount", 0),
                "total_tokens": usage.get("totalTokenCount", 0),
            },
        }

    async def chat_completion(self, request: dict, user: Optional[dict] = None) -> dict:
        model = request.get("model", "gemini-2.0-flash")
        contents = self._convert_messages(request.get("messages", []))
        payload = {"contents": contents}
        if request.get("temperature") is not None:
            payload["generationConfig"] = {"temperature": request["temperature"]}
        if request.get("max_tokens"):
            payload.setdefault("generationConfig", {})["maxOutputTokens"] = request["max_tokens"]

        async with httpx.AsyncClient(timeout=120) as client:
            resp = await client.post(
                f"{GEMINI_API}/models/{model}:generateContent?key={self._api_key}",
                json=payload,
            )
            if resp.status_code != 200:
                raise Exception(f"Gemini API error {resp.status_code}: {resp.text}")
            raw = resp.json()
            return self._to_openai_response(raw, model)

    async def chat_completion_stream(self, request: dict, user: Optional[dict] = None) -> AsyncGenerator[bytes, None]:
        model = request.get("model", "gemini-2.0-flash")
        contents = self._convert_messages(request.get("messages", []))
        payload = {"contents": contents}
        if request.get("temperature") is not None:
            payload["generationConfig"] = {"temperature": request["temperature"]}

        async with httpx.AsyncClient(timeout=300) as client:
            async with client.stream(
                "POST",
                f"{GEMINI_API}/models/{model}:streamGenerateContent?key={self._api_key}",
                json=payload,
            ) as resp:
                if resp.status_code != 200:
                    error_body = await resp.aread()
                    yield json.dumps({"error": f"Gemini upstream {resp.status_code}: {error_body.decode()}"}).encode()
                    return
                buffer = ""
                async for chunk in resp.aiter_bytes():
                    buffer += chunk.decode()
                    while "\n" in buffer:
                        line, rest = buffer.split("\n", 1)
                        buffer = rest
                        line = line.strip()
                        if line:
                            try:
                                data = json.loads(line)
                                oai_chunk = {
                                    "choices": [{
                                        "delta": {"content": data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")},
                                        "index": 0,
                                    }]
                                }
                                yield f"data: {json.dumps(oai_chunk)}\n\n".encode()
                            except json.JSONDecodeError:
                                pass
                yield b"data: [DONE]\n\n"

    def get_model_list(self) -> list:
        models_str = self.channel.get("models")
        if models_str:
            return [m.strip() for m in models_str.split(",") if m.strip()]
        return [
            "gemini-2.0-flash", "gemini-2.0-flash-lite",
            "gemini-1.5-pro", "gemini-1.5-flash",
            "gemini-2.5-pro-exp-03-25",
        ]


ProviderRegistry.register("google", GoogleProvider)
ProviderRegistry.register("gemini", GoogleProvider)
