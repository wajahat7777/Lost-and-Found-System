const express = require('express');
const router = express.Router();
const claimController = require('../controllers/claimController');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth'); // your existing auth middleware

router.post('/', auth, upload.single('proofFile'), claimController.createClaim);
router.get('/finder', auth, claimController.getFinderClaims);
router.patch('/:claimId', auth, claimController.updateClaimStatus);
router.get('/mine', auth, claimController.getMyClaims);

module.exports = router;