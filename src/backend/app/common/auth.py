from functools import wraps
from flask import request
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from werkzeug.exceptions import Forbidden, Unauthorized
from ..models.user import User

def get_current_user():
    verify_jwt_in_request()
    identity = get_jwt_identity()
    if not identity:
        raise Unauthorized('Missing identity')
    
    user = User.query.get(identity)
    if not user:
        raise Unauthorized('User not found')
    
    return user


def role_required(*allowed_roles):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            user = get_current_user()
            user_role = str(user.role)
            if user_role not in allowed_roles:
                raise Forbidden('Insufficient permissions')
            return fn(*args, **kwargs)
        return wrapper
    return decorator



