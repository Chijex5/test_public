import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider } from './firebase'; // Import Firebase services
import axios from 'axios'; // Import Axios
import './Auth.css'; // Ensure this is your CSS file
import Loader from './Loader'; // Ensure this is your Loader component
import Deal from './uni2.png'
import configureBaseUrl from './configureBaseUrl';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    const fetchBaseUrl = async () => {
      const url = configureBaseUrl();
      setBaseUrl(url);
      
    };

    fetchBaseUrl();
  }, []);
  
  const saveUserDataToLocalStorage = (user) => {
    const userData = {
      userId: user.uid,
      username: user.displayName,
      email: user.email,
      profileUrl: user.photoURL
    };
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const sendUserDataToBackend = async (user) => {
    try {
        const response = await axios.post(`${baseUrl}/login`, {
            user_id: user.uid,
            email: user.email,
            username: user.displayName || "",
            profileUrl: user.photoURL || ""
        });

        const userData = response.data;

        if (userData.error) {
            setError(userData.error);
            return;
        }

        if (response.status === 201) {
            console.log('New user created');
        }

        const userToSave = {
            userId: user.uid,
            username: userData.name || user.displayName || "Anonymous",
            email: user.email,
            profileUrl: userData.profileUrl || user.photoURL || "",
            level: userData.level || "",
            flatNo: userData.flat_no || "",
            street: userData.street || "",
            city: userData.city || "",
            state: userData.state || "",
            postalCode: userData.postal_code || "",
            address: userData.address || "",
            phone: userData.phone || "",
            department: userData.department || ""
        };
        localStorage.setItem('user', JSON.stringify(userToSave));

    } catch (err) {
        console.error('Backend Error:', err);
        setError('Failed to send user data to backend.');
    }
};

const checkUserExists = async (email, uid) => {
  try {
    const response = await axios.post(`${baseUrl}/check-user`, { email, uid });
    return response.data.exists; // Returns true if user exists
  } catch (err) {
    console.error('Error checking user:', err);
    setError('Failed to verify user existence.');
    return false;
  }
};



  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;

      const userExists = await checkUserExists(user.email, user.uid);

      if (userExists) {
        saveUserDataToLocalStorage(user);
        await sendUserDataToBackend(user);
        navigate('/home'); // Redirect to home if user exists
      } else {
        navigate('/complete-profile'); // Redirect to complete profile if user does not exist
      }
    } catch (err) {
      setError(err.message);
      console.error('Authentication Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');

    const TIMEOUT_DURATION = 100000; // 10 seconds timeout

    try {
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Authentication timed out')), TIMEOUT_DURATION)
      );

      // Use Promise.race to wait for either the authentication or the timeout
      const result = await Promise.race([
        signInWithPopup(auth, googleProvider).then((result) => result),
        timeoutPromise
      ]);

      const user = result.user;
      const userExists = await checkUserExists(user.email, user.uid);

      if (userExists) {
        saveUserDataToLocalStorage(user);
        await sendUserDataToBackend(user);
        navigate('/home'); // Redirect to home if user exists
      } else {
        navigate('/complete-profile'); // Redirect to complete profile if user does not exist
      }
    } catch (err) {
      setError(err.message);
      console.error('Google Authentication Error:', err);
    } finally {
      
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
      <img src={Deal} alt="logo" className="logo-img" />
        <h2>Log In</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleEmailAuth}>
          <div className='contain'>
            <input
              type="email"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label className="label-input">Email</label>
          </div>
          <div className='contain'>
            <input
              type="password"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label className="label-input">Password</label>
          </div>
          <button type="submit" className="email-login-button" disabled={loading}>
            {loading ? <Loader /> : 'Log In'}
          </button>
        </form>
        <button onClick={handleGoogleAuth} className="google-sign-in-button" disabled={loading}>
          Log In with Google
        </button>
        <a href="#/signup" className="auth-link">
          Don't have an account? Sign Up
        </a>
      </div>
    </div>
  );
};

export default Login;
