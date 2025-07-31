#!/usr/bin/env node

/**
 * Pexels API Setup Script
 * 
 * This script helps you:
 * 1. Get a free Pexels API key
 * 2. Test the API integration
 * 3. Update your environment variables
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

console.log('🍽️  Pexels API Setup for Recipe Images\n');

// Step 1: Instructions for getting API key
console.log('📋 Step 1: Get Your Free Pexels API Key');
console.log('=====================================');
console.log('1. Go to: https://www.pexels.com/api/');
console.log('2. Click "Get Started" or "Sign Up"');
console.log('3. Create a free account');
console.log('4. Go to your dashboard');
console.log('5. Copy your API key');
console.log('6. Add it to your .env.local file as: NEXT_PUBLIC_PEXELS_API_KEY=your_key_here\n');

// Step 2: Check if .env.local exists and has the key
const envPath = path.join(__dirname, '.env.local');
const envExamplePath = path.join(__dirname, 'env.example');

function checkEnvFile() {
    console.log('🔍 Step 2: Checking Environment Configuration');
    console.log('===========================================');
    
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        if (envContent.includes('NEXT_PUBLIC_PEXELS_API_KEY=')) {
            const apiKey = envContent.match(/NEXT_PUBLIC_PEXELS_API_KEY=(.+)/)?.[1];
            if (apiKey && apiKey !== 'your_pexels_api_key_here') {
                console.log('✅ Pexels API key found in .env.local');
                return apiKey;
            } else {
                console.log('⚠️  Pexels API key placeholder found. Please update with your actual key.');
            }
        } else {
            console.log('❌ Pexels API key not found in .env.local');
            console.log('   Adding it now...');
            
            const newEnvLine = '\n# Pexels API (for recipe images)\nNEXT_PUBLIC_PEXELS_API_KEY=your_pexels_api_key_here\n';
            fs.appendFileSync(envPath, newEnvLine);
            console.log('✅ Added PEXELS_API_KEY to .env.local');
        }
    } else {
        console.log('❌ .env.local file not found');
        console.log('   Creating it from env.example...');
        
        if (fs.existsSync(envExamplePath)) {
            fs.copyFileSync(envExamplePath, envPath);
            console.log('✅ Created .env.local from env.example');
        } else {
            console.log('❌ env.example not found. Please create .env.local manually.');
        }
    }
    
    return null;
}

// Step 3: Test the API
async function testPexelsAPI(apiKey) {
    if (!apiKey) {
        console.log('\n⚠️  Skipping API test - no valid API key found');
        return;
    }
    
    console.log('\n🧪 Step 3: Testing Pexels API');
    console.log('============================');
    
    return new Promise((resolve) => {
        const options = {
            hostname: 'api.pexels.com',
            path: '/v1/search?query=food&per_page=1',
            method: 'GET',
            headers: {
                'Authorization': apiKey,
                'Content-Type': 'application/json'
            }
        };
        
        const req = https.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    
                    if (res.statusCode === 200) {
                        console.log('✅ Pexels API test successful!');
                        console.log(`   Found ${response.total_results} food images`);
                        if (response.photos && response.photos.length > 0) {
                            console.log(`   Sample image: ${response.photos[0].src.medium}`);
                        }
                    } else {
                        console.log('❌ Pexels API test failed');
                        console.log(`   Status: ${res.statusCode}`);
                        console.log(`   Response: ${data}`);
                    }
                } catch (error) {
                    console.log('❌ Failed to parse API response');
                    console.log(`   Error: ${error.message}`);
                }
                resolve();
            });
        });
        
        req.on('error', (error) => {
            console.log('❌ API request failed');
            console.log(`   Error: ${error.message}`);
            resolve();
        });
        
        req.end();
    });
}

// Step 4: Next steps
function showNextSteps() {
    console.log('\n🚀 Step 4: Next Steps');
    console.log('====================');
    console.log('1. Add your Pexels API key to .env.local');
    console.log('2. Restart your development server: npm run dev');
    console.log('3. Check that recipe images are loading properly');
    console.log('4. Update your n8n workflow to use Pexels API if needed\n');
    
    console.log('📝 For n8n workflow integration:');
    console.log('   - Replace Unsplash API calls with Pexels API');
    console.log('   - Use endpoint: https://api.pexels.com/v1/search');
    console.log('   - Add Authorization header with your API key');
    console.log('   - Use query parameter for food-related searches\n');
}

// Run the setup
async function main() {
    const apiKey = checkEnvFile();
    await testPexelsAPI(apiKey);
    showNextSteps();
}

main().catch(console.error); 