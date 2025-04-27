const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'FoundItem', required: true },
  claimantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  finderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  proofText: { type: String },
  proofFile: { type: String }, // URL if file uploaded
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  decisionAt: { type: Date }
});

module.exports = mongoose.model('Claim', claimSchema);