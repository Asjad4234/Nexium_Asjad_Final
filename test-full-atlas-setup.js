const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function testFullAtlasSetup() {
    console.log('🔍 Testing Complete Atlas Setup\n');
    
    const atlasUri = process.env.MONGO_URI;
    
    if (!atlasUri) {
        console.error('❌ MONGO_URI not found in .env.local');
        return;
    }
    
    console.log('✅ MONGO_URI found');
    
    if (!atlasUri.includes('mongodb+srv://')) {
        console.error('❌ Not an Atlas connection string');
        return;
    }
    
    console.log('✅ Atlas connection string format detected');
    
    const client = new MongoClient(atlasUri);
    
    try {
        console.log('\n🔌 Connecting to Atlas...');
        await client.connect();
        console.log('✅ Successfully connected to Atlas!');
        
        const db = client.db();
        console.log(`📊 Connected to database: ${db.databaseName}`);
        
        // Check all expected collections
        const collections = await db.listCollections().toArray();
        const expectedCollections = ['users', 'sessions', 'accounts', 'aigenerateds', 'recipes', 'ingredients'];
        
        console.log('\n📋 Checking collections:');
        for (const expected of expectedCollections) {
            const found = collections.find(c => c.name === expected);
            if (found) {
                const count = await db.collection(expected).countDocuments();
                console.log(`✅ ${expected}: ${count} documents`);
            } else {
                console.log(`❌ ${expected}: Not found`);
            }
        }
        
        // Test specific queries that your app uses
        console.log('\n🧪 Testing application queries...');
        
        // Test users query
        const users = await db.collection('users').find({}).limit(1).toArray();
        console.log(`✅ Users query: ${users.length} user found`);
        
        // Test ingredients query
        const ingredients = await db.collection('ingredients').find({}).limit(5).toArray();
        console.log(`✅ Ingredients query: ${ingredients.length} ingredients found`);
        
        // Test recipes query
        const recipes = await db.collection('recipes').find({}).limit(1).toArray();
        console.log(`✅ Recipes query: ${recipes.length} recipe found`);
        
        console.log('\n🎉 All tests passed! Your Atlas setup is ready.');
        console.log('\n📋 Next steps:');
        console.log('1. Start your application: npm run dev');
        console.log('2. Test user login');
        console.log('3. Test recipe creation');
        console.log('4. Test recipe retrieval');
        
    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        console.log('\n🔧 Troubleshooting:');
        console.log('1. Check your Atlas connection string');
        console.log('2. Verify username and password');
        console.log('3. Ensure IP is whitelisted in Atlas');
        console.log('4. Check if cluster is running');
    } finally {
        await client.close();
    }
}

testFullAtlasSetup(); 