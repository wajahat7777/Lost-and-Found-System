const mongoose = require("mongoose");

const foundItemSchema = new mongoose.Schema({
    UserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    UserName: { type: String, required: true },  // Person who found the item
    Email: { type: String, required: true },  // Finder's email
    ItemName: { type: String, required: true },
    Description: { type: String, required: true },
    Category: { type: String, required: true },
    Location: { type: String, required: true },
    DateFound: { type: Date, required: true },
    ContactInfo: { type: String, required: true },
    Status: { type: String, required: true },
    CreatedAt: { type: Date, default: Date.now },
    image: { type: String },  // Path/URL to the uploaded image
    latitude: { type: Number, required: false },
    longitude: { type: Number, required: false },
    locationPoint: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], default: undefined }
    }
});

// Add index for geospatial queries
foundItemSchema.index({ locationPoint: '2dsphere' });

const FoundItem = mongoose.model("FoundItem", foundItemSchema);
module.exports = FoundItem;
