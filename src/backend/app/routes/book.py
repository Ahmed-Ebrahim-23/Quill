from flask import Blueprint, request
from ..common.api_response import jsend_success
from ..services import book_service
from ..common.auth import role_required
from werkzeug.exceptions import NotFound

book_bp = Blueprint('books', __name__)

@book_bp.route('/', methods=['GET'])
def get_books():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    title = request.args.get('title', type=str)
    author = request.args.get('author', type=str)
    category = request.args.get('category', type=str)

    result = book_service.get_all_books(page=page, per_page=per_page, title=title, author=author, category=category)
    return jsend_success(result)


@book_bp.route('/<string:isbn>', methods=['GET'])
def get_book(isbn):
    book = book_service.get_book_by_isbn(isbn)
    if book is None:
        raise NotFound('Book not found')
    return jsend_success(book)


@role_required('librarian', 'admin')
@book_bp.route('/', methods=['POST'])
def create_book():
    data = request.get_json()
    new_book = book_service.create_new_book(data)
    return jsend_success(new_book, status_code=201)


@role_required('librarian', 'admin')
@book_bp.route('/<string:isbn>', methods=['PUT'])
def update_book(isbn):
    data = request.get_json()
    updated_book = book_service.update_existing_book(isbn, data)
    if updated_book is None:
        raise NotFound('Book not found')
    return jsend_success(updated_book)



@role_required('librarian', 'admin')
@book_bp.route('/<string:isbn>', methods=['DELETE'])
def delete_book(isbn):
    result = book_service.delete_book_by_isbn(isbn)
    if result is None:
        raise NotFound('Book not found')
    return '', 204


@role_required('librarian', 'admin')
@book_bp.route('/import', methods=['POST'])
def import_book():
    data = request.get_json()
    new_book = book_service.import_book_from_google(data)
    return jsend_success(new_book, status_code=201)
