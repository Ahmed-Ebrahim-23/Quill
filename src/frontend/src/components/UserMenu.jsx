import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function UserMenu(){
  const { user, logout } = useAuth()

  if(!user){
    return (
      <div className="user-menu">
        <Link to="/login" aria-label="Login to your account">Login</Link>
        <Link to="/register" aria-label="Register for a new account">Register</Link>
      </div>
    )
  }
  return (
    <div className="user-menu">
      {user.role === 'admin' && <Link to="/admin" aria-label="Go to admin dashboard">Dashboard</Link>}
      <span className="user-name" aria-label={`Logged in as ${user.name || user.email}`}>
        {user.name || user.email}
      </span>
      <button onClick={logout} aria-label="Logout of your account">Logout</button>
    </div>
  )
}
