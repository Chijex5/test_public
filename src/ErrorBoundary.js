import React, { Component } from 'react';
import './ErrorBoundary.css';
import errorImage from './assets.jpg'

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

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-container">
          <img src={errorImage} alt="Error Illustration" className="error-boundary-image" />
          <h1 className="error-boundary-title">Oops! Something went wrong.</h1>
          <p className="error-boundary-message">
            An unexpected error has occurred. Please try refreshing the page or contact support if the issue persists.
          </p>
          <div className="error-boundary-footer">
            <p>Bookshopp 2024</p>
          </div>
        </div>
      );
    }     
    return this.props.children;
  }
}

export default ErrorBoundary;
