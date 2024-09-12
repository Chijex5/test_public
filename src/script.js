// src/Home.js
import React, { useState, useEffect } from 'react';
import './Home.css';
import Loader from './Loader';

function Home() {
  const [loading, setLoading] = useState(true);
  const [expandedBook, setExpandedBook] = useState(null);

  const books = [
    { id: 1, title: "Book 1", subject: "Subject 1", available: true, price: "10.99", department: "Department 1" },
    { id: 2, title: "Book 2", subject: "Subject 2", available: false, price: "8.99", department: "Department 2" },
    { id: 3, title: "Book 3", subject: "Subject 3", available: true, price: "12.99", department: "Department 3" },
    { id: 4, title: "Book 4", subject: "Subject 4", available: true, price: "15.99", department: "Department 4" }
  ];

  const bookse = [
    { id: 5, title: "Book 5", subject: "Subject 5", available: true, price: "10.99", department: "Department 5" },
    { id: 6, title: "Book 6", subject: "Subject 6", available: false, price: "8.99", department: "Department 6" },
    { id: 7, title: "Book 7", subject: "Subject 7", available: true, price: "12.99", department: "Department 7" },
    { id: 8, title: "Book 8", subject: "Subject 8", available: true, price: "15.99", department: "Department 8" }
  ];

  const toggleExpand = (id) => {
    setExpandedBook(expandedBook === id ? null : id);
  };

  // Example profile completion status
  const profileCompletion = {
    personalDetails: true,
    paymentDetails: false,
    verification: false,
  };

  const completionPercentage = Object.values(profileCompletion).filter(Boolean).length / 3 * 100;

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 10000); // 10 seconds timeout
    return () => clearTimeout(timer); // Clean up timeout on component unmount
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="home">
      <div className="profile-section">
        <div className="profile-pic">
          <img src="./33.jpg" alt="Profile" className="profile-image" />
          {completionPercentage < 100 && (
            <svg className="progress-ring" width="80" height="80">
              <circle
                className="progress-ring__circle"
                stroke="green"
                strokeWidth="8"
                fill="transparent"
                r="36"
                cx="40"
                cy="40"
                strokeDasharray="251" // Use this value for strokeDasharray to match the CSS
                strokeDashoffset={2 * Math.PI * 36 - (completionPercentage / 100) * (2 * Math.PI * 36)}
              />
            </svg>
          )}
        </div>
      </div>
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
          <span className="value">5</span>
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
              <div className="book-summary">
                <p>Subject: {book.subject}</p>
                <p>Available: {book.available ? "Yes" : "No"}</p>
                <p>Price: ${book.price}</p>
              </div>
              {expandedBook === book.id && (
                <div className="book-details">
                  <p>Title: {book.title}</p>
                  <p>Department: {book.department}</p>
                  <button>Add to Cart</button>
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
                <p>Subject: {book.subject}</p>
                <p>Available: {book.available ? "Yes" : "No"}</p>
                <p>Price: ${book.price}</p>
              </div>
              {expandedBook === book.id && (
                <div className="book-details">
                  <p>Title: {book.title}</p>
                  <p>Department: {book.department}</p>
                  <button>Add to Cart</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="section sales-offers">
        <h2>Sales and Offers</h2>
        <div className="offers">
          <p>Sale 1</p>
          <p>Sale 2</p>
        </div>
      </div>
      <div className="section advertisements">
        <h2>Advertisements</h2>
        <div className="ads">
          <p>Ad 1</p>
          <p>Ad 2</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
