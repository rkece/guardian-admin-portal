const express = require('express');
const router = express.Router();
const sosController = require('../controllers/sosController');
const { protect } = require('../middleware/auth');

router.post('/trigger', protect, sosController.triggerSOS);
router.get('/my-alerts', protect, sosController.getMyAlerts);
router.get('/:id', protect, sosController.getSOSById);
router.put('/:id/resolve', protect, sosController.resolveAlert);

module.exports = router;
