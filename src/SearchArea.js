import React, { useState } from 'react';
import './SearchArea.css'; // Ensure your styles match your design preferences

const SearchArea = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions] = useState([]); // You may need to populate suggestions dynamically

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (onSearch) onSearch(value); // Safely call onSearch if provided
    setShowSuggestions(value.length > 0);
  };

  const handleClear = () => {
    setQuery('');
    if (onSearch) onSearch(''); // Safely reset search if onSearch is provided
    setShowSuggestions(false);
  };

  const handleSearch = () => {
    if (onSearch) onSearch(query); // Trigger the search when the search icon is clicked
  };

  const selectSuggestion = (suggestion) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    if (onSearch) onSearch(suggestion); // Search with selected suggestion
  };

  return (
    <div className="searche-container">
      <div className="search-box">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search anything..."
          className="search-input"
          aria-label="Search"
        />
        <button className="search-icon" onClick={handleSearch}>
          <i className="fas fa-search"></i> {/* Ensure Font Awesome is included */}
        </button>
        {query && (
          <button className="clear-icon" onClick={handleClear}>
            &#x2715;
          </button>
        )}
      </div>
      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions-dropdown">
          {suggestions.map((suggestion, index) => (
            <li key={index} onClick={() => selectSuggestion(suggestion)}>
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchArea;
