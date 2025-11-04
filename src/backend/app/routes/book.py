from flask import Blueprint, request
from ..common.api_response import jsend_success
from ..services import book_service
from werkzeug.exceptions import NotFound

book_bp = Blueprint('books', __name__)

@book_bp.route('/', methods=['GET'])
def get_books():
    books = book_service.get_all_books()
    return jsend_success(books)


@book_bp.route('/<string:isbn>', methods=['GET'])
def get_book(isbn):
    book = book_service.get_book_by_isbn(isbn)
    if book is None:
        raise NotFound('Book not found')
    return jsend_success(book)


@book_bp.route('/', methods=['POST'])
def create_book():
    data = request.get_json()
    new_book = book_service.create_new_book(data)
    return jsend_success(new_book, status_code=201)


@book_bp.route('/<string:isbn>', methods=['PUT'])
def update_book(isbn):
    data = request.get_json()
    updated_book = book_service.update_existing_book(isbn, data)
    if updated_book is None:
        raise NotFound('Book not found')
    return jsend_success(updated_book)


@book_bp.route('/<string:isbn>', methods=['DELETE'])
def delete_book(isbn):
    result = book_service.delete_book_by_isbn(isbn)
    if result is None:
        raise NotFound('Book not found')
    return '', 204
