import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './auth';

const RequireAuth = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return children;
};

export { RequireAuth };
