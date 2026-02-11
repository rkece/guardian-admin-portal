const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/dashboard', protect, adminOnly, adminController.getDashboardStats);
router.get('/alerts', protect, adminOnly, adminController.getAllAlerts);
router.get('/users', protect, adminOnly, adminController.getAllUsers);
router.put('/alerts/:id/status', protect, adminOnly, adminController.updateAlertStatus);

module.exports = router;
