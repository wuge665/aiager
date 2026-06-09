from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    app_name: str = "AI Hub Relay"
    debug: bool = False

    # Database
    database_url: str = "sqlite+aiosqlite:///./relay.db"

    # Auth
    admin_token: str = "admin-relay-2026"
    jwt_secret: str = "change-me-to-a-random-secret"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 1440

    # Rate limit (per key)
    rate_limit_per_minute: int = 60
    rate_limit_per_day: int = 10000

    # Server
    host: str = "0.0.0.0"
    port: int = 8080

    # CORS
    cors_origins: str = "*"

    model_config = {"env_file": ".env", "env_prefix": "RELAY_"}


settings = Settings()
