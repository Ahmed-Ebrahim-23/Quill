import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    })

    // Log error to console in development
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="page">
          <h2>Something went wrong</h2>
          <div className="error">
            <p>An unexpected error occurred. Please try refreshing the page.</p>
            {process.env.NODE_ENV === 'development' && (
              <details style={{ marginTop: '1rem' }}>
                <summary>Error Details (Development Only)</summary>
                <pre style={{ fontSize: '0.75rem', whiteSpace: 'pre-wrap', marginTop: '0.5rem' }}>
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: '1rem' }}
          >
            Refresh Page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary