// src/pages/Wishlist.js
import React, { useState, useEffect } from 'react';
import './Wishlist.css'; // Use a separate CSS file for Wishlist
import Notification from './Notifications';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import { Link } from 'react-router-dom';
import image from './34.jpeg'

const Wishlist = ({ setCartItems }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [notification, setNotification] = useState({ message: '', type: '' });

  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    setWishlistItems(storedWishlist);
  }, []);

  const handleRemoveFromWishlist = (book) => {
    const updatedItems = wishlistItems.filter((item) => item.code !== book.code);
    setWishlistItems(updatedItems);
    localStorage.setItem('wishlist', JSON.stringify(updatedItems));
    setNotification({ message: `${book.code} removed from wishlist.`, type: 'info' });
    setTimeout(() => {
      setNotification({ message: '', type: '' });
    }, 4000)
  };

  const handleMoveToCart = (book) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.code === book.code);
      if (existingItem) {
        return prevItems.map((item) =>
          item.name === book.name ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevItems, { ...book, quantity: 1 }];
      }
    });
    handleRemoveFromWishlist(book);
    setNotification({ message: `${book.code} moved to cart!`, type: 'success' });
    setTimeout(() => {
      setNotification({ message: '', type: '' });
    }, 4000)
  };

  const handleNotificationClose = () => {
    setNotification({ message: '', type: '' });
  };

  return (
    <div className="wishlist-page">
      <h2>Your Wishlist</h2>
      {notification.message && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
          onClose={handleNotificationClose} 
        />
      )}
      {wishlistItems.length > 0 ? (
        <>
        <div className="section wishlist">
        {wishlistItems.map((book) => (
          <div key={book.id} className="wishlist-item">
            <p className='bold'>{book.code}</p>
            < p className='name'>{book.name}</p>
            <p>Price: ₦{book.price}</p>
            <div className='wishlist-buttons'>
              <button data-tooltip-id="move-tooltip"
                onClick={(event) => {
                  event.stopPropagation(); 
                  handleMoveToCart(book);
                }}
                className="move-to-cart-button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24"
                width="2em"
                height="2em" 
                fill="currentColor">
                  <path d="M6.00488 9H19.9433L20.4433 7H8.00488V5H21.7241C22.2764 5 22.7241 5.44772 22.7241 6C22.7241 6.08176 22.7141 6.16322 22.6942 6.24254L20.1942 16.2425C20.083 16.6877 19.683 17 19.2241 17H5.00488C4.4526 17 4.00488 16.5523 4.00488 16V4H2.00488V2H5.00488C5.55717 2 6.00488 2.44772 6.00488 3V9ZM6.00488 23C4.90031 23 4.00488 22.1046 4.00488 21C4.00488 19.8954 4.90031 19 6.00488 19C7.10945 19 8.00488 19.8954 8.00488 21C8.00488 22.1046 7.10945 23 6.00488 23ZM18.0049 23C16.9003 23 16.0049 22.1046 16.0049 21C16.0049 19.8954 16.9003 19 18.0049 19C19.1095 19 20.0049 19.8954 20.0049 21C20.0049 22.1046 19.1095 23 18.0049 23Z"></path>
                </svg>
                Move to Cart
              </button>
              <Tooltip id="move-tooltip" content="Move to Cart" place="top" />
              <button data-tooltip-id="remove-tooltip"
                onClick={(event) => {
                  event.stopPropagation(); 
                  handleRemoveFromWishlist(book);
                }}
                className="remove-from-wishlist-button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                width='2em'
                height='2em'
                fill="currentColor">
                  <path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM13.4142 13.9997L15.182 15.7675L13.7678 17.1817L12 15.4139L10.2322 17.1817L8.81802 15.7675L10.5858 13.9997L8.81802 12.232L10.2322 10.8178L12 12.5855L13.7678 10.8178L15.182 12.232L13.4142 13.9997ZM9 4V6H15V4H9Z"></path>
                </svg>
                Delete
              </button>
              <Tooltip id="remove-tooltip" content="Remove from Wishlist" place="bottom" />
            </div>
          </div>
        ))}
      </div>
      </>
      ):(
        <div className="empty-wishlist-message">
          <p>Your wishlist is empty. Start adding some books!</p>
          <img src={image} alt="Empty Wishlist" />
          <Link to="/book" className="profile-link">
            <button className="browse-books">Browse Books</button>
          </Link>
        </div>
      )}
      
    </div>
  );
};

export default Wishlist;
