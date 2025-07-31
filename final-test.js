import fetch from 'node-fetch';

async function finalTest() {
    console.log('🎯 Final Test - Recipe Webhook with Correct URL\n');
    
    const correctRecipeUrl = 'https://asjad4234.app.n8n.cloud/webhook/recipe-generator-updated';
    
    const testData = {
        ingredients: ['chicken', 'garlic', 'onion', 'tomatoes'],
        dietaryPreferences: ['gluten-free'],
        userId: 'test-user-123',
        sessionId: `test-${Date.now()}`
    };
    
    console.log('📤 Testing recipe generation...');
    console.log('URL:', correctRecipeUrl);
    console.log('Data:', JSON.stringify(testData, null, 2));
    console.log('');
    
    try {
        const startTime = Date.now();
        
        const response = await fetch(correctRecipeUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testData)
        });
        
        const duration = Date.now() - startTime;
        const responseText = await response.text();
        
        console.log(`📊 Status: ${response.status}`);
        console.log(`⏱️  Duration: ${duration}ms`);
        console.log(`📄 Response length: ${responseText.length} characters`);
        
        if (responseText.length === 0) {
            console.log('\n❌ Empty response - workflow execution issue');
            console.log('🔧 Check n8n workflow execution history for errors');
            return;
        }
        
        try {
            const result = JSON.parse(responseText);
            console.log('\n✅ SUCCESS! Recipe generated successfully!');
            console.log(`📋 Recipe: ${result.recipe?.name || 'N/A'}`);
            console.log(`🎯 Success: ${result.success}`);
            
            if (result.recipe) {
                console.log(`📝 Ingredients: ${result.recipe.ingredients?.length || 0}`);
                console.log(`📋 Instructions: ${result.recipe.instructions?.length || 0}`);
                console.log(`🖼️  Has image: ${!!result.recipe.imgLink}`);
            }
            
            console.log('\n🎉 Your n8n workflow is working!');
            console.log('📝 Update your .env.local with:');
            console.log('N8N_WEBHOOK_URL=https://asjad4234.app.n8n.cloud/webhook/recipe-generator-updated');
            
        } catch (parseError) {
            console.log('\n⚠️ Response received but not valid JSON');
            console.log('Raw response:', responseText.substring(0, 200) + '...');
        }
        
    } catch (error) {
        console.log(`\n❌ Error: ${error.message}`);
    }
}

finalTest(); 