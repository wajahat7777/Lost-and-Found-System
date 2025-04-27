const express = require('express');
const router = express.Router();
const { searchItems, searchNearbyItems } = require('../controllers/searchItems.js');

// Search routes
router.get('/', searchItems);
router.get('/nearby', searchNearbyItems);

module.exports = router; 