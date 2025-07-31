import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

console.log('🔍 N8N Workflow Diagnostic Tool');
console.log('================================\n');

// Check environment variables
console.log('📋 Environment Configuration:');
console.log(`   N8N_WEBHOOK_URL: ${process.env.N8N_WEBHOOK_URL || 'NOT SET'}`);
console.log(`   N8N_CHAT_WEBHOOK_URL: ${process.env.N8N_CHAT_WEBHOOK_URL || 'NOT SET'}`);
console.log(`   GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? 'SET' : 'NOT SET'}`);
console.log('');

// Test basic connectivity
async function testBasicConnectivity() {
    console.log('🌐 Testing Basic Connectivity...');
    
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    if (!n8nWebhookUrl) {
        console.log('❌ N8N_WEBHOOK_URL not configured');
        return false;
    }
    
    try {
        // Test with a simple GET request to see if the endpoint exists
        const response = await fetch(n8nWebhookUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        console.log(`   GET request status: ${response.status}`);
        
        if (response.status === 405) {
            console.log('✅ Endpoint exists (Method Not Allowed for GET is expected)');
            return true;
        } else if (response.status === 404) {
            console.log('❌ Endpoint not found - check webhook URL');
            return false;
        } else {
            console.log(`   Unexpected status: ${response.status}`);
            return false;
        }
        
    } catch (error) {
        console.log(`❌ Connectivity error: ${error.message}`);
        return false;
    }
}

// Test with minimal data
async function testMinimalData() {
    console.log('\n🧪 Testing with Minimal Data...');
    
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    
    const minimalData = {
        ingredients: ['chicken'],
        dietaryPreferences: [],
        userId: 'test-user',
        sessionId: `test-${Date.now()}`
    };
    
    try {
        const response = await fetch(n8nWebhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(minimalData)
        });
        
        const responseText = await response.text();
        
        console.log(`   Status: ${response.status}`);
        console.log(`   Content-Length: ${response.headers.get('content-length')}`);
        console.log(`   Response body length: ${responseText.length} characters`);
        
        if (responseText.length === 0) {
            console.log('⚠️ Empty response - workflow execution issue detected');
            return false;
        }
        
        return true;
        
    } catch (error) {
        console.log(`❌ Error: ${error.message}`);
        return false;
    }
}

// Test with different data formats
async function testDataFormats() {
    console.log('\n📊 Testing Different Data Formats...');
    
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    
    const testCases = [
        {
            name: 'Simple ingredients array',
            data: {
                ingredients: ['chicken', 'rice'],
                dietaryPreferences: [],
                userId: 'test-user',
                sessionId: `test-${Date.now()}`
            }
        },
        {
            name: 'With dietary preferences',
            data: {
                ingredients: ['chicken', 'rice', 'vegetables'],
                dietaryPreferences: ['gluten-free'],
                userId: 'test-user',
                sessionId: `test-${Date.now()}`
            }
        },
        {
            name: 'Complex ingredients',
            data: {
                ingredients: ['chicken breast', 'garlic', 'onion', 'tomatoes', 'olive oil'],
                dietaryPreferences: ['low-carb'],
                userId: 'test-user',
                sessionId: `test-${Date.now()}`
            }
        }
    ];
    
    for (const testCase of testCases) {
        console.log(`\n   Testing: ${testCase.name}`);
        
        try {
            const response = await fetch(n8nWebhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(testCase.data)
            });
            
            const responseText = await response.text();
            
            console.log(`     Status: ${response.status}`);
            console.log(`     Response length: ${responseText.length} characters`);
            
            if (responseText.length > 0) {
                try {
                    const result = JSON.parse(responseText);
                    console.log(`     ✅ Valid JSON response received`);
                    console.log(`     Recipe name: ${result.recipe?.name || 'N/A'}`);
                    return true; // Found a working format
                } catch (parseError) {
                    console.log(`     ⚠️ Response is not valid JSON`);
                }
            } else {
                console.log(`     ❌ Empty response`);
            }
            
        } catch (error) {
            console.log(`     ❌ Error: ${error.message}`);
        }
    }
    
    return false;
}

// Check n8n workflow status
async function checkWorkflowStatus() {
    console.log('\n🔧 N8N Workflow Status Check...');
    console.log('   Please check the following in your n8n.cloud instance:');
    console.log('');
    console.log('   1. 🔄 Workflow Status:');
    console.log('      - Go to https://asjad4234.app.n8n.cloud/workflows');
    console.log('      - Check if "My workflow" is ACTIVE (green toggle)');
    console.log('      - If inactive, click the toggle to activate it');
    console.log('');
    console.log('   2. 🔑 Gemini API Credentials:');
    console.log('      - Go to Settings > Credentials');
    console.log('      - Check if "Google Gemini(PaLM) Api account" is valid');
    console.log('      - Verify the API key is correct and has proper permissions');
    console.log('');
    console.log('   3. 📊 Execution History:');
    console.log('      - Go to "My workflow" and check the "Executions" tab');
    console.log('      - Look for recent executions and check for errors');
    console.log('      - Failed executions will show red status');
    console.log('');
    console.log('   4. 🔗 Webhook URLs:');
    console.log('      - Verify webhook URLs are correct:');
    console.log(`      - Recipe: ${process.env.N8N_WEBHOOK_URL}`);
    console.log(`      - Chat: ${process.env.N8N_CHAT_WEBHOOK_URL}`);
    console.log('');
    console.log('   5. 🧠 AI Agent Configuration:');
    console.log('      - Check if "AI Agent1" node is properly configured');
    console.log('      - Verify the prompt format is correct');
    console.log('      - Ensure memory buffer is working');
}

// Main diagnostic function
async function runDiagnostics() {
    console.log('🚀 Starting N8N Workflow Diagnostics...\n');
    
    const connectivityOk = await testBasicConnectivity();
    if (!connectivityOk) {
        console.log('\n❌ Basic connectivity failed. Please check your n8n URL.');
        return;
    }
    
    const minimalOk = await testMinimalData();
    if (!minimalOk) {
        console.log('\n⚠️ Minimal data test failed. This suggests a workflow execution issue.');
    }
    
    const formatOk = await testDataFormats();
    if (formatOk) {
        console.log('\n✅ Found a working data format!');
    } else {
        console.log('\n❌ All data format tests failed.');
    }
    
    await checkWorkflowStatus();
    
    console.log('\n📋 Summary:');
    console.log('   - If all tests return empty responses, the issue is likely:');
    console.log('     1. Workflow is inactive in n8n');
    console.log('     2. Gemini API credentials are invalid');
    console.log('     3. AI Agent node is misconfigured');
    console.log('     4. Workflow execution is failing silently');
    console.log('');
    console.log('   - Next steps:');
    console.log('     1. Check n8n workflow status and execution history');
    console.log('     2. Verify Gemini API credentials');
    console.log('     3. Test the workflow manually in n8n interface');
    console.log('     4. Check n8n logs for error messages');
}

runDiagnostics(); 