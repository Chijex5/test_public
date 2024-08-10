import React from 'react';
import './Cart.css';
import { Link } from 'react-router-dom';

const Cart = ({ cartItems, setCartItems }) => {

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
      <h2>Your Cart</h2>

      {cartItems.length > 0 ? (
        <>
          <ul className="cart-list">
            {cartItems.map((item, index) => (
              <li key={index} className="cart-item">
                <button className="remove-button" onClick={() => handleRemoveItem(item.name)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className='bin-icon'>
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
            <Link to="/book" className="profile-link">
                <button className="continue-shopping">Continue Shopping</button>
            </Link>
            <button className="checkout">Proceed to Checkout</button>
          </div>
        </>
      ) : (
        <div className="empty-cart">
            <p>Your cart is empty. Start adding books to your collection!</p>
            <Link to="/book" className="profile-link">
                <button className="browse-books">Browse Books</button>
            </Link>
        </div>
      )}
    </div>
  );
};

export default Cart;
