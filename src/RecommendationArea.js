import React from 'react';
import './Books.css';
import BookCard from './BookCard';

const RecommendationArea = ({ title, books }) => {
  return (
    <div className="recommendation-section">
      <h2 className="section-title">{title}</h2>
      <div className="books-list">
        {books.map((book, index) => (
          <BookCard key={index} book={book} />
        ))}
      </div>
    </div>
  );
};

export default RecommendationArea;
