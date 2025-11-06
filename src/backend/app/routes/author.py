from flask import Blueprint, request
from ..common.api_response import jsend_success
from ..services import author_service
from ..common.auth import role_required
from werkzeug.exceptions import NotFound

author_bp = Blueprint('authors', __name__)

@author_bp.route('/', methods=['GET'])
def get_authors():
    authors = author_service.get_all_authors()
    return jsend_success(authors)


@author_bp.route('/<int:author_id>', methods=['GET'])
def get_author(author_id):
    author = author_service.get_author_by_id(author_id)
    if author is None:
        raise NotFound('Author not found')
    return jsend_success(author)


@role_required('librarian', 'admin')
@author_bp.route('/', methods=['POST'])
def create_author():
    data = request.get_json()
    new_author = author_service.create_new_author(data)
    return jsend_success(new_author, status_code=201)


@role_required('librarian', 'admin')
@author_bp.route('/<int:author_id>', methods=['PUT'])
def update_author(author_id):
    data = request.get_json()
    updated_author = author_service.update_existing_author(author_id, data)
    if updated_author is None:
        raise NotFound('Author not found')
    return jsend_success(updated_author)


@role_required('librarian', 'admin')
@author_bp.route('/<int:author_id>', methods=['DELETE'])
def delete_author(author_id):
    result = author_service.delete_author_by_id(author_id)
    if result is None:
        raise NotFound('Author not found')
    return '', 204
