const SOS = require('../models/SOS');
const User = require('../models/User');
const EmergencyContact = require('../models/EmergencyContact');
const HelpCenter = require('../models/HelpCenter');

// Calculate distance between two coordinates
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

// Find nearest help centers
const findNearestHelpCenters = async (latitude, longitude, maxDistance = 10) => {
    const allHelpCenters = await HelpCenter.find({ isActive: true });

    const centersWithDistance = allHelpCenters.map(center => ({
        center,
        distance: calculateDistance(
            latitude,
            longitude,
            center.location.latitude,
            center.location.longitude
        )
    }));

    return centersWithDistance
        .filter(item => item.distance <= maxDistance)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 5);
};

// @desc    Hardware SOS trigger
// @route   POST /api/hardware/sos
// @access  Public (for IoT devices)
exports.hardwareSOS = async (req, res) => {
    try {
        const { deviceId, latitude, longitude, timestamp } = req.body;

        // Validate required fields
        if (!deviceId || !latitude || !longitude) {
            return res.status(400).json({
                success: false,
                message: 'Device ID and location coordinates are required'
            });
        }

        // Find user by device ID
        const user = await User.findOne({ deviceId });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Device not registered to any user'
            });
        }

        // Create SOS alert
        const sos = await SOS.create({
            userId: user._id,
            location: {
                latitude,
                longitude
            },
            source: 'hardware',
            deviceId,
            priority: 'critical'
        });

        // Get emergency contacts
        const contacts = await EmergencyContact.find({
            userId: user._id,
            isActive: true
        }).sort({ priority: 1 });

        // Find nearest help centers
        const nearestCenters = await findNearestHelpCenters(latitude, longitude);

        // Update SOS with notifications
        sos.notifiedContacts = contacts.map(contact => ({
            contactId: contact._id,
            notifiedAt: new Date(),
            status: 'sent'
        }));

        sos.notifiedHelpCenters = nearestCenters.map(item => ({
            helpCenterId: item.center._id,
            distance: item.distance,
            notifiedAt: new Date(),
            responseStatus: 'pending'
        }));

        await sos.save();

        // Emit real-time alert
        const io = req.app.get('io');
        io.emit('new-sos-alert', {
            sosId: sos._id,
            source: 'hardware',
            deviceId,
            user: {
                id: user._id,
                name: user.name,
                phone: user.phone
            },
            location: {
                latitude,
                longitude
            },
            timestamp: sos.createdAt
        });

        console.log(`🚨 Hardware SOS triggered by device ${deviceId} for user ${user.name}`);

        res.status(201).json({
            success: true,
            message: 'Hardware SOS alert triggered successfully',
            data: {
                sosId: sos._id,
                contactsNotified: contacts.length,
                helpCentersNotified: nearestCenters.length
            }
        });
    } catch (error) {
        console.error('Hardware SOS error:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing hardware SOS',
            error: error.message
        });
    }
};

// @desc    Register hardware device
// @route   POST /api/hardware/register
// @access  Public
exports.registerDevice = async (req, res) => {
    try {
        const { deviceId, userId } = req.body;

        if (!deviceId || !userId) {
            return res.status(400).json({
                success: false,
                message: 'Device ID and User ID are required'
            });
        }

        // Update user with device ID
        const user = await User.findByIdAndUpdate(
            userId,
            { deviceId },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'Device registered successfully',
            data: {
                deviceId,
                userId: user._id,
                userName: user.name
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error registering device',
            error: error.message
        });
    }
};

// @desc    Device heartbeat
// @route   POST /api/hardware/heartbeat
// @access  Public
exports.deviceHeartbeat = async (req, res) => {
    try {
        const { deviceId, latitude, longitude, batteryLevel } = req.body;

        const user = await User.findOne({ deviceId });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Device not found'
            });
        }

        // Update last location
        if (latitude && longitude) {
            user.lastLocation = {
                latitude,
                longitude,
                timestamp: new Date()
            };
            await user.save();
        }

        res.json({
            success: true,
            message: 'Heartbeat received',
            data: {
                deviceId,
                timestamp: new Date()
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error processing heartbeat',
            error: error.message
        });
    }
};
