import React, { useState, useEffect } from 'react'
import { getMe } from '../api'
import { FaUser, FaEnvelope, FaIdBadge } from 'react-icons/fa'

export default function MyAccount() {
  const [userDetails, setUserDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchUserDetails()
  }, [])

  const fetchUserDetails = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await getMe()
      setUserDetails(response.data.data)
    } catch (err) {
      setError('Failed to load user details')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="my-account-page">
        <div className="my-account-container">
          <h1 className="my-account-title">My Account</h1>
          <div className="loading">Loading user details...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="my-account-page">
        <div className="my-account-container">
          <h1 className="my-account-title">My Account</h1>
          <div className="error">{error}</div>
          <button className="retry-btn" onClick={fetchUserDetails}>Retry</button>
        </div>
      </div>
    )
  }

  return (
    <div className="my-account-page">
      <div className="my-account-container">
        <h1 className="my-account-title">My Account</h1>
        {userDetails && (
          <div className="user-details-card">
            <div className="detail-item">
              <FaUser className="detail-icon" />
              <div className="detail-content">
                <strong>Name:</strong> {userDetails.name}
              </div>
            </div>
            <div className="detail-item">
              <FaEnvelope className="detail-icon" />
              <div className="detail-content">
                <strong>Email:</strong> {userDetails.email}
              </div>
            </div>
            <div className="detail-item">
              <FaIdBadge className="detail-icon" />
              <div className="detail-content">
                <strong>Role:</strong> {userDetails.role}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}