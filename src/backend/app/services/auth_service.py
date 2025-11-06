from ..models.user import User
from flask_jwt_extended import create_access_token
from werkzeug.exceptions import Unauthorized  


def login_user(email, password):
    if not email or not password:
        raise ValueError('Email and password are required')

    user_model = User.query.filter_by(email=email).first()

    if not user_model or not user_model.check_password(password):
        raise Unauthorized('Invalid credentials')

    access_token = create_access_token(identity=str(user_model.id))

    return access_token, user_model.to_dict()
