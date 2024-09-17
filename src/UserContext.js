import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import configureBaseUrl from './configureBaseUrl';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false); // Centralized loading state
  const [baseUrl, setBaseUrl] = useState('');
  const [totalSum, setTotalSum] = useState('---');
  const [userId, setUserId] = useState('');
  const [totalBooks, setTotalBooks] = useState('---');
  const [hasFetched, setHasFetched] = useState(false);

  // Fetch Purchase Summary when userId and baseUrl are set
  const fetchPurchaseSummary = async () => {
    try {
      const response = await axios.get(`${baseUrl}/user/purchases`, {
        params: { userId }
      });
      const { totalSum, totalBooks } = response.data;
      setTotalSum(totalSum);
      setTotalBooks(totalBooks);
      setHasFetched(true);
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
      console.error("Failed to fetch user data:", error);
    }
  };

  // Use `Promise.allSettled()` to wait for all async operations
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true); // Start loading

      const fetchPromises = [
        fetchUserDataFromLocalStorage(),
        fetchBaseUrl(),
      ];

      // Wait for userId and baseUrl before fetching purchases
      if (userId && baseUrl && !hasFetched) {
        fetchPromises.push(fetchPurchaseSummary());
      }

      // Wait for all promises to settle (resolve or reject)
      await Promise.allSettled(fetchPromises);

      setLoading(false); // Stop loading after all operations are done
    };

    fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, baseUrl, hasFetched]);

  // Function to send user data to the backend
  const sendUserDataToBackend = async (user) => {
    try {
      setLoading(true); // Start loading
      const response = await axios.post(`${baseUrl}/login`, {
        user_id: user.uid,
        email: user.email,
        username: user.displayName || "",
        profileUrl: user.photoURL || ""
      });

      const usersData = response.data;
      if (usersData.error) {
        console.error(usersData.error);
        setLoading(false); // Stop loading on error
        return;
      }

      const userToSave = {
        userId: usersData.userId,
        username: usersData.name || "Anonymous",
        email: usersData.email,
        profileUrl: usersData.profileUrl || "",
        level: usersData.level || "",
        address: `${usersData.flat_no || ''}, ${usersData.street || ''}, ${usersData.city || ''}, ${usersData.state || ''}, ${usersData.postal_code || ''}`.replace(/,\s*$/, ""),
        phone: usersData.phone || "",
        department: usersData.department || "",
        flatNo: usersData.flat_no,
        street: usersData.street,
        city: usersData.city,
        state: usersData.state,
        postal_code: usersData.postal_code,
        code: "2"
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
      username: additionalData.fullName || user.displayName || "Anonymous",
      email: user.email,
      profileUrl: user.photoURL || "",
      level: additionalData.level || "",
      address: `${additionalData.flatNo ? `${additionalData.flatNo}, ` : ""}${additionalData.street ? `${additionalData.street}, ` : ""}${additionalData.city ? `${additionalData.city}, ` : ""}${additionalData.state ? `${additionalData.state}, ` : ""}${additionalData.postalCode ? `${additionalData.postalCode}` : ""}`.replace(/,\s*$/, ""),
      phone: additionalData.phone || "",
      department: additionalData.department || ""
    };
    setUserData(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem('user');
      setUserData(null);
      await signOut(auth);
      navigate('/login');
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
      console.error("Failed to update user data:", error);
    }
  };

  return (
    <UserContext.Provider value={{ userData, updateUserData, totalBooks, loading, totalSum, setLoading, handleLogout, sendUserDataToBackend, saveUserDataToLocalStorage }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
