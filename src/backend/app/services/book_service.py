from ..models.book import Book
from ..extensions import db

def get_all_books():
    books = Book.query.all()
    return [book.to_dict() for book in books]

def get_book_by_isbn(isbn):
    book = Book.query.get(isbn)
    if not book:
        return None
    return book.to_dict()

def create_new_book(data):
    required = ['isbn', 'title', 'author_id', 'category_id']
    if not data or not all(k in data for k in required):
        raise ValueError('isbn, title, author_id and category_id are required')

    existing = Book.query.get(data['isbn'])
    if existing:
        raise ValueError(f"Book with ISBN '{data['isbn']}' already exists")

    book = Book(
        isbn=data['isbn'],
        title=data['title'],
        author_id=data['author_id'],
        category_id=data['category_id'],
        total_copies=data.get('total_copies', 1),
        cover=data.get('cover'),
        description=data.get('description')
    )

    db.session.add(book)
    db.session.commit()
    return book.to_dict()

def update_existing_book(isbn, data):
    book = Book.query.get(isbn)
    if not book:
        return None

    # Allow updating fields selectively
    for field in ('title', 'cover', 'total_copies', 'description', 'author_id', 'category_id'):
        if field in data:
            setattr(book, field, data[field])

    db.session.commit()
    return book.to_dict()

def delete_book_by_isbn(isbn):
    book = Book.query.get(isbn)
    if not book:
        return None

    db.session.delete(book)
    db.session.commit()
    return True
