const express = require('express');
const { postLostItem } = require('../controllers/lostItemPost.js');
const { postFoundItem } = require('../controllers/foundItemPost.js');
const upload = require('../middleware/upload');
const router = express.Router();

// Lost Items
router.post('/post/lost', upload.single('image'), (req, res, next) => {
    console.log('Lost item route hit');
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    next();
}, postLostItem);

// Found Items
router.post('/post/found', upload.single('image'), (req, res, next) => {
    console.log('Found item route hit');
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    next();
}, postFoundItem);

module.exports = router;