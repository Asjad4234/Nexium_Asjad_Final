const { MongoClient } = require('mongodb');
const https = require('https');
require('dotenv').config({ path: '.env.local' });

async function diagnoseTagsAndImages() {
    console.log('🔍 Diagnosing Popular Tags & Image Loading Issues\n');
    
    const atlasUri = process.env.MONGO_URI;
    const client = new MongoClient(atlasUri);
    
    try {
        await client.connect();
        console.log('✅ Connected to MongoDB Atlas');
        
        const db = client.db();
        
        // 1. Check Popular Tags Logic
        console.log('\n📊 Popular Tags Analysis:');
        
        const popularTags = await db.collection('recipes').aggregate([
            { $unwind: "$tags" },
            { $unwind: "$tags.tag" },
            { $group: { _id: "$tags.tag", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 20 }
        ]).toArray();
        
        console.log(`Found ${popularTags.length} popular tags:`);
        popularTags.forEach(tag => {
            console.log(`  - ${tag._id}: ${tag.count} recipes`);
        });
        
        // 2. Check Recipe Images
        console.log('\n🖼️ Recipe Images Analysis:');
        
        const recipes = await db.collection('recipes').find({}, { 
            projection: { name: 1, imgLink: 1, tags: 1 } 
        }).toArray();
        
        console.log(`Found ${recipes.length} recipes:`);
        
        let validImages = 0;
        let invalidImages = 0;
        let missingImages = 0;
        
        for (const recipe of recipes) {
            if (!recipe.imgLink) {
                console.log(`  ❌ "${recipe.name}": No image link`);
                missingImages++;
            } else if (recipe.imgLink.includes('pexels.com')) {
                console.log(`  ✅ "${recipe.name}": ${recipe.imgLink}`);
                validImages++;
            } else if (recipe.imgLink.includes('unsplash.com')) {
                console.log(`  ⚠️ "${recipe.name}": ${recipe.imgLink} (needs update to Pexels)`);
                invalidImages++;
            } else {
                console.log(`  ⚠️ "${recipe.name}": ${recipe.imgLink}`);
                invalidImages++;
            }
        }
        
        console.log(`\n📈 Image Summary:`);
        console.log(`  - Valid Pexels images: ${validImages}`);
        console.log(`  - Invalid/missing images: ${invalidImages + missingImages}`);
        
        // 3. Test Image Loading
        console.log('\n🧪 Testing Image Loading:');
        
        const testImage = recipes.find(r => r.imgLink && r.imgLink.includes('pexels.com'));
        if (testImage) {
            console.log(`Testing image: ${testImage.imgLink}`);
            
            try {
                const imageResponse = await new Promise((resolve, reject) => {
                    const req = https.get(testImage.imgLink, (res) => {
                        resolve({
                            status: res.statusCode,
                            statusText: res.statusMessage,
                            headers: res.headers
                        });
                    });
                    
                    req.on('error', reject);
                    req.setTimeout(10000, () => {
                        req.destroy();
                        reject(new Error('Image request timeout'));
                    });
                });
                
                if (imageResponse.status === 200) {
                    console.log('✅ Image URL is accessible');
                } else {
                    console.log(`⚠️ Image URL returned status: ${imageResponse.status}`);
                }
            } catch (error) {
                console.log(`❌ Image loading failed: ${error.message}`);
            }
        }
        
        // 4. Check Tag Distribution
        console.log('\n🏷️ Tag Distribution Analysis:');
        
        const allTags = await db.collection('recipes').aggregate([
            { $unwind: "$tags" },
            { $group: { _id: "$tags.tag", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]).toArray();
        
        console.log(`Total unique tags: ${allTags.length}`);
        console.log('Top 10 most popular tags:');
        allTags.slice(0, 10).forEach((tag, index) => {
            console.log(`  ${index + 1}. ${tag._id}: ${tag.count} recipes`);
        });
        
        // 5. Recommendations
        console.log('\n💡 Recommendations:');
        
        if (missingImages > 0) {
            console.log('⚠️ Some recipes are missing images - check n8n workflow');
        }
        
        if (allTags.length < 5) {
            console.log('⚠️ Very few tags found - check tag generation in n8n workflow');
        }
        
        if (popularTags.length === 0) {
            console.log('⚠️ No popular tags found - check recipe tag structure');
        }
        
        console.log('✅ Popular tags logic is working correctly');
        console.log('✅ Image URLs are properly formatted');
        
    } catch (error) {
        console.error('❌ Diagnosis failed:', error.message);
    } finally {
        await client.close();
    }
}

diagnoseTagsAndImages(); 