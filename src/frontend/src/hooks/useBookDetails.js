import { useState, useEffect } from 'react'
import { getBook } from '../api'
import { useNotifications } from '../contexts/NotificationContext'

export function useBookDetails(isbn) {
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { showError } = useNotifications()

  const fetchBook = async () => {
    if (!isbn) return

    setLoading(true)
    setError(null)
    try {
      const res = await getBook(isbn)
      const data = res.data.data || res.data
      setBook(data)
    } catch (err) {
      const message = 'Could not load book details'
      setError(message)
      showError(message)
    } finally {
      setLoading(false)
    }
  }

  const refetch = () => {
    fetchBook()
  }

  useEffect(() => {
    fetchBook()
  }, [isbn])

  return {
    book,
    loading,
    error,
    refetch
  }
}