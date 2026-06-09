import uuid
import json
from typing import AsyncGenerator, Optional
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from database import Channel, UsageLog, ApiKey, ModelPricing
from services.providers import BaseProvider, ProviderRegistry
from config import settings


def _pick_channel(channels: list) -> dict:
    total_weight = sum(c.get("weight", 1) for c in channels)
    import random
    r = random.uniform(0, total_weight)
    cumulative = 0
    for c in channels:
        cumulative += c.get("weight", 1)
        if r <= cumulative:
            return c
    return channels[0]


async def get_channels_for_model(db: AsyncSession, model: str) -> list:
    result = await db.execute(select(Channel).where(Channel.status == "active"))
    all_channels = result.scalars().all()
    matching = []
    for ch in all_channels:
        models_str = ch.models or ""
        model_names = [m.strip() for m in models_str.split(",")] if models_str else []
        if model in model_names or not model_names:
            matching.append({
                "id": ch.id,
                "name": ch.name,
                "provider": ch.provider,
                "api_key": ch.api_key,
                "api_url": ch.api_url,
                "models": ch.models,
                "weight": ch.weight,
            })
    return matching


async def _calculate_cost(db: AsyncSession, model: str, prompt_tokens: int, completion_tokens: int) -> float:
    result = await db.execute(select(ModelPricing).where(ModelPricing.model == model))
    pricing = result.scalar_one_or_none()
    if pricing:
        return (prompt_tokens / 1000 * pricing.prompt_price +
                completion_tokens / 1000 * pricing.completion_price)
    return 0.0


async def _log_usage(db: AsyncSession, user_id: int, api_key_id: int, channel_id: int,
                     model: str, prompt_tokens: int, completion_tokens: int,
                     cost: float, request_id: str, ip: str):
    log = UsageLog(
        user_id=user_id,
        api_key_id=api_key_id,
        channel_id=channel_id,
        model=model,
        prompt_tokens=prompt_tokens,
        completion_tokens=completion_tokens,
        total_tokens=prompt_tokens + completion_tokens,
        cost=cost,
        request_id=request_id,
        ip_address=ip,
    )
    db.add(log)

    key_result = await db.execute(select(ApiKey).where(ApiKey.id == api_key_id))
    key_record = key_result.scalar_one_or_none()
    if key_record:
        key_record.quota_used = (key_record.quota_used or 0) + prompt_tokens + completion_tokens

    await db.commit()


async def relay_chat_completion(
    db: AsyncSession,
    request: dict,
    user_info: tuple,
    ip: str = "",
) -> dict:
    user, key_record = user_info
    model = request.get("model", "")
    request_id = f"req_{uuid.uuid4().hex[:12]}"

    channels = await get_channels_for_model(db, model)
    if not channels:
        raise Exception(f"No available channel for model: {model}")

    channel = _pick_channel(channels)
    provider_cls = ProviderRegistry.get(channel["provider"])
    if not provider_cls:
        raise Exception(f"Unknown provider: {channel['provider']}")

    provider: BaseProvider = provider_cls(channel)
    result = await provider.chat_completion(request, {"id": user.id})

    usage = result.get("usage", {})
    prompt_tokens = usage.get("prompt_tokens", 0)
    completion_tokens = usage.get("completion_tokens", 0)
    cost = await _calculate_cost(db, model, prompt_tokens, completion_tokens)

    await _log_usage(db, user.id, key_record.id, channel["id"],
                     model, prompt_tokens, completion_tokens,
                     cost, request_id, ip)

    result["request_id"] = request_id
    return result


async def relay_chat_completion_stream(
    db: AsyncSession,
    request: dict,
    user_info: tuple,
    ip: str = "",
) -> AsyncGenerator[bytes, None]:
    user, key_record = user_info
    model = request.get("model", "")
    request_id = f"req_{uuid.uuid4().hex[:12]}"

    channels = await get_channels_for_model(db, model)
    if not channels:
        yield json.dumps({"error": f"No available channel for model: {model}"}).encode()
        return

    channel = _pick_channel(channels)
    provider_cls = ProviderRegistry.get(channel["provider"])
    if not provider_cls:
        yield json.dumps({"error": f"Unknown provider: {channel['provider']}"}).encode()
        return

    provider: BaseProvider = provider_cls(channel)
    prompt_tokens = 0
    completion_tokens = 0

    async for chunk in provider.chat_completion_stream(request, {"id": user.id}):
        yield chunk
        try:
            decoded = chunk.decode()
            if decoded.startswith("data: ") and "[DONE]" not in decoded:
                data = json.loads(decoded[6:])
                usage = data.get("usage", {})
                if usage:
                    prompt_tokens = usage.get("prompt_tokens", prompt_tokens)
                    completion_tokens = usage.get("completion_tokens", completion_tokens)
        except (json.JSONDecodeError, UnicodeDecodeError):
            pass

    cost = await _calculate_cost(db, model, prompt_tokens, completion_tokens)
    await _log_usage(db, user.id, key_record.id, channel["id"],
                     model, prompt_tokens, completion_tokens,
                     cost, request_id, ip)


async def get_available_models(db: AsyncSession) -> list:
    result = await db.execute(select(Channel).where(Channel.status == "active"))
    channels = result.scalars().all()
    models = set()
    for ch in channels:
        provider_cls = ProviderRegistry.get(ch.provider)
        if provider_cls:
            provider = provider_cls({"api_key": ch.api_key, "api_url": ch.api_url, "models": ch.models})
            for m in provider.get_model_list():
                models.add(m)
    return sorted(models)
