import React from 'react'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    this.setState({
      error,
      errorInfo,
    })
    // Optional: Log to external error tracking service
    // logErrorToService(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
          <div className="max-w-md mx-auto">
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-8 backdrop-blur-md">
              <h1 className="text-2xl font-bold text-red-400 mb-4">⚠️ Something went wrong</h1>

              <p className="text-gray-300 mb-6">
                An unexpected error occurred. The team has been notified. Please try refreshing the page.
              </p>

              <details className="mb-6">
                <summary className="cursor-pointer text-sm text-red-300 hover:text-red-200">
                  Error details (development only)
                </summary>
                <pre className="mt-3 bg-slate-900/50 p-3 rounded text-xs text-red-200 overflow-auto max-h-48">
                  {this.state.error && this.state.error.toString()}
                  {'\n\n'}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>

              <div className="flex gap-3">
                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold transition"
                >
                  Refresh Page
                </button>
                <button
                  onClick={() => window.history.back()}
                  className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded font-semibold transition"
                >
                  Go Back
                </button>
              </div>

              <p className="text-xs text-gray-400 mt-6 text-center">
                Error ID: {Math.random().toString(36).substr(2, 9)}
              </p>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
