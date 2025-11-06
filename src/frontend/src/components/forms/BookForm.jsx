import React, { useState } from 'react'

function BookForm({ onSubmit, onCancel, categories, authors }){
  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.target
    const payload = {
      isbn: form.isbn.value,
      title: form.title.value,
      author_id: Number(form.author_id.value),
      category_id: Number(form.category_id.value),
      total_copies: Number(form.total_copies.value || 1),
      cover: form.cover.value || undefined,
      description: form.description.value || undefined
    }
    await onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Book Manually</h3>
      <div className="form-grid">
        <input name="isbn" placeholder="ISBN" required />
        <input name="title" placeholder="Title" required />
        <select name="author_id" required>
          <option value="">Select Author</option>
          {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
        <select name="category_id" required>
          <option value="">Select Category</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input name="total_copies" placeholder="Total copies" type="number" min="1" defaultValue="1" />
        <input name="cover" placeholder="Cover URL (optional)" />
        <textarea name="description" placeholder="Description (optional)" />
      </div>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button type="submit">Create Book</button>
        {onCancel && <button type="button" onClick={onCancel} className="cancel-btn">Cancel</button>}
      </div>
    </form>
  )
}

export default BookForm