import React, { useEffect, useState, useCallback, memo } from 'react'
import {
  getBooks, createBook, deleteBook, updateBook,
  getAuthors, createAuthor, deleteAuthor,
  getCategories, createCategory, deleteCategory,
  getUsers, deleteUser, updateUser, createUser,
  searchGoogleBooks, importBook,
  fetchUnreturnedBorrows, returnBorrow
} from '../api'
import { useNotifications } from '../contexts/NotificationContext'
import Table from '../components/ui/Table'
import Pagination from '../components/ui/Pagination'
import BooksSection from '../components/BooksSection'
import BookForm from '../components/forms/BookForm'
import AuthorsTab from '../components/librarian/AuthorsTab'
import CategoriesTab from '../components/librarian/CategoriesTab'
import MembersTab from '../components/librarian/MembersTab'
import BorrowsTab from '../components/librarian/BorrowsTab'
import BookEditForm from '../components/librarian/BookEditForm'
import GoogleBooksImport from '../components/librarian/GoogleBooksImport'

/**
 * SystemStatsTab: Shows system statistics and analytics
 */
const SystemStatsTab = memo(({ books, authors, categories, users, borrows }) => {
  const totalBooks = books.length
  const totalAuthors = authors.length
  const totalCategories = categories.length
  const totalUsers = users.length
  const totalLibrarians = users.filter(u => u.role === 'librarian').length
  const totalMembers = users.filter(u => u.role === 'member').length
  const activeBorrows = borrows.length
  const overdueBorrows = borrows.filter(b => b.is_overdue).length

  const stats = [
    { title: 'Total Books', value: totalBooks },
    { title: 'Total Authors', value: totalAuthors },
    { title: 'Categories', value: totalCategories },
    { title: 'Total Users', value: totalUsers },
    { title: 'Librarians', value: totalLibrarians },
    { title: 'Members', value: totalMembers },
    { title: 'Active Borrows', value: activeBorrows },
    { title: 'Overdue Books', value: overdueBorrows }
  ]

  return (
    <div className="system-stats-tab">
      <h3>System Statistics</h3>
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-value">{stat.value}</div>
            <div className="stat-title">{stat.title}</div>
          </div>
        ))}
      </div>
    </div>
  )
})

/**
 * LibrariansTab: Manages librarian accounts (add, edit, delete, promote/demote)
 */
