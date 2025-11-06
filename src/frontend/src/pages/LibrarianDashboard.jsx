import React, { useEffect, useState, useCallback, memo } from 'react'
import {
  getBooks, createBook, deleteBook, updateBook,
  getAuthors, createAuthor, deleteAuthor,
  getCategories, createCategory, deleteCategory,
  getUsers, deleteUser,
  searchGoogleBooks, importBook,
  fetchUnreturnedBorrows, returnBorrow
} from '../api'
import { useNotifications } from '../contexts/NotificationContext'
import Table from '../components/ui/Table'
import Pagination from '../components/ui/Pagination'
import BooksSection from '../components/BooksSection'
import BookForm from '../components/forms/BookForm'

/**
 * 📚 BooksTab: Manages creating, editing, and importing books.
 */
const BooksTab = memo(({
  books, pagination, authors, categories, loading,
  onDeleteBook, onEditBook, onSearchBooks, onPageChange,
  onAddBook, onImportBook, onSearchGoogle, googleBooks,
  editingBook, onSaveEdit, onCancelEdit
}) => {
  return (
    <div>
      {/* --- Edit Book Form --- */}
      {editingBook && (
        <BookEditForm
          book={editingBook}
          authors={authors}
          categories={categories}
          onSubmit={onSaveEdit}
          onCancel={onCancelEdit}
        />
      )}

      {/* --- Add Book Form --- */}
      <h3>Add New Book</h3>
      <BookForm
        onSubmit={onAddBook}
        categories={categories}
        authors={authors}
      />

      {/* --- Import from Google Books --- */}
      <GoogleBooksImport
        googleBooks={googleBooks}
        onSearch={onSearchGoogle}
        onImport={onImportBook}
      />

      {/* --- Books List Table --- */}
      <BooksSection
        books={books}
        pagination={pagination}
        authors={authors}
        categories={categories}
        loading={loading}
        onBooksUpdate={onDeleteBook}
        onBooksUpdateEdit={onEditBook}
        onSearchBooks={onSearchBooks}
        onPageChange={onPageChange}
      />
    </div>
  )
})

/**
 * ✍️ GoogleBooksImport: Handles Google Books search and import UI.
 */
