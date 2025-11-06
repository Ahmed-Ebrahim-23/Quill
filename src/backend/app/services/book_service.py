from ..services.category_service import create_new_category
from ..services.author_service import create_new_author
from ..models.author import Author
from ..models.category import Category
from ..models.book import Book
from ..extensions import db

def get_all_books(page=1, per_page=10, title=None, author=None, category=None):
    from ..models.author import Author
    from ..models.category import Category

    query = Book.query

    if title:
        query = query.filter(Book.title.ilike(f'%{title}%'))
    if author:
        query = query.join(Author, Book.author_id == Author.id).filter(Author.name.ilike(f'%{author}%'))
    if category:
        query = query.join(Category, Book.category_id == Category.id).filter(Category.name.ilike(f'%{category}%'))

    books = query.paginate(page=page, per_page=per_page, error_out=False)

    total_count = books.total
    total_pages = books.pages
    has_next = books.has_next
    has_prev = books.has_prev

    result = {
        'books': [book.to_dict() for book in books.items],
        'pagination': {
            'page': page,
            'per_page': per_page,
            'total_pages': total_pages,
            'total_items': total_count,
            'has_next': has_next,
            'has_prev': has_prev
        }
    }
    return result

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

    if 'author_id' in data:
        from ..models.author import Author
        author = Author.query.get(data['author_id'])
        if not author:
            raise ValueError(f"Author with ID {data['author_id']} does not exist")

    if 'category_id' in data:
        from ..models.category import Category
        category = Category.query.get(data['category_id'])
        if not category:
            raise ValueError(f"Category with ID {data['category_id']} does not exist")

    if 'total_copies' in data:
        try:
            copies = int(data['total_copies'])
            if copies < 1:
                raise ValueError("Total copies must be at least 1")
            data['total_copies'] = copies
        except (ValueError, TypeError) as e:
            raise ValueError("Total copies must be a valid integer >= 1")

    for field in ('title', 'cover', 'total_copies', 'description', 'author_id', 'category_id'):
        if field in data:
            setattr(book, field, data[field])

    try:
        db.session.commit()
        return book.to_dict()
    except Exception as e:
        db.session.rollback()
        raise e

def delete_book_by_isbn(isbn):
    book = Book.query.get(isbn)
    if not book:
        return None

    db.session.delete(book)
    db.session.commit()

def import_book_from_google(data):
    required = ['isbn', 'title']
    if not data or not all(k in data for k in required):
        raise ValueError('isbn and title are required for import')

    existing = Book.query.get(data['isbn'])
    if existing:
        raise ValueError(f"Book with ISBN '{data['isbn']}' already exists")

    author_id = None
    if 'author_name' in data and data['author_name']:
        author = Author.query.filter_by(name=data['author_name']).first()
        if not author:
            author = create_new_author({'name': data['author_name']})
        author_id = author['id'] if isinstance(author, dict) else author.id
    else:
        default_author = Author.query.filter_by(name='Unknown Author').first()
        if not default_author:
            default_author = create_new_author({'name': 'Unknown Author'})
        author_id = default_author['id'] if isinstance(default_author, dict) else default_author.id

    category_id = None
    if 'category_name' in data and data['category_name']:
        category = Category.query.filter_by(name=data['category_name']).first()
        if not category:
            category = create_new_category({'name': data['category_name']})
        category_id = category['id'] if isinstance(category, dict) else category.id
    else:
        default_category = Category.query.filter_by(name='Uncategorized').first()
        if not default_category:
            default_category = create_new_category({'name': 'Uncategorized'})
        category_id = default_category['id'] if isinstance(default_category, dict) else default_category.id

    book = Book(
        isbn=data['isbn'],
        title=data['title'],
        author_id=author_id,
        category_id=category_id,
        total_copies=data.get('total_copies', 1),
        cover=data.get('cover'),
        description=data.get('description')
    )

    db.session.add(book)
    db.session.commit()
    return book.to_dict()
    return True
