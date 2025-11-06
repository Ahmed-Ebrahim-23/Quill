import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useNotifications } from '../contexts/NotificationContext'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const { login } = useAuth()
  const { showError } = useNotifications()
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      const user = await login({ email, password })
      // Redirect based on user role
      if (user.role === 'admin') return nav('/admin')
      if (user.role === 'librarian') return nav('/librarian')
      if (user.role === 'member') return nav('/')
      return nav('/')
    } catch (err) {
      let message = err.message || 'Login failed'

      // Handle JSend fail responses
      if (err.response?.data?.status === 'fail') {
        message = err.response.data.data?.description || err.response.data.message || 'Login failed'
      } else if (err.response?.data?.status === 'error') {
        message = err.response.data.message || 'Login failed'
      } else if (err.response?.data?.message) {
        message = err.response.data.message
      }

      setError(message)
      showError(message)
    }
  }

  return (
    <div className="page auth">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your Quill Library account</p>
        </div>
        <form onSubmit={submit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              type="email"
              placeholder="Enter your email"
              required
              aria-describedby={error ? "login-error" : undefined}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              type="password"
              placeholder="Enter your password"
              required
              aria-describedby={error ? "login-error" : undefined}
            />
          </div>
          {error && <div id="login-error" className="error" role="alert">{error}</div>}
          <button type="submit" className="auth-submit-btn">Sign In</button>
        </form>
        <div className="auth-footer">
          <p>Don't have an account? <a href="/register">Create one here</a></p>
        </div>
      </div>
    </div>
  )
}
