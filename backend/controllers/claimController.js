const Claim = require('../models/claimModel');
const FoundItem = require('../models/foundItemModel');
const mongoose = require('mongoose');

// User submits a claim
exports.createClaim = async (req, res) => {
  console.log('--- createClaim controller called ---');
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);
  console.log('Request file:', req.file);
  
  try {
    const { itemId, proofText } = req.body;

    // Validate required fields
    if (!itemId || !proofText) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        details: {
          itemId: !itemId ? 'Item ID is required' : null,
          proofText: !proofText ? 'Proof description is required' : null
        }
      });
    }

    // Convert itemId to ObjectId
    let itemObjectId;
    try {
      itemObjectId = new mongoose.Types.ObjectId(itemId);
    } catch (err) {
      console.error('Invalid ObjectId format:', err);
      return res.status(400).json({ 
        message: 'Invalid item ID format',
        details: { itemId: 'Must be a valid MongoDB ObjectId' }
      });
    }

    console.log('Searching for item with ID:', itemObjectId);
    
    // Debug: List all items in the database
    const allItems = await FoundItem.find({}, '_id ItemName');
    console.log('All items in database:', allItems);
    
    // Try to find the specific item
    const foundItem = await FoundItem.findById(itemObjectId);
    console.log('Found item:', foundItem);

    if (!foundItem) {
      console.log('Item not found in database');
      // Try to find the item using a string query
      const itemByString = await FoundItem.findOne({ _id: itemId });
      console.log('Item found by string query:', itemByString);
      
      return res.status(404).json({ 
        message: 'Item not found',
        details: { 
          itemId: 'No item exists with this ID',
          searchedId: itemId,
          allItems: allItems.map(item => ({ id: item._id, name: item.ItemName }))
        }
      });
    }

    // Check if item is already claimed
    const existingClaim = await Claim.findOne({ 
      itemId: itemObjectId, 
      $or: [
        { status: 'pending' },
        { status: 'approved' }
      ]
    });

    if (existingClaim) {
      return res.status(409).json({ 
        message: 'Item already has an active claim',
        details: { 
          claimStatus: existingClaim.status,
          claimDate: existingClaim.createdAt
        }
      });
    }

    // Check if user is trying to claim their own item
    if (foundItem.UserId.toString() === req.user.id) {
      return res.status(403).json({ 
        message: 'Cannot claim your own item',
        details: { userId: 'You are the finder of this item' }
      });
    }

    const proofFile = req.file ? req.file.path : undefined;

    const claim = await Claim.create({
      itemId: itemObjectId,
      claimantId: req.user.id,
      finderId: foundItem.UserId,
      proofText: proofText.trim(),
      proofFile
    });

    // Populate the response with item and user details
    await claim.populate(['itemId', 'claimantId']);

    res.status(201).json({ 
      message: 'Claim submitted successfully',
      claim 
    });

  } catch (err) {
    console.error('Error in createClaim:', err);
    res.status(500).json({ 
      message: 'Server error while processing claim',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Finder fetches claims for their items
exports.getFinderClaims = async (req, res) => {
  try {
    const claims = await Claim.find({ finderId: req.user.id })
      .populate('itemId')
      .populate('claimantId', '-Password')
      .sort({ createdAt: -1 });

    res.json({ 
      message: 'Claims retrieved successfully',
      claims 
    });
  } catch (err) {
    console.error('Error in getFinderClaims:', err);
    res.status(500).json({ 
      message: 'Server error while fetching claims',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Finder approves/rejects a claim
exports.updateClaimStatus = async (req, res) => {
  try {
    const { claimId } = req.params;
    const { status } = req.body;

    // Validate status
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status',
        details: { status: 'Status must be either "approved" or "rejected"' }
      });
    }

    // Validate claimId format
    if (!mongoose.Types.ObjectId.isValid(claimId)) {
      return res.status(400).json({ 
        message: 'Invalid claim ID format',
        details: { claimId: 'Must be a valid MongoDB ObjectId' }
      });
    }

    const claim = await Claim.findById(claimId);
    
    if (!claim) {
      return res.status(404).json({ 
        message: 'Claim not found',
        details: { claimId: 'No claim exists with this ID' }
      });
    }

    if (claim.finderId.toString() !== req.user.id) {
      return res.status(403).json({ 
        message: 'Not authorized',
        details: { userId: 'You are not the finder of this item' }
      });
    }

    if (claim.status !== 'pending') {
      return res.status(409).json({ 
        message: 'Claim already processed',
        details: { 
          currentStatus: claim.status,
          decisionDate: claim.decisionAt
        }
      });
    }

    claim.status = status;
    claim.decisionAt = new Date();
    await claim.save();

    // If claim is approved, update the found item status
    if (status === 'approved') {
      const foundItem = await FoundItem.findById(claim.itemId);
      if (foundItem) {
        foundItem.Status = 'claimed';
        await foundItem.save();
      }
    }

    // Populate the response with item and user details
    await claim.populate(['itemId', 'claimantId']);

    res.json({ 
      message: `Claim ${status} successfully`,
      claim 
    });
  } catch (err) {
    console.error('Error in updateClaimStatus:', err);
    res.status(500).json({ 
      message: 'Server error while updating claim',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// User fetches their own claims
exports.getMyClaims = async (req, res) => {
  try {
    const claims = await Claim.find({ claimantId: req.user.id })
      .populate('itemId')
      .populate('finderId', '-Password')
      .sort({ createdAt: -1 });

    res.json({ 
      message: 'Claims retrieved successfully',
      claims 
    });
  } catch (err) {
    console.error('Error in getMyClaims:', err);
    res.status(500).json({ 
      message: 'Server error while fetching claims',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};