const { MongoClient } = require('mongodb');

const localUri = 'mongodb://localhost:27017/nexium-recipes';

async function viewLocalData() {
    const client = new MongoClient(localUri);
    
    try {
        await client.connect();
        console.log('Connected to local MongoDB');
        
        const db = client.db('nexium-recipes');
        const collections = await db.listCollections().toArray();
        
        console.log('\n📊 Available Collections:');
        collections.forEach(collection => {
            console.log(`- ${collection.name}`);
        });
        
        // View data from each collection
        for (const collection of collections) {
            console.log(`\n📋 Collection: ${collection.name}`);
            const data = await db.collection(collection.name).find({}).toArray();
            console.log(`Records found: ${data.length}`);
            
            if (data.length > 0) {
                console.log('Sample data:');
                console.log(JSON.stringify(data[0], null, 2));
                
                if (data.length > 1) {
                    console.log('... and', data.length - 1, 'more records');
                }
            }
        }
        
    } catch (error) {
        console.error('Error connecting to local MongoDB:', error);
        console.log('\n💡 Make sure MongoDB is running locally:');
        console.log('1. Install MongoDB Community Server');
        console.log('2. Start MongoDB service');
        console.log('3. Or use Docker: docker run -d -p 27017:27017 --name mongodb mongo:latest');
    } finally {
        await client.close();
    }
}

viewLocalData(); 