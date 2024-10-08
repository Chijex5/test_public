import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, sendEmailVerification, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider } from './firebase'; // Import Firebase services
import './Auth.css'; // Ensure this is your CSS file
import axios from 'axios';
import Loader from './Loader'; // Ensure this is your Loader component
import Deal from './uni2.png'
import Modal from './Modal';
import Loaders from './Loaders';
import { useUser } from './UserContext';
import configureBaseUrl from './configureBaseUrl';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loadings, setLoading] = useState(false);
  const [loadingss, setLoadings] = useState(false);
  
  
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState('');
  const {setUserData, setTotalBooks, setProfileurl, setTotalSum, checkProfileCompletion, userExists} = useUser();
  const navigate = useNavigate();

  const [baseUrl, setBaseUrl] = useState('');

  const generateAvatarUrl = (name) => {
    const avatarBaseUrl = 'https://ui-avatars.com/api/';
    return `${avatarBaseUrl}?name=${encodeURIComponent(name)}&background=random&color=fff&rounded=true&size=128`;
  };

  useEffect(() => {
    const fetchBaseUrl = async () => {
      const url = configureBaseUrl();
      setBaseUrl(url);
    };

    fetchBaseUrl();
  }, []);
  const sendUserDataToBackend = async (user, userId) => {
    if (!user || !baseUrl) return;
    setLoader(true);
    try {
      const response = await axios.post(`${baseUrl}/login`, {
        user_id: user.uid,
        email: user.email,
        username: user.displayName || "",
        profileUrl: user.photoURL || ""
      });
      const usersData = response.data;
      if (usersData.error) {
        console.error(usersData.error);
        return;
      }

      let totalBooks = 0;  // Declare totalBooks and totalSum outside the block
    let totalSum = 0;

    if (userId) {
      const purchasesResponse = await axios.get(`${baseUrl}/user/purchases`, {
        params: { userId }
      });
      totalSum = purchasesResponse.data.totalSum;
      totalBooks = purchasesResponse.data.totalBooks;

      if (user) {
        user.totalSum = totalSum;
        user.totalBooks = totalBooks;
        localStorage.setItem('user', JSON.stringify(user));
      }

      setTotalSum(totalSum);
      setTotalBooks(totalBooks);
    }
    const newAvatarUrl = generateAvatarUrl(usersData.name);

    const userToSave = {
      userId: usersData.userId,
      username: usersData.name,
      email: usersData.email,
      profileUrl: usersData.profileUrl || newAvatarUrl,
      level: usersData.level || "",
      address: `${usersData.flat_no || ''}, ${usersData.street || ''}, ${usersData.city || ''}, ${usersData.state || ''}, ${usersData.postal_code || ''}`.replace(/,\s*$/, ""),
      phone: usersData.phone,
      flat_no: usersData.flat_no,
      street: usersData.street,
      city: usersData.city,
      postal_code: usersData.postal_code,
      state: usersData.state,
      department: usersData.department || "",
      totalBooks: totalBooks || " ", // Now properly accessible
      totalSum: totalSum || " "     // Now properly accessible
    };
    setProfileurl(userToSave.profileUrl)

  
      setUserData(userToSave);
      localStorage.setItem('user', JSON.stringify(userToSave));
      navigate('/dashboard');
    } catch (error) {
      console.error('Backend Error:', error);
    } finally {
      setLoader(false);
      
    }
  };

  const resendVerification = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await sendEmailVerification(user);
        alert('Verification email has been resent.');
      }
    } catch (err) {
      console.error('Error resending verification:', err);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      const emailVerified = await checkEmailVerification(user);
  
      if (!emailVerified) {
        setShowModal(true);
        setError('A verification email has been sent. Please verify your email before continuing.');
        return; // Stop further execution until email is verified
      }
  
      // Check if the user exists in your database
      const exists = await checkUserExists(user.email, user.uid);
      if (exists) {
        await sendUserDataToBackend(user, user.uid);
      } else {
        navigate('/complete-profile');
      }
    } catch (err) {
      setError(err.message);
      console.error('Authentication Error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const checkEmailVerification = async (user) => {
    if (user) {
      if (user.emailVerified) {
        return true;  // Email is verified
      } else {
        
        return false;  // Email is not yet verified
      }
    } else {
      return null;  // No user signed in
    }
  };
  
  const checkUserExists = async (email, uid) => {
    try {
      const response = await axios.post(`${baseUrl}/check-user`, { email, uid });
        return response.data.exists;
    } catch (err) {
      console.error('Error checking user:', err);
      setError('Failed to verify user existence.');
      return false;
    }
  };

  const handleGoogleAuth = async () => {
    setLoadings(true);
    setError('');
        try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        await checkProfileCompletion(user);
    
      if (userExists) {
        await sendUserDataToBackend(user, user.uid);
      } else if(!userExists) {
        navigate('/complete-profile');
      }
    } catch (err) {
      setError(err.message);
      console.error('Google Authentication Error:', err);
    } finally{
      setLoadings(false);
    }
  };
  
  if (loader) {
    return <Loaders />
  }

  return (
    <div className="auth-container">
      <Modal
        show={showModal}
        closeModal={() => setShowModal(false)}
        resendVerification={resendVerification}
      />
      <div className="auth-card">
      <img src={Deal} alt="logo" className="logo-img" />
        <h2>Log In</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleEmailAuth}>
          <div className='contain'>
            <input
              type="email"
              id='email'
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
              id='password'
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label className="label-input">Password</label>
          </div>
          <div className='craaa'>
          <button type="submit" className="email-login-button" disabled={loadings}>
            {loadings ? <Loader /> : 'Log In'}
          </button>
            <div className='or-box'>
              <div className='or-line'></div>
              <label className='craa-label'>OR</label>
              <div className='or-line'></div>
            </div>
          </div>
        </form>
        <button 
          className="gsi-material-button"
          onClick={handleGoogleAuth}
          disabled={loadings}
        >
          <div className="gsi-material-button-state"></div>
          <div className="gsi-material-button-content-wrapper">
            <div className="gsi-material-button-icon">
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: 'block' }}>
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                <path fill="none" d="M0 0h48v48H0z"></path>
              </svg>
            </div>
            <span className="gsi-material-button-contents">
            {loadingss ? <Loader /> : 'Sign in with Google'}</span>
            <span style={{ display: 'none' }}>Sign in with Google</span>
          </div>
        </button>

        <a href="#/signup" className="auth-link">
          <i className="fas fa-user-plus"></i> Don't have an account? Sign Up
        </a>
        <a href="#/forgot-password" className="auth-link">
          <i className="fas fa-key"></i> Forgot password? Click Here
        </a>

      </div>
    </div>
  );
};

export default Login;
