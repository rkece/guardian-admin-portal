const EmergencyContact = require('../models/EmergencyContact');

// @desc    Get all emergency contacts
// @route   GET /api/contacts
// @access  Private
exports.getContacts = async (req, res) => {
    try {
        const contacts = await EmergencyContact.find({
            userId: req.user.id,
            isActive: true
        }).sort({ priority: 1 });

        res.json({
            success: true,
            count: contacts.length,
            data: contacts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching contacts',
            error: error.message
        });
    }
};

// @desc    Add emergency contact
// @route   POST /api/contacts
// @access  Private
exports.addContact = async (req, res) => {
    try {
        const { name, phone, email, relationship, priority } = req.body;

        const contact = await EmergencyContact.create({
            userId: req.user.id,
            name,
            phone,
            email,
            relationship,
            priority
        });

        res.status(201).json({
            success: true,
            message: 'Emergency contact added successfully',
            data: contact
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error adding contact',
            error: error.message
        });
    }
};

// @desc    Update emergency contact
// @route   PUT /api/contacts/:id
// @access  Private
exports.updateContact = async (req, res) => {
    try {
        const { name, phone, email, relationship, priority } = req.body;

        const contact = await EmergencyContact.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { name, phone, email, relationship, priority },
            { new: true, runValidators: true }
        );

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        res.json({
            success: true,
            message: 'Contact updated successfully',
            data: contact
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating contact',
            error: error.message
        });
    }
};

// @desc    Delete emergency contact
// @route   DELETE /api/contacts/:id
// @access  Private
exports.deleteContact = async (req, res) => {
    try {
        const contact = await EmergencyContact.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { isActive: false },
            { new: true }
        );

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        res.json({
            success: true,
            message: 'Contact deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting contact',
            error: error.message
        });
    }
};
