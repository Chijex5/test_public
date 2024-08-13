// src/QuickLinks.js
import React from 'react';
import './QuickLinks.css';

const QuickLinks = () => {
  return (
    <div className="quick-links">
      <h3>Quick Links</h3>
      <ul>
        <li><a href="#new-arrivals">New Arrivals</a></li>
        <li><a href="#bestsellers">Bestsellers</a></li>
        <li><a href="#offers">Special Offers</a></li>
        <li><a href="#contact">Contact Us</a></li>
      </ul>
    </div>
  );
};

export default QuickLinks;
