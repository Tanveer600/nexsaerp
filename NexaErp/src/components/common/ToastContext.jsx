import React, { createContext, useContext, useState, useCallback } from 'react'
import AppToaster from './AppToaster'

const ToastContext = createContext()

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  // Callback use kiya taake re-renders kam hon
  const addToast = useCallback((title, message, type = 'info') => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { id, title, message, type }])

    // 3 seconds baad auto remove
    setTimeout(() => {
      removeToast(id)
    }, 3000)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Aapka banaya hua AppToaster yahan render hoga */}
      <AppToaster toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

// Custom hook banayein taake use karna asaan ho
export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}