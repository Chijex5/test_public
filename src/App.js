import React, { useEffect, useState } from 'react';
import { HashRouter  as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import {getAuth, onAuthStateChanged } from 'firebase/auth';
import './App.css';
import Header from './Header';
import Footer from './Footer';
import Cart from './Cart';
import Home from './Home';
import CompleteProfile from './CompleteProfile'
import Books from './Book';
import Login from './Login';
import Signup from './Signup';
import Loaders from './Loaders';
import UserProfile from './UserProfile';
import Wishlist from './Wishlist';
import { UserProvider } from './UserContext';
import { ThemeProvider } from './ThemeContext';
import ErrorBoundary from './ErrorBoundary';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState('home');
  const [cartItems, setCartItems] = useState([]);

  const auth = getAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
              <Route path="/" element={ <Navigate to="/home" /> } />
                <Route path="/login" element={isAuthenticated ? <Navigate to="/home" /> : <Login />} />
                <Route path="/complete-profile" element={<CompleteProfile user={user} />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/profile" element={isAuthenticated ? <UserProfile /> : <Navigate to="/login" />} />
                <Route path="/home" element={isAuthenticated ? <Home cartItems={cartItems} setCartItems={setCartItems} /> : <Navigate to="/login" />} />
                <Route path="/wishlist" element={isAuthenticated ? <Wishlist cartItems={cartItems} setCartItems={setCartItems} /> : <Navigate to="/login" />} />
                <Route path="/book" element={isAuthenticated ? <Books cartItems={cartItems} setCartItems={setCartItems} /> : <Navigate to="/login" />} />
                <Route path="/cart" element={isAuthenticated ? <Cart cartItems={cartItems} setCartItems={setCartItems} /> : <Navigate to="/login" />} />
                <Route path="*" element={<Navigate to="/home" />} />
              </Routes>
            </main>
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
    const currentPath = location.pathname.split('/')[1] || 'home';
    setActiveNav(currentPath);
  }, [location, setActiveNav]);

  const noHeaderFooter = ['/login', '/signup', '/complete-profile'].includes(location.pathname);

  return (
    <>
      {!noHeaderFooter && <Header />}
      {!noHeaderFooter && <Footer activeNav={activeNav} setActiveNav={setActiveNav} />}
    </>
  );
};

export default App;
