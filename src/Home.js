// Home.js
import React, { useState, useEffect } from 'react';
import { useUser } from './UserContext';
import './Home.css';
import Loaders from './Loaders';
import Loader from './Loader'
import axios from 'axios'


import 'react-tooltip/dist/react-tooltip.css';
import Joyride from 'react-joyride';
import OffersCarousel from './OffersCarousel';
import Notification from './Notifications';
import configureBaseUrl from './configureBaseUrl';

const Home = ({ cartItems, setCartItems }) => {
  const { userData, loading } = useUser();
  const [expandedBook, setExpandedBook] = useState(null);
  const [load, setLoading] = useState(false)
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [userId, setUserId] = useState(''); 
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    const fetchBaseUrl = async () => {
      const url = configureBaseUrl();
      setBaseUrl(url);
      
    };

    fetchBaseUrl();
  }, []);


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

  const [booksData, setBooksData] = useState({
    recentChoices: [],
    departmentBooks: []
  });
  

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
  }, []);   // Empty dependency array to run only once on component mount

  useEffect(() => {
      if (userId) {
        const fetchData = () => {
          axios.get(`${baseUrl}/getbooks`, {
            params: { userId: userId }
          })
            .then(response => {
              const mappedData = {
                recentChoices: mapBooks(response.data.recentChoices),
                departmentBooks: mapBooks(response.data.allBooks)  // Changed to 'allBooks' based on backend
              };
              setBooksData(mappedData);
              console.log(mappedData)
              localStorage.setItem('homeBooksData', JSON.stringify(mappedData));
            })
            .catch(error => {
              console.error("There was an error fetching the books data!", error);
            });
        };

        const cachedBooksData = localStorage.getItem('homeBooksData');
        if (cachedBooksData) {
          setBooksData(JSON.parse(cachedBooksData));
        } else {
          fetchData();
        }

        const intervalId = setInterval(fetchData, 5 * 60 * 1000); // sync every 5 minutes

        return () => clearInterval(intervalId); // Cleanup interval on component unmount
      }
    }, [userId, baseUrl]); // This effect runs when usersData is set

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
  const [clicke, setClicke] = useState(false);

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
    setNotification({ message: `${book.code} added to cart!`, type: 'success' });

    setTimeout(() => {
      setClicked(false);
      setNotification({ message: '', type: '' });
    }, 4000); // 2 seconds

  };

  const handleNotificationClose = () => {
    setNotification({ message: '', type: '' });
  };

  
  if (loading) return <Loaders />;

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
        {notification.message && (
          <Notification 
            message={notification.message} 
            type={notification.type} 
            onClose={handleNotificationClose} 
          />
        )}
        <div className="section recent-books">
          <h2>Recent Books</h2>
          <div className="book-cards">
            {booksData.recentChoices.map((book) => (
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
                    <p className='rating'>Rating: <span className='rating-value'>{book.rating}</span></p>
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
                    <button
                      onClick={(event) => {
                        event.stopPropagation(); 
                        handleAddToWishlist(userId, book.id, book.code);
                      }}
                      className={
                      clicke
                          ? "add-to-wishlist-button clicked"
                          : "add-to-wishlist-button"
                          }
                    >
                      {load ? <Loader /> : (clicke ? "Added!" : "Add to Wishlist")}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="section highest-sellers">
          <h2>Based On Your Department</h2>
          <div className="book-cards">
            {booksData.departmentBooks.map((book) => (
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
                    <p className='rating'>Rating: <span className='rating-value'>{book.rating}</span></p>
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
                    <button
                    
                      onClick={(event) => {
                        event.stopPropagation(); 
                        handleAddToWishlist(userId, book.id, book.code);
                      }}
                      className={
                      clicke
                          ? "add-to-wishlist-button clicked"
                          : "add-to-wishlist-button"
                          }
                    >
                      {clicke ? "Added!" : "Add to Wishlist"}
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