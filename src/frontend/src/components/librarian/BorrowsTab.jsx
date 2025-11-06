import React, { useEffect, useState, useCallback } from 'react'
import Table from '../ui/Table'
import Pagination from '../ui/Pagination'
import { fetchUnreturnedBorrows, returnBorrow } from '../../api'

/**
 * BorrowsTab Component
 * Manages viewing and returning unreturned borrows
 */
export default function BorrowsTab({ showSuccess, showError }) {
  const [borrows, setBorrows] = useState([])
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    current_page: 1
  })
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  const loadBorrows = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetchUnreturnedBorrows(pagination.current_page, 10, search)
      const data = res.data.data || res.data
      setBorrows(data.borrows || [])
      setPagination({
        total: data.total,
        pages: data.pages,
        current_page: data.current_page
      })
    } catch (err) {
      console.error('Failed to fetch unreturned borrows:', err)
      const message =
        err.response?.data?.data?.description ||
        err.response?.data?.message ||
        'Failed to load unreturned borrows'
      showError(message)
    } finally {
      setLoading(false)
    }
  }, [pagination.current_page, search, showError])

  useEffect(() => {
    loadBorrows()
  }, [loadBorrows])

  const handleReturnBorrow = async (borrowId) => {
    try {
      await returnBorrow(borrowId)
      showSuccess('Book returned successfully')
      loadBorrows()
    } catch (err) {
      const message =
        err.response?.data?.data?.description ||
        err.response?.data?.message ||
        'Failed to return book'
      showError(message)
    }
  }

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, current_page: page }))
  }

  // Debounce search to avoid API calls on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      setPagination((prev) => ({ ...prev, current_page: 1 }))
    }, 500)
    return () => clearTimeout(timer)
  }, [search])

  return (
    <div className="borrows-tab">
      <section aria-labelledby="borrows-heading">
        <h3 id="borrows-heading">Unreturned Borrows ({pagination.total})</h3>
        
        <div className="search-filters">
          <input
            type="text"
            placeholder="Search by member name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search unreturned borrows by member name"
          />
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : borrows.length > 0 ? (
          <>
            <Table
              columns={[
                { key: 'book_title', title: 'Book Title' },
                { key: 'member_name', title: 'Member Name' },
                {
                  key: 'borrow_date',
                  title: 'Borrow Date',
                  render: (b) => new Date(b.borrow_date).toLocaleDateString()
                },
                {
                  key: 'due_date',
                  title: 'Due Date',
                  render: (b) => new Date(b.due_date).toLocaleDateString()
                },
                {
                  key: 'status',
                  title: 'Status',
                  render: (b) => (
                    <span className={b.is_overdue ? 'status-overdue' : 'status-active'}>
                      {b.is_overdue ? 'Overdue' : 'Active'}
                    </span>
                  )
                },
                {
                  key: 'actions',
                  title: 'Actions',
                  render: (b) => (
                    <button
                      className="update-btn"
                      onClick={() => handleReturnBorrow(b.id)}
                      aria-label={`Return ${b.book_title}`}
                    >
                      Return
                    </button>
                  )
                }
              ]}
              data={borrows}
              showActions={false}
            />
            {pagination.pages > 1 && (
              <Pagination pagination={pagination} onPageChange={handlePageChange} />
            )}
          </>
        ) : (
          <div className="no-results">
            <p>No unreturned borrows found.</p>
          </div>
        )}
      </section>
    </div>
  )
}
