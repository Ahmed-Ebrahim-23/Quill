from app.extensions import db
from sqlalchemy.orm import validates

class Book(db.Model):
    __tablename__ = 'books'

    isbn = db.Column(db.String(20), primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    cover = db.Column(db.String(500)) 
    total_copies = db.Column(db.Integer, nullable=False, default=1)
    description = db.Column(db.Text)

    author_id = db.Column(db.Integer, db.ForeignKey('authors.id'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)

    borrows = db.relationship('Borrow', backref='book', lazy=True)

    def __init__(self, isbn, title, author_id, category_id, total_copies=1, cover=None, description=None):
        self.isbn = isbn
        self.title = title
        self.author_id = author_id
        self.category_id = category_id
        self.total_copies = total_copies
        self.cover = cover
        self.description = description

    @property
    def available_copies(self):
        """Calculate available copies based on active borrows"""
        active_borrows = sum(1 for borrow in self.borrows if borrow.return_date is None)
        return self.total_copies - active_borrows

    @property
    def is_available(self):
        return self.available_copies > 0

    @validates('total_copies')
    def validate_total_copies(self, key, total_copies):
        if total_copies < 1:
            raise ValueError('Total copies must be at least 1')
        return total_copies

    def to_dict(self):
        return {
            'isbn': self.isbn,
            'title': self.title,
            'cover': self.cover,
            'total_copies': self.total_copies,
            'available_copies': self.available_copies,
            'description': self.description,
            'author': self.author.name if self.author else None,
            'category': self.category.name if self.category else None
        }

    def __repr__(self):
        return f'<Book {self.title} ({self.isbn})>'