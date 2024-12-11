import React, { Component } from 'react';
import './ErrorBoundary.css';
import errorGif from './error.gif';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  handleRefresh = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <div className="error-content">
            <div className="error-image-container">
              <img 
                src={errorGif}
                alt="Error Illustration"
                className="error-image"
              />
            </div>

            <h1 className="error-title">500</h1>
            <h2 className="error-subtitle">
              Looks like you're lost
            </h2>
            <p className="error-message">
              The page you are looking for is not available
            </p>

            <button
              onClick={this.handleRefresh}
              className="refresh-button"
            >
              Refresh Page
            </button>

            <div className="error-footer">
              <p>sL Code Hub</p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
