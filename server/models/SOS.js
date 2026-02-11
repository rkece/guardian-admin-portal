const mongoose = require('mongoose');

const sosSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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
            type: String
        }
    },
    status: {
        type: String,
        enum: ['active', 'resolved', 'false-alarm'],
        default: 'active'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'critical'
    },
    source: {
        type: String,
        enum: ['web', 'hardware', 'mobile'],
        default: 'web'
    },
    deviceId: {
        type: String
    },
    notifiedContacts: [{
        contactId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'EmergencyContact'
        },
        notifiedAt: Date,
        status: {
            type: String,
            enum: ['sent', 'delivered', 'failed'],
            default: 'sent'
        }
    }],
    notifiedHelpCenters: [{
        helpCenterId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'HelpCenter'
        },
        distance: Number,
        notifiedAt: Date,
        responseStatus: {
            type: String,
            enum: ['pending', 'acknowledged', 'dispatched', 'arrived'],
            default: 'pending'
        }
    }],
    resolvedAt: Date,
    resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    notes: String
}, {
    timestamps: true
});

// Index for geospatial queries
sosSchema.index({ 'location.latitude': 1, 'location.longitude': 1 });
sosSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('SOS', sosSchema);
