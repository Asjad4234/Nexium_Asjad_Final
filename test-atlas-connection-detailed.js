const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function testAtlasConnectionDetailed() {
    const atlasUri = process.env.MONGO_URI;
    
    console.log('🔍 Atlas Connection Diagnostic Tool\n');
    
    // Check if MONGO_URI exists
    if (!atlasUri) {
        console.error('❌ MONGO_URI not found in .env.local');
        console.log('💡 Please add your Atlas connection string to .env.local');
        console.log('Example: MONGO_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/nexium-recipes');
        return;
    }
    
    console.log('✅ MONGO_URI found in .env.local');
    
    // Check if it's an Atlas connection string
    if (!atlasUri.includes('mongodb+srv://')) {
        console.error('❌ MONGO_URI does not appear to be an Atlas connection string');
        console.log('💡 Atlas connection strings should start with mongodb+srv://');
        console.log('Current URI starts with:', atlasUri.substring(0, 20) + '...');
        return;
    }
    
    console.log('✅ Connection string format appears correct');
    
    // Extract parts of the connection string for debugging
    try {
        const uriParts = atlasUri.replace('mongodb+srv://', '').split('@');
        const credentials = uriParts[0].split(':');
        const hostPart = uriParts[1].split('/')[0];
        
        console.log('📋 Connection String Analysis:');
        console.log(`- Username: ${credentials[0]}`);
        console.log(`- Password: ${credentials[1] ? '***' + credentials[1].slice(-4) : 'NOT SET'}`);
        console.log(`- Host: ${hostPart}`);
        console.log(`- Database: ${atlasUri.split('/').pop()}`);
    } catch (error) {
        console.log('⚠️ Could not parse connection string format');
    }
    
    const client = new MongoClient(atlasUri, {
        serverSelectionTimeoutMS: 10000, // 10 second timeout
        connectTimeoutMS: 10000,
    });
    
    try {
        console.log('\n🔌 Attempting to connect to Atlas...');
        console.log('⏳ This may take a few seconds...');
        
        await client.connect();
        console.log('✅ Successfully connected to MongoDB Atlas!');
        
        const db = client.db();
        console.log(`📊 Connected to database: ${db.databaseName}`);
        
        const collections = await db.listCollections().toArray();
        console.log(`📋 Found ${collections.length} collections:`);
        
        collections.forEach(collection => {
            console.log(`  - ${collection.name}`);
        });
        
        // Test a simple query
        console.log('\n🧪 Testing a simple query...');
        const result = await db.command({ ping: 1 });
        console.log('✅ Database ping successful:', result);
        
    } catch (error) {
        console.error('\n❌ Connection failed:', error.message);
        
        // Provide specific troubleshooting based on error type
        if (error.message.includes('ECONNREFUSED') || error.message.includes('ENOTFOUND')) {
            console.log('\n🔧 Troubleshooting Network Issues:');
            console.log('1. Check your internet connection');
            console.log('2. Verify the cluster hostname in your connection string');
            console.log('3. Check if your IP is whitelisted in Atlas Network Access');
            console.log('4. Try allowing "Access from Anywhere" temporarily');
        } else if (error.message.includes('Authentication failed')) {
            console.log('\n🔧 Troubleshooting Authentication Issues:');
            console.log('1. Verify your username and password');
            console.log('2. Check if the user exists in Atlas Database Access');
            console.log('3. Ensure the user has proper permissions');
            console.log('4. Try creating a new database user');
        } else if (error.message.includes('Server selection timed out')) {
            console.log('\n🔧 Troubleshooting Timeout Issues:');
            console.log('1. Check your internet connection');
            console.log('2. Verify the cluster is running in Atlas');
            console.log('3. Check if your IP is whitelisted');
            console.log('4. Try a different network (mobile hotspot)');
        }
        
        console.log('\n📞 Additional Help:');
        console.log('- Check Atlas cluster status in your dashboard');
        console.log('- Verify connection string in Atlas Connect dialog');
        console.log('- Try connecting from a different location/network');
    } finally {
        await client.close();
    }
}

testAtlasConnectionDetailed(); 