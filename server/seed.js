const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const HelpCenter = require('./models/HelpCenter');

dotenv.config({ path: './server/.env' });

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('🔌 Connected to MongoDB');

        // 1. Create a Test User
        const userEmail = 'test@guardian.com';
        const userExists = await User.findOne({ email: userEmail });

        if (!userExists) {
            await User.create({
                name: 'Jane Doe',
                email: userEmail,
                password: 'password123', // Will be hashed by pre-save hook
                phone: '+1234567890',
                role: 'user',
                bloodGroup: 'O+',
                address: '123 Safety St, Secure City'
            });
            console.log('✅ Created User: test@guardian.com / password123');
        } else {
            console.log('ℹ️ User already exists');
        }

        // 2. Create an Admin User
        const adminEmail = 'admin@guardian.com';
        const adminExists = await User.findOne({ email: adminEmail });

        if (!adminExists) {
            await User.create({
                name: 'System Admin',
                email: adminEmail,
                password: 'admin123',
                phone: '+9876543210',
                role: 'admin'
            });
            console.log('✅ Created Admin: admin@guardian.com / admin123');
        } else {
            console.log('ℹ️ Admin already exists');
        }

        // 3. Create a User with the name "user" (based on your probable attempt)
        const simpleUserEmail = 'user@gmail.com'; // Common test email
        const simpleUserExists = await User.findOne({ email: simpleUserEmail });

        if (!simpleUserExists) {
            await User.create({
                name: 'Test User',
                email: simpleUserEmail,
                password: 'user123',
                phone: '9999999999',
                role: 'user'
            });
            console.log('✅ Created Simple User: user@gmail.com / user123');
        }

        // 4. Seed some Help Centers if empty
        const helpCentersCount = await HelpCenter.countDocuments();
        if (helpCentersCount === 0) {
            await HelpCenter.create([
                {
                    name: 'City General Hospital',
                    type: 'hospital',
                    location: { latitude: 51.505, longitude: -0.09, address: 'Central District' },
                    contact: { phone: '102' }
                },
                {
                    name: 'Central Police Station',
                    type: 'police',
                    location: { latitude: 51.51, longitude: -0.1, address: 'Police Plaza' },
                    contact: { phone: '100' }
                }
            ]);
            console.log('✅ Seeded Help Centers');
        }

        console.log('🌱 Database Seeding Completed!');
        process.exit();
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedData();
