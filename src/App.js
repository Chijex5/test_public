import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { getAuth, onAuthStateChanged} from 'firebase/auth';
import './App.css';
import Header from './Header';
import Footer from './Footer';
import Cart from './Cart';
import Home from './Home';
import CompleteProfile from './CompleteProfile';
import Books from './Book';
import Login from './Login';
import Signup from './Signup';
import Loaders from './Loaders';
import UserProfile from './UserProfile';
import Wishlist from './Wishlist';
import { UserProvider } from './UserContext';
import { ThemeProvider } from './ThemeContext';
import ErrorBoundary from './ErrorBoundary';
import ForgotPassword from './ForgotPassword';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState('dashboard');
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  // const [showVerifyModal, setShowVerifyModal] = useState(false); // Show verify modal
  // const [verificationSent, setVerificationSent] = useState(false); // Track if email verification has been sent
  // const [sending, setSending] = useState(false); // Track sending status

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        console.log(user)
        setIsAuthenticated(true);
        // if (!user.emailVerified) {
        //   setShowVerifyModal(true); // Show modal if email is not verified
        // }
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  // Function to send email verification
  // const handleSendVerification = async () => {
  //     if (user && !user.emailVerified) {  // Ensure email is unverified
  //       setSending(true);
  //       try {
  //         await sendEmailVerification(user);
  //         setVerificationSent(true);
  //         console.log("Verification email sent successfully.");
  //       } catch (error) {
  //         console.error('Error sending verification email:', error.message);  // Log error message
  //       } finally {
  //         setSending(false);
  //       }
  //     } else {
  //       console.warn("User is either not logged in or the email is already verified.");
  //     }
  // };

  if (loading) {
    return <Loaders />;
  }

  return (
    <Router>
      <ThemeProvider>
        <UserProvider>
          <ErrorBoundary>
            <div className="App">
              <ConditionalHeaderFooter activeNav={activeNav} setActiveNav={setActiveNav} />
              <main>
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                  <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
                  <Route path="/forgot-password" element={isAuthenticated ? <Navigate to="/dashboard" /> : <ForgotPassword />} />
                  <Route path="/complete-profile" element={<CompleteProfile user={user} />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/profile" element={isAuthenticated ? <UserProfile /> : <Navigate to="/login" />} />
                  <Route path="/dashboard" element={isAuthenticated ? <Home cartItems={cartItems} setCartItems={setCartItems} /> : <Navigate to="/login" />} />
                  <Route path="/wishlist" element={isAuthenticated ? <Wishlist cartItems={cartItems} setCartItems={setCartItems} /> : <Navigate to="/login" />} />
                  <Route path="/book" element={isAuthenticated ? <Books cartItems={cartItems} setCartItems={setCartItems} /> : <Navigate to="/login" />} />
                  <Route path="/cart" element={isAuthenticated ? <Cart cartItems={cartItems} setCartItems={setCartItems} /> : <Navigate to="/login" />} />
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
              </main>

              {/* Modal to prompt email verification
              {showVerifyModal && (
                <div className="verify-modal">
                  <div className="verify-content">
                    <h2>Email Verification Needed</h2>
                    <p>Your email is not verified. Please verify your email to continue using the app.</p>

                    {verificationSent ? (
                      <p>A verification email has been sent to your email address.</p>
                    ) : (
                      <button onClick={handleSendVerification} disabled={sending}>
                        {sending ? 'Sending...' : 'Send Verification Email'}
                      </button>
                    )}

                    <button onClick={() => setShowVerifyModal(false)}>Close</button>
                  </div>
                </div>
              )} */}
            </div>
          </ErrorBoundary>
        </UserProvider>
      </ThemeProvider>
    </Router>
  );
};

const ConditionalHeaderFooter = ({ activeNav, setActiveNav }) => {
  const location = useLocation();

  useEffect(() => {
    // Determine the current path and set activeNav accordingly
    const currentPath = location.pathname.split('/')[1] || 'dashboard';
    setActiveNav(currentPath);
    console.log(currentPath);
  }, [location, setActiveNav]);

  const noHeaderFooter = ['/login', '/signup', '/complete-profile', '/forgot-password'].includes(location.pathname);

  return (
    <>
      {!noHeaderFooter && <Header />}
      {!noHeaderFooter && <Footer activeNav={activeNav} setActiveNav={setActiveNav} />}
    </>
  );
};

export default App;
