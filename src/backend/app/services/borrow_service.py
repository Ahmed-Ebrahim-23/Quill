import logging

logger = logging.getLogger(__name__)
from ..models.borrow import Borrow
from ..models.book import Book
from ..models.user import User
from ..extensions import db
from datetime import datetime

def get_all_borrows():
    borrows = Borrow.query.all()
    return [borrow.to_dict() for borrow in borrows]

def get_borrow_by_id(borrow_id):
    borrow = Borrow.query.get(borrow_id)
    if not borrow:
        return None
    return borrow.to_dict()

def create_new_borrow(user_id, book_isbn):
    logger.info(f"Creating borrow: user_id={user_id}, book_isbn={book_isbn}")
    # Basic existence checks
    user = User.query.get(user_id)
    if not user:
        logger.error(f"User not found: user_id={user_id}")
        raise ValueError('User not found')

    book = Book.query.get(book_isbn)
    if not book:
        logger.error(f"Book not found: book_isbn={book_isbn}")
        raise ValueError('Book not found')

    logger.info(f"Book availability: available_copies={book.available_copies}, is_available={book.is_available}")
    if not book.is_available:
        logger.warning(f"No copies available for book: book_isbn={book_isbn}")
        raise ValueError('No copies available')

    try:
        borrow = Borrow(user_id=user_id, book_isbn=book_isbn)
        db.session.add(borrow)
        db.session.commit()
        logger.info(f"Borrow created successfully: borrow_id={borrow.id}")
        return borrow.to_dict()
    except Exception as e:
        logger.error(f"Database error during borrow creation: {str(e)}")
        db.session.rollback()
        raise

def return_borrow(borrow_id):
    borrow = Borrow.query.get(borrow_id)
    if not borrow:
        return None

    if borrow.return_date is not None:
        raise ValueError('Borrow already returned')

    borrow.return_book()
    db.session.commit()
    return borrow.to_dict()

def get_borrows_by_user_id(user_id):
    borrows = Borrow.query.filter_by(user_id=user_id).all()
    return [borrow.to_dict() for borrow in borrows]

def get_unreturned_borrows(page=1, per_page=10, search_member_name=None):
    logger.info(f"get_unreturned_borrows called with page={page}, per_page={per_page}, search_member_name={search_member_name}")
    query = Borrow.query.filter(Borrow.return_date.is_(None)).filter().join(User)
    logger.info(f"Initial query: {query}")
    if search_member_name:
        query = query.filter(User.name.ilike(f'%{search_member_name}%'))
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    logger.info(f"Pagination result: total={pagination.total}, items={len(pagination.items)}")
    return {
        'borrows': [borrow.to_dict() for borrow in pagination.items],
        'total': pagination.total,
        'pages': pagination.pages,
        'current_page': pagination.page
    }

def delete_borrow_by_id(borrow_id):
    borrow = Borrow.query.get(borrow_id)
    if not borrow:
        return None

    db.session.delete(borrow)
    db.session.commit()
    return True
