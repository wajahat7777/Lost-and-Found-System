import React, { useState } from "react";
import "./PostItem.css";

const PostItem = ({ onPostItem }) => {
  const [itemData, setItemData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    date: "",
    type: "lost", // Default to 'lost'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItemData({
      ...itemData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onPostItem(itemData);
    alert("Item posted successfully!");
    setItemData({
      title: "",
      description: "",
      category: "",
      location: "",
      date: "",
      type: "lost",
    });
  };

  return (
    <div className="post-item-container">
      <h2>Post a Lost or Found Item</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={itemData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={itemData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Category</label>
          <select
            name="category"
            value={itemData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="Personal Accessories">Personal Accessories</option>
            <option value="Electronics">Electronics</option>
            <option value="Bags">Bags</option>
          </select>
        </div>
        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={itemData.location}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={itemData.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Type</label>
          <select
            name="type"
            value={itemData.type}
            onChange={handleChange}
            required
          >
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
        </div>
        <button type="submit" className="submit-btn">
          Post Item
        </button>
      </form>
    </div>
  );
};

export default PostItem;
