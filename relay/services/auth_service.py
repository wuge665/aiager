from datetime import datetime, timedelta
from jose import jwt, JWTError
from passlib.context import CryptContext
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from config import settings
from database import User, ApiKey

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
    except JWTError:
        return {}


def generate_api_key() -> str:
    import secrets
    return "sk-" + secrets.token_hex(24)


async def authenticate_api_key(db: AsyncSession, api_key: str) -> tuple:
    result = await db.execute(select(ApiKey).where(ApiKey.key == api_key))
    key_record = result.scalar_one_or_none()
    if not key_record:
        return None, "Invalid API key"
    if key_record.status != "active":
        return None, "API key is disabled"
    if key_record.expires_at and key_record.expires_at < datetime.utcnow():
        return None, "API key has expired"
    if key_record.quota_limit > 0 and key_record.quota_used >= key_record.quota_limit:
        return None, "API key quota exhausted"

    user_result = await db.execute(select(User).where(User.id == key_record.user_id))
    user = user_result.scalar_one_or_none()
    if not user or user.status != "active":
        return None, "User account is disabled"

    return (user, key_record), ""
