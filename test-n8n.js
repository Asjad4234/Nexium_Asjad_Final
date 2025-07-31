import fetch from 'node-fetch';

async function testN8nWorkflow() {
    try {
        console.log('Testing n8n workflow...');
        
        // Use the production URL from environment or fallback to local
        const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/generate-recipe';
        
        console.log('Using n8n webhook URL:', n8nWebhookUrl);
        
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
        
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers.raw());
        
        if (!response.ok) {
            const errorText = await response.text();
            console.log('Error response body:', errorText);
            throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
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
            console.log('Response keys:', Object.keys(result));
        }
        
    } catch (error) {
        console.error('❌ Error testing n8n workflow:', error.message);
        console.error('Full error:', error);
    }
}

testN8nWorkflow(); 