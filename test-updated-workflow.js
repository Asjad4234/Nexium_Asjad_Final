import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function testWebhook(url, name, testData) {
    console.log(`\n🧪 Testing ${name}: ${url}`);
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testData)
        });
        
        const responseText = await response.text();
        
        console.log(`   Status: ${response.status}`);
        console.log(`   Response length: ${responseText.length} characters`);
        
        if (responseText.length === 0) {
            console.log(`   ❌ Empty response`);
            return false;
        }
        
        try {
            const result = JSON.parse(responseText);
            console.log(`   ✅ Valid JSON response`);
            
            if (result.recipe) {
                console.log(`   📋 Recipe: ${result.recipe.name}`);
                console.log(`   🎯 Success: ${result.success}`);
            } else if (result.reply) {
                console.log(`   💬 Reply: ${result.reply.substring(0, 50)}...`);
                console.log(`   🎯 Success: ${result.success}`);
            }
            
            return true;
        } catch (parseError) {
            console.log(`   ⚠️ Response is not valid JSON`);
            console.log(`   Raw: ${responseText.substring(0, 100)}...`);
            return false;
        }
        
    } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
        return false;
    }
}

async function testUpdatedWorkflow() {
    console.log('🔍 Testing Updated N8N Workflow Configuration\n');
    
    const baseUrl = 'https://asjad4234.app.n8n.cloud/webhook';
    
    // Test recipe webhook with correct webhookId
    const recipeWebhookUrl = `${baseUrl}/recipe-generator-updated`;
    const recipeTestData = {
        ingredients: ['chicken', 'garlic', 'onion'],
        dietaryPreferences: ['gluten-free'],
        userId: 'test-user-123',
        sessionId: `test-${Date.now()}`
    };
    
    // Test chat webhook (should work now)
    const chatWebhookUrl = `${baseUrl}/chat-assistant`;
    const chatTestData = {
        message: "Hello, can you help me with a recipe?",
        recipeId: "test-recipe-123",
        userId: 'test-user-123',
        sessionId: `test-${Date.now()}`
    };
    
    console.log('📋 Current Environment URLs:');
    console.log(`   Recipe: ${process.env.N8N_WEBHOOK_URL}`);
    console.log(`   Chat: ${process.env.N8N_CHAT_WEBHOOK_URL}`);
    console.log('');
    
    const recipeResult = await testWebhook(recipeWebhookUrl, 'Recipe Webhook (corrected)', recipeTestData);
    const chatResult = await testWebhook(chatWebhookUrl, 'Chat Webhook (fixed)', chatTestData);
    
    console.log('\n📋 Summary:');
    
    if (recipeResult) {
        console.log('✅ Recipe webhook is working!');
    } else {
        console.log('❌ Recipe webhook still has issues');
    }
    
    if (chatResult) {
        console.log('✅ Chat webhook is working!');
    } else {
        console.log('❌ Chat webhook still has issues');
    }
    
    console.log('\n🔧 Required Environment Updates:');
    console.log('Update your .env.local file:');
    console.log('');
    console.log('N8N_WEBHOOK_URL=https://asjad4234.app.n8n.cloud/webhook/recipe-generator-updated');
    console.log('N8N_CHAT_WEBHOOK_URL=https://asjad4234.app.n8n.cloud/webhook/chat-assistant');
    
    if (recipeResult && chatResult) {
        console.log('\n🎉 Both webhooks are working! Your n8n workflow is ready.');
    } else {
        console.log('\n⚠️ Some webhooks still need attention.');
    }
}

testUpdatedWorkflow(); 