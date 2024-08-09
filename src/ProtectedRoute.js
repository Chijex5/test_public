// src/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import loading from './Loaders'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, authChecked } = useAuth();

  if (!authChecked) {
    return <loading />; // Show a loading indicator while checking auth status
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
