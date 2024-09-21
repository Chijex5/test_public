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
      setLoading(true); // Start loading
      console.log("sttarting 1")
      try {
        // Step 1: Fetch the base URL and set it
        const url = configureBaseUrl();
        setBaseUrl(url);
  
        // Step 2: Fetch user data from localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
          console.log("sttarting 2")
          setUserData(user); // Set the user data state
          setUserId(user.userId); // Set the userId state
          setTotalSum(user.totalSum || 0); // Set the totalSum from localStorage, default to 0
          setTotalBooks(user.totalBooks || 0); // Set the totalBooks from localStorage, default to 0
        }
  
        // Step 3: Fetch purchase summary after baseUrl is set
        if (userId) { 
          console.log("sttarting 3")// Ensure that userId is available
          console.log(userId)
          const response = await axios.get(`${url}/user/purchases`, {
            params: { userId }
          });
          const { totalSum, totalBooks } = response.data;
  
          // Append the purchase data to the existing user data in localStorage
          if (user) {
            user.totalSum = totalSum; // Append totalSum to the user data
            user.totalBooks = totalBooks; // Append totalBooks to the user data
            localStorage.setItem('user', JSON.stringify(user)); // Save the updated data back to localStorage
          }
  
          setTotalSum(totalSum);
          setTotalBooks(totalBooks);
        }
  
        // Step 4: Send user data to the backend
        if (user) {
          console.log("sttarting 4")
          await sendUserDataToBackend(user);
        }
  
      } catch (error) {
        console.error('Error fetching data or sending to backend:', error);
      } finally {
        console.log("stoping loader1")
        setLoading(false); // Stop loading after all tasks are done
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

  const sendUserDataToBackend = async (user) => {
    if (!user || !baseUrl) return;
    try {
      console.log(user);
      const response = await axios.post(`${baseUrl}/login`, {
        user_id: user.uid,
        email: user.email,
        username: user.displayName || "",
        profileUrl: user.photoURL || ""
      });
      
  
      const usersData = response.data;
      console.log(usersData)
      if (usersData.error) {
        console.error(usersData.error);
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
        department: usersData.department || ""
      };
  
      setUserData(userToSave);
      localStorage.setItem('user', JSON.stringify(userToSave));
    } catch (error) {
      console.error('Backend Error:', error);
    } finally {
      console.log("Done 1")
    }
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
    <UserContext.Provider value={{ userData, userExists, error, checkProfileCompletion, updateUserData, totalBooks, loading, totalSum, handleLogout, sendUserDataToBackend, saveUserDataToLocalStorage }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