const LibrariansTab = memo(({ users, onDataUpdate, showSuccess, showError }) => {
  const [isAddingLibrarian, setIsAddingLibrarian] = useState(false)
  const [newLibrarianForm, setNewLibrarianForm] = useState({
    name: '',
    email: '',
    password: ''
  })

  const librarians = users.filter(u => u.role === 'librarian')

  const handleAddLibrarian = async (e) => {
    e.preventDefault()
    try {
      await createUser({ ...newLibrarianForm, role: 'librarian' })
      showSuccess('Librarian added successfully')
      setIsAddingLibrarian(false)
      setNewLibrarianForm({ name: '', email: '', password: '' })
      onDataUpdate()
    } catch (err) {
      const message = err.response?.data?.data?.description || err.response?.data?.message || 'Failed to add librarian'
      showError(message)
    }
  }

  const handlePromoteToLibrarian = async (user) => {
    if (window.confirm(`Promote ${user.name} to librarian?`)) {
      try {
        await updateUser(user.id, { role: 'librarian' })
        showSuccess('User promoted to librarian successfully')
        onDataUpdate()
      } catch (err) {
        const message = err.response?.data?.data?.description || err.response?.data?.message || 'Failed to promote user'
        showError(message)
      }
    }
  }

  const handleDemoteToMember = async (user) => {
    if (window.confirm(`Demote ${user.name} to member?`)) {
      try {
        await updateUser(user.id, { role: 'member' })
        showSuccess('Librarian demoted to member successfully')
        onDataUpdate()
      } catch (err) {
        const message = err.response?.data?.data?.description || err.response?.data?.message || 'Failed to demote user'
        showError(message)
      }
    }
  }

  const handleDeleteLibrarian = async (user) => {
    if (window.confirm(`Delete librarian "${user.name}"?`)) {
      try {
        await deleteUser(user.id)
        showSuccess('Librarian deleted successfully')
        onDataUpdate()
      } catch (err) {
        const message = err.response?.data?.data?.description || err.response?.data?.message || 'Failed to delete librarian'
        showError(message)
      }
    }
  }

  const members = users.filter(u => u.role === 'member')

  return (
    <div className="librarians-tab">
      <section aria-labelledby="add-librarian-heading">
        <div className="section-header">
          <h3 id="add-librarian-heading">Add New Librarian</h3>
          <button 
            className="toggle-btn"
            onClick={() => setIsAddingLibrarian(!isAddingLibrarian)}
          >
            {isAddingLibrarian ? 'Cancel' : 'Add Librarian'}
          </button>
        </div>
        
        {isAddingLibrarian && (
          <form onSubmit={handleAddLibrarian} className="simple-form">
            <input
              type="text"
              value={newLibrarianForm.name}
              onChange={(e) => setNewLibrarianForm({ ...newLibrarianForm, name: e.target.value })}
              placeholder="Full name"
              required
            />
            <input
              type="email"
              value={newLibrarianForm.email}
              onChange={(e) => setNewLibrarianForm({ ...newLibrarianForm, email: e.target.value })}
              placeholder="Email address"
              required
            />
            <input
              type="password"
              value={newLibrarianForm.password}
              onChange={(e) => setNewLibrarianForm({ ...newLibrarianForm, password: e.target.value })}
              placeholder="Password"
              required
            />
            <button type="submit">Create Librarian Account</button>
          </form>
        )}
      </section>

      <section aria-labelledby="librarians-list-heading">
        <h3 id="librarians-list-heading">Current Librarians ({librarians.length})</h3>
        {librarians.length > 0 ? (
          <Table
            columns={[
              { key: 'name', title: 'Name' },
              { key: 'email', title: 'Email' }
            ]}
            data={librarians}
            onDelete={handleDeleteLibrarian}
          />
        ) : (
          <div className="no-results">
            <p>No librarians found.</p>
          </div>
        )}
      </section>

      <section aria-labelledby="promote-members-heading">
        <h3 id="promote-members-heading">Promote Members to Librarians ({members.length})</h3>
        {members.length > 0 ? (
          <Table
            columns={[
              { key: 'name', title: 'Name' },
              { key: 'email', title: 'Email' }
            ]}
            data={members}
            showActions={false}
            customActions={(user) => (
              <button 
                className="promote-btn"
                onClick={() => handlePromoteToLibrarian(user)}
              >
                Promote to Librarian
              </button>
            )}
          />
        ) : (
          <div className="no-results">
            <p>No members available to promote.</p>
          </div>
        )}
      </section>
    </div>
  )
})

/**
 * ReportsTab: Generate various reports and analytics
 */
