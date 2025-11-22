from flask import Blueprint, request, current_app
from flask_jwt_extended import get_jwt_identity, jwt_required
from ..common.api_response import jsend_success
from ..common.auth import role_required
from ..services import borrow_service
from werkzeug.exceptions import NotFound, Forbidden

borrow_bp = Blueprint('borrows', __name__)

@role_required('admin')
@borrow_bp.route('/', methods=['GET'])
def get_borrows():
    borrows = borrow_service.get_all_borrows()
    return jsend_success(borrows)


@role_required('admin', 'librarian')
@borrow_bp.route('/<int:borrow_id>', methods=['GET'])
def get_borrow(borrow_id):
    borrow = borrow_service.get_borrow_by_id(borrow_id)
    if borrow is None:
        raise NotFound('Borrow not found')
    return jsend_success(borrow)


@borrow_bp.route('/', methods=['POST'])
@jwt_required()
@role_required('member')
def create_borrow():
    data = request.get_json()
    
    identity = get_jwt_identity()
    current_app.logger.warning("Current user identity: %s", identity)
    print(identity)
    user_id = data.get('user_id') or identity
    book_isbn = data.get('book_isbn')

    new_borrow = borrow_service.create_new_borrow(user_id, book_isbn)
    return jsend_success(new_borrow, status_code=201)


@role_required('librarian', 'admin')
@borrow_bp.route('/<int:borrow_id>/return', methods=['POST'])
def return_borrow(borrow_id):
    result = borrow_service.get_borrow_by_id(borrow_id)
    if result is None:
        raise NotFound('Borrow not found')
    
    result = borrow_service.return_borrow(borrow_id)
    return jsend_success(result)


@role_required('member', 'librarian', 'admin')
@borrow_bp.route('/user', methods=['GET'])
@jwt_required()
def get_user_borrows():
    identity = get_jwt_identity()
    borrows = borrow_service.get_borrows_by_user_id(identity)
    return jsend_success(borrows)


@role_required('librarian', 'admin')
@borrow_bp.route('/unreturned', methods=['GET'])
def get_unreturned_borrows():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    search = request.args.get('search', type=str)
    result = borrow_service.get_unreturned_borrows(page=page, per_page=per_page, search_member_name=search)
    return jsend_success(result)


@role_required('librarian', 'admin')
@borrow_bp.route('/<int:borrow_id>', methods=['DELETE'])
def delete_borrow(borrow_id):
    result = borrow_service.delete_borrow_by_id(borrow_id)
    if result is None:
        raise NotFound('Borrow not found')
    return jsend_success('',status_code=204)
