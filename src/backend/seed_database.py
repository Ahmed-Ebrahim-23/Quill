#!/usr/bin/env python3
"""
Database seeding script for Quill Library Management System
Creates initial admin, librarian, authors, categories, and sample books
"""

import sys
import os

# Add the parent directory to the path so we can import from run.py
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from run import create_app
from app.models.user import User, UserRole
from app.models.author import Author
from app.models.category import Category
from app.models.book import Book
from app.extensions import db

def seed_database():
    """Seed the database with initial data"""
    app = create_app()
    
    with app.app_context():
        try:
            print("🔄 Starting database seeding...")
            
            # Create tables
            print("📋 Creating database tables...")
            db.create_all()
            
            # Check if data already exists
            existing_users = User.query.count()
            if existing_users > 0:
                print("⚠️  Database already contains data. Skipping seeding to avoid duplicates.")
                return
            
            # Create Admin User
            print("👤 Creating admin user...")
            admin_user = User(
                name='System Administrator',
                email='admin@quill.com',
                password='admin123',
                role=UserRole.admin
            )
            db.session.add(admin_user)
            
            # Create Librarian User
            print("📚 Creating librarian user...")
            librarian_user = User(
                name='Head Librarian',
                email='librarian@quill.com',
                password='librarian123',
                role=UserRole.librarian
            )
            db.session.add(librarian_user)
            
            # Create Sample Members
            print("👥 Creating sample members...")
            sample_members = [
                User('John Doe', 'john.doe@email.com', 'member123', UserRole.member),
                User('Jane Smith', 'jane.smith@email.com', 'member123', UserRole.member),
                User('Bob Johnson', 'bob.johnson@email.com', 'member123', UserRole.member),
                User('Alice Brown', 'alice.brown@email.com', 'member123', UserRole.member),
                User('Charlie Wilson', 'charlie.wilson@email.com', 'member123', UserRole.member),
            ]
            
            for member in sample_members:
                db.session.add(member)
            
            # Create Authors
            print("✍️  Creating authors...")
            authors = [
                Author('George Orwell'),
                Author('Jane Austen'),
                Author('J.K. Rowling'),
                Author('Ernest Hemingway'),
                Author('F. Scott Fitzgerald'),
                Author('Agatha Christie'),
                Author('Isaac Asimov'),
                Author('Ray Bradbury'),
                Author('J.R.R. Tolkien'),
                Author('Mark Twain'),
                Author('Charles Dickens'),
                Author('Harper Lee'),
            ]
            
            for author in authors:
                db.session.add(author)
            
            # Create Categories
            print("📂 Creating categories...")
            categories = [
                Category('Fiction'),
                Category('Non-Fiction'),
                Category('Science Fiction'),
                Category('Mystery'),
                Category('Romance'),
                Category('Fantasy'),
                Category('Biography'),
                Category('History'),
                Category('Technology'),
                Category('Self-Help'),
                Category('Poetry'),
                Category('Drama'),
            ]
            
            for category in categories:
                db.session.add(category)
            
            # Commit authors and categories to get their IDs
            db.session.commit()
            
            # Create Sample Books
            print("📖 Creating sample books...")
            books = [
                # Fiction classics
                Book('978-0-452-28423-4', '1984', 1, 1, 5, 'https://covers.openlibrary.org/b/id/7222246-L.jpg', 
                     'A dystopian social science fiction novel and cautionary tale about the future.'),
                Book('978-0-14-143951-8', 'Pride and Prejudice', 2, 1, 3, 'https://covers.openlibrary.org/b/id/8091016-L.jpg',
                     'A classic novel about Elizabeth Bennet and her complex relationship with Mr. Darcy.'),
                Book('978-0-439-70818-8', 'Harry Potter and the Philosopher\'s Stone', 3, 6, 4, 'https://covers.openlibrary.org/b/id/7977656-L.jpg',
                     'The first book in the Harry Potter series about a young wizard discovering his powers.'),
                
                # Science Fiction
                Book('978-0-553-29337-9', 'Foundation', 7, 3, 2, 'https://covers.openlibrary.org/b/id/8093264-L.jpg',
                     'A science fiction novel about the fall of the Galactic Empire and the establishment of the Foundation.'),
                Book('978-0-7432-7356-5', 'Fahrenheit 451', 8, 3, 3, 'https://covers.openlibrary.org/b/id/8226571-L.jpg',
                     'A dystopian novel about a future American society where books are outlawed and burned.'),
                
                # Mystery
                Book('978-0-06-207348-8', 'Murder on the Orient Express', 6, 4, 2, 'https://covers.openlibrary.org/b/id/7887476-L.jpg',
                     'Hercule Poirot investigates a murder on the luxurious Orient Express train.'),
                
                # Fantasy
                Book('978-0-547-92822-7', 'The Hobbit', 9, 6, 6, 'https://covers.openlibrary.org/b/id/8226572-L.jpg',
                     'A fantasy novel about Bilbo Baggins\' unexpected journey with Gandalf and dwarves.'),
                
                # Literature
                Book('978-0-7432-7356-5', 'The Great Gatsby', 5, 1, 3, 'https://covers.openlibrary.org/b/id/8115482-L.jpg',
                     'A novel about the American Dream and the excesses of the Jazz Age.'),
                Book('978-0-06-112008-4', 'To Kill a Mockingbird', 12, 1, 4, 'https://covers.openlibrary.org/b/id/8226191-L.jpg',
                     'A novel about racial injustice in the Deep South seen through the eyes of young Scout Finch.'),
                
                # Non-Fiction
                Book('978-0-374-52336-0', 'The Old Man and the Sea', 4, 1, 2, 'https://covers.openlibrary.org/b/id/8091017-L.jpg',
                     'The story of an old Cuban fisherman and his epic struggle with a giant marlin.'),
                Book('978-0-14-143956-3', 'A Christmas Carol', 11, 1, 5, 'https://covers.openlibrary.org/b/id/8226192-L.jpg',
                     'A novella about Ebenezer Scrooge\'s journey of redemption and the spirit of Christmas.'),
                
                # Additional popular books
                Book('978-0-06-112008-4', 'Adventures of Huckleberry Finn', 10, 1, 2, 'https://covers.openlibrary.org/b/id/8226193-L.jpg',
                     'A novel about Huck Finn\'s adventures on the Mississippi River with Jim, a runaway slave.'),
                Book('978-0-439-70819-5', 'Harry Potter and the Chamber of Secrets', 3, 6, 3, 'https://covers.openlibrary.org/b/id/7977657-L.jpg',
                     'Harry\'s second year at Hogwarts involves a mysterious chamber and its deadly occupant.'),
            ]
            
            for book in books:
                db.session.add(book)
            
            # Final commit
            db.session.commit()
            
            print("\n✅ Database seeding completed successfully!")
            print("\n📋 Summary of created data:")
            print(f"   • Admin User: admin@quill.com / admin123")
            print(f"   • Librarian User: librarian@quill.com / librarian123")
            print(f"   • Sample Members: 5 users created")
            print(f"   • Authors: {Author.query.count()} authors created")
            print(f"   • Categories: {Category.query.count()} categories created")
            print(f"   • Books: {Book.query.count()} books created")
            print(f"\n🚀 You can now start the application and login with the credentials above!")
            
        except Exception as e:
            print(f"\n❌ Error during database seeding: {str(e)}")
            db.session.rollback()
            raise

if __name__ == '__main__':
    seed_database()