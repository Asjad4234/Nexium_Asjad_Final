import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function quickTest() {
    console.log('🚀 Quick N8N Test\n');
    
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    console.log(`Testing: ${n8nWebhookUrl}\n`);
    
    const testData = {
        ingredients: ['chicken', 'garlic', 'onion'],
        dietaryPreferences: ['gluten-free'],
        userId: 'test-user',
        sessionId: `test-${Date.now()}`
    };
    
    try {
        console.log('📤 Sending request...');
        const startTime = Date.now();
        
        const response = await fetch(n8nWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testData)
        });
        
        const duration = Date.now() - startTime;
        const responseText = await response.text();
        
        console.log(`📊 Status: ${response.status}`);
        console.log(`⏱️  Duration: ${duration}ms`);
        console.log(`📄 Response length: ${responseText.length} characters`);
        
        if (responseText.length === 0) {
            console.log('\n❌ Empty response - workflow still not working');
            console.log('🔧 Please check the fix guide: fix-n8n-workflow.md');
            return;
        }
        
        try {
            const result = JSON.parse(responseText);
            console.log('\n✅ SUCCESS! Workflow is working!');
            console.log(`📋 Recipe: ${result.recipe?.name || 'N/A'}`);
            console.log(`🎯 Success: ${result.success}`);
            
            if (result.recipe) {
                console.log(`📝 Ingredients: ${result.recipe.ingredients?.length || 0}`);
                console.log(`📋 Instructions: ${result.recipe.instructions?.length || 0}`);
                console.log(`🖼️  Has image: ${!!result.recipe.imgLink}`);
            }
            
        } catch (parseError) {
            console.log('\n⚠️ Response received but not valid JSON');
            console.log('Raw response:', responseText.substring(0, 200) + '...');
        }
        
    } catch (error) {
        console.log(`\n❌ Error: ${error.message}`);
    }
}

quickTest(); 