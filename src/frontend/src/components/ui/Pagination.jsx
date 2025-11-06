import React from 'react'

function Pagination({ pagination, onPageChange, currentFilters = {} }){
  if (pagination.total_pages <= 1) return null;

  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(pagination.page - 1, currentFilters.title, currentFilters.author, currentFilters.category)}
        disabled={!pagination.has_prev}
      >
        Previous
      </button>
      <span>
        Page {pagination.page} of {pagination.total_pages}
      </span>
      <button
        onClick={() => onPageChange(pagination.page + 1, currentFilters.title, currentFilters.author, currentFilters.category)}
        disabled={!pagination.has_next}
      >
        Next
      </button>
    </div>
  )
}

export default Pagination