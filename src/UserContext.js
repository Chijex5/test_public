// UserContext.js
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
  const [loading, setLoading] = useState(true);
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    const fetchBaseUrl = async () => {
      const url = configureBaseUrl();
      setBaseUrl(url);
    };

    fetchBaseUrl();
  }, []);

  useEffect(() => {
    setLoading(true)
    const fetchUserDataFromLocalStorage = async () => {
      try {
        const user = await JSON.parse(localStorage.getItem('user'));
        if (user) {
          setUserData(user);
          console.log(user)
          
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserDataFromLocalStorage();
  }, []);

  const sendUserDataToBackend = async (user) => {
    try {
        const response = await axios.post(`${baseUrl}/login`, {
            user_id: user.uid,
            email: user.email,
            username: user.displayName || "",
            profileUrl: user.photoURL || ""
        });

        const usersData = response.data;

        if (userData.error) {
            setError(userData.error);
            return;
        }

        if (response.status === 201) {
            console.log('New user created');
        }

        const userToSave = {
            userId: usersData.uid,
            username: usersData.name ||  "Anonymous",
            email: usersData.email,
            profileUrl: usersData.profileUrl || "",
            level: usersData.level || "",
            flatNo: usersData.flat_no || "",
            street: usersData.street || "",
            city: usersData.city || "",
            state: usersData.state || "",
            postalCode: usersData.postal_code || "",
            address: usersData.address || "",
            phone: usersData.phone || "",
            department: usersData.department || ""
        };
        setUserData(userToSave)
        localStorage.setItem('user', JSON.stringify(userToSave));

    } catch (err) {
        console.error('Backend Error:', err);
        setError('Failed to send user data to backend.');
    }
};


  const handleLogout = async () => {
    try {
      localStorage.removeItem('user');
      setUserData(null);
      await signOut(auth);
      localStorage.clear();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  const updateUserData = async (newData) => {
    try {
      // Send update request to backend
      const response = await axios.put(`${baseUrl}/updateuser`, newData);
      
      if (response.status === 200) {
        // Update local state and localStorage if the backend update is successful
        setUserData(newData);
        localStorage.setItem('user', JSON.stringify(newData));
      }
    } catch (error) {
      console.error("Failed to update user data:", error);
    }
  };

  return (
    <UserContext.Provider value={{ userData, updateUserData, loading, handleLogout, sendUserDataToBackend }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
