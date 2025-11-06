import React from 'react'

function SearchFilters({ query, authorFilter, categoryFilter, authors, categories, onQueryChange, onAuthorFilterChange, onCategoryFilterChange, onSearch, onClear, placeholder = "Search by title" }){
  return (
    <div className="search-filters">
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={e => onQueryChange(e.target.value)}
        aria-label="Search books"
      />
      <select
        value={authorFilter}
        onChange={e => onAuthorFilterChange(e.target.value)}
        aria-label="Filter by author"
      >
        <option value="">All Authors</option>
        {authors.map(author => (
          <option key={author.id} value={author.name}>{author.name}</option>
        ))}
      </select>
      <select
        value={categoryFilter}
        onChange={e => onCategoryFilterChange(e.target.value)}
        aria-label="Filter by category"
      >
        <option value="">All Categories</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.name}>{cat.name}</option>
        ))}
      </select>
      <div className="button-group">
        <button onClick={onSearch}>Search</button>
        <button onClick={onClear}>Clear</button>
      </div>
    </div>
  )
}

export default SearchFilters