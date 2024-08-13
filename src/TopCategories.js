import React from 'react';
import './TopCategories.css';

const TopCategories = () => {
  const categories = ['Engineering', 'Mathematics', 'Biology', 'Chemistry', 'Statistics'];

  return (
    <div className="top-categories">
      <h3>Top Categories</h3>
      <div className="categories-list">
        {categories.map((category, index) => (
          <div key={index} className="category-item">
            {category}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopCategories;
