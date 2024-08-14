import React, { useState } from 'react';
import './SearchArea.css'; // Ensure your styles match your design preferences

const SearchArea = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
    setShowSuggestions(value.length > 0);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
    setShowSuggestions(false);
  };

  return (
    <div className="search-area">
      <div className="search-bar">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search for books, departments..."
          className="search-input"
        />
        {query && (
          <button className="clear-button" onClick={handleClear}>
            &#x2715;
          </button>
        )}
      </div>
      {showSuggestions && (
        <ul className="suggestions-list">
          {/* Sample suggestions for now, replace with actual logic */}
          <li>Suggestion 1</li>
          <li>Suggestion 2</li>
          <li>Suggestion 3</li>
        </ul>
      )}
    </div>
  );
};

export default SearchArea;
