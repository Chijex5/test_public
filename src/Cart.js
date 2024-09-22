import React, {useState, useEffect} from 'react';
import './Cart.css';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from './UserContext';
import image from './23.png';
import configureBaseUrl from './configureBaseUrl';
import Loaders from './Loaders';
import axios from 'axios';

const Cart = ({ cartItems, setCartItems }) => {
  const {userData, setTotalBooks, setTotalSum, loading} = useUser();
  const [form, setForm] = useState(null);
  const navigate = useNavigate();
  const [userId, setUserId] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPayOnDelivery, setIsPayOnDelivery] = useState(false);
  const [deliveryConfirmed, setDeliveryConfirmed] = useState(false);
  const [deliveryTime, setDeliveryTime] = useState(null);
  const [baseUrl, setBaseUrl] = useState('');

useEffect(() => {
  const fetchBaseUrl = async () => {
    const url = configureBaseUrl();
    setBaseUrl(url);
    
  };

  fetchBaseUrl();
}, []);


  // Function to handle Pay on Delivery selection
  const handlePayOnDelivery = () => {
    const now = new Date();
    const deliveryDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    setDeliveryTime(deliveryDate);
    setIsPayOnDelivery(true);
  };
  const options ={
    weekday: 'long',
    year : 'numeric',
    month: 'long',
    day: 'numeric'
  };

  // Function to confirm availability
  const handleConfirmDelivery = () => {
  // Extracting purchase data from cartItems
  const purchases = cartItems.map(item => ({
    book_code: item.code,
    quantity: item.quantity,
    unit_price: item.price,
    total_price: item.price * item.quantity
  }));

  const purchasedDetails = cartItems.map(item => ({
    userId: form?.userId,  // Assuming userId is part of the user data
    bookId: item.id,   // Assuming each cart item has a bookId
    price: item.price * item.quantity,
    paymentMethod: 'Pay on Delivery' // This can vary based on the selected method
  }));

  // Payment method data
  const options = { year: 'numeric', month: 'long', day: 'numeric' };  // Date formatting options
  const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };  // Time formatting options

  const date = new Date();
  const formattedDate = date.toLocaleDateString('en-US', options);
  const formattedTime = date.toLocaleTimeString('en-US', timeOptions);

  const time = `${formattedDate} by ${formattedTime}`;
  const method = {
    type: 'Pay on Delivery',  // This can vary based on the selected method
    account_name: form.username,  // Assuming form contains user data
    account_number: 'NA',  // You can update this dynamically
    pay_by: time,  // Example: using formatted time as the pay by date
    tax: tax  // Assuming tax is defined elsewhere in your code
  };



  // Payload for backend
  const purchaseDetails = {
    customer_name: form.username,
    address: `${form.flatNo || ""} ${form.street || " "}, ${form.city || ""}, ${form.state}`,
    date: new Date().toISOString().split('T')[0],  // Current date in YYYY-MM-DD format
    purchases: purchases,
    method: method,
    purchasedDetails: purchasedDetails
  };

  // Send purchase details to the backend
  sendPurchaseData(purchaseDetails);

  setDeliveryConfirmed(true);
  
  setCartItems([]);  // Empty the cart
};

  const sendPurchaseData = async (purchaseDetails) => {
  try {
    const response = await fetch(`${baseUrl}/purchase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(purchaseDetails),  // Send the purchase details
    });
  
    if (response.ok) {

      if (userId) { 

        const response = await axios.get(`${baseUrl}/user/purchases`, {
          params: { userId }
        });
        const { totalSum, totalBooks } = response.data;

        setTotalSum(totalSum);
        setTotalBooks(totalBooks);
      }
      const blob = await response.blob();  // Get the file as a blob

      // Create a link element
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;

      // Set the file name to download
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'invoice.pdf';  // Default file name

      if (contentDisposition && contentDisposition.indexOf('attachment') !== -1) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match && match[1]) {
          filename = match[1];
        }
      }

      a.download = filename;

      // Append the link to the document and trigger the download
      document.body.appendChild(a);
      a.click();

      // Clean up
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } else {
      console.error('Failed to send purchase data.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};


  
  
  

  // Function to update the quantity
  const handleQuantityChange = (name, delta) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.name === name
          ? { ...item, quantity: Math.max(item.quantity + delta, 1) }
          : item
      )
    );
  };

  useEffect(() => {
    if (!loading && userData) {
      setForm(userData); 
      setUserId(userData.userId) // Set form when userData is available
    }
  }, [userData, loading]);

  // If loading, show the loader
  if (loading || !form) {
    return <Loaders />;
  }

  const address = form.address || ''
  const name = form.username || ''
  const email = form.email || ''

   // Function to handle checkout click (opens modal)
   const handleProceedToCheckout = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const closeModalx = () => {
    setIsPayOnDelivery(false)
    setIsModalOpen(false);
  };
  // Function to remove an item from the cart
  const handleRemoveItem = (name) => {
    setCartItems((prevItems) => prevItems.filter(item => item.name !== name));
  };

  // Calculate totals
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1; // Example tax calculation
  const total = subtotal + tax;
  return (
    <div className="cart-container">
      {!deliveryConfirmed ? (
        <>
          <h2>Your Cart</h2>

          {cartItems.length > 0 ? (
            <>
              <ul className="cart-list">
                {cartItems.map((item, index) => (
                  <li key={index} className="cart-item">
                    <button className="remove-button" onClick={() => handleRemoveItem(item.name)}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="bin-icon">
                        <path d="M7 4V2H17V4H22V6H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V6H2V4H7ZM6 6V20H18V6H6ZM9 9H11V17H9V9ZM13 9H15V17H13V9Z"></path>
                      </svg>
                    </button>
                    <div className="book-info">
                      <span className="book-title">{item.code}</span>
                      <span className="book-author">{item.name}</span>
                    </div>
                    <div className="book-price">₦{item.price.toFixed(2)}</div>
                    <div className="quantity-selector">
                      <button
                        className="quantity-button"
                        onClick={() => handleQuantityChange(item.name, -1)}
                        disabled={item.quantity === 1}  // Disable when quantity is 1
                      >
                        -
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button
                        className="quantity-button"
                        onClick={() => handleQuantityChange(item.name, 1)}
                      >
                        +
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="cart-summary">
                <div className="summary-item">
                  <span>Subtotal:</span>
                  <span>₦{subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-item">
                  <span>Our Fees:</span>
                  <span>₦{tax.toFixed(2)}</span>
                </div>
                <div className="summary-item total">
                  <span>Total:</span>
                  <span>₦{total.toFixed(2)}</span>
                </div>
              </div>

              <div className="cart-actions">
                <button onClick={() => navigate('/book')} className="continue-shopping">Continue Shopping</button>
                <button className="checkout" onClick={handleProceedToCheckout}>Proceed to Checkout</button>
              </div>

              {/* Modal for payment options */}
              {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                  <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <h3>Select Payment Method</h3>
                    <button className="payment-option">
                      <i className='bx bxs-credit-card bx-spin'></i>
                      <span>Pay with Credit Card</span>
                    </button>
                    <button className="payment-option">
                      <i className='bx bxs-bank bx-tada'></i>
                      <span>Pay with Bank Transfer</span>
                    </button>
                    <button className="payment-option">
                      <i className='bx bxl-paypal bx-tada'></i>
                      <span>Pay with PayPal</span>
                    </button>
                    <button className="payment-option" onClick={handlePayOnDelivery}>
                      <i className='bx bxs-truck bx-fade-left'></i>
                      <span>Pay on Delivery</span>
                    </button>

                    <button className="close-modal" onClick={closeModal}> <i className="fas fa-times"> </i></button>
                  </div>
                </div>
              )}

              {/* Pay on Delivery confirmation */}
              {isPayOnDelivery && !deliveryConfirmed && isModalOpen && (
                <div className="modals-overlay" onClick={closeModal}>
                  <div className="modals-content" onClick={(e) => e.stopPropagation()}>
                    <h2>Hello, {name}</h2>
                    <p>
                      Thank you for choosing <strong>Unibooks</strong> and opting for payment on delivery.
                      Please note that a delivery fee of ₦1000 applies for deliveries outside campus.
                    </p>
                    <div className="delivery-info">
                      <h3>Delivery Information</h3>
                      <p>
                        <strong>Address:</strong> {address} <br />
                        <strong>Total Amount:</strong> ₦{total.toFixed(2)}
                      </p>
                    </div>
                    <div className="availability-info">
                      <h3>Availability Confirmation</h3>
                      <p>
                        Will you be available to receive your package on <strong>{deliveryTime?.toLocaleDateString('en-US', options)}</strong> around <strong>{deliveryTime.getHours()} o'clock</strong>?
                      </p>
                    </div>
                    <div className="modal-buttons">
                      <button className="confirm-delivery" onClick={handleConfirmDelivery}>
                        Yes, I will be available
                      </button>
                      <button className="closes-modal" onClick={closeModalx}> No, I want to cancel</button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="empty-cart">
              <div className='text-button'>
                <p>Your cart is empty. Start adding books to your collection!</p>
                <Link to="/book" className="profile-link">
                  <button className="browse-books">Browse Books</button>
                </Link>
              </div>
              <div className='cart-image'>
                <img src={image} alt="No wishlist items" className="empty-cart-image" />
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="delivery-animation">
          <p>Your package is being delivered!</p>
          <p className='bold-email'>
            Check your email <span>"{email}"</span> for more details. Your invoice download will begin shortly.
          </p>

          <div className="delivery-bus"></div>
          
          <div className="road"></div>
          
          {/* Optional clouds for background effect */}
          <div className="cloud" style={{ top: "150px", left: "20px" }}></div>
          <div className="cloud" style={{ top: "170px", left: "150px" }}></div>
        </div>
      
      )}
    </div>
  );
};

export default Cart;