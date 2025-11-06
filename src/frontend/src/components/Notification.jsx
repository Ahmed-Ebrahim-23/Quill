import React, { useState, useEffect } from 'react'

const Notification = ({ message, type = 'info', duration = 5000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        onClose && onClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const handleClose = () => {
    setIsVisible(false)
    onClose && onClose()
  }

  if (!isVisible) return null

  const getIcon = () => {
    switch (type) {
      case 'success': return '✓'
      case 'error': return '✕'
      case 'warning': return '⚠'
      default: return 'ℹ'
    }
  }

  return (
    <div className={`notification notification-${type}`} role="alert">
      <span className="notification-icon">{getIcon()}</span>
      <span className="notification-message">{message}</span>
      <button
        className="notification-close"
        onClick={handleClose}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  )
}

export default Notification