const HelpCenter = require('../models/HelpCenter');

// Calculate distance
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

// @desc    Get all help centers
// @route   GET /api/help-centers
// @access  Public
exports.getHelpCenters = async (req, res) => {
    try {
        const { type } = req.query;
        const filter = { isActive: true };

        if (type) {
            filter.type = type;
        }

        const helpCenters = await HelpCenter.find(filter);

        res.json({
            success: true,
            count: helpCenters.length,
            data: helpCenters
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching help centers',
            error: error.message
        });
    }
};

// @desc    Get nearby help centers
// @route   GET /api/help-centers/nearby
// @access  Public
exports.getNearbyHelpCenters = async (req, res) => {
    try {
        const { latitude, longitude, maxDistance = 10 } = req.query;

        if (!latitude || !longitude) {
            return res.status(400).json({
                success: false,
                message: 'Latitude and longitude are required'
            });
        }

        const allHelpCenters = await HelpCenter.find({ isActive: true });

        const centersWithDistance = allHelpCenters.map(center => ({
            ...center.toObject(),
            distance: calculateDistance(
                parseFloat(latitude),
                parseFloat(longitude),
                center.location.latitude,
                center.location.longitude
            )
        }));

        const nearbyCenters = centersWithDistance
            .filter(center => center.distance <= parseFloat(maxDistance))
            .sort((a, b) => a.distance - b.distance);

        res.json({
            success: true,
            count: nearbyCenters.length,
            data: nearbyCenters
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching nearby help centers',
            error: error.message
        });
    }
};

// @desc    Add help center
// @route   POST /api/help-centers
// @access  Private/Admin
exports.addHelpCenter = async (req, res) => {
    try {
        const helpCenter = await HelpCenter.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Help center added successfully',
            data: helpCenter
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error adding help center',
            error: error.message
        });
    }
};

// @desc    Update help center
// @route   PUT /api/help-centers/:id
// @access  Private/Admin
exports.updateHelpCenter = async (req, res) => {
    try {
        const helpCenter = await HelpCenter.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!helpCenter) {
            return res.status(404).json({
                success: false,
                message: 'Help center not found'
            });
        }

        res.json({
            success: true,
            message: 'Help center updated successfully',
            data: helpCenter
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating help center',
            error: error.message
        });
    }
};

// @desc    Delete help center
// @route   DELETE /api/help-centers/:id
// @access  Private/Admin
exports.deleteHelpCenter = async (req, res) => {
    try {
        const helpCenter = await HelpCenter.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );

        if (!helpCenter) {
            return res.status(404).json({
                success: false,
                message: 'Help center not found'
            });
        }

        res.json({
            success: true,
            message: 'Help center deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting help center',
            error: error.message
        });
    }
};
