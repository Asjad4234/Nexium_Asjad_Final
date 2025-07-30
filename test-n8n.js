const fetch = require('node-fetch');

async function testN8nWorkflow() {
    try {
        console.log('Testing n8n workflow...');
        
        const n8nWebhookUrl = 'http://localhost:5678/webhook/generate-recipe';
        
        const testData = {
            ingredients: ['chicken', 'garlic', 'onion'],
            dietaryPreferences: ['gluten-free'],
            userId: 'test-user-123',
            sessionId: `test-session-${Date.now()}`
        };
        
        console.log('Sending test data:', JSON.stringify(testData, null, 2));
        
        const response = await fetch(n8nWebhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('n8n response:', JSON.stringify(result, null, 2));
        
        // Validate the response structure
        if (result.recipe && result.success) {
            console.log('✅ n8n workflow is working correctly!');
            console.log('Recipe name:', result.recipe.name);
            console.log('Recipe has openaiPromptId:', !!result.recipe.openaiPromptId);
            console.log('Recipe has imgLink:', !!result.recipe.imgLink);
        } else {
            console.log('❌ n8n workflow response is invalid');
        }
        
    } catch (error) {
        console.error('❌ Error testing n8n workflow:', error.message);
    }
}

testN8nWorkflow(); 