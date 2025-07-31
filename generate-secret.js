// Generate a secure NextAuth secret
const crypto = require('crypto');

console.log('🔐 Generating Secure NextAuth Secret...\n');

// Generate a random 32-byte secret and encode it as base64
const secret = crypto.randomBytes(32).toString('base64');

console.log('✅ Your secure NEXTAUTH_SECRET:');
console.log(secret);
console.log('\n📝 Copy this into your .env.local file as:');
console.log(`NEXTAUTH_SECRET=${secret}`);
console.log('\n🔒 This secret is cryptographically secure and suitable for production use.'); 