from flask import Blueprint, request
from ..common.api_response import jsend_success
from ..services import user_service, auth_service
from ..common.auth import role_required , get_current_user

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')

    access_token, user_dict = auth_service.login_user(email, password)

    return jsend_success({
        'access_token': access_token,
        'user': user_dict
    })


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    new_user = user_service.create_new_user(data)
    return jsend_success(new_user, status_code=201)


@auth_bp.route('/me', methods=['GET'])
def me():
    current_user = get_current_user().to_dict()
    return jsend_success(current_user)


@role_required('admin')
@auth_bp.route('/admin/create-librarian', methods=['POST'])
def create_librarian():
    data = request.get_json() or {}
    data['role'] = 'librarian'  
    new_user = user_service.create_new_user(data)
    return jsend_success(new_user, status_code=201)


@role_required('admin')
@auth_bp.route('/admin/create-admin', methods=['POST'])
def create_admin():
    data = request.get_json() or {}
    data['role'] = 'admin' 
    new_user = user_service.create_new_user(data)
    return jsend_success(new_user, status_code=201)
