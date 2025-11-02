import os
from dotenv import load_dotenv
from flask import Flask
from config import get_config
from .extensions import db, migrate 
from .routes import register_blueprints
from .common import register_error_handlers

load_dotenv()

def create_app(config_name=None):
    """
    Application factory function.
    """
    app = Flask(__name__)
    app.config.from_object(get_config(config_name))

    app.json.sort_keys = False

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    
    # Register blueprints
    register_blueprints(app)

    # Register error handlers
    register_error_handlers(app)
    return app
