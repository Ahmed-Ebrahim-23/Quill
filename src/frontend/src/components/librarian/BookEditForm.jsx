import React, { useState, useEffect } from 'react'

/**
 * BookEditForm Component
 * A controlled form for editing an existing book
 */
export default function BookEditForm({ book, authors, categories, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(book)

  useEffect(() => {
    setFormData(book)
  }, [book])

  const handleChange = (e) => {
    const { name, value, type } = e.target

    let finalValue = value
    if (type === 'number') {
      finalValue = value === '' ? '' : Number(value)
    } else if (name === 'author_id' || name === 'category_id') {
      finalValue = Number(value)
    }

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <section className="edit-book-section" aria-labelledby="edit-book-heading">
      <h3 id="edit-book-heading">Edit Book: {book.title}</h3>
      <form onSubmit={handleSubmit} className="edit-book-form">
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="edit-title">Title</label>
            <input
              id="edit-title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Title"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="edit-author">Author</label>
            <select
              id="edit-author"
              name="author_id"
              value={formData.author_id || ''}
              onChange={handleChange}
              required
            >
              <option value="">Select Author</option>
              {authors.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="edit-category">Category</label>
            <select
              id="edit-category"
              name="category_id"
              value={formData.category_id || ''}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="edit-copies">Total Copies</label>
            <input
              id="edit-copies"
              name="total_copies"
              type="number"
              min="1"
              value={formData.total_copies}
              onChange={handleChange}
              placeholder="Total Copies"
              required
            />
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="edit-cover">Cover URL</label>
          <input
            id="edit-cover"
            name="cover"
            value={formData.cover || ''}
            onChange={handleChange}
            placeholder="Cover URL (optional)"
          />
        </div>

        <div className="form-field">
          <label htmlFor="edit-description">Description</label>
          <textarea
            id="edit-description"
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            placeholder="Description (optional)"
          />
        </div>

        <div className="form-actions">
          <button type="submit">Save Changes</button>
          <button type="button" onClick={onCancel} className="cancel-btn">
            Cancel
          </button>
        </div>
      </form>
    </section>
  )
}
