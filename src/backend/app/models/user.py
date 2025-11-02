from app.extensions import db
from flask_bcrypt import Bcrypt
import enum

bcrypt = Bcrypt()

class UserRole(enum.Enum):
    MEMBER = "member"
    LIBRARIAN = "librarian"
    ADMIN = "admin"

    def __str__(self):
        return self.value

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.Enum(UserRole), nullable=False, default=UserRole.MEMBER)

    borrows = db.relationship('Borrow', backref='user', lazy=True)

    def __init__(self, name, email, password, role='member'):
        self.name = name
        self.email = email
        self.set_password(password)
        self.role = role

    def set_password(self, password):
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'role': self.role
        }

    def __repr__(self):
        return f'<User {self.name} ({self.role})>'