import React, { useState } from 'react';
import './Cart.css';
import QuantitySelector from './QuantitySelector'; // Import your QuantitySelector component

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    { id: 1, title: 'Book 1', author: 'Author 1', price: 10, quantity: 1 },
    { id: 2, title: 'Book 2', author: 'Author 2', price: 15, quantity: 2 },
  ]);

  // Function to update the quantity
  const handleQuantityChange = (id, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
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
            {cartItems.map((item) => (
              <li key={item.id} className="cart-item">
                <div className="book-info">
                  <span className="book-title">{item.title}</span>
                  <span className="book-author">by {item.author}</span>
                </div>
                <div className="book-price">${item.price.toFixed(2)}</div>
                <div className="quantity-selector">
                  <QuantitySelector
                    quantity={item.quantity}
                    setQuantity={(newQuantity) =>
                      handleQuantityChange(item.id, newQuantity)
                    }
                  />
                </div>
              </li>
            ))}
          </ul>

          <div className="cart-summary">
            <div className="summary-item">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-item">
              <span>Tax & Fees:</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="summary-item total">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="cart-actions">
            <button className="continue-shopping">Continue Shopping</button>
            <button className="checkout">Proceed to Checkout</button>
          </div>
        </>
      ) : (
        <div className="empty-cart">
          <p>Your cart is empty. Start adding books to your collection!</p>
          <button className="browse-books">Browse Books</button>
        </div>
      )}
    </div>
  );
};

export default Cart;
