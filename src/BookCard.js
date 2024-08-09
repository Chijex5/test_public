import React from 'react';
import './Books.css';

const BookCard = ({ book }) => {
  const { name, subject_code, department, available } = book;
  return (
    <div className="book-card">
      <h3>{name}</h3>
      <p>Subject Code: {subject_code}</p>
      <p>Department: {department}</p>
      <p>{available ? 'Available' : 'Not Available'}</p>
      <button className="add-to-cart-btn">Add to Cart</button>
    </div>
  );
};

export default BookCard;
