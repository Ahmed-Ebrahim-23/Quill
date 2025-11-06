import { useState, useEffect } from 'react'
import { getBooks, createBorrow } from '../api'
import { useNotifications } from '../contexts/NotificationContext'

export function useBooks(){
  const [books, setBooks] = useState([])
  const [pagination, setPagination] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { showSuccess, showError } = useNotifications()

  const fetchBooks = async (page = 1, title = '', author = '', category = '') => {
    setLoading(true)
    setError(null)
    try{
      const params = { page, per_page: 12 }
      if (title) params.title = title
      if (author) params.author = author
      if (category) params.category = category

      const res = await getBooks(params)
      const data = res.data.data || res.data
      const booksArray = data.books || (Array.isArray(data) ? data : [])
      setBooks(booksArray)
      setPagination(data.pagination || {})
    }catch(err){
      const message = 'Could not load books'
      setError(message)
      showError(message)
    }finally{ setLoading(false) }
  }

  const borrowBook = async (book) => {
    try {
      console.log('Attempting to borrow book:', book.isbn, book.title)
      const response = await createBorrow({ book_isbn: book.isbn })
      console.log('Borrow response:', response)
      showSuccess('Book borrowed successfully!')
      await fetchBooks() // Refresh the list
    } catch (err) {
      console.error('Borrow error:', err.response?.data, err.response?.status, err.message)
      showError(err.response?.data?.message || 'Could not borrow book')
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  return {
    books,
    pagination,
    loading,
    error,
    fetchBooks,
    borrowBook
  }
}