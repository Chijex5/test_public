import React from 'react';
import './FeaturedAuthor.css';

const FeaturedAuthor = ({ author }) => {
  return (
    <div className="featured-author">
      <h3>Author of the Month</h3>
      <div className="author-details">
        <img src={author.photo} alt={author.name} className="author-photo" />
        <div className="author-info">
          <h4>{author.name}</h4>
          <p>{author.bio}</p>
        </div>
      </div>
      <div className="author-books">
        <h4>Books by {author.name}</h4>
        <div className="book-cards">
          {author.books.map((book) => (
            <div key={book.id} className="book-card">
              <p>{book.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedAuthor;
