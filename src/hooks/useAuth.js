// src/hooks/useAuth.js
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../AuthContext';

const useAuth = () => {
  const { isAuthenticated, checkAuthStatus } = useContext(AuthContext);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    checkAuthStatus().finally(() => setAuthChecked(true));
  }, [checkAuthStatus]);

  return { isAuthenticated, authChecked };
};

export default useAuth;
