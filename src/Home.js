import React, { useState, useEffect } from 'react';
import { useUser } from './UserContext'; // Import the context
import './Home.css';
import { Link } from 'react-router-dom';
import profilePic from './33.jpg';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import Joyride from 'react-joyride';
import OffersCarousel from './OffersCarousel'

const Home = ({ cartItems, setCartItems }) =>  {

  const [tour, setTour] = useState({
    run: false,
    steps: [

      {
        target: '.hello',  // CSS selector for the target element
        content: 'This is your Dashbord. You get to see your activities here.',
      },
      {
        target: '.profile-link',  // CSS selector for the target element
        content: 'This is your profile. Click here to view more details.',
      },
      {
        target: '.book-card',  // Example of another target
        content: "Click to expand. 'Unavailable' simply means the book is currently out of stock.",
      },
      {
        target: '.sales-offers',  // Example of another target
        content: "Don't forget to check back here—every now and then, we roll out unbeatable offers you won't want to miss!",
      },
      {
        target: '.advertisements',  // Example of another target
        content: "Hey, we know ads can be a drag, but we promise our offers are worth your attention. Keep an eye out—you might just find something you love!",
      },
    ],

    
  });
  const { userData, loading } = useUser();
  const [expandedBook, setExpandedBook] = useState(null);

  const books = [
    { code: 'STA112', id: 1, name: 'Probability II', department: 'Statistics', price: 2000, available: true, level: "100" },
    { code: 'STA111', id: 2, name: 'Introduction to Probability', department: 'Statistics', price: 2500, available: true, level: "100" },
    { code: 'STA132', id: 3, name: 'Inference II', department: 'Statistics', price: 3000, available: false, level: "100" },
    { code: 'STA131', id: 4, name: 'Introduction to Inference', department: 'Statistics', price: 2200, available: true, level: "100" },
    { code: 'STA172', id: 5, name: 'Statistical Computing', department: 'Statistics', price: 2800, available: true, level: "100" },
    { code: 'MTH122', id: 6, name: 'Circle Geometry', department: 'Mathematics', price: 1800, available: true, level: "100" },
    { code: 'MTH111', id: 7, name: 'Integrated Mathematics', department: 'Mathematics', price: 1500, available: false, level: "100" },
    { code: 'MTH131', id: 8, name: 'Integration and Depreciation', department: 'Mathematics', price: 2000, available: true, level: "100" },
    { code: 'BIO151', id: 9, name: 'Introduction to Biology', department: 'Micro Biology', price: 3000, available: true, level: "100" },
    { code: 'CHM122', id: 10, name: 'Organic Chemistry II', department: 'Pure and Industrial Chemistry', price: 3500, available: true, level: "100" },
    { code: 'CHM132', id: 11, name: 'Inorganic Chemistry II', department: 'Pure and Industrial Chemistry', price: 4000, available: false, level: "100" },
    { code: 'CHM171', id: 12, name: 'Introduction to Organic Chemistry', department: 'Pure and Industrial Chemistry', price: 3200, available: true, level: "100" },
    { code: 'CHM101', id: 13, name: 'Introduction to Inorganic Chemistry', department: 'Pure and Industrial Chemistry', price: 2800, available: true, level: "100" },
    { code: 'ENG101', id: 14, name: 'Introduction to Engineering', department: 'Engineering', price: 2500, available: true, level: "100" },
    { code: 'GSP102', id: 15, name: 'Lexis and Structure', department: 'General Studies', price: 1500, available: true, level: "100" }
  ];

  const bookse = [
    { code: 'GSP111', id: 21, name: 'Use of Library', department: 'General Studies', price: 1000, available: false, level: "100" },
    { code: 'GSP101', id: 16, name: 'Use of English', department: 'General Studies', price: 1200, available: true, level: "100" },
    { code: 'ENG102', id: 17, name: 'Introduction to Engineering II', department: 'Engineering', price: 3000, available: true, level: "100" },
    { code: 'GLG142', id: 18, name: 'Earth History', department: 'Geology', price: 2000, available: true, level: "100" },
    { code: 'COS101', id: 19, name: 'Introduction to Computer Sciences', department: 'Computer Sciences', price: 2500, available: true, level: "100" },
    { code: 'PHY121', id: 20, name: 'Physics for Engineering', department: 'Engineering', price: 2500, available: true, level: "100" }
  ];

  const handleTourFinish = () => {
    localStorage.setItem('hasCompletedTour', 'true');
    setTour((prevTour) => ({ ...prevTour, run: false }));
  };

  useEffect(() => {
    const hasCompletedTour = localStorage.getItem('hasCompletedTour');
    if (!hasCompletedTour) {
      setTour((prevTour) => ({ ...prevTour, run: true }));
    }
  }, []);

  const toggleExpand = (id) => {
    setExpandedBook(expandedBook === id ? null : id);
  };
  // eslint-disable-next-line
  const [clicked, setClicked] = useState(false);

  const handleAddToCart = (book) => {
    setClicked(true)
    
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.name === book.name);
      if (existingItem) {
        // If the book is already in the cart, increase the quantity
        return prevItems.map((item) =>
          item.name === book.name ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // If the book is not in the cart, add it with a quantity of 1
        return [...prevItems, { ...book, quantity: 1 }];
      }
      
    });
    setTimeout(() => {
      setClicked(false);
    }, 2000); // 2 seconds
  };


  const profileCompletion = {
    firstName: !!userData?.username?.split(' ')[0],
    lastName: !!userData?.username?.split(' ')[1],
    email: !!userData?.email,
    phone: !!userData?.phone,
    department: !!userData?.department,
    address: !!userData?.address,
  };

  const completionPercentage = Object.values(profileCompletion).filter(Boolean).length / Object.keys(profileCompletion).length * 100;

  if (loading) return <p>Fetching Data .... </p>;

  return (
    
    <div className="home">
      <div className="homeie">
      <Joyride
        steps={tour.steps}
        run={tour.run}
        continuous={true}
        scrollToFirstStep={true}
        showProgress={true}
        showSkipButton={true}
        callback={(data) => {
          const { status } = data;
          if (status === 'finished' || status === 'skipped') {
            handleTourFinish();
          }
        }}
        styles={{
          options: {
            primaryColor: '#28a745',
          },
        }}
      />
        <div className="profile-section">
          <Link to="/home/profile" className="profile-link" data-tooltip-id="profile-tooltip">
            <div className="profile-pic">
              <img src={userData?.profileUrl || profilePic} alt="Profile" className="profile-img" />
              {completionPercentage < 100 && (
                <div className="profile-completion-overlay">
                  <div className="completion-bar" style={{ width: `${completionPercentage}%` }}></div>
                  <span className="completion-text">{Math.floor(completionPercentage)}% Complete</span>
                </div>
              )}
            </div>
          </Link>
          <Tooltip id="profile-tooltip" content="View Profile" place="top" />
        </div>
        <h1 className='hello'>Hello, {userData?.username?.split(' ')[0] || 'User'}!</h1>
        <div className="dashboard">
          <div className="dashboard-item">
            <span className="label">Books Bought</span>
            <span className="value">10</span>
          </div>
          <div className="dashboard-item">
            <span className="label">Money Spent</span>
            <span className="value">₦20,000.00</span>
          </div>
          <div className="dashboard-item">
            <span className="label">Books in Cart</span>
            <span className="value">{cartItems.length}</span>
          </div>
        </div>
        <div className="section recent-books">
          <h2>Recent Books</h2>
          <div className="book-cards">
            {books.map((book) => (
              <div
                key={book.id}
                className={`book-card ${expandedBook === book.id ? 'expanded' : ''}`}
                onClick={() => toggleExpand(book.id)}
              >
                <div className="book-summary" >
                  <p>Course Code: {book.code}</p>
                  <p className={book.available ? "available" : "notavailable"}>{book.available ? "Available" : "Unavailable"}</p>
                  <p>Price: ₦{book.price}</p>
                </div>
                {expandedBook === book.id && (
                  <div className="book-details">
                    <p>Title: {book.name}</p>
                    <p>Department: {book.department}</p>
                    <button
                      onClick={(event) => {
                        event.stopPropagation(); 
                        handleAddToCart(book);
                      }} 
                      disabled={!book.available}
                      className={
                        clicked
                          ? "add-to-cart-button clicked"
                          : book.available
                          ? "add-to-cart-button"
                          : "out-of-stock-button"
                      }
                    >
                      {book.available ? (clicked ? "Added!" : "Add to Cart") : "Out of Stock"}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="section highest-sellers">
          <h2>Highest Sellers This Week</h2>
          <div className="book-cards">
            {bookse.map((book) => (
              <div
                key={book.id}
                className={`book-card ${expandedBook === book.id ? 'expanded' : ''}`}
                onClick={() => toggleExpand(book.id)}
              >
                <div className="book-summary">
                  <p>Course Code: {book.code}</p>
                  <p className={book.available ? "available" : "notavailable"}>{book.available ? "Available" : "Unavailable"}</p>
                  <p>Price: ₦{book.price}</p>
                </div>
                {expandedBook === book.id && (
                  <div className="book-details">
                    <p>Title: {book.name}</p>
                    <p>Department: {book.department}</p>
                    <button
                      onClick={(event) => {
                        event.stopPropagation(); 
                        handleAddToCart(book);
                      }} 
                      disabled={!book.available}
                      className={
                        clicked
                          ? "add-to-cart-button clicked"
                          : book.available
                          ? "add-to-cart-button"
                          : "out-of-stock-button"
                      }
                    >
                      {book.available ? (clicked ? "Added!" : "Add to Cart") : "Out of Stock"}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="section sales-offers">
          <h2>Sales and Offers</h2>
          <OffersCarousel />
        </div>
              

        <div className="section advertisements">
          <h2 className="ads-title">Advertisements</h2>
          <div className="ads-container">
            
            {/* Pop-Up Banner */}
            <div className="ad pop-up-banner">
              <div className="ad-content">
                <h3 className="ad-title">New Arrivals Just In!</h3>
                <p className="ad-text">Explore the latest additions to our collection.</p>
                <button className="btn-shop-now">Shop Now</button>
              </div>
            </div>

            {/* Sidebar Ad */}
            <div className="ad sidebar-ad">
              <div className="ad-content">
                <h3 className="ad-title">Back-to-School Discounts</h3>
                <p className="ad-text">Save up to 30% on textbooks and materials for the new school year.</p>
                <button className="btn-shop-now">Shop Now</button>
              </div>
            </div>
            
          </div>
        </div>
      </div>
      </div>
    );
    }

export default Home;