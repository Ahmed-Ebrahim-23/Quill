import React, { useState } from 'react'
import Table from '../ui/Table'
import { createCategory, deleteCategory } from '../../api'

/**
 * CategoriesTab Component
 * Manages adding and deleting categories
 */
export default function CategoriesTab({ categories, onDataUpdate, showSuccess, showError }) {
  const [newCategoryName, setNewCategoryName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddCategory = async (e) => {
    e.preventDefault()
    if (!newCategoryName.trim()) return

    setIsSubmitting(true)
    try {
      await createCategory({ name: newCategoryName.trim() })
      showSuccess('Category added successfully')
      setNewCategoryName('')
      onDataUpdate()
    } catch (err) {
      const message =
        err.response?.data?.data?.description ||
        err.response?.data?.message ||
        'Failed to add category'
      showError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteCategory = async (category) => {
    if (window.confirm(`Delete category "${category.name}"?`)) {
      try {
        await deleteCategory(category.id)
        showSuccess('Category deleted successfully')
        onDataUpdate()
      } catch (err) {
        const message =
          err.response?.data?.data?.description ||
          err.response?.data?.message ||
          'Failed to delete category'
        showError(message)
      }
    }
  }

  return (
    <div className="categories-tab">
      <section aria-labelledby="add-category-heading">
        <h3 id="add-category-heading">Add New Category</h3>
        <form onSubmit={handleAddCategory} className="simple-form">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Category name"
            aria-label="Category name"
            required
            disabled={isSubmitting}
          />
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Category'}
          </button>
        </form>
      </section>

      <section aria-labelledby="categories-list-heading">
        <h3 id="categories-list-heading">Categories List ({categories.length})</h3>
        <Table
          columns={[
            { key: 'name', title: 'Name' },
            { key: 'books_count', title: 'Books' }
          ]}
          data={categories}
          onDelete={handleDeleteCategory}
        />
      </section>
    </div>
  )
}
