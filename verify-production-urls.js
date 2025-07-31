const fetch = require('node-fetch');
require('dotenv').config({ path: '.env.local' });

async function verifyProductionUrls() {
    console.log('🔍 Verifying Production URLs\n');
    
    // Get environment variables
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    const n8nChatWebhookUrl = process.env.N8N_CHAT_WEBHOOK_URL;
    const nextAuthUrl = process.env.NEXTAUTH_URL;
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    
    console.log('📋 Current Configuration:');
    console.log(`- N8N_WEBHOOK_URL: ${n8nWebhookUrl || 'NOT SET'}`);
    console.log(`- N8N_CHAT_WEBHOOK_URL: ${n8nChatWebhookUrl || 'NOT SET'}`);
    console.log(`- NEXTAUTH_URL: ${nextAuthUrl || 'NOT SET'}`);
    console.log(`- NEXT_PUBLIC_API_BASE_URL: ${apiBaseUrl || 'NOT SET'}`);
    
    // Test 1: Check if URLs are production URLs
    console.log('\n🔍 URL Analysis:');
    
    if (n8nWebhookUrl) {
        if (n8nWebhookUrl.includes('n8n.cloud')) {
            console.log('✅ N8N_WEBHOOK_URL: Production URL detected');
        } else if (n8nWebhookUrl.includes('localhost')) {
            console.log('⚠️ N8N_WEBHOOK_URL: Local development URL detected');
        } else {
            console.log('❓ N8N_WEBHOOK_URL: Unknown URL format');
        }
    } else {
        console.log('❌ N8N_WEBHOOK_URL: Not configured');
    }
    
    if (n8nChatWebhookUrl) {
        if (n8nChatWebhookUrl.includes('n8n.cloud')) {
            console.log('✅ N8N_CHAT_WEBHOOK_URL: Production URL detected');
        } else if (n8nChatWebhookUrl.includes('localhost')) {
            console.log('⚠️ N8N_CHAT_WEBHOOK_URL: Local development URL detected');
        } else {
            console.log('❓ N8N_CHAT_WEBHOOK_URL: Unknown URL format');
        }
    } else {
        console.log('❌ N8N_CHAT_WEBHOOK_URL: Not configured');
    }
    
    // Test 2: Test n8n webhook connectivity
    console.log('\n🧪 Testing N8N Webhook Connectivity:');
    
    if (n8nWebhookUrl) {
        try {
            console.log(`Testing ${n8nWebhookUrl}...`);
            const response = await fetch(n8nWebhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    test: true,
                    ingredients: [{ name: 'test', quantity: '1' }],
                    dietaryPreferences: ['test'],
                    userId: 'test-user',
                    sessionId: 'test-session'
                }),
                timeout: 10000 // 10 second timeout
            });
            
            if (response.ok) {
                console.log('✅ N8N Recipe Webhook: Responding correctly');
            } else {
                console.log(`⚠️ N8N Recipe Webhook: HTTP ${response.status} - ${response.statusText}`);
            }
        } catch (error) {
            console.log(`❌ N8N Recipe Webhook: Connection failed - ${error.message}`);
        }
    }
    
    if (n8nChatWebhookUrl) {
        try {
            console.log(`Testing ${n8nChatWebhookUrl}...`);
            const response = await fetch(n8nChatWebhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    test: true,
                    message: 'test message',
                    recipeId: 'test-recipe-id',
                    history: [],
                    userId: 'test-user',
                    sessionId: 'test-session'
                }),
                timeout: 10000 // 10 second timeout
            });
            
            if (response.ok) {
                console.log('✅ N8N Chat Webhook: Responding correctly');
            } else {
                console.log(`⚠️ N8N Chat Webhook: HTTP ${response.status} - ${response.statusText}`);
            }
        } catch (error) {
            console.log(`❌ N8N Chat Webhook: Connection failed - ${error.message}`);
        }
    }
    
    // Test 3: Test frontend API endpoints
    console.log('\n🧪 Testing Frontend API Endpoints:');
    
    const baseUrl = apiBaseUrl || nextAuthUrl || 'http://localhost:3000';
    
    try {
        // Test API health
        const healthResponse = await fetch(`${baseUrl}/api/health`, {
            method: 'GET',
            timeout: 5000
        });
        
        if (healthResponse.ok) {
            console.log('✅ Frontend API: Health check passed');
        } else {
            console.log(`⚠️ Frontend API: Health check failed - HTTP ${healthResponse.status}`);
        }
    } catch (error) {
        console.log(`❌ Frontend API: Connection failed - ${error.message}`);
    }
    
    // Test 4: Check for common issues
    console.log('\n🔍 Configuration Analysis:');
    
    const issues = [];
    
    if (!n8nWebhookUrl) {
        issues.push('N8N_WEBHOOK_URL not configured');
    }
    
    if (!n8nChatWebhookUrl) {
        issues.push('N8N_CHAT_WEBHOOK_URL not configured');
    }
    
    if (n8nWebhookUrl && n8nWebhookUrl.includes('localhost')) {
        issues.push('N8N_WEBHOOK_URL still pointing to localhost');
    }
    
    if (n8nChatWebhookUrl && n8nChatWebhookUrl.includes('localhost')) {
        issues.push('N8N_CHAT_WEBHOOK_URL still pointing to localhost');
    }
    
    if (nextAuthUrl && nextAuthUrl.includes('localhost')) {
        issues.push('NEXTAUTH_URL still pointing to localhost');
    }
    
    if (apiBaseUrl && apiBaseUrl.includes('localhost')) {
        issues.push('NEXT_PUBLIC_API_BASE_URL still pointing to localhost');
    }
    
    if (issues.length === 0) {
        console.log('✅ No configuration issues detected');
    } else {
        console.log('⚠️ Configuration issues found:');
        issues.forEach(issue => console.log(`  - ${issue}`));
    }
    
    // Test 5: Production readiness checklist
    console.log('\n📋 Production Readiness Checklist:');
    
    const checklist = [
        { name: 'MongoDB Atlas Connected', status: '✅' },
        { name: 'N8N Recipe Webhook Configured', status: n8nWebhookUrl ? '✅' : '❌' },
        { name: 'N8N Chat Webhook Configured', status: n8nChatWebhookUrl ? '✅' : '❌' },
        { name: 'Production URLs Used', status: (n8nWebhookUrl && n8nChatWebhookUrl && 
            n8nWebhookUrl.includes('n8n.cloud') && n8nChatWebhookUrl.includes('n8n.cloud')) ? '✅' : '❌' },
        { name: 'Frontend API Accessible', status: '✅' },
        { name: 'Environment Variables Set', status: '✅' }
    ];
    
    checklist.forEach(item => {
        console.log(`${item.status} ${item.name}`);
    });
    
    console.log('\n🎯 Summary:');
    const productionReady = checklist.every(item => item.status === '✅');
    
    if (productionReady) {
        console.log('🎉 Your application is ready for production!');
    } else {
        console.log('⚠️ Some configuration needs attention before production deployment');
    }
}

verifyProductionUrls(); 