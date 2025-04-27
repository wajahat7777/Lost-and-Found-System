const jwt = require('jsonwebtoken');
const FoundItem = require("../models/foundItemModel");
const User = require("../models/userRegModel");
const mongoose = require('mongoose');

exports.postFoundItem = async (req, res) => {
    console.log('PostFoundItem controller called');

    // Check database connection
    if (mongoose.connection.readyState !== 1) {
        console.error('Database not connected');
        return res.status(500).json({ message: "Database connection error" });
    }

    try {
        // Get token from header
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            console.log('No token provided');
            return res.status(401).json({ message: "Authentication required. Please log in." });
        }

        // Verify token
        let decodedToken;
        try {
            decodedToken = jwt.verify(token, '22I-1134');
        } catch (error) {
            console.log('Invalid token:', error);
            return res.status(401).json({ message: "Invalid or expired session. Please log in again." });
        }

        console.log('Request body:', JSON.stringify(req.body, null, 2));
        
        // Check if request body is empty
        if (!req.body || Object.keys(req.body).length === 0) {
            console.error('Empty request body');
            return res.status(400).json({ message: "Request body is empty" });
        }

        const { email, itemName, description, category, location, dateFound, contactInfo, latitude, longitude } = req.body;

        // Verify that the email in the request matches the logged-in user's email
        if (email.toLowerCase() !== decodedToken.email.toLowerCase()) {
            console.log('Email mismatch:', email, 'vs', decodedToken.email);
            return res.status(403).json({ 
                message: "You can only post items using your own email address." 
            });
        }

        // Validate required fields
        const requiredFields = {
            email: 'Email',
            itemName: 'Item name',
            description: 'Description',
            category: 'Category',
            location: 'Location',
            dateFound: 'Date found',
            contactInfo: 'Contact information'
        };

        const missingFields = Object.entries(requiredFields)
            .filter(([key]) => !req.body[key])
            .map(([_, label]) => label);

        if (missingFields.length > 0) {
            console.log('Missing fields:', missingFields);
            return res.status(400).json({
                message: 'Missing required fields',
                fields: missingFields
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.log('Invalid email format:', email);
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Validate date format and value
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(dateFound)) {
            console.log('Invalid date format:', dateFound);
            return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD' });
        }

        const parsedDate = new Date(dateFound);
        if (isNaN(parsedDate.getTime())) {
            console.log('Invalid date value:', dateFound);
            return res.status(400).json({ message: 'Invalid date value' });
        }

        console.log('Looking for user with email:', email.toLowerCase());
        // Validate user by email
        const user = await User.findOne({ Email: email.toLowerCase() });
        if (!user) {
            console.log('User not found:', email);
            return res.status(404).json({ message: "User not found. Please register first." });
        }

        // Create new found item
        const newFoundItem = new FoundItem({
            UserId: decodedToken.id,
            UserName: user.UserName,
            Email: email.toLowerCase(),
            ItemName: itemName,
            Description: description,
            Category: category,
            Location: location,
            DateFound: parsedDate,
            ContactInfo: contactInfo,
            Status: "active",
            latitude: latitude,
            longitude: longitude,
            locationPoint: (latitude && longitude) ? { type: 'Point', coordinates: [parseFloat(longitude), parseFloat(latitude)] } : undefined,
            image: req.file ? req.file.path : undefined // Add image URL from Cloudinary
        });

        // Save the item
        const savedItem = await newFoundItem.save();
        console.log('Item saved successfully:', savedItem);

        res.status(201).json({
            message: "Found item posted successfully",
            item: savedItem
        });

    } catch (error) {
        console.error('Error in postFoundItem:', error);
        res.status(500).json({ 
            message: "Error posting found item",
            error: error.message 
        });
    }
};