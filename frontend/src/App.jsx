import React from 'react'
import Dashboard from './components/Dashboard'
import { ThemeProvider } from './context/ThemeContext'
import { AlertContainer } from './services/alertManager'

function App() {
  return (
    <ThemeProvider>
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:bg-gradient-to-br dark:from-black dark:via-slate-900 dark:to-black text-gray-900 dark:text-white transition-colors duration-300">
        {/* Animated space background effect */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-32 right-1/3 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/3 right-10 w-72 h-72 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>

        {/* Content with relative positioning to stay above background */}
        <div className="relative z-10">
          <Dashboard />
          <AlertContainer />
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App
