import React, { createContext, useContext, useState, useCallback } from 'react'

// Toast Context
const ToastContext = createContext()

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

// Toast Provider Component
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback(
    (message, type = 'info', duration = 3000) => {
      const id = Date.now()
      const toast = { id, message, type, duration }

      setToasts((prev) => [...prev, toast])

      if (duration) {
        setTimeout(() => {
          removeToast(id)
        }, duration)
      }

      return id
    },
    []
  )

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const value = {
    addToast,
    removeToast,
    success: (msg, duration) => addToast(msg, 'success', duration),
    error: (msg, duration) => addToast(msg, 'error', duration),
    warning: (msg, duration) => addToast(msg, 'warning', duration),
    info: (msg, duration) => addToast(msg, 'info', duration),
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

// Individual Toast Component
function Toast({ toast, onRemove }) {
  const [isExiting, setIsExiting] = useState(false)

  const typeConfig = {
    success: {
      bg: 'bg-green-500/90',
      border: 'border-green-400/50',
      icon: '✓',
      textColor: 'text-green-100',
    },
    error: {
      bg: 'bg-red-500/90',
      border: 'border-red-400/50',
      icon: '✕',
      textColor: 'text-red-100',
    },
    warning: {
      bg: 'bg-yellow-500/90',
      border: 'border-yellow-400/50',
      icon: '⚠',
      textColor: 'text-yellow-100',
    },
    info: {
      bg: 'bg-blue-500/90',
      border: 'border-blue-400/50',
      icon: 'ℹ',
      textColor: 'text-blue-100',
    },
  }

  const config = typeConfig[toast.type]

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => onRemove(toast.id), 300)
  }

  return (
    <div
      className={`
        transform transition-all duration-300
        ${isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
      `}
    >
      <div
        className={`
          flex items-center gap-3 px-4 py-3 rounded-lg backdrop-blur-md
          border ${config.border} ${config.bg}
          shadow-lg shadow-black/50
          max-w-sm
        `}
      >
        <span className="text-xl flex-shrink-0">{config.icon}</span>

        <p className={`flex-1 text-sm font-medium ${config.textColor}`}>
          {toast.message}
        </p>

        <button
          onClick={handleClose}
          className="flex-shrink-0 ml-2 opacity-70 hover:opacity-100 transition"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

// Toast Container
function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast toast={toast} onRemove={removeToast} />
        </div>
      ))}
    </div>
  )
}

export default ToastProvider
