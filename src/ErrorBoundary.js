import React, { Component } from 'react';
import './ErrorBoundary.css';
import errorGif from './gif/error.gif';

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
        <div className="error-content">
          <h1>500</h1>
          <img src={errorGif} alt="Error" />
          <div className="text">
            <h2>Look like you're lost</h2>
            <p>The page you are looking for is not available</p>
            <button onClick={this.handleRefresh}>
              Refresh Page
            </button>
          </div>
          <p>sL Code <span style={{ color: 'red' }}>Hub</span></p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
