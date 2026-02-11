const mongoose = require('mongoose');

const helpCenterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Help center name is required'],
        trim: true
    },
    type: {
        type: String,
        enum: ['police', 'hospital', 'ngo', 'fire-station'],
        required: true
    },
    location: {
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        city: String,
        state: String,
        pincode: String
    },
    contact: {
        phone: {
            type: String,
            required: true
        },
        email: String,
        emergencyNumber: String
    },
    availability: {
        isOpen24x7: {
            type: Boolean,
            default: true
        },
        workingHours: {
            start: String,
            end: String
        }
    },
    capacity: {
        type: Number,
        default: 100
    },
    currentLoad: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 5,
        min: 0,
        max: 5
    },
    responseTime: {
        type: Number, // in minutes
        default: 10
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Geospatial index for finding nearby help centers
helpCenterSchema.index({ 'location.latitude': 1, 'location.longitude': 1 });

module.exports = mongoose.model('HelpCenter', helpCenterSchema);
