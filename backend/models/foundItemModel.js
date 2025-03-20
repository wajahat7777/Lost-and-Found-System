const mongoose = require("mongoose");

const foundItemSchema = new mongoose.Schema({
    UserName: { type: String },  // Person who found the item
    Email: { type: String },  // Finder's email
    ItemName: { type: String, required: true },
    Description: { type: String, required: true },
    Category: { type: String, required: true },
    Location: { type: String, required: true },
    DateFound: { type: Date, required: true },
    ContactInfo: { type: String, required: true },
    Status: { type: String, default: "found" },  // Default status is "found"
    CreatedAt: { type: Date, default: Date.now }
});

const FoundItem = mongoose.model("FoundItem", foundItemSchema);
module.exports = FoundItem;
