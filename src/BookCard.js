import React, { useState, useEffect } from 'react';
import './Books.css';
import Notification from './Notifications';

const BookCard = ({ book, onAddToCart }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [clicked, setClicked] = useState(false);
  const [clicke, setClicke] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });

  const handleAddToWishlist = (book) => {
    const existingItem = wishlistItems.find((item) => item.code === book.code);
    if (!existingItem) {
      const updatedWishlist = [...wishlistItems, book];
      setWishlistItems(updatedWishlist);
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      setNotification({ message: `${book.code} added to wishlist!`, type: 'success' });
    } else {
      setNotification({ message: `${book.code} is already in your wishlist!`, type: 'info' });
    }
    setClicke(true)
    setTimeout(() => {
      setClicke(false);
    }, 2000);
    setTimeout(() => {
      setClicked(false);
      setNotification({ message: '', type: '' });
    }, 4000);
  };
  
  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    setWishlistItems(storedWishlist);
  }, []);

  const handleAddToCart = () => {
    onAddToCart(book);
    setClicked(true);

    // Reset clicked state after a short duration
    setTimeout(() => {
      setClicked(false);
    }, 2000); // 2 seconds
    setNotification({ message: `${book.code} added to cart!`, type: 'success' });

    setTimeout(() => {
      setClicked(false);
      setNotification({ message: '', type: '' });
    }, 4000); // 2 seconds

  };

  const handleNotificationClose = () => {
    setNotification({ message: '', type: '' });
  };

  return (
    <div className="book-cardy">
      <h3>{book.code}</h3>
      <p>{book.name}</p>
      <p>{book.department}</p>
      <p>₦{book.price.toFixed(2)}</p>
      <button
        onClick={handleAddToCart}
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
      <button
        onClick={(event) => {
          event.stopPropagation(); 
          handleAddToWishlist(book);
        }}
        className={
          clicke
          ? "add-to-wishlist-button clicked"
          : "add-to-wishlist-button"
        }
      >
        {clicke ? "Added!" : "Add to Wishlist"}
      </button>
      {notification.message && (
          <Notification 
            message={notification.message} 
            type={notification.type} 
            onClose={handleNotificationClose} 
          />
        )}
    </div>
  );
};

export default BookCard;