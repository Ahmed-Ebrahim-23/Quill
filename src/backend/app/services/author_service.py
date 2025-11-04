from ..models.author import Author
from ..extensions import db

def get_all_authors():
    authors = Author.query.all()
    return [author.to_dict() for author in authors]

def get_author_by_id(author_id):
    author = Author.query.get(author_id)
    if not author:
        return None
    return author.to_dict()

def create_new_author(data):
    if not data or not data.get('name'):
        raise ValueError('Name is required')

    existing = Author.query.filter_by(name=data['name']).first()
    if existing:
        raise ValueError(f"Author '{data['name']}' already exists")

    author = Author(name=data['name'])
    db.session.add(author)
    db.session.commit()
    return author.to_dict()

def update_existing_author(author_id, data):
    author = Author.query.get(author_id)
    if not author:
        return None

    if not data or not data.get('name'):
        raise ValueError('Name is required')

    existing = Author.query.filter(Author.name == data['name'], Author.id != author_id).first()
    if existing:
        raise ValueError(f"Author name '{data['name']}' already in use")

    author.name = data['name']
    db.session.commit()
    return author.to_dict()

def delete_author_by_id(author_id):
    author = Author.query.get(author_id)
    if not author:
        return None

    db.session.delete(author)
    db.session.commit()
    return True
