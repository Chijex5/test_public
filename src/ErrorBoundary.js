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
              Something went wrong 
            </h2>
            <p className="error-message">
              It's from our end and we are working on fixing it
            </p>

            <button
              onClick={this.handleRefresh}
              className="refresh-button"
            >
              Refresh Page
            </button>

            <div className="error-footer">
              <p>Unibooks</p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
