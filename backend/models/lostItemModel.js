const mongoose = require("mongoose");

const lostItemSchema = new mongoose.Schema({
    UserName: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    ItemName: {
        type: String,
        required: true
    },
    Description: {
        type: String,
        required: true
    },
    Category: {
        type: String,
        required: true
    },
    Location: {
        type: String,
        required: true
    },
    DateLost: {
        type: Date,
        required: true
    },
    ContactInfo: {
        type: String,
        required: true
    },
    Status: {
        type: String,
        required: true
    },
    CreatedAt: { type: Date, default: Date.now },
    image: { type: String },
    latitude: { type: Number, required: false },
    longitude: { type: Number, required: false },
    locationPoint: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], default: undefined }
    }
});

// Add index for geospatial queries
lostItemSchema.index({ locationPoint: '2dsphere' });

const LostItem = mongoose.model("LostItem", lostItemSchema);
module.exports = LostItem;
