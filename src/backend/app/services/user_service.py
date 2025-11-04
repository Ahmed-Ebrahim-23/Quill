from ..models.user import User , UserRole
from ..extensions import db

def get_all_users():
    users = User.query.all()
    return [user.to_dict() for user in users]

def get_user_by_id(user_id):
    user = User.query.get(user_id)
    if not user:
        return None
    return user.to_dict()

def create_new_user(data):
    required = ['name', 'email', 'password']
    if not data or not all(k in data for k in required):
        raise ValueError('name, email and password are required')

    existing = User.query.filter_by(email=data['email']).first()
    if existing:
        raise ValueError('Email already registered')

    user = User(name=data['name'], email=data['email'], password=data['password'], role=data.get('role', UserRole.member))
    db.session.add(user)
    db.session.commit()
    return user.to_dict()

def update_existing_user(user_id, data):
    user = User.query.get(user_id)
    if not user:
        return None

    for field in ('name', 'email', 'role'):
        if field in data:
            setattr(user, field, data[field])

    if 'password' in data and data['password']:
        user.set_password(data['password'])

    db.session.commit()
    return user.to_dict()

def delete_user_by_id(user_id):
    user = User.query.get(user_id)
    if not user:
        return None

    db.session.delete(user)
    db.session.commit()
    return True
