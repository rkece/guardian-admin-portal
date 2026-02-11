const SOS = require('../models/SOS');
const EmergencyContact = require('../models/EmergencyContact');
const HelpCenter = require('../models/HelpCenter');
const User = require('../models/User');

// Calculate distance between two coordinates (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
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

    // Filter and sort by distance
    return centersWithDistance
        .filter(item => item.distance <= maxDistance)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 5); // Get top 5 nearest
};

// @desc    Trigger SOS alert
// @route   POST /api/sos/trigger
// @access  Private
exports.triggerSOS = async (req, res) => {
    try {
        const { latitude, longitude, address } = req.body;

        if (!latitude || !longitude) {
            return res.status(400).json({
                success: false,
                message: 'Location coordinates are required'
            });
        }

        // Create SOS alert
        const sos = await SOS.create({
            userId: req.user.id,
            location: {
                latitude,
                longitude,
                address
            },
            source: 'web',
            priority: 'critical'
        });

        // Get user's emergency contacts
        const contacts = await EmergencyContact.find({
            userId: req.user.id,
            isActive: true
        }).sort({ priority: 1 });

        // Notify emergency contacts
        const notifiedContacts = contacts.map(contact => ({
            contactId: contact._id,
            notifiedAt: new Date(),
            status: 'sent'
        }));

        // Find nearest help centers
        const nearestCenters = await findNearestHelpCenters(latitude, longitude);

        // Notify help centers
        const notifiedHelpCenters = nearestCenters.map(item => ({
            helpCenterId: item.center._id,
            distance: item.distance,
            notifiedAt: new Date(),
            responseStatus: 'pending'
        }));

        // Update SOS with notifications
        sos.notifiedContacts = notifiedContacts;
        sos.notifiedHelpCenters = notifiedHelpCenters;
        await sos.save();

        // Populate for response
        await sos.populate('userId', 'name email phone');
        await sos.populate('notifiedContacts.contactId');
        await sos.populate('notifiedHelpCenters.helpCenterId');

        // Emit real-time alert via Socket.io
        const io = req.app.get('io');
        io.emit('new-sos-alert', {
            sosId: sos._id,
            user: {
                id: req.user.id,
                name: req.user.name,
                phone: req.user.phone
            },
            location: {
                latitude,
                longitude,
                address
            },
            timestamp: sos.createdAt,
            nearestHelpCenters: nearestCenters.map(item => ({
                name: item.center.name,
                type: item.center.type,
                distance: item.distance.toFixed(2) + ' km'
            }))
        });

        res.status(201).json({
            success: true,
            message: 'SOS alert triggered successfully',
            data: {
                sos,
                contactsNotified: contacts.length,
                helpCentersNotified: nearestCenters.length,
                nearestHelpCenters: nearestCenters.map(item => ({
                    name: item.center.name,
                    type: item.center.type,
                    distance: item.distance.toFixed(2) + ' km',
                    phone: item.center.contact.phone
                }))
            }
        });
    } catch (error) {
        console.error('SOS trigger error:', error);
        res.status(500).json({
            success: false,
            message: 'Error triggering SOS alert',
            error: error.message
        });
    }
};

// @desc    Get my SOS alerts
// @route   GET /api/sos/my-alerts
// @access  Private
exports.getMyAlerts = async (req, res) => {
    try {
        const alerts = await SOS.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .populate('notifiedHelpCenters.helpCenterId', 'name type contact');

        res.json({
            success: true,
            count: alerts.length,
            data: alerts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching alerts',
            error: error.message
        });
    }
};

// @desc    Get SOS by ID
// @route   GET /api/sos/:id
// @access  Private
exports.getSOSById = async (req, res) => {
    try {
        const sos = await SOS.findById(req.params.id)
            .populate('userId', 'name email phone')
            .populate('notifiedContacts.contactId')
            .populate('notifiedHelpCenters.helpCenterId');

        if (!sos) {
            return res.status(404).json({
                success: false,
                message: 'SOS alert not found'
            });
        }

        res.json({
            success: true,
            data: sos
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching SOS alert',
            error: error.message
        });
    }
};

// @desc    Resolve SOS alert
// @route   PUT /api/sos/:id/resolve
// @access  Private
exports.resolveAlert = async (req, res) => {
    try {
        const { notes } = req.body;

        const sos = await SOS.findByIdAndUpdate(
            req.params.id,
            {
                status: 'resolved',
                resolvedAt: new Date(),
                resolvedBy: req.user.id,
                notes
            },
            { new: true }
        );

        if (!sos) {
            return res.status(404).json({
                success: false,
                message: 'SOS alert not found'
            });
        }

        // Emit resolution via Socket.io
        const io = req.app.get('io');
        io.emit('sos-resolved', {
            sosId: sos._id,
            resolvedBy: req.user.name,
            resolvedAt: sos.resolvedAt
        });

        res.json({
            success: true,
            message: 'SOS alert resolved successfully',
            data: sos
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error resolving alert',
            error: error.message
        });
    }
};
