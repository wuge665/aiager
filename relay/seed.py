"""
Seed script: creates admin user, demo user, and example channels.
Run: python seed.py
"""
import asyncio
from sqlalchemy import select
from database import async_session, User, ApiKey, Channel, ModelPricing, init_db
from services.auth_service import hash_password, generate_api_key


async def seed():
    await init_db()
    async with async_session() as db:
        existing = await db.execute(select(User).where(User.username == "admin"))
        if existing.scalar_one_or_none():
            print("Database already seeded, skipping.")
            return

        # Admin user
        admin = User(username="admin", password_hash=hash_password("admin123"), role="admin", balance=9999)
        db.add(admin)
        await db.flush()

        admin_key = ApiKey(key=generate_api_key(), user_id=admin.id, name="Admin Key", quota_limit=-1)
        db.add(admin_key)

        # Demo user
        demo = User(username="demo", password_hash=hash_password("demo123"), role="user", balance=100)
        db.add(demo)
        await db.flush()

        demo_key = ApiKey(key=generate_api_key(), user_id=demo.id, name="Demo Key", quota_limit=1000000)
        db.add(demo_key)

        # Example channels
        channels = [
            Channel(name="OpenAI Official", provider="openai", api_key="sk-your-openai-key",
                    models="gpt-4o,gpt-4o-mini,gpt-4-turbo,gpt-3.5-turbo", weight=3),
            Channel(name="Claude Official", provider="anthropic", api_key="sk-ant-your-claude-key",
                    models="claude-3-5-sonnet-20241022,claude-3-5-haiku-20241022", weight=2),
            Channel(name="Gemini Official", provider="google", api_key="your-gemini-api-key",
                    models="gemini-2.0-flash,gemini-1.5-pro", weight=1),
        ]
        for ch in channels:
            db.add(ch)

        # Pricing defaults
        pricings = [
            ModelPricing(model="gpt-4o", prompt_price=0.01, completion_price=0.03),
            ModelPricing(model="gpt-4o-mini", prompt_price=0.0015, completion_price=0.006),
            ModelPricing(model="gpt-3.5-turbo", prompt_price=0.001, completion_price=0.002),
            ModelPricing(model="claude-3-5-sonnet-20241022", prompt_price=0.003, completion_price=0.015),
            ModelPricing(model="claude-3-5-haiku-20241022", prompt_price=0.001, completion_price=0.005),
            ModelPricing(model="gemini-2.0-flash", prompt_price=0.0001, completion_price=0.0004),
            ModelPricing(model="gemini-1.5-pro", prompt_price=0.0035, completion_price=0.0105),
        ]
        for p in pricings:
            db.add(p)

        await db.commit()

        print("=== Seed Complete ===")
        print(f"Admin key: {admin_key.key}")
        print(f"Demo key:  {demo_key.key}")
        print(f"Admin token: admin123")
        print(f"Demo token: demo123")


if __name__ == "__main__":
    asyncio.run(seed())
