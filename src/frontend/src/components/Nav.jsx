import React from 'react'
import { Link } from 'react-router-dom'
import { FaBook, FaUser, FaChartLine, FaBookmark } from 'react-icons/fa'
import UserMenu from './UserMenu'
import { useTheme } from './ThemeToggle'
import { useAuth } from '../contexts/AuthContext'

export default function Nav(){
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const isAdmin = user && user.role === 'admin'
  const isLibrarian = user && user.role === 'librarian'
  const isMember = user && user.role === 'member'

  return (
    <nav className="nav" role="navigation" aria-label="Main navigation">
      <Link to="/" className="brand" aria-label="Quill Library home">Quill</Link>
      <div className="links">
        <Link to="/" aria-label="Browse book catalog">
          <FaBook /> Catalog
        </Link>
        {isAdmin && (
          <Link to="/admin" aria-label="View admin dashboard">
            <FaChartLine /> Admin
          </Link>
        )}
        {isLibrarian && (
          <Link to="/librarian" aria-label="View librarian dashboard">
            <FaChartLine /> Dashboard
          </Link>
        )}
        {isMember && (
          <Link to="/my-borrows" aria-label="View your borrows">
            <FaBookmark /> My Borrows
          </Link>
        )}
        <Link to="/my-account" aria-label="View your account">
          <FaUser /> My Account
        </Link>
      </div>
      <div className="nav-controls">
        <button
          className="theme-toggle-nav"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        <UserMenu />
      </div>
    </nav>
  )
}
