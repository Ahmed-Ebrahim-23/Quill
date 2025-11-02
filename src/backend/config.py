import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    DEBUG = os.getenv("DEBUG").lower() in ("true", "1")

    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JSON_SORT_KEYS = False

class DevelopmentConfig(Config):
    DEBUG = True

config = {
    "default": DevelopmentConfig
}

def get_config(config_name=None):
    return config.get(config_name, config["default"])