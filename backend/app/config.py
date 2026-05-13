from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    gemini_api_key: str
    database_url: str = "sqlite:///./mahsulum.db"
    app_name: str = "Mahsulüm"
    debug: bool = True

    class Config:
        env_file = ".env"

settings = Settings()