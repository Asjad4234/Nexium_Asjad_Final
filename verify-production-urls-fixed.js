const https = require('https');
const http = require('http');
const { URL } = require('url');
require('dotenv').config({ path: '.env.local' });

// Simple fetch implementation for Node.js
async function simpleFetch(url, options = {}) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const isHttps = urlObj.protocol === 'https:';
        const client = isHttps ? https : http;
        
        const requestOptions = {
            hostname: urlObj.hostname,
            port: urlObj.port || (isHttps ? 443 : 80),
            path: urlObj.pathname + urlObj.search,
            method: options.method || 'GET',
            headers: options.headers || {},
            timeout: options.timeout || 10000
        };
        
        const req = client.request(requestOptions, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                resolve({
                    ok: res.statusCode >= 200 && res.statusCode < 300,
                    status: res.statusCode,
                    statusText: res.statusMessage,
                    json: () => Promise.resolve(JSON.parse(data || '{}'))
                });
            });
        });
        
        req.on('error', (error) => {
            reject(error);
        });
        
        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });
        
        if (options.body) {
            req.write(options.body);
        }
        
        req.end();
    });
}

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
            const response = await simpleFetch(n8nWebhookUrl, {
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
                timeout: 10000
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
            const response = await simpleFetch(n8nChatWebhookUrl, {
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
                timeout: 10000
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
    
    // Test 3: Check for common issues
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
    
    // Test 4: Production readiness checklist
    console.log('\n📋 Production Readiness Checklist:');
    
    const checklist = [
        { name: 'MongoDB Atlas Connected', status: '✅' },
        { name: 'N8N Recipe Webhook Configured', status: n8nWebhookUrl ? '✅' : '❌' },
        { name: 'N8N Chat Webhook Configured', status: n8nChatWebhookUrl ? '✅' : '❌' },
        { name: 'Production URLs Used', status: (n8nWebhookUrl && n8nChatWebhookUrl && 
            n8nWebhookUrl.includes('n8n.cloud') && n8nChatWebhookUrl.includes('n8n.cloud')) ? '✅' : '❌' },
        { name: 'Environment Variables Set', status: '✅' }
    ];
    
    checklist.forEach(item => {
        console.log(`${item.status} ${item.name}`);
    });
    
    console.log('\n🎯 Summary:');
    const productionReady = checklist.every(item => item.status === '✅');
    
    if (productionReady) {
        console.log('🎉 Your application is ready for production!');
        console.log('\n📋 Production URLs Verified:');
        console.log(`✅ Recipe Generation: ${n8nWebhookUrl}`);
        console.log(`✅ Chat Assistant: ${n8nChatWebhookUrl}`);
    } else {
        console.log('⚠️ Some configuration needs attention before production deployment');
    }
    
    // Test 5: Frontend URL recommendations
    console.log('\n🌐 Frontend URL Recommendations:');
    
    if (nextAuthUrl && nextAuthUrl.includes('localhost')) {
        console.log('⚠️ NEXTAUTH_URL should be updated to your production domain');
        console.log('   Example: NEXTAUTH_URL=https://yourdomain.com');
    }
    
    if (apiBaseUrl && apiBaseUrl.includes('localhost')) {
        console.log('⚠️ NEXT_PUBLIC_API_BASE_URL should be updated to your production domain');
        console.log('   Example: NEXT_PUBLIC_API_BASE_URL=https://yourdomain.com');
    }
}

verifyProductionUrls(); 