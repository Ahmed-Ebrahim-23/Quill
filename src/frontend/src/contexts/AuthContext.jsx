import React, { createContext, useContext, useState, useEffect } from 'react'
import api, { authLogin, authRegister } from '../api'

const AuthContext = createContext()

export default function AuthProvider({ children }){
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('user')
      return raw ? JSON.parse(raw) : null
    } catch { return null }
  })
  const [token, setToken] = useState(() => localStorage.getItem('token') || null)

  useEffect(() => {
    if(token){
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete api.defaults.headers.common['Authorization']
    }
  }, [token])

  const login = async (credentials) => {
    const res = await authLogin(credentials)
    // JSend format: res.data.data contains the actual response
    const loginData = res.data.data
    const token = loginData.access_token
    const user = loginData.user

    if (!token) {
      throw new Error('No token returned from login')
    }

    // Set token in localStorage and axios header
    localStorage.setItem('token', token)
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setToken(token)

    // Set user data from login response
    if (user) {
      setUser(user)
      localStorage.setItem('user', JSON.stringify(user))
      return user
    }

    throw new Error('Login failed - no user data')
  }

  const register = async (payload) => {
    const res = await authRegister(payload)
    // Handle JSend fail responses for registration
    if (res.data?.status === 'fail') {
      const errorMessage = res.data.data?.description || res.data.message || 'Registration failed'
      throw new Error(errorMessage)
    }
    return res
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete api.defaults.headers.common['Authorization']
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
