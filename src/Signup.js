import React, { useState, useEffect } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for making HTTP requests
import './Signup.css';
import Loader from './Loader';
import Deal from './uni2.png'
import configureBaseUrl from './configureBaseUrl';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const auth = getAuth();
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    const fetchBaseUrl = async () => {
      const url = configureBaseUrl();
      setBaseUrl(url);
    };

    fetchBaseUrl();
  }, []);

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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Check if user exists in the backend
      const userExists = await checkUserExists(user.email, user.uid);

      if (userExists) {
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
    const provider = new GoogleAuthProvider();
    setLoading(true);
    setError('');

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user exists in the backend
      const userExists = await checkUserExists(user.email, user.uid);

      if (userExists) {
        navigate('/home'); // Redirect to home if user exists
      } else {
        navigate('/complete-profile'); // Redirect to complete profile if user does not exist
      }
    } catch (err) {
      setError(err.message);
      console.error('Google Authentication Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
      <img src={Deal} alt="logo" className="logo-img" />
        <h2>Sign Up</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleEmailAuth}>
          <div className="input-group">
            <input
              type="email"
              className="signup-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label className="input-label">Email</label>
          </div>
          <div className="input-group">
            <input
              type="password"
              className="signup-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label className="input-label">Password</label>
          </div>
          <button type="submit" className="signup-button" disabled={loading}>
            {loading ? <Loader /> : 'Sign Up'}
          </button>
        </form>
        <button onClick={handleGoogleAuth} className="google-button">
          Continue with Google
        </button>
        <a href="#/login" className="signup-link">
          Already have an account? Log In
        </a>
      </div>
    </div>
  );
};

export default Signup;
