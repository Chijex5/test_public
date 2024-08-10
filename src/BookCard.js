import React, { useState } from 'react';
import './Books.css';

const BookCard = ({ book, onAddToCart }) => {
  const [clicked, setClicked] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(book);
    setClicked(true);

    // Reset clicked state after a short duration
    setTimeout(() => {
      setClicked(false);
    }, 2000); // 2 seconds
  };

  return (
    <div className="book-card">
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
    </div>
  );
};

export default BookCard;