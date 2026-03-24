import React, { useState } from 'react'
import { Lock, Mail, User, LogIn } from 'lucide-react'
import axios from 'axios'

export default function LoginPage() {
  const [mode, setMode] = useState('login') // login or register
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          username: formData.username,
          password: formData.password
        }
      )

      // Store token
      localStorage.setItem('access_token', response.data.access_token)
      localStorage.setItem('token_type', response.data.token_type)

      // Redirect to dashboard
      window.location.href = '/dashboard'
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        {
          username: formData.username,
          email: formData.email,
          password: formData.password
        }
      )

      setError('')
      setMode('login')
      setFormData({ username: '', email: '', password: '', confirmPassword: '' })
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-space-dark via-space-blue/5 to-space-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Lock className="w-8 h-8 text-space-cyan" />
            <h1 className="text-3xl font-bold text-white">AS3</h1>
          </div>
          <p className="text-gray-400">Advanced Space System Platform</p>
        </div>

        {/* Form Card */}
        <div className="glass rounded-lg p-8 border border-space-cyan/20">
          {/* Mode Toggle */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 rounded-lg font-semibold transition ${mode === 'login'
                  ? 'bg-space-cyan text-space-dark'
                  : 'bg-space-blue/20 text-gray-300 hover:bg-space-blue/40'
                }`}
            >
              Login
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-2 rounded-lg font-semibold transition ${mode === 'register'
                  ? 'bg-space-cyan text-space-dark'
                  : 'bg-space-blue/20 text-gray-300 hover:bg-space-blue/40'
                }`}
            >
              Register
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-400/50 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter username"
                  className="w-full pl-10 pr-4 py-2 bg-space-dark border border-space-cyan/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-space-cyan transition"
                  required
                />
              </div>
            </div>

            {/* Email (Register only) */}
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    className="w-full pl-10 pr-4 py-2 bg-space-dark border border-space-cyan/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-space-cyan transition"
                    required
                  />
                </div>
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="w-full pl-10 pr-4 py-2 bg-space-dark border border-space-cyan/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-space-cyan transition"
                  required
                />
              </div>
            </div>

            {/* Confirm Password (Register only) */}
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    className="w-full pl-10 pr-4 py-2 bg-space-dark border border-space-cyan/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-space-cyan transition"
                    required
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-space-cyan text-space-dark font-semibold rounded-lg hover:bg-space-cyan/80 disabled:opacity-50 transition flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              {loading ? 'Processing...' : mode === 'login' ? 'Login' : 'Register'}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-gray-500 mt-4">
            {mode === 'login'
              ? "Don't have an account? Click Register"
              : 'Already have an account? Click Login'}
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 p-3 bg-space-blue/10 rounded-lg border border-space-cyan/10 text-xs text-gray-400">
          <p className="font-semibold text-space-cyan mb-2">Demo Credentials:</p>
          <p>Username: demo</p>
          <p>Password: demo123</p>
        </div>
      </div>

      {/* Background effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-space-cyan/20 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-space-purple/20 rounded-full blur-3xl opacity-20"></div>
      </div>
    </div>
  )
}
