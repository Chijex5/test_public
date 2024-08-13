import React from 'react';
import './Recommendations.css';

const Recommendations = ({ recommendedBooks }) => {
  return (
    <div className="recommendations">
      <h3>Recommended for You</h3>
      <div className="book-cards">
        {recommendedBooks.map((book) => (
          <div key={book.id} className="book-card">
            <p>{book.name}</p>
            <p>{book.department}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
