import React, { useState, useEffect } from 'react';
import './Books.css';
import Notification from './Notifications';
import configureBaseUrl from './configureBaseUrl';

const BookCard = ({ book, onAddToCart }) => {
  const [baseUrl, setBaseUrl] = useState('');
  const [load, setLoading] = useState(false)
  const [clicke, setClicke] = useState(false);
  const [buttonState, setButtonState] = useState({ cartClicked: false, wishlistClicked: false });
  const [notification, setNotification] = useState({ message: '', type: '' });
  useEffect(() => {
    const fetchBaseUrl = async () => {
      const url = configureBaseUrl();
      setBaseUrl(url);
      
    };

    fetchBaseUrl();
  }, []);
  
  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 4000); // Clear notification after 4 seconds
  };
  
  async function handleAddToWishlist(userId, bookId, bookcode) {
    setLoading(true)
    try {
      // API endpoint URL
      const url = `${baseUrl}/addToWishlist`; // Replace with your actual backend endpoint
  
      // Prepare the request payload
      const payload = {
        userId,
        bookId,
      };
  
      // Send the POST request
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      // Handle the response based on the status code
      if (response.ok) {
        setLoading(false)
        setClicke(true);
        setNotification({message: `${bookcode} successfully added to wishlist!`, type: 'success'});
        setTimeout(() => {
          setClicke(false);
          setNotification({ message: '', type: '' });
        }, 4000);
        // Handle the successful addition
      } else if (response.status === 409) {
        // 409 Conflict: Book already in wishlist
        setLoading(false)
        setNotification({message: `${bookcode} is already in your wishlist.`, type: 'info'});
        setTimeout(() => {
          setClicke(false);
          setNotification({ message: '', type: '' });
        }, 4000);
      } else {
        // Other errors
        setLoading(false)
        setNotification({message: `Failed to add ${bookcode} to the wishlist.`, type: 'error'})
        console.log("Failed to add the book to the wishlist.");
        setTimeout(() => {
          setClicke(false);
          setNotification({ message: '', type: '' });
        }, 4000);
      }
    } catch (error) {
      // Handle network errors
      console.error("Error while adding to wishlist:", error);
    }
  }
  
  const handleAddToCart = () => {
    onAddToCart(book);
    setButtonState({ ...buttonState, cartClicked: true });
    showNotification(`${book.code} added to cart!`, 'success');
    setTimeout(() => setButtonState({ ...buttonState, cartClicked: false }), 2000);
  };
  

  return (
    <div className="book-cardy">
      <h3>{book.code}</h3>
      <div className="text-container">
        <p>{book.name}</p>
        <p>Department: {book.department}</p>
        <p>₦{book.price ? book.price.toFixed(2) : "N/A"}</p>
        <p className='rating'>Rating: <span className='rating-value'>{book.rating}</span></p>
      </div>
      <button
        onClick={handleAddToCart}
        disabled={!book.available}
        className={
          buttonState.cartClicked
            ? "add-to-cart-button clicked"
            : book.available
            ? "add-to-cart-button"
            : "out-of-stock-button"
        }
      >
        {book.available ? (buttonState.cartClicked ? "Added!" : "Add to Cart") : "Out of Stock"}
      </button>
      <button
        onClick={(event) => {
          event.stopPropagation();
          handleAddToWishlist(book);
        }}
        className={
          buttonState.wishlistClicked
            ? "add-to-wishlist-button clicked"
            : "add-to-wishlist-button"
        }
      >
        {buttonState.wishlistClicked ? "Added!" : "Add to Wishlist"}
      </button>
      {notification.message && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification({ message: '', type: '' })} 
        />
      )}
    </div>
  );
};

export default BookCard;
