const User = require('../models/User');
const SOS = require('../models/SOS');
const HelpCenter = require('../models/HelpCenter');

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' });
        const activeAlerts = await SOS.countDocuments({ status: 'active' });
        const resolvedAlerts = await SOS.countDocuments({ status: 'resolved' });
        const helpCenters = await HelpCenter.countDocuments({ isActive: true });

        // Get recent alerts
        const recentAlerts = await SOS.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('userId', 'name')
            .select('status priority createdAt location');

        res.json({
            success: true,
            data: {
                stats: {
                    totalUsers,
                    activeAlerts,
                    resolvedAlerts,
                    helpCenters
                },
                recentAlerts
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching admin stats',
            error: error.message
        });
    }
};

// @desc    Get all alerts with filtering
// @route   GET /api/admin/alerts
// @access  Private/Admin
exports.getAllAlerts = async (req, res) => {
    try {
        const { status, priority, limit = 20, page = 1 } = req.query;

        const query = {};
        if (status) query.status = status;
        if (priority) query.priority = priority;

        const alerts = await SOS.find(query)
            .populate('userId', 'name email phone')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await SOS.countDocuments(query);

        res.json({
            success: true,
            data: {
                alerts,
                totalPages: Math.ceil(total / limit),
                currentPage: page
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching alerts',
            error: error.message
        });
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'user' })
            .select('-password')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message
        });
    }
};

// @desc    Update alert status
// @route   PUT /api/admin/alerts/:id/status
// @access  Private/Admin
exports.updateAlertStatus = async (req, res) => {
    try {
        const { status, notes } = req.body;

        const sos = await SOS.findByIdAndUpdate(
            req.params.id,
            {
                status,
                notes,
                ...(status === 'resolved' ? { resolvedAt: new Date(), resolvedBy: req.user.id } : {})
            },
            { new: true }
        );

        if (!sos) {
            return res.status(404).json({
                success: false,
                message: 'Alert not found'
            });
        }

        // Emit update via Socket.io
        const io = req.app.get('io');
        io.emit('alert-status-updated', {
            sosId: sos._id,
            status,
            updatedBy: req.user.name
        });

        res.json({
            success: true,
            message: 'Alert status updated',
            data: sos
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating alert status',
            error: error.message
        });
    }
};
