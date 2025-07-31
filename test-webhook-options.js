import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function testWebhook(url, name) {
    console.log(`\n🧪 Testing ${name}: ${url}`);
    
    const testData = {
        message: "Hello, can you help me with a recipe?",
        userId: 'test-user-123',
        sessionId: `test-${Date.now()}`
    };
    
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
            console.log(`   Reply: ${result.reply?.substring(0, 50)}...`);
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

async function testBothOptions() {
    console.log('🔍 Testing Both Webhook URL Options\n');
    
    const baseUrl = 'https://asjad4234.app.n8n.cloud/webhook';
    
    // Test both possible URLs
    const option1 = `${baseUrl}/chat-assistant`;
    const option2 = `${baseUrl}/chat-assistant-updated`;
    
    console.log('Current environment URL:', process.env.N8N_CHAT_WEBHOOK_URL);
    console.log('');
    
    const result1 = await testWebhook(option1, 'Option 1: /chat-assistant');
    const result2 = await testWebhook(option2, 'Option 2: /chat-assistant-updated');
    
    console.log('\n📋 Summary:');
    
    if (result1 && !result2) {
        console.log('✅ Option 1 (/chat-assistant) works!');
        console.log('🔧 Fix: Change webhookId to "chat-assistant" in n8n');
    } else if (result2 && !result1) {
        console.log('✅ Option 2 (/chat-assistant-updated) works!');
        console.log('🔧 Fix: Update environment variable to use /chat-assistant-updated');
    } else if (result1 && result2) {
        console.log('✅ Both options work! Choose either one.');
    } else {
        console.log('❌ Neither option works. Check workflow status and configuration.');
    }
    
    console.log('\n📝 Next Steps:');
    console.log('1. Go to n8n workflow editor');
    console.log('2. Find "Chat Webhook Trigger" node');
    console.log('3. Make sure Path and WebhookId match');
    console.log('4. Save the workflow');
    console.log('5. Test again with: node quick-n8n-test.js');
}

testBothOptions(); 