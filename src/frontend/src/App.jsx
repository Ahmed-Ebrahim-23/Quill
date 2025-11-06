import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AdminDashboard from './pages/AdminDashboard'
import BooksList from './pages/BooksList'
import Nav from './components/Nav'
import AuthProvider from './contexts/AuthContext'
import NotificationProvider from './contexts/NotificationContext'
import ThemeProvider, { ThemeToggle } from './components/ThemeToggle'
import Login from './pages/Login'
import Register from './pages/Register'
import RoleGuard from './components/RoleGuard'
import LibrarianDashboard from './pages/LibrarianDashboard'
import BookDetails from './pages/BookDetails'
import MyAccount from './pages/MyAccount'
import MyBorrows from './pages/MyBorrows'
import ProtectedRoute from './components/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'

export default function App(){
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <NotificationProvider>
          <AuthProvider>
            <div className="app">
              <Nav />
              <main>
                <Routes>
                  <Route path="/" element={<BooksList />} />
                  <Route path="/admin" element={<RoleGuard roles={["admin"]}><AdminDashboard /></RoleGuard>} />
                  <Route path="/librarian" element={<RoleGuard roles={["librarian","admin"]}><LibrarianDashboard /></RoleGuard>} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/my-account" element={<ProtectedRoute><MyAccount /></ProtectedRoute>} />
                  <Route path="/my-borrows" element={<ProtectedRoute><MyBorrows /></ProtectedRoute>} />
                  <Route path="/book/:isbn" element={<BookDetails />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </div>
          </AuthProvider>
        </NotificationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}
