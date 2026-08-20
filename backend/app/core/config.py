from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "AI Career Platform"
    DEBUG: bool = True
    DATABASE_URL: str = "postgresql://vishal@localhost:5432/ai_career_db"
    SECRET_KEY: str = "your-secret-key-change-this-later"

    class Config:
        env_file = ".env"

settings = Settings()
