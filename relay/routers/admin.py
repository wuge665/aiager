from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from config import settings
from database import get_session, User, ApiKey, Channel, UsageLog, ModelPricing
from models.relay import ChannelCreate, ChannelOut
from models.user import UserOut, ApiKeyCreate, ApiKeyOut
from pydantic import BaseModel


class UserCreateByAdmin(BaseModel):
    username: str
    password: str = "123456"
    email: str = ""
    role: str = "user"
    balance: float = 0.0
from services.auth_service import generate_api_key, hash_password

router = APIRouter(prefix="/api/admin", tags=["admin"])


async def verify_admin(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(401, "Missing authorization header")
    token = authorization.replace("Bearer ", "")
    if token != settings.admin_token:
        raise HTTPException(403, "Invalid admin token")
    return True


@router.get("/users")
async def list_users(db: AsyncSession = Depends(get_session), _=Depends(verify_admin)):
    result = await db.execute(select(User))
    return [UserOut.model_validate(u) for u in result.scalars().all()]


@router.post("/users")
async def create_user(data: UserCreateByAdmin, db: AsyncSession = Depends(get_session), _=Depends(verify_admin)):
    user = User(
        username=data.username,
        password_hash=hash_password(data.password),
        email=data.email or None,
        role=data.role,
        balance=data.balance,
    )
    db.add(user)
    await db.commit()
    return {"message": "User created", "user_id": user.id}


@router.post("/users/{user_id}/keys", response_model=ApiKeyOut)
async def create_api_key(user_id: int, data: ApiKeyCreate, db: AsyncSession = Depends(get_session), _=Depends(verify_admin)):
    result = await db.execute(select(User).where(User.id == user_id))
    if not result.scalar_one_or_none():
        raise HTTPException(404, "User not found")

    key = ApiKey(
        key=generate_api_key(),
        user_id=user_id,
        name=data.name,
        quota_limit=data.quota_limit,
    )
    db.add(key)
    await db.commit()
    return ApiKeyOut.model_validate(key)


@router.get("/channels", response_model=list[ChannelOut])
async def list_channels(db: AsyncSession = Depends(get_session), _=Depends(verify_admin)):
    result = await db.execute(select(Channel))
    return [ChannelOut.model_validate(c) for c in result.scalars().all()]


@router.post("/channels", response_model=ChannelOut)
async def create_channel(data: ChannelCreate, db: AsyncSession = Depends(get_session), _=Depends(verify_admin)):
    ch = Channel(
        name=data.name,
        provider=data.provider,
        api_key=data.api_key,
        api_url=data.api_url,
        models=data.models,
        weight=data.weight,
    )
    db.add(ch)
    await db.commit()
    return ChannelOut.model_validate(ch)


@router.delete("/channels/{channel_id}")
async def delete_channel(channel_id: int, db: AsyncSession = Depends(get_session), _=Depends(verify_admin)):
    result = await db.execute(select(Channel).where(Channel.id == channel_id))
    ch = result.scalar_one_or_none()
    if not ch:
        raise HTTPException(404, "Channel not found")
    await db.delete(ch)
    await db.commit()
    return {"message": "Channel deleted"}


@router.get("/usage")
async def get_usage(page: int = 1, size: int = 50, db: AsyncSession = Depends(get_session), _=Depends(verify_admin)):
    result = await db.execute(
        select(UsageLog).order_by(UsageLog.created_at.desc()).offset((page - 1) * size).limit(size)
    )
    total = await db.execute(select(func.count(UsageLog.id)))
    return {
        "data": [
            {
                "id": log.id,
                "user_id": log.user_id,
                "model": log.model,
                "prompt_tokens": log.prompt_tokens,
                "completion_tokens": log.completion_tokens,
                "total_tokens": log.total_tokens,
                "cost": log.cost,
                "created_at": str(log.created_at),
            }
            for log in result.scalars().all()
        ],
        "total": total.scalar(),
        "page": page,
        "size": size,
    }


@router.post("/pricing/{model}")
async def set_pricing(model: str, prompt_price: float, completion_price: float,
                      db: AsyncSession = Depends(get_session), _=Depends(verify_admin)):
    result = await db.execute(select(ModelPricing).where(ModelPricing.model == model))
    pricing = result.scalar_one_or_none()
    if pricing:
        pricing.prompt_price = prompt_price
        pricing.completion_price = completion_price
    else:
        db.add(ModelPricing(model=model, prompt_price=prompt_price, completion_price=completion_price))
    await db.commit()
    return {"message": "Pricing set"}
