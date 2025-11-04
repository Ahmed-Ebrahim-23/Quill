from .main import main_bp
from .category import category_bp
from .author import author_bp
from .book import book_bp
from .borrow import borrow_bp
from .user import user_bp
from .auth import auth_bp


def register_blueprints(app):
    app.register_blueprint(main_bp, url_prefix='/')
    app.register_blueprint(category_bp, url_prefix='/categories')
    app.register_blueprint(author_bp, url_prefix='/authors')
    app.register_blueprint(book_bp, url_prefix='/books')
    app.register_blueprint(borrow_bp, url_prefix='/borrows')
    app.register_blueprint(user_bp, url_prefix='/users')
    app.register_blueprint(auth_bp, url_prefix='/auth')