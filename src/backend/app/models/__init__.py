from app.extensions import db

from .user import User
from .author import Author
from .category import Category
from .book import Book
from .borrow import Borrow


__all__ = ['User', 'Author', 'Category', 'Book', 'Borrow']