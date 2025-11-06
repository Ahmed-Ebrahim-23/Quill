import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    DEBUG = os.getenv("DEBUG").lower() in ("true", "1")

    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
    JWT_ACCESS_TOKEN_EXPIRES = int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES'))

    BORROWING_LIMIT_DAYS = int(os.getenv('BORROWING_LIMIT_DAYS', 14))

    JSON_SORT_KEYS = False

class DevelopmentConfig(Config):
    DEBUG = True

config = {
    "default": DevelopmentConfig
}

def get_config(config_name=None):
    return config.get(config_name, config["default"])