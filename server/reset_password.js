const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config({ path: './server/.env' });

const resetPassword = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('🔌 Connected to MongoDB');

        const email = 'mmrakeshkumar13@gmail.com';
        const user = await User.findOne({ email });

        if (user) {
            // Direct access to set password - will be hashed by pre-save hook in User model
            user.password = 'password123';
            await user.save();
            console.log(`✅ Success! Password for ${email} has been reset to: password123`);
        } else {
            console.log(`❌ User ${email} not found.`);
            // If not found, let's create it to be safe
            await User.create({
                name: 'Rakesh Kumar',
                email: email,
                password: 'password123',
                phone: '8838586580',
                role: 'user',
                bloodGroup: 'O+',
                address: 'India',
                isActive: true
            });
            console.log(`✅ Created new user ${email} with password: password123`);
        }

        process.exit();
    } catch (error) {
        console.error('❌ Error resetting password:', error);
        process.exit(1);
    }
};

resetPassword();
