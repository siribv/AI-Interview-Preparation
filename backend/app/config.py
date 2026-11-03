import os
from urllib.parse import quote_plus
from dotenv import load_dotenv

# Load variables from .env file
load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "default-dev-secret-key-change-me")
    
    # MySQL Database Connection details
    DB_USER = os.getenv("DB_USER", "root")
    DB_PASSWORD = os.getenv("DB_PASSWORD", "")
    DB_HOST = os.getenv("DB_HOST", "127.0.0.1")
    DB_PORT = os.getenv("DB_PORT", "3306")
    DB_NAME = os.getenv("DB_NAME", "ai_interview_db")
    
    # URL-encode password in case it contains special characters (@, #, !, etc.)
    encoded_password = quote_plus(DB_PASSWORD) if DB_PASSWORD else ""
    
    # Standard MySQL connection URI with PyMySQL driver
    SQLALCHEMY_DATABASE_URI = (
        f"mysql+pymysql://{DB_USER}:{encoded_password}@{DB_HOST}:{DB_PORT}/{DB_NAME}?charset=utf8mb4"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_recycle": 280,
        "pool_pre_ping": True,
    }
    
    # AI API Configuration
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
    JWT_ACCESS_TOKEN_EXPIRES_HOURS = 24

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False

config_by_name = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig,
}
