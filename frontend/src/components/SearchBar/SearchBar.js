import React, { useState } from "react";
import "./SearchBar.css";

const SearchBar = ({
  searchQuery,
  setSearchQuery,
  searchFilters,
  setSearchFilters,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  // Example data for suggestions (should come from a backend API in production)
  const allItems = [
    "Black Wallet",
    "Blue Backpack",
    "iPhone 14",
    "Red Scarf",
    "Car Keys",
    "Laptop Bag",
  ];

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Filter suggestions based on query
    if (query.length > 0) {
      const filteredSuggestions = allItems.filter((item) =>
        item.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters({
      ...searchFilters,
      [name]: value,
    });
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

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn-filter"
        >
          Filters
        </button>
      </div>

      {showFilters && (
        <form className="filters-panel">
          <div className="filter-group">
            <label>Category</label>
            <select
              name="category"
              value={searchFilters.category}
              onChange={handleFilterChange}
            >
              <option value="">All</option>
              <option value="Personal Accessories">Personal Accessories</option>
              <option value="Electronics">Electronics</option>
              <option value="Bags">Bags</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              placeholder="Enter location"
              value={searchFilters.location}
              onChange={handleFilterChange}
            />
          </div>

          <div className="filter-group">
            <label>Type</label>
            <select
              name="type"
              value={searchFilters.type}
              onChange={handleFilterChange}
            >
              <option value="all">All</option>
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Date From</label>
            <input
              type="date"
              name="dateFrom"
              value={searchFilters.dateFrom}
              onChange={handleFilterChange}
            />
          </div>

          <div className="filter-group">
            <label>Date To</label>
            <input
              type="date"
              name="dateTo"
              value={searchFilters.dateTo}
              onChange={handleFilterChange}
            />
          </div>
        </form>
      )}
    </div>
  );
};

export default SearchBar;
