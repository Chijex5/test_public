import React, { useState } from 'react';
import './Books.css';

const SellBook = () => {
  // eslint-disable-next-line
  const [price, setPrice] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);

  const handlePriceChange = (e) => {
    const inputPrice = parseFloat(e.target.value) || 0;
    setPrice(inputPrice);
    setFinalAmount(inputPrice * 0.8);
  };

  return (
    <div className="sell-book-section">
      <h2 className="section-title">Sell Your Book</h2>
      <div className="name-code">
        <input type="text" placeholder="Book Name" className="input-field name" />
        <input type="text" placeholder="Subject Code" className="input-field code" />
      </div>
      <input type="text" placeholder="Department" className="input-field dept" />
      <textarea placeholder="Book Description" className="input-field desc"></textarea>
      <input 
        type="number" 
        placeholder="Price" 
        onChange={handlePriceChange} 
        className="input-field price" 
      />
      <p className="warning-message">We take 20% of the price you put.</p>
      <p className="earnings">Your earnings: <span>₦{finalAmount.toFixed(2)}</span></p>
      <button className="submit-button">Submit</button>
    </div>
  );
};

export default SellBook;
