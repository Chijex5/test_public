import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './Auth.css'; // Ensure this is your CSS file
import Loader from './Loader'; // Ensure this is your Loader component

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const auth = getAuth();

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/home'); // Redirect to home page on success
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
      await signInWithPopup(auth, provider);
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
        <h2>Sign Up</h2>
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
          <button type="submit" className="email-sign-up-button" disabled={loading}>
            {loading ? <Loader /> : 'Sign Up'}
          </button>
        </form>
        <button onClick={handleGoogleAuth} className="google-sign-in-button">
          Continue with Google
        </button>
        <a href="/login" className="auth-link">
          Already have an account? Log In
        </a>
      </div>
    </div>
  );
};

export default Signup;
