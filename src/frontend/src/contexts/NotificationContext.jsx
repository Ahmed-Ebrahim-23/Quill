import React, { createContext, useContext, useState, useCallback } from 'react'
import Notification from '../components/Notification'

const NotificationContext = createContext()

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

export default function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])

  const addNotification = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random()
    const notification = { id, message, type, duration }

    setNotifications(prev => [...prev, notification])

    return id
  }, [])

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }, [])

  const showSuccess = useCallback((message, duration) => addNotification(message, 'success', duration), [addNotification])
  const showError = useCallback((message, duration) => addNotification(message, 'error', duration), [addNotification])
  const showWarning = useCallback((message, duration) => addNotification(message, 'warning', duration), [addNotification])
  const showInfo = useCallback((message, duration) => addNotification(message, 'info', duration), [addNotification])

  return (
    <NotificationContext.Provider value={{
      showSuccess,
      showError,
      showWarning,
      showInfo,
      removeNotification
    }}>
      {children}
      <div className="notifications-container">
        {notifications.map(notification => (
          <Notification
            key={notification.id}
            message={notification.message}
            type={notification.type}
            duration={notification.duration}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  )
}