import React, { Component } from 'react';
import './ErrorBoundary.css';
import errorImage from './assets.jpg';

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
        <div className="error-boundary-container">
          <img src={errorImage} alt="Error Illustration" className="error-boundary-image" />
          <h1 className="error-boundary-title">Oops! Something went wrong.</h1>
          <p className="error-boundary-message">
            We encountered an unexpected error. Please try refreshing the page or contact support if the issue persists.
          </p>
          <button className="error-boundary-button" onClick={this.handleRefresh}>
            Refresh Page
          </button>
          <div className="error-boundary-footer">
            <p>&copy; Unibooks 2024</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
