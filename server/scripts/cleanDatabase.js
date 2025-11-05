const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cmis';

async function cleanDatabase() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Get the database
        const db = mongoose.connection.db;
        
        // Drop the students collection to remove corrupted data
        try {
            await db.collection('students').drop();
            console.log('Students collection dropped successfully');
        } catch (error) {
            if (error.message.includes('ns not found')) {
                console.log('Students collection does not exist, nothing to drop');
            } else {
                console.error('Error dropping students collection:', error.message);
            }
        }

        // Also check and clean any other collections that might have issues
        const collections = await db.listCollections().toArray();
        console.log('Available collections:', collections.map(c => c.name));

        console.log('Database cleanup completed successfully');
        
    } catch (error) {
        console.error('Database cleanup failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit(0);
    }
}

cleanDatabase();