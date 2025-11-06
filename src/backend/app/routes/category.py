from flask import Blueprint, request
from ..common.api_response import jsend_success, jsend_fail
from ..services import category_service
from ..common.auth import role_required
from werkzeug.exceptions import NotFound

category_bp = Blueprint('categories', __name__)

@category_bp.route('/', methods=['GET'])
def get_categories():
    categories = category_service.get_all_categories()
    return jsend_success(categories)

@category_bp.route('/<int:category_id>', methods=['GET'])
def get_category(category_id):
    category = category_service.get_category_by_id(category_id)
    if category is None:
        raise NotFound("Category not found")
    return jsend_success(category)


@role_required('librarian', 'admin')
@category_bp.route('/', methods=['POST'])
def create_category():
    data = request.get_json()

    if not data or not data.get('name'):
        raise ValueError("Name is required")
    if len(data['name']) < 3:
         raise ValueError("Name must be at least 3 characters")

    new_category = category_service.create_new_category(data)
    return jsend_success(new_category, status_code=201)


@role_required('librarian', 'admin')
@category_bp.route('/<int:category_id>', methods=['PUT'])
def update_category(category_id):
    data = request.get_json()

    if not data or not data.get('name'):
        raise ValueError("Name is required")
    if len(data['name']) < 3:
         raise ValueError("Name must be at least 3 characters")

    updated_category = category_service.update_existing_category(category_id, data)
    
    if updated_category is None:
        raise NotFound("Category not found")
        
    return jsend_success(updated_category)


@role_required('librarian', 'admin')
@category_bp.route('/<int:category_id>', methods=['DELETE'])
def delete_category(category_id):
    result = category_service.delete_category_by_id(category_id)
    if result is None:
        raise NotFound("Category not found")
    return jsend_success(status_code=204)

