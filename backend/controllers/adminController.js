const LostItem = require('../models/lostItemModel');
const FoundItem = require('../models/foundItemModel');
const User = require('../models/userRegModel');
const Claim = require('../models/claimModel');

// Get all items (lost + found)
exports.getAllItems = async (req, res) => {
    try {
        const lostItems = await LostItem.find();
        const foundItems = await FoundItem.find();
        // Add a type field for clarity
        const allItems = [
            ...lostItems.map(item => ({ ...item.toObject(), type: 'lost' })),
            ...foundItems.map(item => ({ ...item.toObject(), type: 'found' }))
        ];
        res.json(allItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all claims
exports.getAllClaims = async (req, res) => {
    try {
        const claims = await Claim.find()
            .populate('itemId')
            .populate('claimantId')
            .populate('finderId');
        res.json(claims);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get analytics
exports.getAnalytics = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalLostItems = await LostItem.countDocuments();
        const totalFoundItems = await FoundItem.countDocuments();
        const activeClaims = await Claim.countDocuments({ status: 'approved' });
        const pendingItems = await Claim.countDocuments({ status: 'pending' });

        res.json({
            totalUsers,
            totalLostItems,
            totalFoundItems,
            activeClaims,
            pendingItems
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Simple admin login (no security, just for UI testing)
exports.login = (req, res) => {
    const { email, password } = req.body;
    if (email === 'admin@admin.com' && password === 'iamadmin') {
        return res.json({ success: true });
    } else {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
};
// Delete a user
exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.userId);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete an item (from both lost and found collections)
exports.deleteItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        // Try to delete from both collections
        await LostItem.findByIdAndDelete(itemId);
        await FoundItem.findByIdAndDelete(itemId);
        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update claim status
exports.updateClaimStatus = async (req, res) => {
    try {
        const { claimId } = req.params;
        const { status } = req.body;
        const claim = await Claim.findByIdAndUpdate(
            claimId,
            { status },
            { new: true }
        );
        res.json(claim);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalLostItems = await LostItem.countDocuments();
        const totalFoundItems = await FoundItem.countDocuments();
        const activeClaims = await Claim.countDocuments({ status: 'approved' });
        const pendingItems = await Claim.countDocuments({ status: 'pending' });

        res.json({
            totalUsers,
            totalLostItems,
            totalFoundItems,
            activeClaims,
            pendingItems
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a user
exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.userId);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete an item (from both lost and found collections)
exports.deleteItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        // Try to delete from both collections
        await LostItem.findByIdAndDelete(itemId);
        await FoundItem.findByIdAndDelete(itemId);
        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};