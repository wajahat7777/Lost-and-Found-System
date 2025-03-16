import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ searchQuery, setSearchQuery, searchFilters, setSearchFilters }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  
  // Example data for suggestions (should come from a backend API in production)
  const allItems = [
    'Black Wallet', 'Blue Backpack', 'iPhone 14', 'Red Scarf', 'Car Keys', 'Laptop Bag'
  ];

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Filter suggestions based on query
    if (query.length > 0) {
      const filteredSuggestions = allItems.filter(item =>
        item.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className="search-container">
      <div className="search-main">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search for lost or found items..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
          {/* Display search suggestions */}
          {suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((suggestion, index) => (
                <li key={index} onClick={() => setSearchQuery(suggestion)}>
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button onClick={() => setShowFilters(!showFilters)} className="btn-filter">
          Filters
        </button>
      </div>

      {showFilters && (
        <form className="filters-panel">
          {/* Filters remain unchanged */}
        </form>
      )}
    </div>
  );
};

export default SearchBar;
