"""
Application configuration using Pydantic Settings.
Manages environment variables and application settings.
"""
from pydantic_settings import BaseSettings
from typing import List, Union


class Settings(BaseSettings):
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    CORS_ORIGINS: Union[str, List[str]] = [
        "http://localhost:3000",  # Next.js dev server
        "http://localhost:3001",  # Alternative port
        "http://127.0.0.1:3000",
    ]
    LLM_PROVIDER: str = "openai"
    LLM_MODEL: str = "gpt-4"
    LLM_API_KEY: str = ""
    LLM_ENABLED: bool = False
    ENVIRONMENT: str = "development"

    def get_cors_origins(self) -> List[str]:
        """Convert CORS_ORIGINS to a list of strings."""
        if isinstance(self.CORS_ORIGINS, str):
            return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]
        return self.CORS_ORIGINS

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

