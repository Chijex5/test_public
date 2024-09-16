import { useState } from 'react';
import { auth } from './firebase';
import { sendPasswordResetEmail, fetchSignInMethodsForEmail} from 'firebase/auth';
import './ForgotPassword.css' // Ensure you have Firebase set up and imported correctly
import Loader from './Loader';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    try {
      setLoading(true);
      // Check if the email exists
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
  
      if (signInMethods.length === 0) {
        // If no sign-in methods are returned, the email isn't registered
        setError('No account found with this email address.');
        setMessage('');
      } else {
        // Proceed with password reset
        await sendPasswordResetEmail(auth, email);
        setMessage('Password reset email has been sent!');
        setError(''); // Clear any previous error
      }
    } catch (err) {
      setError('Failed to send reset email. Please try again later.');
      console.log(err);
      setMessage('');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="forgot-password-container">
        <div className="forgot-password-card">
            <h2 className="forgot-password-heading">Forgot Password</h2>
            <form className='form'>
                <div className='contain'>
                    <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="forgot-password-input"
                    />
                    <label className="label-input">Email</label>
                </div>
                <button onClick={handleForgotPassword} className="forgot-password-button">
                {loading ? <Loader /> : 'Reset Password'}
                </button>
                {message && <p className="message success">{message}</p>}
                {error && <p className="message error">{error}</p>}
            </form>
            <a href="#/login" className="auth-link">
                <i className="fas fa-user"></i> Have an account? Log in
            </a>
        </div>
    </div>
  );
};

export default ForgotPassword;
