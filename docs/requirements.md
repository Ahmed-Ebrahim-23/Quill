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
- Users can register, log in, and log out securely.
- Each role (Member, Librarian, Admin) has its own dashboard and permissions.

### Book Management
- Librarians can add, edit, or remove books from the system.
- The system stores book details including title, author, category, ISBN, and availability.
- Book availability updates automatically when borrowed, returned, or reserved.

### Reservation & Borrowing
- Members can reserve unavailable books and borrow available ones.
- The system tracks due dates and sends reminders for upcoming or overdue returns.
- Book availability updates automatically after borrowing or returning.
- Notifications are sent to members for important updates.

### User Management
- Admins can add, update, or remove librarian and member accounts.
- The system validates credentials before granting access to any user.
- User information (borrowing history, status, etc.) is stored and retrievable.

### Reports & Analytics
- The system generates reports for:
  - Borrowed and overdue books
  - Most borrowed titles
  - Member activity and usage statistics

