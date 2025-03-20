const jwt = require('jsonwebtoken');
const FoundItem = require("../models/foundItemModel.js");
const User = require("../models/userRegModel");

exports.postFoundItem = async (req, res) => {
    try {
        const { email, itemName, description,
            category, location, dateFound, contactInfo,
        } = req.body;
        if ( !email || !itemName || !description || !category || !location || !dateFound || !contactInfo) {
            return res.status(400).json({ message: "All fields must exist." });
        }
        const isUserExist = await User.findOne({ Email: email });
        if (!isUserExist) {
            return res.status(400).json({ message: "User with this email does not exist." });
        }
        const newFoundItem = new FoundItem({
            UserName: isUserExist.UserName,
            Email: isUserExist.Email,
            ItemName: itemName,
            Description: description,
            Category: category,
            Location: location,
            DateFound: dateFound,
            ContactInfo: contactInfo,
            Status:"found"
        });

        await newFoundItem.save();
        return res.status(201).json({ message: "Found item reported successfully!", foundItem: newFoundItem });

    } catch (error) {
        return res.status(500).json({ message: "Server Error", error: error.message });
    }

}