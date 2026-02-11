const mongoose = require('mongoose');

const emergencyContactSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Contact name is required'],
        trim: true
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    relationship: {
        type: String,
        enum: ['family', 'friend', 'colleague', 'other'],
        default: 'other'
    },
    priority: {
        type: Number,
        default: 1,
        min: 1,
        max: 5
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for quick lookups
emergencyContactSchema.index({ userId: 1, priority: 1 });

module.exports = mongoose.model('EmergencyContact', emergencyContactSchema);
