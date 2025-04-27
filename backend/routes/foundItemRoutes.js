const express = require('express');
const router = express.Router();
const foundItemController = require('../controllers/foundItemPost');
const upload = require('../middleware/upload');

// Post a found item
router.post('/post', upload.single('image'), foundItemController.postFoundItem);

// Get all found items
router.get('/items', foundItemController.getFoundItems);

// Get a specific found item
router.get('/items/:id', foundItemController.getFoundItem);

// Update a found item
router.put('/items/:id', upload.single('image'), foundItemController.updateFoundItem);

// Delete a found item
router.delete('/items/:id', foundItemController.deleteFoundItem);

module.exports = router; 