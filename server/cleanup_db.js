require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');

const cleanupDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB Atlas');

        const db = mongoose.connection.db;

        // Clean up Users collection
        console.log('\n🔧 Cleaning up Users collection...');
        const usersResult = await db.collection('users').updateMany(
            {},
            {
                $unset: {
                    role: "",
                    bloodGroup: "",
                    createdAt: "",
                    updatedAt: "",
                    __v: ""
                }
            }
        );
        console.log(`✅ Updated ${usersResult.modifiedCount} user documents`);

        // Clean up SOS collection (if needed)
        console.log('\n🔧 Cleaning up SOS collection...');
        const sosResult = await db.collection('sos').updateMany(
            {},
            {
                $unset: {
                    createdAt: "",
                    updatedAt: "",
                    __v: ""
                }
            }
        );
        console.log(`✅ Updated ${sosResult.modifiedCount} SOS documents`);

        // Clean up Help Centers collection (if needed)
        console.log('\n🔧 Cleaning up Help Centers collection...');
        const helpCentersResult = await db.collection('helpcenters').updateMany(
            {},
            {
                $unset: {
                    createdAt: "",
                    updatedAt: "",
                    __v: ""
                }
            }
        );
        console.log(`✅ Updated ${helpCentersResult.modifiedCount} help center documents`);

        // Clean up Emergency Contacts collection (if needed)
        console.log('\n🔧 Cleaning up Emergency Contacts collection...');
        const contactsResult = await db.collection('emergencycontacts').updateMany(
            {},
            {
                $unset: {
                    createdAt: "",
                    updatedAt: "",
                    __v: ""
                }
            }
        );
        console.log(`✅ Updated ${contactsResult.modifiedCount} emergency contact documents`);

        console.log('\n✨ Database cleanup completed successfully!');

        // Show sample user after cleanup
        const sampleUser = await db.collection('users').findOne({});
        console.log('\n📄 Sample user document after cleanup:');
        console.log(JSON.stringify(sampleUser, null, 2));

    } catch (error) {
        console.error('❌ Error during cleanup:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 Database connection closed');
        process.exit(0);
    }
};

cleanupDatabase();
