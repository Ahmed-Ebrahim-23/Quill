import React from 'react'
import BookForm from '../forms/BookForm'
import BooksSection from '../BooksSection'
import GoogleBooksImport from './GoogleBooksImport'
import BookEditForm from './BookEditForm'

/**
 * BooksTab Component
 * Manages the books section of the librarian dashboard
 */
export default function BooksTab({
  books,
  pagination,
  authors,
  categories,
  loading,
  onDeleteBook,
  onEditBook,
  onSearchBooks,
  onPageChange,
  onAddBook,
  onImportBook,
  onSearchGoogle,
  googleBooks,
  editingBook,
  onSaveEdit,
  onCancelEdit
}) {
  return (
    <div className="books-tab">
      {/* Edit Book Form */}
      {editingBook && (
        <BookEditForm
          book={editingBook}
          authors={authors}
          categories={categories}
          onSubmit={onSaveEdit}
          onCancel={onCancelEdit}
        />
      )}

      {/* Add Book Form */}
      <section aria-labelledby="add-book-heading">
        <h3 id="add-book-heading">Add New Book</h3>
        <BookForm
          onSubmit={onAddBook}
          categories={categories}
          authors={authors}
        />
      </section>

      {/* Import from Google Books */}
      <GoogleBooksImport
        googleBooks={googleBooks}
        onSearch={onSearchGoogle}
        onImport={onImportBook}
      />

      {/* Books List Table */}
      <BooksSection
        books={books}
        pagination={pagination}
        authors={authors}
        categories={categories}
        loading={loading}
        onBooksUpdate={onDeleteBook}
        onBooksUpdateEdit={onEditBook}
        onSearchBooks={onSearchBooks}
        onPageChange={onPageChange}
      />
    </div>
  )
}
