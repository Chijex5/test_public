import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import './App.css';
import Header from './Header';
import Footer from './Footer';
import Home from './Home';
import Books from './Book';
import About from './About';
import Login from './Login';
import Signup from './Signup';
import { auth } from './firebase'; // Import Firebase auth
import Loaders from './Loaders';
import UserProfile from './UserProfile';
import { UserProvider } from './UserContext';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState('home'); // Add state for activeNav
  
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
              <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> :<Login />} />
              <Route path="/signup" element={isAuthenticated ? <Navigate to="/" /> : <Signup />} />
              <Route path="/profile" element={isAuthenticated ? <UserProfile /> : <Navigate to="/login" />} />
              <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
              <Route path="/book" element={isAuthenticated ? <Books /> : <Navigate to="/login" />} />
              <Route path="/about" element={isAuthenticated ? <About /> : <Navigate to="/login" />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </UserProvider>
    </Router>
  );
};

const ConditionalHeaderFooter = ({ activeNav, setActiveNav }) => {
  const location = useLocation();
  const noHeaderFooter = ['/login', '/signup'].includes(location.pathname);

  return (
    <>
      {!noHeaderFooter && <Header />}
      {!noHeaderFooter && <Footer activeNav={activeNav} setActiveNav={setActiveNav} />}
    </>
  );
};

export default App;
