import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import configureBaseUrl from './configureBaseUrl';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [centralLoading, setCentralLoading] = useState(false); // Centralized loading state
  const [baseUrl, setBaseUrl] = useState('');
  const [userExists, setUserExists] = useState(null);
  const [totalSum, setTotalSum] = useState('---');
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState('');
  const [user, setUser] = useState(false);
  const [totalBooks, setTotalBooks] = useState('---');

  // Checking if the user exists
  const checkUserExists = async (email, uid) => {
    try {
      const response = await axios.post(`${baseUrl}/check-user`, { email, uid });
      return response.data.exists; // Returns true if user exists (profile is complete)
    } catch (err) {
      console.error('Error checking user:', err);
      setError('Failed to verify user existence.');
      return false;
    }
  };

  // Function to check profile completion (can be called globally)
  const checkProfileCompletion = async (user) => {
    setCentralLoading(true);
    const exists = await checkUserExists(user.email, user.uid);
    setUserExists(exists);
    setCentralLoading(false);
  };

  // Fetch Purchase Summary when userId and baseUrl are set
  const fetchPurchaseSummary = async () => {
    try {
      const response = await axios.get(`${baseUrl}/user/purchases`, {
        params: { userId },
      });
      const { totalSum, totalBooks } = response.data;
      setTotalSum(totalSum);
      setTotalBooks(totalBooks);
    } catch (error) {
      console.error('Error fetching purchase summary:', error);
    }
  };

  // Fetch base URL
  const fetchBaseUrl = async () => {
    try {
      const url = configureBaseUrl();
      setBaseUrl(url);
    } catch (error) {
      console.error('Failed to fetch base URL:', error);
    }
  };

  // Fetch user data from localStorage
  const fetchUserDataFromLocalStorage = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        setUserData(user);
        setUserId(user.userId); // Set the userId here
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  // Handle Firebase Authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(true)
        console.log(currentUser)
        await sendUserDataToBackend(currentUser);
        // Check if the user's profile is complete
        await checkProfileCompletion(currentUser);
      } else {
        // User is logged out, clear user data
        setUserData(null);
        setUser(false)
        localStorage.removeItem('user');
      }
    });

    return () => unsubscribe(); // Clean up the listener on unmount
    // eslint-disable-next-line
  }, [auth]);

  // Use `Promise.allSettled()` to wait for all async operations
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true); // Start loading

      const fetchPromises = [fetchUserDataFromLocalStorage(), fetchBaseUrl()];

      // Wait for userId and baseUrl before fetching purchases
      if (userId && baseUrl) {
        fetchPromises.push(fetchPurchaseSummary());
      }

      // Wait for all promises to settle (resolve or reject)
      await Promise.allSettled(fetchPromises);

      setLoading(false); // Stop loading after all operations are done
    };

    fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, baseUrl]);

  // Function to send user data to the backend
  const sendUserDataToBackend = async (user) => {
    try {
      setLoading(true); // Start loading
      const response = await axios.post(`${baseUrl}/login`, {
        user_id: user.uid,
        email: user.email,
        username: user.displayName || '',
        profileUrl: user.photoURL || '',
      });

      const usersData = response.data;
      if (usersData.error) {
        console.error(usersData.error);
        setLoading(false); // Stop loading on error
        return;
      }

      const userToSave = {
        userId: usersData.userId,
        username: usersData.name || 'Anonymous',
        email: usersData.email,
        profileUrl: usersData.profileUrl || '',
        level: usersData.level || '',
        address: `${usersData.flat_no || ''}, ${usersData.street || ''}, ${usersData.city || ''}, ${usersData.state || ''}, ${usersData.postal_code || ''}`.replace(/,\s*$/, ''),
        phone: usersData.phone || '',
        department: usersData.department || '',
      };

      setUserData(userToSave);
      localStorage.setItem('user', JSON.stringify(userToSave));
      setLoading(false); // Stop loading after success
    } catch (error) {
      console.error('Backend Error:', error);
      setLoading(false); // Stop loading on error
    }
  };

  const saveUserDataToLocalStorage = (user, additionalData) => {
    const userData = {
      userId: user.uid,
      username: additionalData.fullName || user.displayName || 'Anonymous',
      email: user.email,
      profileUrl: user.photoURL || '',
      level: additionalData.level || '',
      address: `${additionalData.flatNo ? `${additionalData.flatNo}, ` : ''}${additionalData.street ? `${additionalData.street}, ` : ''}${additionalData.city ? `${additionalData.city}, ` : ''}${additionalData.state ? `${additionalData.state}, ` : ''}${additionalData.postalCode ? `${additionalData.postalCode}` : ''}`.replace(/,\s*$/, ''),
      phone: additionalData.phone || '',
      department: additionalData.department || '',
    };
    setUserData(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem('user');
      setUserData(null);
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  const updateUserData = async (newData) => {
    try {
      const response = await axios.put(`${baseUrl}/updateuser`, newData);
      if (response.status === 200) {
        setUserData(newData);
        localStorage.setItem('user', JSON.stringify(newData));
      }
    } catch (error) {
      console.error('Failed to update user data:', error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        userData,
        userExists,
        error,
        checkProfileCompletion,
        updateUserData,
        totalBooks,
        loading,
        user,
        centralLoading,
        totalSum,
        setLoading,
        handleLogout,
        sendUserDataToBackend,
        saveUserDataToLocalStorage,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
