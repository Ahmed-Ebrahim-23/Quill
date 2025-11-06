# Requirements Document

## 1. Actors
- **Member:** can register, search, reserve, and borrow books.
- **Librarian:** manages book inventory, handles reservations and returns.
- **Admin:** manages librarians, members, and system-wide settings.

---

## 2. User Stories

### Member
- Register and log in to the system to access the personal dashboard.
- Search for books by title, author, or category.
- Reserve books that are currently borrowed by other members.
- Borrow available books from the catalog.
- View current borrowed and reserved books.
- Receive notifications for book availability, due dates, and overdue reminders.
- Return borrowed books or mark them as returned.

### Librarian
- Add, edit, or delete books in the catalog.
- View and manage all reservations and borrowing requests.
- Approve or reject book reservations.
- Mark books as borrowed or returned.
- View overdue books and contact members for returns.
- Generate reports on borrowed books and member activity.

### Admin
- Create and manage librarian and member accounts.
- Update or deactivate inactive user accounts.
- Monitor overall system statistics such as total users, books, and reservations.
- Configure system settings including borrowing limits and penalty rules.

---

## 3. Functional Requirements

### General
- Users can register, log in, and log out securely using JWT-based authentication.
- Each role (Member, Librarian, Admin) has its own dashboard and permissions.
- Authentication tokens expire after 1 hour (configurable via JWT_ACCESS_TOKEN_EXPIRES).

### Book Management
- Librarians can add, edit, or remove books from the system via REST API endpoints.
- The system stores book details including title, author, category, ISBN, publication date, and availability status.
- Book availability updates automatically when borrowed, returned, or reserved.
- Google Books API integration allows importing book data automatically.

### Reservation & Borrowing
- Members can reserve unavailable books and borrow available ones through the web interface.
- The system tracks due dates with a default borrowing period of 14 days (configurable via BORROWING_LIMIT_DAYS).
- Book availability updates automatically after borrowing or returning operations.
- Notification system sends alerts for important updates to members.
- Borrow status tracked in PostgreSQL database with proper relationship constraints.

### User Management
- Admins can add, update, or remove librarian and member accounts through admin interface.
- The system validates credentials using bcrypt hashing before granting access.
- User information including borrowing history, current status, and role assignments stored in database.
- Role-based access control (RBAC) implemented for different user types.
- User sessions managed via JWT tokens with secure HTTP-only cookies.

### Reports & Analytics
- The system generates reports for:
  - Borrowed and overdue books with detailed member information
  - Most borrowed titles and category statistics
  - Member activity and usage statistics including borrowing patterns
  - System-wide statistics accessible via admin dashboard
- Reports generated using SQLAlchemy queries with proper data aggregation.
