const { runAllTests } = require('./test-workflow-3.js');

console.log('🧪 Workflow 3 Test Runner');
console.log('========================\n');

// Check if n8n is running
const axios = require('axios');

async function checkN8nStatus() {
  try {
    await axios.get('http://localhost:5678', { timeout: 5000 });
    console.log('✅ n8n is running on http://localhost:5678');
    return true;
  } catch (error) {
    console.log('❌ n8n is not running on http://localhost:5678');
    console.log('💡 Please start n8n with: npx n8n start');
    return false;
  }
}

async function main() {
  const n8nRunning = await checkN8nStatus();
  
  if (!n8nRunning) {
    console.log('\n📋 Setup Instructions:');
    console.log('1. Start n8n: npx n8n start');
    console.log('2. Import "My workflow 3 (1).json" into n8n');
    console.log('3. Configure OpenAI credentials in n8n');
    console.log('4. Activate the workflow');
    console.log('5. Run this test again: node run-workflow-3-tests.js');
    return;
  }
  
  console.log('\n🚀 Starting Workflow 3 tests...\n');
  
  try {
    const results = await runAllTests();
    
    if (results.recipeGeneration?.success && results.chatAssistant?.success) {
      console.log('\n🎉 SUCCESS: Your Workflow 3 is working perfectly!');
      process.exit(0);
    } else {
      console.log('\n⚠️ Some tests failed. Check the configuration.');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Test execution failed:', error.message);
    process.exit(1);
  }
}

main(); 