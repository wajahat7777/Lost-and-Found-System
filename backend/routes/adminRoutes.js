const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
//const adminAuth = require('../middleware/adminAuth');

// Public routes
router.post('/login', adminController.login);


router.get('/dashboard/stats', adminController.getDashboardStats);
router.get('/users', adminController.getAllUsers);
router.get('/items', adminController.getAllItems);
router.get('/claims', adminController.getAllClaims);
router.delete('/users/:userId', adminController.deleteUser);
router.delete('/items/:itemId', adminController.deleteItem);
router.put('/claims/:claimId/status', adminController.updateClaimStatus);
router.get('/analytics', adminController.getAnalytics);
router.delete('/users/:userId', adminController.deleteUser);
router.delete('/items/:itemId', adminController.deleteItem);
module.exports = router; 