const GoogleBooksImport = memo(({ googleBooks, onSearch, onImport }) => {
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!query.trim()) return
    onSearch(query)
  }

  return (
    <div className="import-section">
      <h3>Import from Google Books</h3>
      <form onSubmit={handleSubmit} className="simple-form">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter ISBN or book title"
          required
        />
        <button type="submit">Search</button>
      </form>

      {googleBooks.length > 0 && (
        <div className="search-results">
          <h4>Search Results</h4>
          <table className="google-books-table">
            <thead>
              <tr>
                <th>Cover</th>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>ISBN</th>
                <th>Copies</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {googleBooks.map(book => {
                const volumeInfo = book.volumeInfo
                const isbn = volumeInfo.industryIdentifiers?.find(id => id.type === 'ISBN_13')?.identifier ||
                            volumeInfo.industryIdentifiers?.find(id => id.type === 'ISBN_10')?.identifier ||
                            volumeInfo.industryIdentifiers?.[0]?.identifier || ''
                return (
                  <tr key={book.id}>
                    <td>
                      {volumeInfo.imageLinks?.thumbnail && (
                        <img src={volumeInfo.imageLinks.thumbnail} alt={volumeInfo.title} className="table-book-cover" />
                      )}
                    </td>
                    <td>{volumeInfo.title}</td>
                    <td>{volumeInfo.authors?.join(', ') || 'Unknown'}</td>
                    <td>{volumeInfo.categories?.join(', ') || 'Uncategorized'}</td>
                    <td>{isbn}</td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        defaultValue="1"
                        className="copies-input"
                        onChange={(e) => book.totalCopies = Number(e.target.value)}
                      />
                    </td>
                    <td>
                      <button
                        className="add-btn"
                        onClick={() => onImport(book)}
                      >
                        Add
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
})

/**
 * 📝 BookEditForm: A controlled form for editing an existing book.
 */
const BookEditForm = ({ book, authors, categories, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(book)

  useEffect(() => {
    setFormData(book)
  }, [book])

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    let finalValue = value;
    if (type === 'number') {
      finalValue = value === '' ? '' : Number(value);
    } 
    else if (name === 'author_id' || name === 'category_id') {
      finalValue = Number(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: finalValue
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="edit-book-section">
      <h3>Edit Book: {book.title}</h3>
      <form onSubmit={handleSubmit} className="edit-book-form">
        <div className="form-grid">
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            required
          />
          <select name="author_id" value={formData.author_id || ''} onChange={handleChange} required>
            <option value="">Select Author</option>
            {authors.map(author => (
              <option key={author.id} value={author.id}>{author.name}</option>
            ))}
          </select>
          <select name="category_id" value={formData.category_id || ''} onChange={handleChange} required>
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <input
            name="total_copies"
            type="number"
            min="1"
            value={formData.total_copies}
            onChange={handleChange}
            placeholder="Total Copies"
            required
          />
        </div>
        <input
          name="cover"
          value={formData.cover || ''}
          onChange={handleChange}
          placeholder="Cover URL"
        />
        <textarea
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          placeholder="Description"
        />
        <div className="form-actions">
          <button type="submit">Save Changes</button>
          <button type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  )
}

/**
 * 🧑‍🏫 AuthorsTab: Manages adding and deleting authors.
 */
const AuthorsTab = memo(({ authors, onDataUpdate, showSuccess, showError }) => {
  const [newAuthorName, setNewAuthorName] = useState('')

  const handleAddAuthor = async (e) => {
    e.preventDefault()
    if (!newAuthorName.trim()) return
    try {
      await createAuthor({ name: newAuthorName.trim() })
      showSuccess('Author added successfully')
      setNewAuthorName('')
      onDataUpdate()
    } catch (err) {
      const message = err.response?.data?.data?.description || err.response?.data?.message || 'Failed to add author'
      showError(message)
    }
  }

  const handleDeleteAuthor = async (a) => {
    if (window.confirm('Delete author?')) {
      try {
        await deleteAuthor(a.id)
        showSuccess('Author deleted successfully')
        onDataUpdate()
      } catch (err) {
        const message = err.response?.data?.data?.description || err.response?.data?.message || 'Failed to delete author'
        showError(message)
      }
    }
  }

  return (
    <div>
      <form onSubmit={handleAddAuthor} className="simple-form">
        <input
          value={newAuthorName}
          onChange={(e) => setNewAuthorName(e.target.value)}
          placeholder="Author name"
          required
        />
        <button type="submit">Add Author</button>
      </form>
      <Table columns={[{ key: 'name', title: 'Name' }, { key: 'books_count', title: 'Books' }]} data={authors} onDelete={handleDeleteAuthor} />
    </div>
  )
})

/**
 * 🏷️ CategoriesTab: Manages adding and deleting categories.
 */
const CategoriesTab = memo(({ categories, onDataUpdate, showSuccess, showError }) => {
  const [newCategoryName, setNewCategoryName] = useState('')

  const handleAddCategory = async (e) => {
    e.preventDefault()
    if (!newCategoryName.trim()) return
    try {
      await createCategory({ name: newCategoryName.trim() })
      showSuccess('Category added successfully')
      setNewCategoryName('')
      onDataUpdate()
    } catch (err) {
      const message = err.response?.data?.data?.description || err.response?.data?.message || 'Failed to add category'
      showError(message)
    }
  }

  const handleDeleteCategory = async (c) => {
    if (window.confirm('Delete category?')) {
      try {
        await deleteCategory(c.id)
        showSuccess('Category deleted successfully')
        onDataUpdate()
      } catch (err) {
        const message = err.response?.data?.data?.description || err.response?.data?.message || 'Failed to delete category'
        showError(message)
      }
    }
  }

  return (
    <div>
      <form onSubmit={handleAddCategory} className="simple-form">
        <input
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="Category name"
          required
        />
        <button type="submit">Add Category</button>
      </form>
      <Table columns={[{ key: 'name', title: 'Name' }, { key: 'books_count', title: 'Books' }]} data={categories} onDelete={handleDeleteCategory} />
    </div>
  )
})

/**
 * 👥 MembersTab: Manages deleting members.
 */
const MembersTab = memo(({ users, onDataUpdate, showSuccess, showError }) => {
  const handleDeleteUser = async (u) => {
    if (window.confirm('Delete user?')) {
      try {
        await deleteUser(u.id)
        showSuccess('User deleted successfully')
        onDataUpdate()
      } catch (err) {
        const message = err.response?.data?.data?.description || err.response?.data?.message || 'Failed to delete user'
        showError(message)
      }
    }
  }

  return (
    <div>
      <h3>Members</h3>
      <Table columns={[{ key: 'name', title: 'Name' }, { key: 'email', title: 'Email' }, { key: 'role', title: 'Role' }]} data={users} onDelete={handleDeleteUser} />
    </div>
  )
})

/**
 * 🔄 BorrowsTab: Manages viewing and returning unreturned borrows.
 */
const BorrowsTab = memo(({ showSuccess, showError }) => {
  const [borrows, setBorrows] = useState([])
  const [pagination, setPagination] = useState({ total: 0, pages: 0, current_page: 1 })
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  const loadBorrows = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetchUnreturnedBorrows(pagination.current_page, 10, search)
      const data = res.data.data || res.data
      setBorrows(data.borrows || [])
      setPagination({ total: data.total, pages: data.pages, current_page: data.current_page })
    } catch (err) {
      console.error('Failed to fetch unreturned borrows:', err)
      const message = err.response?.data?.data?.description || err.response?.data?.message || 'Failed to load unreturned borrows'
      showError(message)
    } finally {
      setLoading(false)
    }
  }, [pagination.current_page, search, showError])

  useEffect(() => {
    loadBorrows()
  }, [loadBorrows]) // loadBorrows is wrapped in useCallback, so this is safe

  const handleReturnBorrow = async (borrowId) => {
    try {
      await returnBorrow(borrowId)
      showSuccess('Book returned successfully')
      loadBorrows()
    } catch (err) {
      const message = err.response?.data?.data?.description || err.response?.data?.message || 'Failed to return book'
      showError(message)
    }
  }

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, current_page: page }))
  }

  // Basic debounce for search to avoid API calls on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
        // Trigger search by resetting to page 1
        setPagination(prev => ({ ...prev, current_page: 1 }))
    }, 500); // 500ms delay
    return () => clearTimeout(timer);
  }, [search]);


  return (
    <div>
      <h3>Unreturned Borrows ({pagination.total})</h3>
      <div className="search-filters">
        <input
          type="text"
          placeholder="Search by member name"
          value={search}
          onChange={e => setSearch(e.target.value)}
          aria-label="Search unreturned borrows"
        />
      </div>
      {loading ? (
        <div className="loading"><div className="spinner"></div></div>
      ) : borrows.length > 0 ? (
        <>
          <Table
            columns={[
              { key: 'book_title', title: 'Book Title' },
              { key: 'member_name', title: 'Member Name' },
              { key: 'borrow_date', title: 'Borrow Date', render: (b) => new Date(b.borrow_date).toLocaleDateString() },
              { key: 'due_date', title: 'Due Date', render: (b) => new Date(b.due_date).toLocaleDateString() },
              { key: 'status', title: 'Status', render: (b) => <span className={b.is_overdue ? 'status-overdue' : 'status-active'}>{b.is_overdue ? 'Overdue' : 'Active'}</span> },
              { key: 'actions', title: 'Actions', render: (b) => <button className="update-btn" onClick={() => handleReturnBorrow(b.id)}>Return</button> }
            ]}
            data={borrows}
            showActions={false}
          />
          {pagination.pages > 1 && (
            <Pagination
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : (
        <div className="no-results">
          <p>No unreturned borrows found.</p>
        </div>
      )}
    </div>
  )
})

// #endregion


/**
 * 🏛️ LibrarianDashboard (Main Component)
 *
 * Manages master state, data fetching, and renders the active tab.
 */
export default function LibrarianDashboard() {
  const [tab, setTab] = useState('books')
  const [books, setBooks] = useState([])
  const [pagination, setPagination] = useState({})
  const [authors, setAuthors] = useState([])
  const [categories, setCategories] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [googleBooks, setGoogleBooks] = useState([])
  const [editingBook, setEditingBook] = useState(null)
  const { showSuccess, showError } = useNotifications()

  // --- Core Data Fetching ---

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const [bRes, aRes, cRes, uRes] = await Promise.all([
        getBooks(), getAuthors(), getCategories(), getUsers()
      ])
      
      const booksData = bRes.data.data || bRes.data
      const booksArray = booksData.books || (Array.isArray(booksData) ? booksData : [])
      setBooks(booksArray)
      setPagination(booksData.pagination || {})
      
      setAuthors(aRes.data.data || aRes.data || [])
      setCategories(cRes.data.data || cRes.data || [])
      setUsers((uRes.data.data || uRes.data || []).filter(u => u.role !== 'admin' && u.role !== 'librarian'))
      
    } catch (err) {
      console.error('Failed to fetch data:', err)
      const message = err.response?.data?.data?.description || err.response?.data?.message || 'Failed to load dashboard data'
      showError(message)
    } finally {
      setLoading(false)
    }
  }, [showError]) // Add showError as dependency

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
  }, [showError]) // Add showError as dependency

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
      fetchAll() // Refetch all to update book list and counts
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
        fetchAll() // Refetch all to update book list and counts
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
      fetchAll() // Refetch all to update book list
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
      fetchAll() // Refetch all to get new book, author, and category
    } catch (err) {
      const message = err.response?.data?.data?.description || err.response?.data?.message || 'Failed to import book'
      showError(message)
    }
  }, [fetchAll, showError, showSuccess])

  // --- Render ---

  const renderTabContent = () => {
    if (loading && !editingBook) { // Don't show global spinner if just editing
      return <div className="loading"><div className="spinner"></div></div>
    }

    switch (tab) {
      case 'books':
        return (
          <BooksTab
            books={books}
            pagination={pagination}
            authors={authors}
            categories={categories}
            loading={loading}
            onDeleteBook={handleDeleteBook}
            onEditBook={handleUpdateBook}
            onSearchBooks={fetchBooks}
            onPageChange={(page, title, author, category) => fetchBooks(page, title, author, category)}
            onAddBook={handleAddBook}
            onImportBook={handleAddBookFromGoogle}
            onSearchGoogle={handleSearchGoogleBooks}
            googleBooks={googleBooks}
            editingBook={editingBook}
            onSaveEdit={handleSaveBookUpdate}
            onCancelEdit={handleCancelEdit}
          />
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
      default:
        return null
    }
  }

  return (
    <div className="page librarian-dashboard">
      <h2>Librarian Dashboard</h2>
      <div className="tabs">
        <button className={tab === 'books' ? 'active' : ''} onClick={() => setTab('books')}>Books</button>
        <button className={tab === 'authors' ? 'active' : ''} onClick={() => setTab('authors')}>Authors</button>
        <button className={tab === 'categories' ? 'active' : ''} onClick={() => setTab('categories')}>Categories</button>
        <button className={tab === 'members' ? 'active' : ''} onClick={() => setTab('members')}>Members</button>
        <button className={tab === 'borrows' ? 'active' : ''} onClick={() => setTab('borrows')}>Unreturned Borrows</button>
      </div>

      <div className="tab-content">
        {renderTabContent()}
      </div>
    </div>
  )
}