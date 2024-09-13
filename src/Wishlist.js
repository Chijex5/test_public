import React, { useState, useEffect } from 'react';
import './Wishlist.css'; // Use a separate CSS file for Wishlist
import Notification from './Notifications';
import { Tooltip } from 'react-tooltip';
import axios from 'axios';
import 'react-tooltip/dist/react-tooltip.css';
import { Link } from 'react-router-dom';
import image from './22.png';
import configureBaseUrl from './configureBaseUrl';

const Wishlist = ({ setCartItems }) => {
  
  const [wishlist, setWishlist] = useState([]);
  const [userId, setUserId] = useState(''); 
  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    const fetchBaseUrl = async () => {
      const url = configureBaseUrl();
      setBaseUrl(url);
    };

    fetchBaseUrl();
  }, []);

  useEffect(() => {
    const fetchUserDataFromLocalStorage = async () => {
      try {
        const user = await JSON.parse(localStorage.getItem('user'));
        if (user) {
          setUserId(user.userId); // Set the userId here
          console.log("User data fetched from local storage:", user);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
  
    fetchUserDataFromLocalStorage();
  }, []);  

  useEffect(() => {
    const fetchAndSetWishlist = async () => {
      try {
        const response = await axios.get(`${baseUrl}/getWishlist`, {
          params: { userId: userId }
        });
    
        if (response.status === 200) {
          const mappedBooks = mapBooks(response.data);
          setWishlist(mappedBooks);
          console.log('Wishlist successfully updated.');
        } else {
          console.log('Failed to fetch wishlist data.');
        }
      } catch (error) {
        console.error('Error while fetching wishlist data:', error);
      }
    };
  
    fetchAndSetWishlist();
  }, [userId, baseUrl]);


  const handleRemoveFromWishlist = async (book, bookId) => {
    setLoading(true)
    try {
      // Send DELETE request to the backend API with query parameters
      const response = await axios.delete(`${baseUrl}/removeFromWishlist`, {
        params: {
          bookId,
          userId
        }
      });
  
      // Check the response status
      if (response.status === 200) {
        const mappedBooks = mapBooks(response.data);
          setWishlist(mappedBooks);
          setLoading(false)
        console.log('Book successfully removed from wishlist.');
        setNotification({ message: `${book.code} removed from wishlist.`, type: 'info' });
        setTimeout(() => {
          setNotification({ message: '', type: '' });
        }, 4000);

      } else {
        console.log('Failed to remove book from wishlist.');
        setLoading(false)
      }
    } catch (error) {
      console.error('Error while removing book from wishlist:', error);
      return { success: false, message: 'An error occurred while removing the book' };
    }
  };
  

// Usage example:



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
    const handleRemoveFromWishlist = async (bookId) => {
      try {
        // Send DELETE request to the backend API with query parameters
        const response = await axios.delete(`${baseUrl}/removeFromWishlist`, {
          params: {
            bookId,
            userId
          }
        });
    
        // Check the response status
        if (response.status === 200) {
          const mappedBooks = mapBooks(response.data);
            setWishlist(mappedBooks);
        } else {
          console.log('Failed to remove book from wishlist.');
        }
      } catch (error) {
        console.error('Error while removing book from wishlist:', error);
        return { success: false, message: 'An error occurred while removing the book' };
      }
    };
    handleRemoveFromWishlist(book.id);
    setNotification({ message: `${book.code} moved to cart!`, type: 'success' });
    setTimeout(() => {
      setNotification({ message: '', type: '' });
    }, 4000);
  };

  const mapBooks = (booksArray) => {
    return booksArray.map(book => ({
      id: book[0],
      code: book[1],
      name: book[2],
      department: book[3],
      price: parseFloat(book[4]),
      available: Boolean(book[5]),
      level: book[6],
      quantity: book[7],
      rating: book[8],
      category: book[9]
    }));
  };

  const handleNotificationClose = () => {
    setNotification({ message: '', type: '' });
  };

  console.log(wishlist);

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
      {wishlist.length > 0 ? (
        <div className="section wishlist">
          {wishlist.map((book) => (
            <div key={book.code} className="wishlist-item">
              <p className='bold'>{book.code}</p>
              <p className='name'>{book.name}</p>
              <p className='bold'>Price: ₦{book.price}</p>
              <div className='wishlist-buttons'>
                <button
                  data-tooltip-id={book.available ? `move-tooltip-${book.id}` : `out-of-stock-tooltip-${book.id}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    handleMoveToCart(book);
                  }}
                  disabled={!book.available}
                  className={book.available ? "move-to-cart-button" : "unavailable-button"}
                >
                  {book.available ? (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="2em"
                        height="2em"
                        fill="currentColor"
                      >
                        <path d="M6.00488 9H19.9433L20.4433 7H8.00488V5H21.7241C22.2764 5 22.7241 5.44772 22.7241 6C22.7241 6.08176 22.7141 6.16322 22.6942 6.24254L20.1942 16.2425C20.083 16.6877 19.683 17 19.2241 17H5.00488C4.4526 17 4.00488 16.5523 4.00488 16V4H2.00488V2H5.00488C5.55717 2 6.00488 2.44772 6.00488 3V9ZM6.00488 23C4.90031 23 4.00488 22.1046 4.00488 21C4.00488 19.8954 4.90031 19 6.00488 19C7.10945 19 8.00488 19.8954 8.00488 21C8.00488 22.1046 7.10945 23 6.00488 23ZM18.0049 23C16.9003 23 16.0049 22.1046 16.0049 21C16.0049 19.8954 16.9003 19 18.0049 19C19.1095 19 20.0049 19.8954 20.0049 21C20.0049 22.1046 19.1095 23 18.0049 23Z"></path>
                      </svg>
                      Move to Cart
                    </>
                  ) : (
                    "Unavailable"
                  )}
                </button>

                <Tooltip id={`move-tooltip-${book.id}`} content="Move to Cart" place="top" />
                <Tooltip id={`out-of-stock-tooltip-${book.id}`} content="Book is out of stock" place="top" />

                <button data-tooltip-id={`remove-tooltip-${book.id}`}
                  onClick={(event) => {
                    event.stopPropagation(); 
                    handleRemoveFromWishlist(book, book.id);
                  }}
                  className="remove-from-wishlist-button"
                >
                  {loading ? (
                    <div className="wishlist-loaders"></div>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      width='2em'
                      height='2em'
                      fill="currentColor">
                        <path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM9 6H15V4H9V6ZM6 20V8H18V20H6Z"></path>
                      </svg>
                      Remove
                    </>
                  )}
                </button>
                <Tooltip id={`remove-tooltip-${book.id}`} content="Remove from Wishlist" place="top" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-wishlist-message">
          <p>Nothing in your wishlist yet. Save your favorite books here!</p>
          <Link to="/book" className="profile-link">
                <button className="browse-books">Browse Books</button>
          </Link>
          <img src={image} alt="No wishlist items" className="empty-wishlist-image" />
        </div>
      )}
    </div>
  );
};

export default Wishlist;
