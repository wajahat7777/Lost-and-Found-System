import React from 'react';
import './LostItems.css';

const LostItems = ({ filteredItems, setSelectedItem }) => {
  return (
    <div className="lost-items-view">
      <h2>Lost Items</h2>
      <div className="item-grid">
        {filteredItems
          .filter((item) => item.type === 'lost')
          .map((item) => (
            <div
              key={item.id}
              className="item-card"
              onClick={() => setSelectedItem(item)}
            >
              <img src={item.imageUrl} alt={item.title} />
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default LostItems;