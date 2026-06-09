from abc import ABC, abstractmethod
from typing import Dict, Any, AsyncGenerator, Optional


class BaseProvider(ABC):
    def __init__(self, channel: dict):
        self.channel = channel

    @abstractmethod
    async def chat_completion(self, request: dict, user: Optional[dict] = None) -> dict:
        pass

    @abstractmethod
    async def chat_completion_stream(self, request: dict, user: Optional[dict] = None) -> AsyncGenerator[bytes, None]:
        pass
        yield b""

    @abstractmethod
    def get_model_list(self) -> list:
        pass


class ProviderRegistry:
    _providers: dict = {}

    @classmethod
    def register(cls, name: str, provider_cls):
        cls._providers[name] = provider_cls

    @classmethod
    def get(cls, name: str):
        return cls._providers.get(name)

    @classmethod
    def all_providers(cls) -> dict:
        return dict(cls._providers)
