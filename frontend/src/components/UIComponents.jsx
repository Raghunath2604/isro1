import React from 'react'

/**
 * Professional Button Component with Multiple Variants
 * Supports: primary, secondary, danger, ghost, outline
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon: Icon = null,
  onClick,
  className = '',
  ...props
}) {
  const baseStyles = `
    inline-flex items-center justify-center gap-2 font-semibold
    transition-all duration-200 rounded-lg
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900
    disabled:opacity-50 disabled:cursor-not-allowed
    active:scale-95
  `

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  const variants = {
    primary: `bg-gradient-to-r from-cyan-500 to-blue-500
              hover:from-cyan-600 hover:to-blue-600
              text-white shadow-lg shadow-cyan-500/50
              hover:shadow-cyan-600/50
              focus:ring-cyan-400`,

    secondary: `bg-gradient-to-r from-purple-600 to-pink-600
               hover:from-purple-700 hover:to-pink-700
               text-white shadow-lg shadow-purple-500/50
               hover:shadow-purple-600/50
               focus:ring-purple-400`,

    danger: `bg-gradient-to-r from-red-600 to-orange-600
            hover:from-red-700 hover:to-orange-700
            text-white shadow-lg shadow-red-500/50
            hover:shadow-red-600/50
            focus:ring-red-400`,

    ghost: `bg-white/5 hover:bg-white/10
           text-gray-300 hover:text-white
           border border-gray-600/30 hover:border-gray-500/50
           focus:ring-gray-400`,

    outline: `border-2 border-cyan-400/50 hover:border-cyan-400
             text-cyan-400 hover:text-cyan-300
             hover:bg-cyan-400/5
             focus:ring-cyan-400`,
  }

  return (
    <button
      className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <svg
          className="w-4 h-4 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75 fill-current"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {Icon && !loading && <Icon className="w-4 h-4" />}
      {children}
    </button>
  )
}

/**
 * Professional Input Component
 */
export function Input({
  label,
  error,
  success,
  icon: Icon = null,
  placeholder,
  value,
  onChange,
  type = 'text',
  disabled = false,
  className = '',
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          {label}
          {error && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
        )}

        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            w-full px-4 py-2 rounded-lg
            bg-slate-800/50 border-2 backdrop-blur-sm
            text-white placeholder-gray-500
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900
            disabled:opacity-50 disabled:cursor-not-allowed
            ${Icon ? 'pl-10' : ''}
            ${error
              ? 'border-red-500/50 focus:border-red-500 focus:ring-red-400'
              : success
              ? 'border-green-500/50 focus:border-green-500 focus:ring-green-400'
              : 'border-cyan-500/30 hover:border-cyan-500/50 focus:border-cyan-500 focus:ring-cyan-400'
            }
            ${className}
          `}
          {...props}
        />

        {success && (
          <svg
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </div>

      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
      {success && <p className="text-green-400 text-sm mt-1">✓ Looks good!</p>}
    </div>
  )
}

/**
 * Card Component with Hover Effects
 */
export function Card({
  children,
  className = '',
  hoverable = true,
  gradient = false,
}) {
  return (
    <div
      className={`
        bg-slate-800/30 backdrop-blur-md rounded-xl border border-cyan-500/20
        transition-all duration-300
        ${hoverable ? 'hover:bg-slate-800/50 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/10' : ''}
        ${gradient ? 'bg-gradient-to-br from-slate-800/50 to-cyan-900/20' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}

/**
 * Status Badge Component
 */
export function Badge({ children, variant = 'default', size = 'md' }) {
  const variants = {
    default: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30',
    success: 'bg-green-500/20 text-green-300 border border-green-500/30',
    warning: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
    danger: 'bg-red-500/20 text-red-300 border border-red-500/30',
  }

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  }

  return (
    <span
      className={`
        inline-block rounded-full font-semibold
        ${variants[variant]} ${sizes[size]}
      `}
    >
      {children}
    </span>
  )
}

export default Button
