from app.extensions import db
from datetime import datetime, timedelta, timezone
from config import Config

class Borrow(db.Model):
    __tablename__ = 'borrows'

    id = db.Column(db.Integer, primary_key=True)
    borrow_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    due_date = db.Column(db.DateTime, nullable=False)
    return_date = db.Column(db.DateTime, nullable=True)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    book_isbn = db.Column(db.String(20), db.ForeignKey('books.isbn'), nullable=False)

    def __init__(self, user_id, book_isbn, borrow_date=None, due_date=None):
        self.user_id = user_id
        self.book_isbn = book_isbn
        self.borrow_date = borrow_date or datetime.now(timezone.utc)
        self.due_date = due_date or (self.borrow_date + timedelta(days=Config.BORROWING_LIMIT_DAYS))

    @property
    def is_overdue(self):
        """Check if the borrow is overdue"""
        return self.return_date is None and datetime.now(timezone.utc) > self.due_date

    @property
    def days_overdue(self):
        """Calculate days overdue"""
        if not self.is_overdue:
            return 0
        return (datetime.now(timezone.utc) - self.due_date).days

    def return_book(self):
        """Mark the book as returned"""
        self.return_date = datetime.now(timezone.utc)

    def to_dict(self):
        return {
            'id': self.id,
            'borrow_date': self.borrow_date.isoformat(),
            'due_date': self.due_date.isoformat(),
            'return_date': self.return_date.isoformat() if self.return_date else None,
            'is_overdue': self.is_overdue,
            'days_overdue': self.days_overdue,
            'user_id': self.user_id,
            'book_isbn': self.book_isbn,
            'book_title': self.book.title if self.book else None,
            'user_name': self.user.name if self.user else None
        }

    def __repr__(self):
        return f'<Borrow {self.book_isbn} by user {self.user_id} ({self.return_date or "active"})>'