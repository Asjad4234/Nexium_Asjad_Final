import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function testProductionN8nWorkflow() {
    try {
        console.log('🧪 Testing Production N8N Workflow...');
        
        const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
        
        if (!n8nWebhookUrl) {
            console.error('❌ N8N_WEBHOOK_URL not found in environment variables');
            return;
        }
        
        console.log('📍 Using n8n webhook URL:', n8nWebhookUrl);
        
        const testData = {
            ingredients: ['chicken', 'garlic', 'onion', 'tomatoes'],
            dietaryPreferences: ['gluten-free'],
            userId: 'test-user-123',
            sessionId: `test-session-${Date.now()}`
        };
        
        console.log('📤 Sending test data:', JSON.stringify(testData, null, 2));
        
        console.log('⏳ Making request to n8n...');
        
        const startTime = Date.now();
        
        const response = await fetch(n8nWebhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testData)
        });
        
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        console.log('📊 Response Details:');
        console.log(`   Status: ${response.status}`);
        console.log(`   Duration: ${duration}ms`);
        console.log(`   Content-Length: ${response.headers.get('content-length')}`);
        console.log(`   Content-Type: ${response.headers.get('content-type')}`);
        
        // Check if response is empty
        const responseText = await response.text();
        console.log(`   Response body length: ${responseText.length} characters`);
        
        if (responseText.length === 0) {
            console.log('⚠️ Empty response received from n8n workflow');
            console.log('🔍 This suggests the workflow might be:');
            console.log('   1. Failing at the AI Agent step');
            console.log('   2. Not reaching the Return Response node');
            console.log('   3. Having an error in the workflow execution');
            console.log('   4. The workflow might be inactive or misconfigured');
            return;
        }
        
        if (!response.ok) {
            console.log('❌ Error response body:', responseText);
            throw new Error(`HTTP error! status: ${response.status}, body: ${responseText}`);
        }
        
        // Try to parse JSON
        let result;
        try {
            result = JSON.parse(responseText);
        } catch (parseError) {
            console.log('❌ Failed to parse JSON response:', parseError.message);
            console.log('Raw response:', responseText);
            return;
        }
        
        console.log('✅ n8n response parsed successfully!');
        console.log('📄 Response structure:', JSON.stringify(result, null, 2));
        
        // Validate the response structure
        if (result.recipe && result.success) {
            console.log('🎉 n8n workflow is working correctly!');
            console.log('📋 Recipe details:');
            console.log(`   Name: ${result.recipe.name}`);
            console.log(`   Has openaiPromptId: ${!!result.recipe.openaiPromptId}`);
            console.log(`   Has imgLink: ${!!result.recipe.imgLink}`);
            console.log(`   Ingredients count: ${result.recipe.ingredients?.length || 0}`);
            console.log(`   Instructions count: ${result.recipe.instructions?.length || 0}`);
        } else {
            console.log('⚠️ n8n workflow response structure is unexpected');
            console.log('Response keys:', Object.keys(result));
        }
        
    } catch (error) {
        console.error('❌ Error testing n8n workflow:', error.message);
        
        if (error.code === 'ECONNREFUSED') {
            console.error('🔍 This suggests the n8n instance might be down or the URL is incorrect');
        } else if (error.code === 'ENOTFOUND') {
            console.error('🔍 This suggests the n8n URL is not reachable or DNS issue');
        } else if (error.code === 'ETIMEDOUT') {
            console.error('🔍 This suggests the n8n workflow is taking too long to respond');
        }
        
        console.error('Full error details:', error);
    }
}

// Also test the chat webhook
async function testChatWebhook() {
    try {
        console.log('\n🧪 Testing Production N8N Chat Webhook...');
        
        const chatWebhookUrl = process.env.N8N_CHAT_WEBHOOK_URL;
        
        if (!chatWebhookUrl) {
            console.error('❌ N8N_CHAT_WEBHOOK_URL not found in environment variables');
            return;
        }
        
        console.log('📍 Using chat webhook URL:', chatWebhookUrl);
        
        const testData = {
            message: "Hello, can you help me with a recipe?",
            userId: 'test-user-123',
            sessionId: `test-chat-${Date.now()}`
        };
        
        console.log('📤 Sending test chat data:', JSON.stringify(testData, null, 2));
        
        const response = await fetch(chatWebhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testData)
        });
        
        console.log(`📊 Chat Response Status: ${response.status}`);
        console.log(`📊 Chat Content-Length: ${response.headers.get('content-length')}`);
        
        const responseText = await response.text();
        console.log(`📊 Chat Response body length: ${responseText.length} characters`);
        
        if (responseText.length === 0) {
            console.log('⚠️ Empty response from chat webhook');
            return;
        }
        
        if (!response.ok) {
            console.log('❌ Chat webhook error:', responseText);
        } else {
            try {
                const result = JSON.parse(responseText);
                console.log('✅ Chat webhook working:', JSON.stringify(result, null, 2));
            } catch (parseError) {
                console.log('❌ Failed to parse chat response:', responseText);
            }
        }
        
    } catch (error) {
        console.error('❌ Error testing chat webhook:', error.message);
    }
}

// Run both tests
async function runAllTests() {
    await testProductionN8nWorkflow();
    await testChatWebhook();
}

runAllTests(); 