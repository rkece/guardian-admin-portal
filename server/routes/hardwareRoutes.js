const express = require('express');
const router = express.Router();
const hardwareController = require('../controllers/hardwareController');

// Hardware device endpoints (no auth required for IoT devices)
router.post('/sos', hardwareController.hardwareSOS);
router.post('/register', hardwareController.registerDevice);
router.post('/heartbeat', hardwareController.deviceHeartbeat);

module.exports = router;
