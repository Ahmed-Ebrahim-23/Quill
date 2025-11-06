import React, { useState, useEffect } from 'react'
import { getUserBorrows } from '../api'
import Table from '../components/ui/Table'

export default function MyBorrows() {
  const [borrows, setBorrows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchBorrows()
  }, [])

  const fetchBorrows = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await getUserBorrows()
      setBorrows(response.data.data)
    } catch (err) {
      setError('Failed to load your borrows')
    } finally {
      setLoading(false)
    }
  }

  const getStatus = (borrow) => {
    if (borrow.return_date) {
      return 'Returned'
    } else if (new Date() > new Date(borrow.due_date)) {
      return 'Overdue'
    } else {
      return 'Borrowed'
    }
  }

  const columns = [
    {
      key: 'book_title',
      title: 'Book Title',
      render: (borrow) => borrow.book_title || borrow.book_isbn
    },
    {
      key: 'borrow_date',
      title: 'Borrow Date',
      render: (borrow) => new Date(borrow.borrow_date).toLocaleDateString()
    },
    {
      key: 'due_date',
      title: 'Due Date',
      render: (borrow) => new Date(borrow.due_date).toLocaleDateString()
    },
    {
      key: 'return_date',
      title: 'Return Date',
      render: (borrow) => borrow.return_date ? new Date(borrow.return_date).toLocaleDateString() : '-'
    },
    {
      key: 'status',
      title: 'Status',
      render: (borrow) => getStatus(borrow)
    }
  ]

  if (loading) {
    return (
      <div className="my-borrows-page">
        <div className="my-borrows-container">
          <h1 className="my-borrows-title">My Borrows</h1>
          <div className="loading">Loading your borrows...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="my-borrows-page">
        <div className="my-borrows-container">
          <h1 className="my-borrows-title">My Borrows</h1>
          <div className="error">{error}</div>
          <button className="retry-btn" onClick={fetchBorrows}>Retry</button>
        </div>
      </div>
    )
  }

  return (
    <div className="my-borrows-page">
      <div className="my-borrows-container">
        <h1 className="my-borrows-title">My Borrows</h1>
        {borrows.length === 0 ? (
          <div className="no-borrows">You haven't borrowed any books yet.</div>
        ) : (
          <Table
            columns={columns}
            data={borrows}
            onDelete={() => {}} // No delete functionality for user view
            onUpdate={() => {}} // No update functionality for user view
            showActions={false}
          />
        )}
      </div>
    </div>
  )
}