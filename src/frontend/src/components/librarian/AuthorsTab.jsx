import React, { useState } from 'react'
import Table from '../ui/Table'
import { createAuthor, deleteAuthor } from '../../api'

/**
 * AuthorsTab Component
 * Manages adding and deleting authors
 */
export default function AuthorsTab({ authors, onDataUpdate, showSuccess, showError }) {
  const [newAuthorName, setNewAuthorName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddAuthor = async (e) => {
    e.preventDefault()
    if (!newAuthorName.trim()) return

    setIsSubmitting(true)
    try {
      await createAuthor({ name: newAuthorName.trim() })
      showSuccess('Author added successfully')
      setNewAuthorName('')
      onDataUpdate()
    } catch (err) {
      const message =
        err.response?.data?.data?.description ||
        err.response?.data?.message ||
        'Failed to add author'
      showError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteAuthor = async (author) => {
    if (window.confirm(`Delete author "${author.name}"?`)) {
      try {
        await deleteAuthor(author.id)
        showSuccess('Author deleted successfully')
        onDataUpdate()
      } catch (err) {
        const message =
          err.response?.data?.data?.description ||
          err.response?.data?.message ||
          'Failed to delete author'
        showError(message)
      }
    }
  }

  return (
    <div className="authors-tab">
      <section aria-labelledby="add-author-heading">
        <h3 id="add-author-heading">Add New Author</h3>
        <form onSubmit={handleAddAuthor} className="simple-form">
          <input
            type="text"
            value={newAuthorName}
            onChange={(e) => setNewAuthorName(e.target.value)}
            placeholder="Author name"
            aria-label="Author name"
            required
            disabled={isSubmitting}
          />
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Author'}
          </button>
        </form>
      </section>

      <section aria-labelledby="authors-list-heading">
        <h3 id="authors-list-heading">Authors List ({authors.length})</h3>
        <Table
          columns={[
            { key: 'name', title: 'Name' },
            { key: 'books_count', title: 'Books' }
          ]}
          data={authors}
          onDelete={handleDeleteAuthor}
        />
      </section>
    </div>
  )
}
