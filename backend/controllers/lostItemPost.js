const jwt = require('jsonwebtoken');
const LostItem = require("../models/lostItemModel");
const User = require("../models/userRegModel");

exports.postLostItem = async (req, res) => {
    try {
        const {  email,itemName, description, category, location, dateLost, contactInfo } = req.body;

        if (!itemName || !description || !category || !location || !dateLost || !contactInfo || !email) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Validate user by email
        const user = await User.findOne({ Email: email.toLowerCase() });
        if (!user) {
            return res.status(400).json({ message: "User with this email does not exist." });
        }

        // Create lost item
        const newLostItem = new LostItem({
            UserName: user.UserName,
            Email: email.toLowerCase(),
            ItemName:itemName,
            Description:description,
            Category:category,
            Location:location,
            DateLost:dateLost,
            ContactInfo:contactInfo,
            Status:"lost"
        });

        await newLostItem.save();
        return res.status(201).json({ message: "Lost item reported successfully!", lostItem: newLostItem });

    } catch (error) {
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
};
