from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from database import get_session, User
from models.user import UserCreate, Token
from services.auth_service import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register")
async def register(data: UserCreate, db: AsyncSession = Depends(get_session)):
    result = await db.execute(select(User).where(User.username == data.username))
    if result.scalar_one_or_none():
        raise HTTPException(400, "Username already exists")

    user = User(
        username=data.username,
        password_hash=hash_password(data.password),
        email=data.email,
    )
    db.add(user)
    await db.commit()
    return {"message": "User created", "user_id": user.id}


@router.post("/login", response_model=Token)
async def login(data: UserCreate, db: AsyncSession = Depends(get_session)):
    result = await db.execute(select(User).where(User.username == data.username))
    user = result.scalar_one_or_none()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(401, "Invalid credentials")
    if user.status != "active":
        raise HTTPException(403, "Account disabled")

    token = create_access_token({"sub": str(user.id), "role": user.role})
    return Token(access_token=token)
