from flask import Blueprint, request
from flask_jwt_extended import create_access_token
from ..common.api_response import jsend_success
from ..services import user_service
from flask_jwt_extended import jwt_required, get_jwt_identity

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        raise ValueError('Email and password are required')

    # Get user model directly from database
    from ..models.user import User
    user_model = User.query.filter_by(email=email).first()
    if not user_model:
        raise ValueError('Invalid credentials')

    if not user_model.check_password(password):
        raise ValueError('Invalid credentials')

    access_token = create_access_token(identity=user_model.id)
    return jsend_success({
        'access_token': access_token,
        'user': user_model.to_dict()
    })


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    new_user = user_service.create_new_user(data)
    return jsend_success(new_user, status_code=201)


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    identity = get_jwt_identity()
    print(identity)
    user = user_service.get_user_by_id(identity)
    return jsend_success(user)
