import React from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useNotifications } from '../contexts/NotificationContext'
import { useBookDetails } from '../hooks/useBookDetails'
import { useBooks } from '../hooks/useBooks'

function BookDetails() {
  const { isbn } = useParams()
  const { book, loading, error } = useBookDetails(isbn)
  const { borrowBook } = useBooks()
  const { user } = useAuth()
  const { showError } = useNotifications()

  const handleBorrow = async () => {
    if (!user) {
      showError('Please login to borrow books')
      return
    }
    if (!book || book.available_copies <= 0) {
      showError('This book is currently unavailable')
      return
    }
    try {
      await borrowBook(book)
    } catch (err) {
      showError(err.response?.data?.message || 'Could not borrow book')
    }
  }

  if (loading) {
    return (
      <div className="page book-details loading">
        <div className="loading-spinner">Loading book details...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page book-details error">
        <div className="error-message">{error}</div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="page book-details">
        <div className="no-book">Book not found</div>
      </div>
    )
  }

  return (
    <div className="page book-details">
      <div className="book-details-container">
        {/* Header Section */}
        <div className="book-details-header">
          <div className="book-cover-large">
            {book.cover ? (
              <img src={book.cover} alt={`Cover of ${book.title}`} />
            ) : (
              <div className="book-cover-placeholder">
                <span>No cover available</span>
              </div>
            )}
          </div>
          <div className="book-info-main">
            <h1 className="book-title-large">{book.title}</h1>
            <div className="book-meta-large">
              <p className="book-author">by {book.author}</p>
              <p className="book-category">{book.category}</p>
              <p className="book-availability-status">
                {book.available_copies > 0 ? 'Available' : 'Unavailable'}
              </p>
              <p className="book-isbn">ISBN: {book.isbn}</p>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="book-details-section">
          <h2>Description</h2>
          <div className="book-description">
            {book.description ? (
              <p>{book.description}</p>
            ) : (
              <p className="no-description">No description available for this book.</p>
            )}
          </div>
        </div>

        {/* Availability Section */}
        <div className="book-details-section">
          <h2>Availability</h2>
          <div className="book-availability">
            <div className="availability-info">
              <p><strong>Total Copies:</strong> {book.total_copies}</p>
              <p><strong>Available Copies:</strong> {book.available_copies}</p>
            </div>
            {user && (
              <button
                onClick={handleBorrow}
                disabled={book.available_copies <= 0}
                aria-label={`Borrow ${book.title}`}
                className="borrow-button-large"
              >
                {book.available_copies <= 0 ? 'Unavailable' : 'Borrow Book'}
              </button>
            )}
          </div>
        </div>

        {/* Metadata Section */}
        <div className="book-details-section">
          <h2>Additional Information</h2>
          <div className="book-metadata">
            <div className="metadata-item">
              <strong>Author:</strong> {book.author}
            </div>
            <div className="metadata-item">
              <strong>Category:</strong> {book.category}
            </div>
            <div className="metadata-item">
              <strong>ISBN:</strong> {book.isbn}
            </div>
            <div className="metadata-item">
              <strong>Total Copies:</strong> {book.total_copies}
            </div>
            <div className="metadata-item">
              <strong>Available Copies:</strong> {book.available_copies}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookDetails