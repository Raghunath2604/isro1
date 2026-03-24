import React from 'react'

/**
 * Animated Card Component with Smooth Transitions
 * Features: hover scale, shadow glow, smooth animations
 */
export function AnimatedCard({
  title,
  subtitle,
  children,
  icon: Icon = null,
  onClick,
  isActive = false,
  gradient = 'from-cyan-500/10 to-blue-500/10',
  hoverGradient = 'from-cyan-500/20 to-blue-500/20',
  className = '',
}) {
  return (
    <div
      onClick={onClick}
      className={`
        group relative overflow-hidden rounded-xl
        bg-gradient-to-br ${gradient} backdrop-blur-md
        border border-cyan-500/20 hover:border-cyan-500/40
        transition-all duration-300 transform
        hover:scale-105 hover:shadow-2xl
        ${isActive ? 'ring-2 ring-cyan-400' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {/* Animated background glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className={`
          absolute inset-0 bg-gradient-to-br ${hoverGradient}
          blur-2xl
        `} />
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 space-y-3">
        {/* Header with icon */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            {title && (
              <h3 className="text-lg font-semibold text-cyan-300 group-hover:text-cyan-200 transition-colors">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                {subtitle}
              </p>
            )}
          </div>

          {Icon && (
            <Icon className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300 transition-colors transform group-hover:scale-110 duration-300" />
          )}
        </div>

        {/* Children */}
        {children && (
          <div className="pt-2 group-hover:text-gray-100 transition-colors">
            {children}
          </div>
        )}
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-400 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
    </div>
  )
}

/**
 * Stat Card for Displaying Metrics
 */
export function StatCard({
  label,
  value,
  unit,
  icon: Icon = null,
  trend,
  color = 'cyan',
}) {
  const colors = {
    cyan: 'from-cyan-500/10 to-blue-500/10 text-cyan-400',
    green: 'from-green-500/10 to-emerald-500/10 text-green-400',
    purple: 'from-purple-500/10 to-pink-500/10 text-purple-400',
    orange: 'from-orange-500/10 to-red-500/10 text-orange-400',
  }

  return (
    <div className={`
      bg-gradient-to-br ${colors[color]}
      backdrop-blur-md rounded-lg p-4
      border border-slate-700/50 hover:border-slate-600/50
      transition-all duration-300 group cursor-pointer
      hover:shadow-lg hover:shadow-${color}-500/10
    `}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-medium text-gray-400">{label}</p>
        {Icon && (
          <Icon className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity" />
        )}
      </div>

      <div className="space-y-1">
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-bold">{value}</p>
          {unit && <p className="text-sm text-gray-500">{unit}</p>}
        </div>

        {trend && (
          <p className={`text-xs font-semibold ${
            trend > 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% vs last hour
          </p>
        )}
      </div>
    </div>
  )
}

/**
 * Feature List Item with Icons and Descriptions
 */
export function FeatureItem({
  icon: Icon,
  title,
  description,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={`
        flex gap-4 p-4 rounded-lg
        bg-slate-800/30 hover:bg-slate-800/50
        border border-slate-700/50 hover:border-cyan-500/30
        transition-all duration-200 group
        ${onClick ? 'cursor-pointer' : ''}
      `}
    >
      <div className="flex-shrink-0">
        <Icon className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300 transition-colors mt-0.5" />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
          {title}
        </h4>
        <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors mt-1">
          {description}
        </p>
      </div>
    </div>
  )
}

/**
 * Progress Ring Component
 */
export function ProgressRing({
  percentage,
  label,
  size = 'md',
}) {
  const sizes = { sm: 60, md: 80, lg: 120 }
  const radius = sizes[size] / 2 - 8
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: sizes[size], height: sizes[size] }}>
        <svg className="w-full h-full transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={sizes[size] / 2}
            cy={sizes[size] / 2}
            r={radius}
            className="fill-none stroke-slate-700/50"
            strokeWidth="4"
          />
          {/* Progress circle */}
          <circle
            cx={sizes[size] / 2}
            cy={sizes[size] / 2}
            r={radius}
            className="fill-none stroke-cyan-400 transition-all duration-500"
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-lg font-semibold">{percentage}%</p>
        </div>
      </div>

      {label && <p className="text-sm text-gray-400">{label}</p>}
    </div>
  )
}

export default AnimatedCard
