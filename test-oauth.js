// Test OAuth configuration
require('dotenv').config({ path: '.env.local' });

console.log('🔍 Testing OAuth Configuration...\n');

// Check if we can access the NextAuth endpoints
const https = require('https');
const http = require('http');

const testUrl = 'http://localhost:3000/api/auth/providers';

console.log('Testing NextAuth providers endpoint...');
console.log('URL:', testUrl);

const req = http.get(testUrl, (res) => {
    console.log('Status:', res.statusCode);
    console.log('Headers:', res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    
    res.on('end', () => {
        try {
            const providers = JSON.parse(data);
            console.log('✅ NextAuth is responding correctly');
            console.log('Available providers:', Object.keys(providers));
            
            if (providers.google) {
                console.log('✅ Google provider is configured');
                console.log('Google provider details:', {
                    id: providers.google.id,
                    name: providers.google.name,
                    type: providers.google.type,
                    signinUrl: providers.google.signinUrl
                });
            } else {
                console.log('❌ Google provider not found');
            }
        } catch (e) {
            console.log('❌ Failed to parse response:', e.message);
            console.log('Raw response:', data);
        }
    });
});

req.on('error', (err) => {
    console.log('❌ Error testing NextAuth:', err.message);
});

req.end();

console.log('\n📋 Environment Check:');
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Expected callback URL:', `${process.env.NEXTAUTH_URL}/api/auth/callback/google`);

console.log('\n🔧 Troubleshooting Steps:');
console.log('1. Make sure your Google OAuth redirect URI is exactly:');
console.log(`   ${process.env.NEXTAUTH_URL}/api/auth/callback/google`);
console.log('2. Clear browser cache and cookies');
console.log('3. Restart your development server');
console.log('4. Try signing in again'); 