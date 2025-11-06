import React, { useState } from 'react'

/**
 * GoogleBooksImport Component
 * Handles searching Google Books API and importing books
 */
export default function GoogleBooksImport({ googleBooks, onSearch, onImport }) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!query.trim()) return
    onSearch(query)
  }

  return (
    <section className="import-section" aria-labelledby="google-books-heading">
      <h3 id="google-books-heading">Import from Google Books</h3>
      <form onSubmit={handleSubmit} className="simple-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter ISBN or book title"
          aria-label="Search Google Books by ISBN or title"
          required
        />
        <button type="submit">Search</button>
      </form>

      {googleBooks.length > 0 && (
        <div className="search-results">
          <h4>Search Results ({googleBooks.length})</h4>
          <div className="table-wrapper">
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
                {googleBooks.map((book) => {
                  const volumeInfo = book.volumeInfo
                  const isbn =
                    volumeInfo.industryIdentifiers?.find((id) => id.type === 'ISBN_13')?.identifier ||
                    volumeInfo.industryIdentifiers?.find((id) => id.type === 'ISBN_10')?.identifier ||
                    volumeInfo.industryIdentifiers?.[0]?.identifier ||
                    ''
                  
                  return (
                    <tr key={book.id}>
                      <td>
                        {volumeInfo.imageLinks?.thumbnail && (
                          <img
                            src={volumeInfo.imageLinks.thumbnail}
                            alt={`Cover of ${volumeInfo.title}`}
                            className="table-book-cover"
                          />
                        )}
                      </td>
                      <td>{volumeInfo.title}</td>
                      <td>{volumeInfo.authors?.join(', ') || 'Unknown'}</td>
                      <td>{volumeInfo.categories?.join(', ') || 'Uncategorized'}</td>
                      <td className="isbn-cell">{isbn}</td>
                      <td>
                        <input
                          type="number"
                          min="1"
                          defaultValue="1"
                          className="copies-input"
                          onChange={(e) => (book.totalCopies = Number(e.target.value))}
                          aria-label="Number of copies to add"
                        />
                      </td>
                      <td>
                        <button
                          className="add-btn"
                          onClick={() => onImport(book)}
                          aria-label={`Import ${volumeInfo.title}`}
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
        </div>
      )}
    </section>
  )
}
