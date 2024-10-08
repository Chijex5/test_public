import React, { useState, useEffect } from 'react';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, updateProfile, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for making HTTP requests
import './Signup.css';
import Loaders from './Loaders';
import Loader from './Loader';
import Modal from './Modal';
import Deal from './uni2.png'
import configureBaseUrl from './configureBaseUrl';
import { useUser } from './UserContext';


const Signup = () => {
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [didSendUserData, setDidSendUserData] = useState(false);
  const {setUserData, setTotalBooks, setTotalSum} = useUser();
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

  const retrySendUserData = async (user, userId, maxRetries = 3) => {
    for (let i = 0; i < maxRetries; i++) {
      if (!didSendUserData) {
        await sendUserDataToBackend(user, userId);
        if (didSendUserData) {
          break;
        }
      }
    }
  };

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

      if (userId) { 
        const response = await axios.get(`${baseUrl}/user/purchases`, {
          params: { userId }
        });
        const { totalSum, totalBooks } = response.data;

        if (user) {
          user.totalSum = totalSum; // Append totalSum to the user data
          user.totalBooks = totalBooks; // Append totalBooks to the user data
          localStorage.setItem('user', JSON.stringify(user)); // Save the updated data back to localStorage
        }

        setTotalSum(totalSum);
        setTotalBooks(totalBooks);
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
      setDidSendUserData(true)
      navigate('/dashboard');
    } catch (error) {
      console.error('Backend Error:', error);
      setDidSendUserData(false)
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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Send verification email and wait for it
      const emailVerified = await checkEmailVerification(user);
  
      if (!emailVerified) {
        setError('A verification email has been sent. Please verify your email before continuing.');
        return; // Stop further execution until email is verified
      }
  
      // Check if the user exists in your database
      const exists = await checkUserExists(user.email, user.uid);
  
      if (exists) {
        await sendUserDataToBackend(user, user.uid);
        if (!didSendUserData) {
          await retrySendUserData(user, user.uid);
        }
      } else if (!exists) {
        navigate('/complete-profile');
      } else {
        setError('Failed to check user. Internal server error.');
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
        return true;
      } else {

        await updateProfile(user, {
          displayName: displayName 
        }).then(async () => {
          await sendEmailVerification(user);
        }).catch((error) => {
          console.error("Error updating display name:", error);
        });
  
        setShowModal(true); // Show modal after sending email
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
    const provider = new GoogleAuthProvider();
    setLoading(true);
    setError('');

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const exists = await checkUserExists(user.email, user.uid);

      if (exists) {
        await sendUserDataToBackend(user, user.uid);
        if (!didSendUserData) {
          await retrySendUserData(user, user.uid);
        }
      } else if(!exists) {
        navigate('/complete-profile');
      } else {
        setError('Failed to check user. Internal server error')
      }
    } catch (err) {
      setError(err.message);
      console.error('Google Authentication Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loader){
    return <Loaders />
  }

  return (
    <div className="signup-container">
      <div className="signup-card">
      <Modal
        show={showModal}
        closeModal={() => setShowModal(false)}
        resendVerification={resendVerification}
      />
      <img src={Deal} alt="logo" className="logo-img" />
        <h2>Sign Up</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleEmailAuth}>
        <div className="input-group">
            <input
              type="text"
              id='name'
              className="signup-input"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
            <label className="input-label">Full Name</label>
          </div>
          <div className="input-group">
            <input
              type="email"
              id='email'
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
              id='password'
              className="signup-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label className="input-label">Password</label>
          </div>
          <div className='craaa'>
            <button type="submit" className="signup-button" disabled={loading}>
              {loading ? <Loader /> : 'Sign Up'}
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
            <span className="gsi-material-button-contents">Sign up with Google</span>
            <span style={{ display: 'none' }}>Sign up with Google</span>
          </div>
        </button>
        <a href="#/login" className="auth-link">
          <i className="fas fa-user"></i> Have an account? Log in
        </a>
      </div>
    </div>
  );
};

export default Signup;
