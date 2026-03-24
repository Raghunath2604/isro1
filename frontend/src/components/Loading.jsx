import React from 'react'

// Loading Spinner
export function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizeClasses[size]} border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin`}
      />
      {text && <p className="text-sm text-gray-400 animate-pulse">{text}</p>}
    </div>
  )
}

// Skeleton Loader
export function SkeletonLoader({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-gradient-to-r from-slate-700 to-slate-600 rounded animate-pulse"
          style={{
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  )
}

// Card Skeleton
export function CardSkeleton() {
  return (
    <div className="bg-slate-800/50 rounded-lg p-4 backdrop-blur-sm border border-slate-700/30">
      <div className="h-6 bg-slate-700 rounded mb-3 animate-pulse" />
      <SkeletonLoader lines={3} />
    </div>
  )
}

// Panel Loading State
export function PanelLoading({ title = 'Loading...' }) {
  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-lg p-6 backdrop-blur-md border border-cyan-500/20 shadow-lg">
      <h3 className="text-lg font-semibold text-cyan-400 mb-6">{title}</h3>
      <div className="flex justify-center py-8">
        <LoadingSpinner size="md" text="" />
      </div>
    </div>
  )
}

// Full Page Loading
export function FullPageLoading({ message = 'InitializingAS³ Platform...' }) {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center z-50">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <h2 className="mt-6 text-xl font-semibold text-cyan-400">{message}</h2>
        <p className="mt-2 text-sm text-gray-400">This may take a moment...</p>
      </div>
    </div>
  )
}

export default LoadingSpinner
