import os
from app import create_app

if __name__ == "__main__":
    config_name = os.getenv("FLASK_ENV")

    app = create_app(config_name)

    host = os.getenv("HOST")
    port = int(os.getenv("PORT"))

    app.run(host=host, port=port, debug=app.config["DEBUG"])