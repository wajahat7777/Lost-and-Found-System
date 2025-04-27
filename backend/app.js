//Requiring the libraries used
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
const connectDB = require('./database.js');

// Import routes
const userRoutes = require('./routes/userRoutes');
// const messageRoutes = require('./routes/messageRoutes'); // Removed messageRoutes import
const lfmsRoutes = require('./routes/lfmsRouters');
const searchRoutes = require('./routes/searchRoutes');

const claimRoutes = require('./routes/claimRoutes');

// Middleware for parsing JSON bodies
app.use(express.json());

// Middleware for parsing URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Detailed request logging middleware
app.use((req, res, next) => {
    console.log('--------------------');
    console.log('New Request:');
    console.log('Time:', new Date().toISOString());
    console.log('Method:', req.method);
    console.log('URL:', req.url);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    console.log('--------------------');
    next();
});

// CORS configuration
app.use(cors({
    origin: 'http://localhost:3000', // Allow frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
}));

dotenv.config();

// Connect to database
connectDB();

// Mount routes
app.use('/api/users', userRoutes);
// app.use('/api/messages', messageRoutes); // Removed messageRoutes mounting
app.use('/api/lfms', lfmsRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/claims', claimRoutes);


// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(500).json({
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

module.exports = app;