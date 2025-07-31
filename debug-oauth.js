// Comprehensive OAuth debugging tool
require('dotenv').config({ path: '.env.local' });

console.log('🔍 OAuth Debugging Tool\n');

// Check environment variables
console.log('📋 Environment Variables:');
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? 'SET' : 'MISSING');
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'SET' : 'MISSING');
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'MISSING');

// Expected URLs
const expectedCallbackUrl = `${process.env.NEXTAUTH_URL}/api/auth/callback/google`;
console.log('\n🎯 Expected Callback URL:', expectedCallbackUrl);

// Test NextAuth endpoints
const http = require('http');

async function testEndpoint(url, description) {
    return new Promise((resolve) => {
        console.log(`\n🔍 Testing: ${description}`);
        console.log('URL:', url);
        
        const req = http.get(url, (res) => {
            console.log('Status:', res.statusCode);
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    console.log('✅ Response:', json);
                } catch (e) {
                    console.log('📄 Raw response:', data.substring(0, 200) + '...');
                }
                resolve();
            });
        });
        
        req.on('error', (err) => {
            console.log('❌ Error:', err.message);
            resolve();
        });
        
        req.setTimeout(5000, () => {
            console.log('⏰ Timeout');
            req.destroy();
            resolve();
        });
    });
}

async function runTests() {
    await testEndpoint('http://localhost:3000/api/auth/providers', 'NextAuth Providers');
    await testEndpoint('http://localhost:3000/api/auth/session', 'NextAuth Session');
    
    console.log('\n🔧 Troubleshooting Checklist:');
    console.log('1. ✅ Environment variables are set');
    console.log('2. 🔍 Check Google Cloud Console redirect URI');
    console.log('3. 🧹 Clear browser cache/cookies');
    console.log('4. 🔄 Restart development server');
    console.log('5. 🌐 Use incognito/private mode');
    
    console.log('\n📝 Google Cloud Console Steps:');
    console.log('1. Go to: https://console.cloud.google.com/');
    console.log('2. Select your project');
    console.log('3. Navigate to: APIs & Services → Credentials');
    console.log('4. Click your OAuth 2.0 Client ID');
    console.log('5. Under "Authorized redirect URIs" add:');
    console.log(`   ${expectedCallbackUrl}`);
    console.log('6. Save changes');
    console.log('7. Wait 5-10 minutes for changes to propagate');
}

runTests(); 