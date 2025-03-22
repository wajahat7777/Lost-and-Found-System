import React from "react";
import "./MyItems.css";

const MyItems = ({ items }) => {
  return (
    <div className="my-items-container">
      <h2>My Posted Items</h2>
      {items.length === 0 ? (
        <p>No items posted yet.</p>
      ) : (
        <div className="item-grid">
          {items.map((item) => (
            <div key={item.id} className="item-card">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <span className={`item-type ${item.type}`}>
                {item.type === "lost" ? "Lost" : "Found"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyItems;
