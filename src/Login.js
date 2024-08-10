import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider } from './firebase'; // Import Firebase services
import axios from 'axios'; // Import Axios
import './Auth.css'; // Ensure this is your CSS file
import Loader from './Loader'; // Ensure this is your Loader component

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const BASE_URL = window.location.hostname === 'localhost' ? 'http://127.0.0.1:5000' : 'http://192.168.113.240:5000';

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
      await axios.post(`${BASE_URL}/login`, {
        user_id: user.uid,
        email: user.email
      });
    } catch (err) {
      console.error('Backend Error:', err);
      setError('Failed to send user data to backend.');
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      saveUserDataToLocalStorage(user);
      await sendUserDataToBackend(user);
      navigate('/home'); // Redirect to home page on success
    } catch (err) {
      setError(err.message);
      console.error('Authentication Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
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
      saveUserDataToLocalStorage(user);
      await sendUserDataToBackend(user);
      navigate('/'); // Redirect to home page on success
    } catch (err) {
      setError(err.message);
      console.error('Google Authentication Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
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
            <label class="label-input">Email</label>
          </div>
          <div className='contain'>
            <input
              type="password"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label class="label-input">Password</label>
          </div>
          <button type="submit" className="email-login-button" disabled={loading}>
            {loading ? <Loader /> : 'Log In'}
          </button>
        </form>
        <button onClick={handleGoogleAuth} className="google-sign-in-button" disabled={loading}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
            <path fill="#ffffff" d="M44.5,20H24v8.5h11.9c-1,5-5.3,8.5-11.9,8.5c-7,0-12.5-5.7-12.5-12.5S17,12,24,12c3,0,5.7,1.1,7.8,3l5.7-5.7C34.2,5.8,29.3,4,24,4C12.4,4,3,13.4,3,25s9.4,21,21,21c10.6,0,19.7-7.9,21-18h-0.5V20z"/>
          </svg>
          <p>Log In with Google</p>
        </button>
        <a href="/signup" className="auth-link">
          Don't have an account? Sign Up
        </a>
      </div>
    </div>
  );
};

export default Login;
