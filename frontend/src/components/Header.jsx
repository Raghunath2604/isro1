import React, { useState, useEffect } from 'react'
import { Satellite, AlertCircle, Radio } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'

export default function Header() {
  const [time, setTime] = useState(new Date())
  const [connected, setConnected] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="backdrop-blur-md bg-gradient-to-r from-slate-900/80 via-purple-900/80 to-slate-900/80 dark:from-black/60 dark:via-slate-900/60 dark:to-black/60 border-b border-purple-500/30 dark:border-cyan-500/20 sticky top-0 z-50 shadow-2xl">
      <div className="max-w-full px-3 md:px-6 py-3 md:py-4 flex items-center justify-between gap-2 md:gap-4 flex-wrap md:flex-nowrap">
        {/* Left: Logo & Title with space theme */}
        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
          <div className="relative">
            <Satellite className="w-6 md:w-8 h-6 md:h-8 text-cyan-400 drop-shadow-lg" />
            <div className="absolute inset-0 bg-cyan-400 rounded-full blur-lg opacity-20"></div>
          </div>
          <div className="hidden md:block">
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-300 bg-clip-text text-transparent">AS³ Platform</h1>
            <p className="text-xs text-cyan-300/70 dark:text-cyan-400/60">Autonomous Space System</p>
          </div>
          <h1 className="md:hidden text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-300 bg-clip-text text-transparent">AS³</h1>
        </div>

        {/* Center: Mission Info (hidden on mobile) */}
        <div className="hidden lg:flex items-center gap-6 flex-1 justify-center">
          <div className="text-center px-4 py-2 rounded-lg backdrop-blur-sm bg-cyan-500/5 border border-cyan-400/30 hover:border-cyan-400/50 transition-all">
            <p className="text-xs text-cyan-300/70 uppercase tracking-wider font-semibold">Spacecraft</p>
            <p className="text-base font-bold text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]">ISS-01</p>
          </div>
          <div className="h-1 w-8 bg-gradient-to-r from-cyan-400/0 via-cyan-400 to-cyan-400/0"></div>
          <div className="text-center px-4 py-2 rounded-lg backdrop-blur-sm bg-blue-500/5 border border-blue-400/30 hover:border-blue-400/50 transition-all">
            <p className="text-xs text-blue-300/70 uppercase tracking-wider font-semibold">Mission Time</p>
            <p className="text-base font-bold text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]">{time.toLocaleTimeString()}</p>
          </div>
        </div>

        {/* Right: Status Indicators */}
        <div className="flex items-center gap-2 md:gap-4 flex-shrink-0 flex-wrap justify-end">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Connection Status */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg backdrop-blur-sm bg-green-500/5 border border-green-400/30">
            <div
              className={`w-2.5 h-2.5 rounded-full ${connected ? 'bg-green-400 animate-pulse drop-shadow-[0_0_8px_rgba(74,222,128,0.6)]' : 'bg-red-400'}`}
            ></div>
            <span className="text-xs md:text-sm font-medium text-green-400">{connected ? 'Connected' : 'Offline'}</span>
          </div>

          {/* Alerts */}
          <button className="relative p-2 hover:bg-red-500/10 dark:hover:bg-red-900/20 rounded-lg transition border border-red-400/20 hover:border-red-400/50">
            <AlertCircle className="w-5 h-5 text-red-400 drop-shadow-lg" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse drop-shadow-[0_0_6px_rgba(239,68,68,0.8)]"></span>
          </button>

          {/* Radio Status */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg border border-cyan-400/40 hover:border-cyan-400/60 transition-all hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse drop-shadow-lg" />
            <span className="text-sm font-semibold bg-gradient-to-r from-cyan-400 to-blue-300 bg-clip-text text-transparent">Live Feed</span>
          </div>
        </div>
      </div>
    </header>
  )
}
