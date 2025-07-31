const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function testAtlasConnection() {
    const atlasUri = process.env.MONGO_URI;
    
    if (!atlasUri) {
        console.error('❌ MONGO_URI not found in .env.local');
        console.log('💡 Make sure you have updated your .env.local file with your Atlas connection string');
        return;
    }
    
    if (!atlasUri.includes('mongodb+srv://')) {
        console.error('❌ MONGO_URI does not appear to be an Atlas connection string');
        console.log('💡 Atlas connection strings should start with mongodb+srv://');
        return;
    }
    
    const client = new MongoClient(atlasUri);
    
    try {
        console.log('🔌 Testing Atlas connection...');
        await client.connect();
        console.log('✅ Successfully connected to MongoDB Atlas!');
        
        const db = client.db();
        const collections = await db.listCollections().toArray();
        
        console.log('\n📊 Collections found in Atlas:');
        collections.forEach(collection => {
            console.log(`- ${collection.name}`);
        });
        
        // Check if all expected collections exist
        const expectedCollections = ['users', 'sessions', 'accounts', 'aigenerateds', 'recipes', 'ingredients'];
        const foundCollections = collections.map(c => c.name);
        
        console.log('\n🔍 Checking for expected collections:');
        expectedCollections.forEach(collection => {
            if (foundCollections.includes(collection)) {
                console.log(`✅ ${collection}`);
            } else {
                console.log(`❌ ${collection} (not found)`);
            }
        });
        
        // Count documents in each collection
        console.log('\n📈 Document counts:');
        for (const collection of collections) {
            const count = await db.collection(collection.name).countDocuments();
            console.log(`- ${collection.name}: ${count} documents`);
        }
        
    } catch (error) {
        console.error('❌ Failed to connect to Atlas:', error.message);
        console.log('\n🔧 Troubleshooting tips:');
        console.log('1. Check your connection string in .env.local');
        console.log('2. Verify your username and password');
        console.log('3. Ensure your IP is whitelisted in Atlas');
        console.log('4. Check if your cluster is running');
    } finally {
        await client.close();
    }
}

testAtlasConnection(); 