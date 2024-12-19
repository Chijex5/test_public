import React from 'react';
import './ErrorBoundary.css'; // Reuse the same CSS
import errorGif from './error.gif'; // Reuse the same GIF

const NotFound = () => {
  return (
    <div className="error-container">
      <div className="error-content">
        <div className="error-image-container">
          <img 
            src={errorGif}
            alt="404 Illustration"
            className="error-image"
          />
        </div>

        <h1 className="error-title">404</h1>
        <h2 className="error-subtitle">Page Not Found</h2>
        <p className="error-message">
          We couldn't find the page you were looking for. Please check the URL or go back to the home page.
        </p>

        <button
          onClick={() => (window.location.href = '/dashboard')} // Redirect to a relevant page
          className="refresh-button"
        >
          Go to Dashboard
        </button>

        <div className="error-footer">
          <p>Unibooks</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
