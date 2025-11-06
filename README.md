# Quill Library Management System

## Description
Quill is a library management system designed to streamline the operations of libraries for administrators, librarians, and members. The system provides role-based access control, book management, borrowing/reservation workflows, and analytics reporting. Built with modern web technologies, Quill offers a responsive and intuitive interface for managing library resources efficiently.

## Table of Contents
- [Quill Library Management System](#quill-library-management-system)
  - [Description](#description)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
  - [Project Structure](#project-structure)
  - [Installation](#installation)
  - [Usage](#usage)
    - [For Members:](#for-members)
    - [For Librarians:](#for-librarians)
    - [For Admins:](#for-admins)
  - [API Reference](#api-reference)
    - [Authentication](#authentication)
    - [Books](#books)
    - [Borrows](#borrows)
    - [Users](#users)
    - [Authors \& Categories](#authors--categories)

---

## Features
- **User Management**: Secure registration and authentication with JWT tokens
- **Role-Based Access Control**: Three distinct user roles (Member, Librarian, Admin) with appropriate permissions
- **Book Catalog Management**: Complete CRUD operations for books, authors, and categories
- **Borrowing & Reservation System**: Track book availability, manage reservations, and handle returns
- **Google Books Integration**: Import book metadata automatically using ISBN or search queries
- **Analytics & Reporting**: Generate reports on borrowing patterns, popular titles, and member activity
- **Responsive Design**: Mobile-friendly interface built with React and modern CSS
- **Database Management**: PostgreSQL integration with proper relationship constraints and migrations

---

## Tech Stack
**Frontend:**  
React, Vite, JavaScript ES6+

**Backend:**  
Flask , SQLAlchemy

**Database:**  
PostgreSQL

**AI Models / Tools:**  
Google Books API integration for automatic book metadata import

**Deployment:**  
Docker & Docker Compose

---

## Project Structure
```
quill-library-management/
├── docs/
│   ├── ERD.drawio              # Entity Relationship Diagram
│   └── requirements.md         # Detailed requirements specification
├── src/
│   ├── backend/
│   │   ├── app/
│   │   │   ├── models/         # Database models (User, Book, Author, etc.)
│   │   │   ├── routes/         # API endpoints
│   │   │   ├── services/       # Business logic layer
│   │   │   └── common/         # Shared utilities and configurations
│   │   ├── config.py           # Application configuration
│   │   ├── run.py              # Flask application entry point
│   │   └── seed_database.py    # Database seeding script
│   └── frontend/
│       ├── src/
│       │   ├── components/     # React components
│       │   ├── pages/          # Page components
│       │   ├── contexts/       # React contexts (Auth, Notifications)
│       │   ├── hooks/          # Custom React hooks
│       │   └── api.js          # API service layer
│       └── vite.config.js      # Vite configuration
├── docker-compose.yml          # Multi-container Docker setup
├── Dockerfile.backend          # Backend container configuration
├── Dockerfile.frontend         # Frontend container configuration
└── README.md                   # Project documentation
```

---

## Installation
1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd quill-library-management
   ```

2. **Set up environment variables**:
   ```bash
   # Copy environment files
   cp src/backend/.env.example src/backend/.env
   cp src/frontend/.env.example src/frontend/.env
   
   # Edit the .env files with your configuration
   ```

3. **Start the application using Docker Compose**:
   ```bash
   docker-compose up --build
   ```

4. **Alternative: Manual setup**:
   ```bash
   # Backend setup
   cd src/backend
   pip install -r requirements.txt
   flask db upgrade
   python seed_database.py
   flask run
   
   # Frontend setup (in new terminal)
   cd src/frontend
   npm install
   npm run dev
   ```

5. **Access the application**

---

## Usage
### For Members:
1. **Register** and log in to access your dashboard
2. **Search** for books by title, author, or category
3. **Reserve** books that are currently borrowed
4. **Borrow** available books from the catalog
5. **View** your current borrowed and reserved books
6. **Return** borrowed books through the interface

### For Librarians:
1. **Manage Books**: Add, edit, or delete books from the catalog
2. **Handle Reservations**: Approve or reject book reservations
3. **Process Returns**: Mark books as borrowed or returned
4. **Monitor Overdue**: View overdue books and contact members
5. **Generate Reports**: Access borrowing statistics and member activity

### For Admins:
1. **User Management**: Create and manage librarian and member accounts
2. **System Configuration**: Update borrowing limits and penalty rules
3. **Monitor Statistics**: View system-wide usage analytics
4. **Access Control**: Manage user roles and permissions

---

## API Reference
### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user account |
| POST | `/auth/login` | Authenticate user and receive JWT token |
| GET | `/auth/me` | Get current user information |

### Books
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/books/` | Retrieve paginated list of books |
| GET | `/books/{isbn}` | Get specific book details |
| POST | `/books/` | Create new book (Librarian/Admin only) |
| PUT | `/books/{isbn}` | Update book information |
| DELETE | `/books/{isbn}` | Delete book (Librarian/Admin only) |
| POST | `/books/import` | Import book from Google Books API |

### Borrows
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/borrows/user` | Get current user's borrow history |
| POST | `/borrows/` | Create new borrow request |
| POST | `/borrows/{id}/return` | Mark book as returned |
| GET | `/borrows/unreturned` | Get unreturned borrows (Librarian/Admin) |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/` | Get all users (Admin only) |
| POST | `/users/` | Create new user (Admin only) |
| PUT | `/users/{id}` | Update user information |
| DELETE | `/users/{id}` | Delete user (Admin only) |

### Authors & Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/authors/` | Retrieve all authors |
| POST | `/authors/` | Create new author |
| PUT | `/authors/{id}` | Update author information |
| DELETE | `/authors/{id}` | Delete author |
| GET | `/categories/` | Retrieve all categories |
| POST | `/categories/` | Create new category |
| PUT | `/categories/{id}` | Update category information |
| DELETE | `/categories/{id}` | Delete category |

---

**Note**: Default configuration uses a 14-day borrowing period and JWT tokens that expire after 1 hour. These settings can be configured through environment variables as documented in the configuration files.
