from ..models.category import Category
from ..extensions import db

def get_all_categories():
    categories = Category.query.all()
    return [category.to_dict() for category in categories]

def get_category_by_id(category_id):
    category = Category.query.get(category_id)
    if not category:
        return None
    return category.to_dict()

def create_new_category(data):
    existing = Category.query.filter_by(name=data['name']).first()
    if existing:
        raise ValueError(f"Category '{data['name']}' already exists")

    category = Category(name=data['name'])

    db.session.add(category)
    db.session.commit()
    return category.to_dict()

def update_existing_category(category_id, data):
    category = Category.query.get(category_id)
    if not category:
        return None

    if not data or not data.get('name'):
        raise ValueError("Name is required")

    existing = Category.query.filter(
        Category.name == data['name'],
        Category.id != category_id
    ).first()
    if existing:
        raise ValueError(f"Category name '{data['name']}' already in use")

    category.name = data['name']

    db.session.commit()
    return category.to_dict()

def delete_category_by_id(category_id):
    category = Category.query.get(category_id)
    if not category:
        return None

    db.session.delete(category)
    db.session.commit()
    return True

