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
  const [userExists, setUserExists] = useState(null);
  const [totalSum, setTotalSum] = useState('---');
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState('');
  const [totalBooks, setTotalBooks] = useState('---');

  useEffect(() => {
    console.log("sttarting")
    const fetchData = async () => {
      console.log("sttarting 1")
      try {
        setLoading(true)
        const url = configureBaseUrl();
        setBaseUrl(url);
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
          console.log("sttarting 2")
          setUserData(user); // Set the user data state
          setUserId(user.userId); 
        }
  
      } catch (error) {
        console.error('Error fetching data or sending to backend:', error);
      } finally {
        setLoading(false)
      }
    };
  
    fetchData();
    // eslint-disable-next-line
  }, [userExists, userId]); // Add `userId` to the dependency array
  

    const saveUserDataToLocalStorage = (user, additionalData) => {
      const userToSave = {
        userId: user.uid,
        username: additionalData.fullName || user.displayName || "Anonymous",
        email: user.email,
        profileUrl: user.photoURL || "",
        level: additionalData.level || "",
        flatNo: additionalData.flatNo || "",
        street: additionalData.street || "",
        city: additionalData.city || "",
        state: additionalData.state || "",
        postalCode: additionalData.postalCode || "",
        phone: additionalData.phone || "",
        department: additionalData.department || ""
      };
  
      // Save the user data in localStorage
      localStorage.setItem('user', JSON.stringify(userToSave));
  
      // Update the userData state
      setUserData(userToSave);
    };

  const checkUserExists = async (email, uid) => {
    try {
      const response = await axios.post(`${baseUrl}/check-user`, { email, uid });
      console.log(response)
      return response.data.exists; // Returns true if user exists (profile is complete)
    } catch (err) {
      console.error('Error checking user:', err);
      setError('Failed to verify user existence.');
      return false;
    }
  };

  const checkProfileCompletion = async (user) => {
    const exists = await checkUserExists(user.email, user.uid);
    setUserExists(exists);
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
    <UserContext.Provider value={{ userData, userExists, error, checkProfileCompletion, updateUserData, setTotalBooks, setTotalSum, totalBooks, loading, totalSum, handleLogout, setUserData, saveUserDataToLocalStorage }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
