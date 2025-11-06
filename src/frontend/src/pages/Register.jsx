import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Register(){
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const { register } = useAuth()
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    try{
      await register({ name, email, password })
      nav('/login')
    }catch(err){
      setError(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="page auth">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join the Quill Library community</p>
        </div>
        <form onSubmit={submit} className="auth-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              type="email"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              value={password}
              onChange={e => setPassword(e.target.value)}
              type="password"
              placeholder="Create a secure password"
              required
            />
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit" className="auth-submit-btn">Create Account</button>
        </form>
        <div className="auth-footer">
          <p>Already have an account? <a href="/login">Sign in here</a></p>
        </div>
      </div>
    </div>
  )
}
