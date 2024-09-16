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
  const [totalSum, setTotalSum] = useState('---');
  const [userId, setUserId] = useState(''); 
  const [totalBooks, setTotalBooks] = useState('---');
  const [hasFetched, setHasFetched] = useState(false);  // State to track if data has been fetched

  useEffect(() => {
    if (userId && !hasFetched) {
      const fetchPurchaseSummary = async () => {
        setLoading(true)
        try {
          const response = await axios.get(`${baseUrl}/user/purchases`, {
            params: { userId }
          });
          const { totalSum, totalBooks } = response.data;
          setTotalSum(totalSum);
          setTotalBooks(totalBooks);
          setHasFetched(true);  // Set to true after data is fetched
        } catch (error) {
          console.error('Error fetching purchase summary:', error);
        } finally {
          setLoading(false)
        }
      };

      fetchPurchaseSummary();
    }
  }, [userId, hasFetched, baseUrl]);

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
          
          
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserDataFromLocalStorage();
  }, []);

  useEffect(() => {
    const fetchUserDataFromLocalStorage = async () => {
      try {
        const user = await JSON.parse(localStorage.getItem('user'));
        if (user) {
          setUserId(user.userId); // Set the userId here
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
  
    fetchUserDataFromLocalStorage();
  }, []);

  const sendUserDataToBackend = async (user) => {
    try {
      setLoading(true)
        const response = await axios.post(`${baseUrl}/login`, {
            user_id: user.uid,
            email: user.email,
            username: user.displayName || "",
            profileUrl: user.photoURL || ""
        });

        const usersData = response.data;
        
        if (usersData.error) {
            console.log(userData.error);
            setLoading(false);
            return;
        }

        if (response.status === 201) {
            console.log('New user created');
        }

        const userToSave = {
          
            userId: usersData.userId,
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
            department: usersData.department || "",
            code: "2"
        };

        setUserData(userToSave)
        localStorage.setItem('user', JSON.stringify(userToSave));

        setLoading(false);
    } catch (err) {
        console.error('Backend Error:', err);
        setLoading(false);
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
    flatNo: additionalData.flat_no || "",
    street: additionalData.street || "",
    city: additionalData.city || "",
    state: additionalData.state || "",
    postalCode: additionalData.postal_code || "",
    code: "1",
    department: additionalData.department || ""
  };
  setUserData(userData)
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
    <UserContext.Provider value={{ userData, updateUserData, totalBooks, loading, totalSum, setLoading, handleLogout, sendUserDataToBackend, saveUserDataToLocalStorage }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
