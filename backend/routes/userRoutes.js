const express = require('express');
const router = express.Router();
const { registerUser, signInUser, userVerification } = require('../controllers/userSignUp.js');

// Authentication routes
router.post('/register', registerUser);
router.post('/signin', signInUser);
router.post('/verify', userVerification);

module.exports = router; 