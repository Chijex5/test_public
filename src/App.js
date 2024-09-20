import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import { UserProvider, useUser } from './UserContext';
import { ThemeProvider } from './ThemeContext';
import ErrorBoundary from './ErrorBoundary';
import ForgotPassword from './ForgotPassword';
import ProtectedRoute from './ProtectedRoute';

const App = () => {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [cartItems, setCartItems] = useState([]);
  const { user, loading } = useUser();

  if (loading) {
    return <Loaders />;
  }

  return (
    
      <Router>
        <ThemeProvider>
            <ErrorBoundary>
              {/* <BuggyComponent> */}
              <div className="App">
                <ConditionalHeaderFooter activeNav={activeNav} setActiveNav={setActiveNav} />
                <main>
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                    <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
                    <Route path="/forgot-password" element={user ? <Navigate to="/dashboard" /> : <ForgotPassword />} />
                    <Route path="/complete-profile" element={<ProtectedRoute />}>
                      <Route path="" element={<CompleteProfile user={user}/>} />
                    </Route>
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/profile" element={user ? <UserProfile /> : <Navigate to="/login" />} />
                    <Route path="/dashboard" element={user ? <Home cartItems={cartItems} setCartItems={setCartItems} /> : <Navigate to="/login" />} />
                    <Route path="/wishlist" element={user ? <Wishlist cartItems={cartItems} setCartItems={setCartItems} /> : <Navigate to="/login" />} />
                    <Route path="/book" element={user ? <Books cartItems={cartItems} setCartItems={setCartItems} /> : <Navigate to="/login" />} />
                    <Route path="/cart" element={user ? <Cart cartItems={cartItems} setCartItems={setCartItems} /> : <Navigate to="/login" />} />
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
              {/* </BuggyComponent> */}
            </ErrorBoundary>
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

const Root = () => (
  <UserProvider>
    <App />
  </UserProvider>
);

export default Root;