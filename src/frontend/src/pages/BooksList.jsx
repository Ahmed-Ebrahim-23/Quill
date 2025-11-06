import React, { useState, useEffect } from 'react'
import { getCategories, getAuthors } from '../api'
import BookCard from '../components/common/BookCard'
import Pagination from '../components/ui/Pagination'
import SearchFilters from '../components/common/SearchFilters'
import { useBooks } from '../hooks/useBooks'

export default function BooksList(){
  const [categories, setCategories] = useState([])
  const [authors, setAuthors] = useState([])
  const [query, setQuery] = useState('')
  const [authorFilter, setAuthorFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  const { books, pagination, loading, error, fetchBooks, borrowBook } = useBooks()

  useEffect(() => {
    fetchCategories()
    fetchAuthors()
  }, [])

  async function fetchCategories(){
    try{
      const res = await getCategories()
      const categoriesData = res.data.data || res.data || []
      setCategories(categoriesData)
    }catch(err){
      console.error('Could not load categories', err)
    }
  }

  async function fetchAuthors(){
    try{
      const res = await getAuthors()
      const authorsData = res.data.data || res.data || []
      setAuthors(authorsData)
    }catch(err){
      console.error('Could not load authors', err)
    }
  }

  const handleSearch = () => {
    fetchBooks(1, query, authorFilter, categoryFilter)
  }

  const handleClear = () => {
    setQuery('')
    setAuthorFilter('')
    setCategoryFilter('')
    fetchBooks(1, '', '', '')
  }

  const handlePageChange = (newPage, title, author, category) => {
    fetchBooks(newPage, title || query, author || authorFilter, category || categoryFilter)
  }

  return (
    <div className="page books">
      <h1>Library Catalog</h1>
      <SearchFilters
        query={query}
        authorFilter={authorFilter}
        categoryFilter={categoryFilter}
        authors={authors}
        categories={categories}
        onQueryChange={setQuery}
        onAuthorFilterChange={setAuthorFilter}
        onCategoryFilterChange={setCategoryFilter}
        onSearch={handleSearch}
        onClear={handleClear}
        placeholder="Search by title, author or category"
      />

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <>
          <div className="books-grid">
            {books.map(book => (
              <BookCard key={book.isbn} book={book} onBorrow={borrowBook} />
            ))}
          </div>

          <Pagination pagination={pagination} onPageChange={handlePageChange} currentFilters={{ title: query, author: authorFilter, category: categoryFilter }} />
        </>
      )}
    </div>
  )
}
