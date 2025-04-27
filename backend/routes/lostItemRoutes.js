const express = require('express');
const router = express.Router();
const lostItemController = require('../controllers/lostItemPost');
const upload = require('../middleware/upload');

// Post a lost item
router.post('/post', upload.single('image'), lostItemController.postLostItem);

// Get all lost items
router.get('/items', lostItemController.getLostItems);

// Get a specific lost item
router.get('/items/:id', lostItemController.getLostItem);

// Update a lost item
router.put('/items/:id', upload.single('image'), lostItemController.updateLostItem);

// Delete a lost item
router.delete('/items/:id', lostItemController.deleteLostItem);

module.exports = router; 