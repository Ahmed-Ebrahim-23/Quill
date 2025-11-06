import React, { useState } from 'react'
import Table from './ui/Table'
import Pagination from './ui/Pagination'

function BooksSection({ books, pagination, authors, categories, loading, onBooksUpdate, onBooksUpdateEdit, onSearchBooks, onPageChange }){
  const [searchQuery, setSearchQuery] = useState('')
  const [authorFilter, setAuthorFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  const currentFilters = { title: searchQuery, author: authorFilter, category: categoryFilter }

  const handleSearch = () => onSearchBooks(1, searchQuery, authorFilter, categoryFilter)
  const handleClear = () => {
    setSearchQuery('')
    setAuthorFilter('')
    setCategoryFilter('')
    onSearchBooks(1, '', '', '')
  }

  return (
    <div className="books-section">

      <h3>Books ({pagination.total_items || books.length})</h3>

      <div className="search-filters">
        <input
          type="text"
          placeholder="Search by title"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          aria-label="Search books by title"
        />
        <select
          value={authorFilter}
          onChange={e => setAuthorFilter(e.target.value)}
          aria-label="Filter by author"
        >
          <option value="">All Authors</option>
          {authors.map(author => (
            <option key={author.id} value={author.name}>{author.name}</option>
          ))}
        </select>
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          aria-label="Filter by category"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
        <div className="button-group">
          <button onClick={handleSearch}>Search</button>
          <button onClick={handleClear}>Clear</button>
        </div>
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : books.length > 0 ? (
        <>
          <Table
            columns={[
              {key:'cover',title:'Cover',render:(b)=> b.cover ? <img src={b.cover} alt={b.title} className="table-book-cover" /> : 'N/A'},
              {key:'isbn',title:'ISBN'},
              {key:'title',title:'Title'},
              {key:'author',title:'Author'},
              {key:'category',title:'Category'},
              {key:'available_copies',title:'Available'}
            ]}
            data={books}
            onDelete={onBooksUpdate}
            onUpdate={onBooksUpdateEdit}
          />
          <Pagination pagination={pagination} onPageChange={onPageChange} currentFilters={currentFilters} />
        </>
      ) : (
        <div className="no-results">
          <p>No books found matching your search criteria.</p>
        </div>
      )}
    </div>
  )
}
export default BooksSection