const mongoose = require("mongoose");

const lostItemSchema = new mongoose.Schema({
    UserName:{type:String},
    Email:{type:String},
    ItemName: { type: String, required: true },
    Description: { type: String, required: true },
    Category: { type: String, required: true },
    Location: { type: String, required: true },
    DateLost: { type: Date, required: true },
    ContactInfo: { type: String, required: true },
    Status: { type: String, default: "lost" },
    CreatedAt: { type: Date, default: Date.now }
});

const LostItem = mongoose.model("LostItem", lostItemSchema);
module.exports = LostItem;
