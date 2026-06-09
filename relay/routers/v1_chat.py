from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sse_starlette.sse import EventSourceResponse

from database import get_session, async_session
from models.relay import ChatCompletionRequest, ModelList, ModelInfo
from services.auth_service import authenticate_api_key
from services.relay_service import relay_chat_completion, relay_chat_completion_stream, get_available_models
from utils.rate_limiter import rate_limiter
from config import settings

router = APIRouter(prefix="/v1", tags=["openai-compatible"])


async def auth_user(request: Request, db: AsyncSession = Depends(get_session)):
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        raise HTTPException(401, "Missing or invalid Authorization header")
    api_key = auth[7:]

    user_info, err = await authenticate_api_key(db, api_key)
    if err:
        raise HTTPException(401, err)

    ok, msg = rate_limiter.check(api_key, settings.rate_limit_per_minute, settings.rate_limit_per_day)
    if not ok:
        raise HTTPException(429, msg)

    return db, user_info


@router.get("/models", response_model=ModelList)
async def list_models(auth=Depends(auth_user)):
    db, _ = auth
    models = await get_available_models(db)
    return ModelList(data=[ModelInfo(id=m) for m in models])


@router.post("/chat/completions")
async def chat_completions(
    body: ChatCompletionRequest,
    request: Request,
    auth=Depends(auth_user),
):
    db, user_info = auth
    ip = request.client.host if request.client else ""

    if body.stream:
        return EventSourceResponse(
            _stream_handler(body.model_dump(exclude_none=True), user_info, ip)
        )

    try:
        result = await relay_chat_completion(db, body.model_dump(exclude_none=True), user_info, ip)
        return result
    except Exception as e:
        raise HTTPException(502, str(e))


async def _stream_handler(request_body: dict, user_info, ip: str):
    async with async_session() as db:
        async for chunk in relay_chat_completion_stream(db, request_body, user_info, ip):
            if isinstance(chunk, bytes):
                yield {"event": "message", "data": chunk.decode()}
            else:
                yield {"event": "message", "data": chunk}
    yield {"event": "message", "data": "[DONE]"}


@router.post("/embeddings")
async def embeddings():
    raise HTTPException(501, "Embeddings API not yet implemented")


@router.post("/images/generations")
async def image_generations():
    raise HTTPException(501, "Image generation not yet implemented")
