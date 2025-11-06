import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useNotifications } from '../../contexts/NotificationContext'

function BookCard({ book, onBorrow }) {
  const { user } = useAuth()
  const { showError } = useNotifications()

  const borrow = async () => {
    if (!user) {
      showError('Please login to borrow books')
      return
    }
    try {
      await onBorrow(book)
    } catch (err) {
      showError(err.response?.data?.message || 'Could not borrow book')
    }
  }

  return (
    <div className="book-card">
      {book.cover && <img src={book.cover} alt={`Cover of ${book.title}`} className="book-cover" />}
      <div className="book-info">
        <Link to={`/book/${book.isbn}`}><h3 className="book-title">{book.title}</h3></Link>
        <div className="book-meta">{book.author} — {book.category}</div>
        <button
          onClick={borrow}
          disabled={book.available_copies <= 0}
          aria-label={`Borrow ${book.title}`}
        >
          {book.available_copies <= 0 ? 'Unavailable' : 'Borrow'}
        </button>
      </div>
    </div>
  )
}

export default BookCard