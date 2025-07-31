// Check environment variables for NextAuth configuration
require('dotenv').config({ path: '.env.local' });

console.log('🔍 Checking NextAuth Environment Variables...\n');

const requiredVars = [
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET', 
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET'
];

let allGood = true;

requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (!value) {
        console.log(`❌ ${varName}: MISSING`);
        allGood = false;
    } else if (value.includes('your-') || value.includes('example')) {
        console.log(`⚠️  ${varName}: SET BUT MAY BE PLACEHOLDER`);
        allGood = false;
    } else {
        console.log(`✅ ${varName}: SET`);
    }
});

console.log('\n📋 Current Values:');
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? '***SET***' : 'MISSING');
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? '***SET***' : 'MISSING');
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? '***SET***' : 'MISSING');

if (allGood) {
    console.log('\n🎉 All environment variables are properly configured!');
} else {
    console.log('\n⚠️  Please fix the missing or placeholder environment variables.');
    console.log('\n📝 Steps to fix:');
    console.log('1. Create a .env.local file in your project root');
    console.log('2. Add the required variables with your actual values');
    console.log('3. Restart your development server');
} 