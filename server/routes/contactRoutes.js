const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { protect } = require('../middleware/auth');

router.get('/', protect, contactController.getContacts);
router.post('/', protect, contactController.addContact);
router.put('/:id', protect, contactController.updateContact);
router.delete('/:id', protect, contactController.deleteContact);

module.exports = router;
