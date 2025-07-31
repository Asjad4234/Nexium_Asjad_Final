import fetch from 'node-fetch';

async function debugResponse() {
    console.log('🔍 Debugging Webhook Response\n');
    
    const webhookUrl = 'https://asjad4234.app.n8n.cloud/webhook/recipe-generator-updated';
    
    const testData = {
        ingredients: ['chicken', 'garlic', 'onion'],
        dietaryPreferences: ['gluten-free'],
        userId: 'test-user-123',
        sessionId: `test-${Date.now()}`
    };
    
    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testData)
        });
        
        const responseText = await response.text();
        
        console.log(`Status: ${response.status}`);
        console.log(`Content-Length: ${response.headers.get('content-length')}`);
        console.log(`Content-Type: ${response.headers.get('content-type')}`);
        console.log(`Response length: ${responseText.length} characters`);
        console.log('\n📄 Full Response:');
        console.log(responseText);
        
        if (responseText.length > 0) {
            try {
                const result = JSON.parse(responseText);
                console.log('\n✅ Parsed JSON:');
                console.log(JSON.stringify(result, null, 2));
            } catch (parseError) {
                console.log('\n❌ Not valid JSON');
            }
        }
        
    } catch (error) {
        console.log(`Error: ${error.message}`);
    }
}

debugResponse(); 