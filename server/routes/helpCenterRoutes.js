const express = require('express');
const router = express.Router();
const helpCenterController = require('../controllers/helpCenterController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', helpCenterController.getHelpCenters);
router.get('/nearby', helpCenterController.getNearbyHelpCenters);
router.post('/', protect, adminOnly, helpCenterController.addHelpCenter);
router.put('/:id', protect, adminOnly, helpCenterController.updateHelpCenter);
router.delete('/:id', protect, adminOnly, helpCenterController.deleteHelpCenter);

module.exports = router;
