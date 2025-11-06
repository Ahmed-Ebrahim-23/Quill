from flask import Blueprint, request
from ..common.api_response import jsend_success
from ..services import user_service
from ..common.auth import role_required
from werkzeug.exceptions import NotFound

user_bp = Blueprint('users', __name__)

@role_required('librarian', 'admin')
@user_bp.route('/', methods=['GET'])
def get_users():
    users = user_service.get_all_users()
    return jsend_success(users)


@role_required('librarian', 'admin')
@user_bp.route('/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = user_service.get_user_by_id(user_id)
    if user is None:
        raise NotFound('User not found')
    return jsend_success(user)


@role_required('admin')
@user_bp.route('/', methods=['POST'])
def create_user():
    data = request.get_json()
    new_user = user_service.create_new_user(data)
    return jsend_success(new_user, status_code=201)


@role_required('librarian', 'admin')
@user_bp.route('/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.get_json()
    updated_user = user_service.update_existing_user(user_id, data)
    if updated_user is None:
        raise NotFound('User not found')
    return jsend_success(updated_user)


@role_required('librarian', 'admin')
@user_bp.route('/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    result = user_service.delete_user_by_id(user_id)
    if result is None:
        raise NotFound('User not found')
    return '', 204
