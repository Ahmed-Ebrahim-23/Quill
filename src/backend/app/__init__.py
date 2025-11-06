import os
from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS
from config import get_config
from .extensions import db, migrate 
from .extensions import bcrypt, jwt
from .routes import register_blueprints
from .common import register_error_handlers

load_dotenv()

def create_app(config_name=None):
    app = Flask(__name__)
    app.config.from_object(get_config(config_name))

    app.json.sort_keys = False

    # Enable CORS  
    CORS(app)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    jwt.init_app(app)
    
    # Register error handlers
    register_error_handlers(app)
    
    # Register blueprints
    register_blueprints(app)

    return app
