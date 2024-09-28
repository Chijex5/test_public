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

import FabButton from './FabButton';
// import BuggyComponent from './BuggyComponent'

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState('dashboard');
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  if (loading) {
    return <Loaders />;
  }

  return (
    <Router>
      <ThemeProvider>
        <UserProvider>
          <ErrorBoundary>
            {/* <BuggyComponent> */}
            <div className="App">
              <ConditionalHeaderFooter activeNav={activeNav} setActiveNav={setActiveNav} />
              
              <main>
              <FabButton isAuth={isAuthenticated} />
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                  <Route path="/login" element={ <Login />} />
                  <Route path="/forgot-password" element={isAuthenticated ? <Navigate to="/dashboard" /> : <ForgotPassword />} />
                  <Route path="/complete-profile" element={<CompleteProfile user={user}/>} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/profile" element={isAuthenticated ? <UserProfile /> : <Navigate to="/login" />} />
                  <Route path="/dashboard" element={isAuthenticated ? <Home cartItems={cartItems} setCartItems={setCartItems} /> : <Navigate to="/login" />} />
                  <Route path="/wishlist" element={isAuthenticated ? <Wishlist cartItems={cartItems} setCartItems={setCartItems} /> : <Navigate to="/login" />} />
                  <Route path="/book" element={isAuthenticated ? <Books cartItems={cartItems} setCartItems={setCartItems} /> : <Navigate to="/login" />} />
                  <Route path="/cart" element={isAuthenticated ? <Cart cartItems={cartItems} setCartItems={setCartItems} /> : <Navigate to="/login" />} />
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
              </main>
            </div>
            {/* </BuggyComponent> */}
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
