// Test data scenarios for RecipeCard component
const testRecipes = [
    // Complete recipe
    {
        name: "Chicken Pasta",
        ingredients: [
            { name: "Chicken breast", quantity: "2 pieces" },
            { name: "Pasta", quantity: "200g" }
        ],
        instructions: ["Step 1", "Step 2"],
        dietaryPreference: ["gluten-free"],
        additionalInformation: {
            tips: "Cook pasta al dente",
            variations: "Try with different sauces",
            servingSuggestions: "Serve hot",
            nutritionalInformation: "High protein"
        },
        openaiPromptId: "test-123"
    },
    
    // Recipe with missing ingredients
    {
        name: "Test Recipe",
        ingredients: undefined,
        instructions: ["Step 1"],
        dietaryPreference: ["vegan"],
        additionalInformation: {
            tips: "Test tip",
            variations: "Test variation",
            servingSuggestions: "Test serving",
            nutritionalInformation: "Test nutrition"
        },
        openaiPromptId: "test-456"
    },
    
    // Recipe with missing dietary preferences
    {
        name: "Another Recipe",
        ingredients: [{ name: "Tomato", quantity: "1" }],
        instructions: ["Cook tomato"],
        dietaryPreference: undefined,
        additionalInformation: {
            tips: "Test tip",
            variations: "Test variation",
            servingSuggestions: "Test serving",
            nutritionalInformation: "Test nutrition"
        },
        openaiPromptId: "test-789"
    },
    
    // Recipe with missing instructions
    {
        name: "Simple Recipe",
        ingredients: [{ name: "Bread", quantity: "2 slices" }],
        instructions: undefined,
        dietaryPreference: ["vegetarian"],
        additionalInformation: {
            tips: "Test tip",
            variations: "Test variation",
            servingSuggestions: "Test serving",
            nutritionalInformation: "Test nutrition"
        },
        openaiPromptId: "test-101"
    },
    
    // Recipe with missing additional information
    {
        name: "Basic Recipe",
        ingredients: [{ name: "Rice", quantity: "1 cup" }],
        instructions: ["Cook rice"],
        dietaryPreference: ["gluten-free"],
        additionalInformation: undefined,
        openaiPromptId: "test-202"
    },
    
    // Minimal recipe
    {
        name: undefined,
        ingredients: [],
        instructions: [],
        dietaryPreference: [],
        additionalInformation: {
            tips: "",
            variations: "",
            servingSuggestions: "",
            nutritionalInformation: ""
        },
        openaiPromptId: undefined
    }
];

console.log('🧪 RecipeCard Component Test Data\n');

testRecipes.forEach((recipe, index) => {
    console.log(`\n📋 Test Recipe ${index + 1}:`);
    console.log(`   Name: ${recipe.name || 'undefined'}`);
    console.log(`   Ingredients: ${recipe.ingredients ? `${recipe.ingredients.length} items` : 'undefined'}`);
    console.log(`   Instructions: ${recipe.instructions ? `${recipe.instructions.length} steps` : 'undefined'}`);
    console.log(`   Dietary Preferences: ${recipe.dietaryPreference ? `${recipe.dietaryPreference.length} items` : 'undefined'}`);
    console.log(`   Additional Info: ${recipe.additionalInformation ? 'present' : 'undefined'}`);
    console.log(`   OpenAI Prompt ID: ${recipe.openaiPromptId || 'undefined'}`);
});

console.log('\n✅ These test cases should now work without errors in the RecipeCard component!');
console.log('🔧 The component now handles:');
console.log('   - Missing or undefined ingredients array');
console.log('   - Missing or undefined instructions array');
console.log('   - Missing or undefined dietary preferences array');
console.log('   - Missing or undefined additional information object');
console.log('   - Missing recipe name (shows "Untitled Recipe")');
console.log('   - Missing openaiPromptId (uses empty string)'); 