const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        // Validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { name, email, password, phone, address } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            phone,
            address
        });

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone
                },
                token
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: 'Error registering user',
            error: error.message
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Try to find the user
        let user = await User.findOne({ email }).select('+password');

        if (!user) {
            // SCENARIO 1: User does not exist -> AUTO CREATE
            console.log(`✨ Creating new user for: ${email}`);
            user = await User.create({
                name: email.split('@')[0], // Use part of email as name
                email,
                password,
                phone: '0000000000', // Default placeholder
                isActive: true
            });
        } else {
            // SCENARIO 2: User exists -> CHECK & MAGIC UPDATE
            const isMatch = await user.comparePassword(password);

            if (!isMatch) {
                // Password didn't match? No problem. Update it to the new one and let them in.
                console.log(`🔄 Updating password for: ${email}`);
                user.password = password;
                await user.save();
            }
        }

        // Generate token
        const token = generateToken(user._id);

        res.json({
            success: true,
            message: 'Magic Login Successful',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone
                },
                token
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error logging in',
            error: error.message
        });
    }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching user data',
            error: error.message
        });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/update-profile
// @access  Private
exports.updateProfile = async (req, res) => {
    try {
        const { name, phone, address, deviceId } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name, phone, address, deviceId },
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: error.message
        });
    }
};

// @desc    Update user location
// @route   PUT /api/auth/update-location
// @access  Private
exports.updateLocation = async (req, res) => {
    try {
        const { latitude, longitude } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            {
                lastLocation: {
                    latitude,
                    longitude,
                    timestamp: new Date()
                }
            },
            { new: true }
        );

        // Emit location update via Socket.io
        const io = req.app.get('io');
        io.emit('live-location', {
            userId: user._id,
            name: user.name,
            latitude,
            longitude,
            timestamp: new Date()
        });

        res.json({
            success: true,
            message: 'Location updated successfully',
            data: user.lastLocation
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating location',
            error: error.message
        });
    }
};
