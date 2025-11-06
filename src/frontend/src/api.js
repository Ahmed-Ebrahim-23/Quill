import axios from 'axios'

const BASE = import.meta.env.VITE_API_BASE


const api = axios.create({
  baseURL: BASE,
  timeout: 5000,
})

// Always attach JWT token from localStorage to Authorization header
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const getBooks = (params = {}) => api.get('/books/', { params })
export const getBook = (isbn) => api.get(`/books/${isbn}`)

export const authLogin = (payload) => api.post('/auth/login', payload)
export const authRegister = (payload) => api.post('/auth/register', payload)
export const getUsers = () => api.get('/users/')
export const createBorrow = (payload) => api.post('/borrows/', payload)
export const getUserBorrows = () => api.get('/borrows/user')
export const fetchUnreturnedBorrows = (page = 1, perPage = 10, search = '') =>
  api.get('/borrows/unreturned', { params: { page, per_page: perPage, search } })
export const returnBorrow = (borrowId) => api.post(`/borrows/${borrowId}/return`)
export const getMe = () => api.get('/auth/me')
// Books
export const createBook = (payload) => api.post('/books/', payload)
export const updateBook = (isbn, payload) => {
  console.log('updateBook called with:', { isbn, payload })
  return api.put(`/books/${isbn}`, payload)
}
export const deleteBook = (isbn) => api.delete(`/books/${isbn}`)
// Authors
export const getAuthors = () => api.get('/authors/')
export const createAuthor = (payload) => api.post('/authors/', payload)
export const updateAuthor = (id, payload) => api.put(`/authors/${id}`, payload)
export const deleteAuthor = (id) => api.delete(`/authors/${id}`)
// Categories
export const getCategories = () => api.get('/categories/')
export const createCategory = (payload) => api.post('/categories/', payload)
export const updateCategory = (id, payload) => api.put(`/categories/${id}`, payload)
export const deleteCategory = (id) => api.delete(`/categories/${id}`)
// Users
export const importBook = (payload) => api.post('/books/import', payload)
// Users
export const deleteUser = (id) => api.delete(`/users/${id}`)
export const updateUser = (id, payload) => api.put(`/users/${id}`, payload)
export const createUser = (payload) => api.post('/users/', payload)
// Google Books API
export const searchGoogleBooks = async (query) => {
  // Check if query looks like an ISBN (10 or 13 digits)
  const isISBN = /^\d{10}(\d{3})?$/.test(query.replace(/[-\s]/g, ''));

  // Use isbn: prefix for ISBN searches to get exact matches
  const searchQuery = isISBN ? `isbn:${query.replace(/[-\s]/g, '')}` : query;

  const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}&maxResults=10`);
  if (!response.ok) {
    throw new Error('Failed to fetch from Google Books API');
  }
  return response.json();
};

export default api