const ReportsTab = memo(({ books, users, borrows }) => {
  const [reportType, setReportType] = useState('popular-books')
  const [dateRange, setDateRange] = useState('30') // days

  const generateReport = () => {
    switch (reportType) {
      case 'popular-books':
        return generatePopularBooksReport()
      case 'user-activity':
        return generateUserActivityReport()
      case 'overdue-books':
        return generateOverdueBooksReport()
      default:
        return []
    }
  }

  const generatePopularBooksReport = () => {
    // This would typically come from borrow statistics
    // For now, we'll show books with most copies as a proxy
    return books
      .sort((a, b) => b.total_copies - a.total_copies)
      .slice(0, 10)
      .map(book => ({
        title: book.title,
        author: book.author_name || 'Unknown',
        totalCopies: book.total_copies,
        availableCopies: book.available_copies,
        status: book.available_copies > 0 ? 'Available' : 'All Borrowed'
      }))
  }

  const generateUserActivityReport = () => {
    const memberUsers = users.filter(u => u.role === 'member')
    return memberUsers.map(user => ({
      name: user.name,
      email: user.email,
      status: 'Active' // This would come from actual activity data
    }))
  }

  const generateOverdueBooksReport = () => {
    const overdue = borrows.filter(b => b.is_overdue)
    return overdue.map(borrow => ({
      bookTitle: borrow.book_title,
      memberName: borrow.member_name,
      borrowDate: new Date(borrow.borrow_date).toLocaleDateString(),
      dueDate: new Date(borrow.due_date).toLocaleDateString(),
      daysOverdue: Math.floor((new Date() - new Date(borrow.due_date)) / (1000 * 60 * 60 * 24))
    }))
  }

  const reportData = generateReport()

  const getReportColumns = () => {
    switch (reportType) {
      case 'popular-books':
        return [
          { key: 'title', title: 'Book Title' },
          { key: 'author', title: 'Author' },
          { key: 'totalCopies', title: 'Total Copies' },
          { key: 'availableCopies', title: 'Available' },
          { key: 'status', title: 'Status' }
        ]
      case 'user-activity':
        return [
          { key: 'name', title: 'Member Name' },
          { key: 'email', title: 'Email' },
          { key: 'status', title: 'Status' }
        ]
      case 'overdue-books':
        return [
          { key: 'bookTitle', title: 'Book Title' },
          { key: 'memberName', title: 'Borrower' },
          { key: 'borrowDate', title: 'Borrow Date' },
          { key: 'dueDate', title: 'Due Date' },
          { key: 'daysOverdue', title: 'Days Overdue' }
        ]
      default:
        return []
    }
  }

  const exportReport = () => {
    const csvContent = [
      getReportColumns().map(col => col.title).join(','),
      ...reportData.map(row => 
        getReportColumns().map(col => row[col.key] || '').join(',')
      )
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${reportType}-report-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="reports-tab">
      <h3>Reports & Analytics</h3>
      
      <div className="report-controls">
        <div className="control-group">
          <label>Report Type:</label>
          <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
            <option value="popular-books">Popular Books</option>
            <option value="user-activity">User Activity</option>
            <option value="overdue-books">Overdue Books</option>
          </select>
        </div>
        
        <div className="control-group">
          <label>Date Range:</label>
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
        </div>
        
        <button onClick={exportReport} className="export-btn">
          Export CSV
        </button>
      </div>

      <div className="report-content">
        <h4>{reportType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</h4>
        {reportData.length > 0 ? (
          <Table
            columns={getReportColumns()}
            data={reportData}
            showActions={false}
          />
        ) : (
          <div className="no-results">
            <p>No data available for the selected report.</p>
          </div>
        )}
      </div>
    </div>
  )
})

/**
 * AdminDashboard (Main Component)
 * 
 * Comprehensive admin dashboard with all librarian functionality plus admin-specific features
 */
export default function AdminDashboard() {
  const [tab, setTab] = useState('overview')
  const [books, setBooks] = useState([])
  const [pagination, setPagination] = useState({})
  const [authors, setAuthors] = useState([])
  const [categories, setCategories] = useState([])
  const [users, setUsers] = useState([])
  const [borrows, setBorrows] = useState([])
  const [loading, setLoading] = useState(false)
  const [googleBooks, setGoogleBooks] = useState([])
  const [editingBook, setEditingBook] = useState(null)
  const { showSuccess, showError } = useNotifications()

  // --- Core Data Fetching ---

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const [bRes, aRes, cRes, uRes, borrowsRes] = await Promise.all([
        getBooks(), getAuthors(), getCategories(), getUsers(), fetchUnreturnedBorrows()
      ])
      
      const booksData = bRes.data.data || bRes.data
      const booksArray = booksData.books || (Array.isArray(booksData) ? booksData : [])
      setBooks(booksArray)
      setPagination(booksData.pagination || {})
      
      setAuthors(aRes.data.data || aRes.data || [])
      setCategories(cRes.data.data || cRes.data || [])
      setUsers(uRes.data.data || uRes.data || [])
      
      const borrowsData = borrowsRes.data.data || borrowsRes.data
      setBorrows(borrowsData.borrows || [])
      
    } catch (err) {
      console.error('Failed to fetch data:', err)
      const message = err.response?.data?.data?.description || err.response?.data?.message || 'Failed to load dashboard data'
      showError(message)
    } finally {
      setLoading(false)
    }
  }, [showError])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const fetchBooks = useCallback(async (page = 1, title = '', author = '', category = '') => {
    setLoading(true)
    try {
      const params = { page, per_page: 10 }
      if (title) params.title = title
      if (author) params.author = author
      if (category) params.category = category

      const res = await getBooks(params)
      const data = res.data.data || res.data
      const booksArray = data.books || (Array.isArray(data) ? data : [])
      setBooks(booksArray)
      setPagination(data.pagination || {})
    } catch (err) {
      console.error('Failed to fetch books:', err)
      const message = err.response?.data?.data?.description || err.response?.data?.message || 'Failed to load books'
      showError(message)
    } finally {
      setLoading(false)
    }
  }, [showError])

  // --- Book Handlers ---

  const handleAddBook = useCallback(async (e) => {
    e.preventDefault()
    const form = e.target
    const payload = {
      isbn: form.isbn.value,
      title: form.title.value,
      author_id: Number(form.author_id.value),
      category_id: Number(form.category_id.value),
      total_copies: Number(form.total_copies.value || 1),
      cover: form.cover.value || undefined,
      description: form.description.value || undefined
    }
    try {
      await createBook(payload)
      showSuccess('Book added successfully')
      form.reset()
      fetchAll()
    } catch (err) {
      const message = err.response?.data?.data?.description || err.response?.data?.message || 'Failed to add book'
      showError(message)
    }
  }, [fetchAll, showError, showSuccess])

  const handleDeleteBook = useCallback(async (book) => {
    if (window.confirm('Delete book?')) {
      try {
        await deleteBook(book.isbn)
        showSuccess('Book deleted successfully')
        fetchAll()
      } catch (err) {
        const message = err.response?.data?.data?.description || err.response?.data?.message || 'Failed to delete book'
        showError(message)
      }
    }
  }, [fetchAll, showError, showSuccess])

  const handleUpdateBook = useCallback((book) => {
    setEditingBook({
      ...book,
      author_id: book.author_id || 0,
      category_id: book.category_id || 0
    })
  }, [])

  const handleSaveBookUpdate = useCallback(async (updatedBookData) => {
    const payload = {
      title: updatedBookData.title,
      author_id: Number(updatedBookData.author_id),
      category_id: Number(updatedBookData.category_id),
      total_copies: Number(updatedBookData.total_copies || 1),
      cover: updatedBookData.cover || undefined,
      description: updatedBookData.description || undefined
    }
    
    try {
      await updateBook(editingBook.isbn, payload)
      showSuccess('Book updated successfully')
      setEditingBook(null)
      fetchAll()
    } catch (err) {
      console.error('Error updating book:', err)
      const message = err.response?.data?.data?.description || err.response?.data?.message || 'Failed to update book'
      showError(message)
    }
  }, [editingBook, fetchAll, showError, showSuccess])

  const handleCancelEdit = useCallback(() => {
    setEditingBook(null)
  }, [])

  // --- Google Books Handlers ---

  const handleSearchGoogleBooks = useCallback(async (query) => {
    if (!query.trim()) return
    try {
      const response = await searchGoogleBooks(query)
      setGoogleBooks(response.items || [])
    } catch (err) {
      console.error('Google Books search failed:', err)
      showError('Failed to search Google Books')
      setGoogleBooks([])
    }
  }, [showError])

  const handleAddBookFromGoogle = useCallback(async (book) => {
    const volumeInfo = book.volumeInfo
    const copies = book.totalCopies || 1

    const isbn = volumeInfo.industryIdentifiers?.find(id => id.type === 'ISBN_13')?.identifier ||
                 volumeInfo.industryIdentifiers?.find(id => id.type === 'ISBN_10')?.identifier ||
                 volumeInfo.industryIdentifiers?.[0]?.identifier || ''

    if (!isbn) return showError('Book must have a valid ISBN')
    if (!volumeInfo.title) return showError('Book must have a title')

    const payload = {
      isbn: isbn,
      title: volumeInfo.title,
      author_name: volumeInfo.authors?.[0] || null,
      category_name: volumeInfo.categories?.[0] || null,
      total_copies: copies,
      cover: volumeInfo.imageLinks?.thumbnail || '',
      description: volumeInfo.description || ''
    }

    try {
      await importBook(payload)
      showSuccess('Book imported successfully')
      fetchAll()
    } catch (err) {
      const message = err.response?.data?.data?.description || err.response?.data?.message || 'Failed to import book'
      showError(message)
    }
  }, [fetchAll, showError, showSuccess])

  // --- Render ---

  const renderTabContent = () => {
    if (loading && !editingBook) {
      return <div className="loading"><div className="spinner"></div></div>
    }

    switch (tab) {
      case 'overview':
        return (
          <SystemStatsTab
            books={books}
            authors={authors}
            categories={categories}
            users={users}
            borrows={borrows}
          />
        )
      case 'books':
        return (
          <div>
            {editingBook && (
              <BookEditForm
                book={editingBook}
                authors={authors}
                categories={categories}
                onSubmit={handleSaveBookUpdate}
                onCancel={handleCancelEdit}
              />
            )}
            <BookForm
              onSubmit={handleAddBook}
              categories={categories}
              authors={authors}
            />
            <GoogleBooksImport
              googleBooks={googleBooks}
              onSearch={handleSearchGoogleBooks}
              onImport={handleAddBookFromGoogle}
            />
            <BooksSection
              books={books}
              pagination={pagination}
              authors={authors}
              categories={categories}
              loading={loading}
              onBooksUpdate={handleDeleteBook}
              onBooksUpdateEdit={handleUpdateBook}
              onSearchBooks={fetchBooks}
              onPageChange={(page, title, author, category) => fetchBooks(page, title, author, category)}
            />
          </div>
        )
      case 'authors':
        return (
          <AuthorsTab
            authors={authors}
            onDataUpdate={fetchAll}
            showSuccess={showSuccess}
            showError={showError}
          />
        )
      case 'categories':
        return (
          <CategoriesTab
            categories={categories}
            onDataUpdate={fetchAll}
            showSuccess={showSuccess}
            showError={showError}
          />
        )
      case 'members':
        return (
          <MembersTab
            users={users.filter(u => u.role === 'member')}
            onDataUpdate={fetchAll}
            showSuccess={showSuccess}
            showError={showError}
          />
        )
      case 'librarians':
        return (
          <LibrariansTab
            users={users}
            onDataUpdate={fetchAll}
            showSuccess={showSuccess}
            showError={showError}
          />
        )
      case 'borrows':
        return (
          <BorrowsTab
            showSuccess={showSuccess}
            showError={showError}
          />
        )
      case 'reports':
        return (
          <ReportsTab
            books={books}
            users={users}
            borrows={borrows}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="librarian-dashboard">
      <h2>Admin Dashboard</h2>
      <div className="tabs">
        <button className={tab === 'overview' ? 'active' : ''} onClick={() => setTab('overview')}>Overview</button>
        <button className={tab === 'books' ? 'active' : ''} onClick={() => setTab('books')}>Books</button>
        <button className={tab === 'authors' ? 'active' : ''} onClick={() => setTab('authors')}>Authors</button>
        <button className={tab === 'categories' ? 'active' : ''} onClick={() => setTab('categories')}>Categories</button>
        <button className={tab === 'members' ? 'active' : ''} onClick={() => setTab('members')}>Members</button>
        <button className={tab === 'librarians' ? 'active' : ''} onClick={() => setTab('librarians')}>Librarians</button>
        <button className={tab === 'borrows' ? 'active' : ''} onClick={() => setTab('borrows')}>Unreturned Borrows</button>
        <button className={tab === 'reports' ? 'active' : ''} onClick={() => setTab('reports')}>Reports</button>
      </div>

      <div className="tab-content">
        {renderTabContent()}
      </div>
    </div>
  )
}