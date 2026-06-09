from pydantic import BaseModel
from typing import Optional, List, Dict, Any, Union


class ChatMessage(BaseModel):
    role: str
    content: Union[str, List[Dict[str, Any]]]


class ChatCompletionRequest(BaseModel):
    model: str
    messages: List[ChatMessage]
    temperature: Optional[float] = None
    top_p: Optional[float] = None
    n: Optional[int] = None
    stream: Optional[bool] = False
    stop: Optional[Union[str, List[str]]] = None
    max_tokens: Optional[int] = None
    presence_penalty: Optional[float] = None
    frequency_penalty: Optional[float] = None
    user: Optional[str] = None


class ModelInfo(BaseModel):
    id: str
    object: str = "model"
    created: int = 1677610602
    owned_by: str = "ai-hub-relay"


class ModelList(BaseModel):
    object: str = "list"
    data: List[ModelInfo]


class ChannelCreate(BaseModel):
    name: str
    provider: str
    api_key: str
    api_url: Optional[str] = None
    models: Optional[str] = None
    weight: int = 1


class ChannelOut(BaseModel):
    id: int
    name: str
    provider: str
    api_key: str
    api_url: Optional[str] = None
    models: Optional[str] = None
    weight: int
    status: str
    created_at: Optional[str] = None

    model_config = {"from_attributes": True}
