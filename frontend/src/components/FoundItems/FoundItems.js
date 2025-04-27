import React from "react";
import "./FoundItems.css";

const FoundItems = ({ filteredItems, setSelectedItem }) => {
  return (
    <div className="found-items-view">
      <h2>Found Items</h2>
      <div className="item-grid">
        {filteredItems
          .filter((item) => item.type === "found")
          .map((item) => (
            <div
              key={item.id}
              className="item-card"
              onClick={() => setSelectedItem(item)}
            >
              {item.image && (
                <img src={item.image} alt={item.title} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '10px' }} />
              )}
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default FoundItems;
