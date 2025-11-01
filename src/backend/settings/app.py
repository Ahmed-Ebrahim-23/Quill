import os
from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from settings.config import get_config

load_dotenv()

db = SQLAlchemy()

def create_app(config_name=None):
    app = Flask(__name__)
    app.config.from_object(get_config(config_name))

    app.json.sort_keys = False

    db.init_app(app)

    @app.route("/")
    def index():
        return jsonify({
            "status": "ok", 
            "message": "Quill backend running"
        })

    return app