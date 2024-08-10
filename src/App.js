import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import './App.css';
import Header from './Header';
import Footer from './Footer';
import Cart from './Cart';
import Home from './Home';
import Books from './Book';
import About from './About';
import Login from './Login';
import Signup from './Signup';
import { auth } from './firebase';
import Loaders from './Loaders';
import UserProfile from './UserProfile';
import { UserProvider } from './UserContext';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState('home');
  const [cartItems, setCartItems] = useState([]);
  

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
      <UserProvider>
        <div className="App">
          <ConditionalHeaderFooter activeNav={activeNav} setActiveNav={setActiveNav} />
          <main>
            <Routes>
            <Route path="/" element={ <Navigate to="/home" /> } />
              <Route path="/login" element={isAuthenticated ? <Navigate to="/home" /> : <Login />} />
              <Route path="/signup" element={isAuthenticated ? <Navigate to="/home" /> : <Signup />} />
              <Route path="/home/profile" element={isAuthenticated ? <UserProfile /> : <Navigate to="/login" />} />
              <Route path="/home" element={isAuthenticated ? <Home cartItems={cartItems} setCartItems={setCartItems} /> : <Navigate to="/login" />} />
              <Route path="/book" element={isAuthenticated ? <Books cartItems={cartItems} setCartItems={setCartItems} /> : <Navigate to="/login" />} />
              <Route path="/cart" element={isAuthenticated ? <Cart cartItems={cartItems} setCartItems={setCartItems} /> : <Navigate to="/login" />} />
              <Route path="/about" element={isAuthenticated ? <About /> : <Navigate to="/login" />} />
              <Route path="*" element={<Navigate to="/home" />} />
            </Routes>
          </main>
        </div>
      </UserProvider>
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

  const noHeaderFooter = ['/login', '/signup'].includes(location.pathname);

  return (
    <>
      {!noHeaderFooter && <Header />}
      {!noHeaderFooter && <Footer activeNav={activeNav} setActiveNav={setActiveNav} />}
    </>
  );
};

export default App;
