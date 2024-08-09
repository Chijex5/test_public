// UserContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDataFromLocalStorage = () => {
      const user = JSON.parse(localStorage.getItem('user'));

      if (user) {
        setUserData(user);
      }

      setLoading(false);
    };

    fetchUserDataFromLocalStorage();
  }, []);

  const updateUserData = (newData) => {
    setUserData(newData);
    localStorage.setItem('user', JSON.stringify(newData));
  };

  return (
    <UserContext.Provider value={{ userData, updateUserData, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
