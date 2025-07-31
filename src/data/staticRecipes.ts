import { ExtendedRecipe } from '../types';

// Static recipe data for the home page
export const staticRecipes: ExtendedRecipe[] = [
    {
        _id: '1',
        name: 'Spicy Thai Basil Chicken',
        description: 'A flavorful Thai dish with aromatic basil, spicy chilies, and tender chicken. Perfect for a quick weeknight dinner that packs a punch of authentic Thai flavors.',
        ingredients: [
            { name: 'chicken breast', quantity: '500g' },
            { name: 'thai basil', quantity: '1 cup' },
            { name: 'garlic', quantity: '4 cloves' },
            { name: 'fish sauce', quantity: '2 tbsp' },
            { name: 'soy sauce', quantity: '1 tbsp' },
            { name: 'chili peppers', quantity: '3-4' },
            { name: 'vegetable oil', quantity: '2 tbsp' }
        ],
        instructions: [
            'Slice chicken breast into thin strips',
            'Mince garlic and slice chili peppers',
            'Heat oil in a wok over high heat',
            'Stir-fry chicken until golden brown',
            'Add garlic and chili peppers, stir for 30 seconds',
            'Add fish sauce and soy sauce',
            'Add Thai basil and stir until wilted',
            'Serve hot with steamed rice'
        ],
        dietaryPreference: ['High Protein', 'Gluten Free', 'Quick & Easy'],
        additionalInformation: {
            cookingTime: '20 minutes',
            difficulty: 'Easy',
            servings: '4',
            tips: 'Use high heat for authentic wok cooking. Don\'t overcook the basil.',
            variations: 'Can substitute chicken with tofu for vegetarian version',
            servingSuggestions: 'Serve with steamed jasmine rice and fresh cucumber slices',
            nutritionalInformation: 'High in protein, low in carbs, rich in flavor'
        },
        openaiPromptId: 'thai-basil-chicken',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
    },
    {
        _id: '2',
        name: 'Creamy Mediterranean Quinoa Bowl',
        description: 'A healthy and colorful Mediterranean-inspired bowl featuring fluffy quinoa, fresh vegetables, and creamy feta cheese. Packed with nutrients and Mediterranean flavors.',
        ingredients: [
            { name: 'quinoa', quantity: '1 cup' },
            { name: 'cucumber', quantity: '1 medium' },
            { name: 'cherry tomatoes', quantity: '1 cup' },
            { name: 'feta cheese', quantity: '100g' },
            { name: 'olive oil', quantity: '3 tbsp' },
            { name: 'lemon juice', quantity: '2 tbsp' },
            { name: 'chickpeas', quantity: '1 can' },
            { name: 'red onion', quantity: '1/2' }
        ],
        instructions: [
            'Rinse quinoa thoroughly under cold water',
            'Cook quinoa according to package instructions',
            'Dice cucumber, tomatoes, and red onion',
            'Drain and rinse chickpeas',
            'In a large bowl, combine cooked quinoa with vegetables',
            'Crumble feta cheese over the mixture',
            'Whisk together olive oil and lemon juice for dressing',
            'Pour dressing over salad and toss gently'
        ],
        dietaryPreference: ['Vegetarian', 'High Fiber', 'Protein Rich'],
        additionalInformation: {
            cookingTime: '25 minutes',
            difficulty: 'Easy',
            servings: '4',
            tips: 'Let quinoa cool completely before mixing with vegetables to prevent wilting.',
            variations: 'Add grilled chicken or shrimp for protein boost',
            servingSuggestions: 'Serve chilled or at room temperature with crusty bread',
            nutritionalInformation: 'High in fiber, protein, and healthy fats'
        },
        openaiPromptId: 'mediterranean-quinoa-bowl',
        createdAt: new Date('2024-01-16'),
        updatedAt: new Date('2024-01-16')
    },
    {
        _id: '3',
        name: 'Classic Italian Pasta Carbonara',
        description: 'A traditional Italian pasta dish with creamy egg sauce, crispy pancetta, and freshly grated Parmesan cheese. Simple ingredients create an unforgettable flavor.',
        ingredients: [
            { name: 'spaghetti', quantity: '400g' },
            { name: 'pancetta', quantity: '150g' },
            { name: 'eggs', quantity: '4 large' },
            { name: 'parmesan cheese', quantity: '100g' },
            { name: 'black pepper', quantity: 'to taste' },
            { name: 'garlic', quantity: '2 cloves' },
            { name: 'olive oil', quantity: '2 tbsp' }
        ],
        instructions: [
            'Bring a large pot of salted water to boil',
            'Cook spaghetti according to package directions',
            'Meanwhile, dice pancetta and mince garlic',
            'In a bowl, whisk together eggs, grated Parmesan, and black pepper',
            'Cook pancetta in olive oil until crispy',
            'Add garlic and cook for 30 seconds',
            'Add hot pasta to pancetta pan',
            'Remove from heat and quickly stir in egg mixture',
            'Serve immediately with extra Parmesan'
        ],
        dietaryPreference: ['High Protein', 'Quick & Easy', 'Italian'],
        additionalInformation: {
            cookingTime: '15 minutes',
            difficulty: 'Medium',
            servings: '4',
            tips: 'The key is to add the egg mixture off the heat to prevent scrambling.',
            variations: 'Substitute pancetta with bacon or guanciale',
            servingSuggestions: 'Serve with a simple green salad and crusty bread',
            nutritionalInformation: 'Rich in protein and healthy fats'
        },
        openaiPromptId: 'pasta-carbonara',
        createdAt: new Date('2024-01-17'),
        updatedAt: new Date('2024-01-17')
    },
    {
        _id: '4',
        name: 'Healthy Asian Stir Fry',
        description: 'A vibrant and nutritious stir-fry loaded with colorful vegetables, tender chicken, and a savory sauce. Quick to prepare and packed with Asian flavors.',
        ingredients: [
            { name: 'chicken breast', quantity: '400g' },
            { name: 'broccoli', quantity: '2 cups' },
            { name: 'bell peppers', quantity: '2' },
            { name: 'carrots', quantity: '2' },
            { name: 'soy sauce', quantity: '3 tbsp' },
            { name: 'sesame oil', quantity: '1 tbsp' },
            { name: 'ginger', quantity: '1 inch' },
            { name: 'garlic', quantity: '3 cloves' }
        ],
        instructions: [
            'Slice chicken into thin strips',
            'Cut vegetables into bite-sized pieces',
            'Mince garlic and ginger',
            'Heat sesame oil in a wok over high heat',
            'Stir-fry chicken until cooked through',
            'Add vegetables and stir-fry for 3-4 minutes',
            'Add garlic and ginger, cook for 30 seconds',
            'Pour in soy sauce and toss to combine',
            'Serve hot over steamed rice'
        ],
        dietaryPreference: ['High Protein', 'Low Carb', 'Quick & Easy'],
        additionalInformation: {
            cookingTime: '20 minutes',
            difficulty: 'Easy',
            servings: '4',
            tips: 'Keep the heat high and don\'t overcrowd the wok for best results.',
            variations: 'Use tofu instead of chicken for vegetarian version',
            servingSuggestions: 'Serve with steamed rice or cauliflower rice',
            nutritionalInformation: 'High in protein and vegetables, low in calories'
        },
        openaiPromptId: 'asian-stir-fry',
        createdAt: new Date('2024-01-18'),
        updatedAt: new Date('2024-01-18')
    },
    {
        _id: '5',
        name: 'Creamy Coconut Lentil Curry',
        description: 'A comforting and aromatic curry made with red lentils, coconut milk, and warming spices. Perfect for a cozy dinner that\'s both healthy and satisfying.',
        ingredients: [
            { name: 'red lentils', quantity: '1 cup' },
            { name: 'coconut milk', quantity: '1 can' },
            { name: 'sweet potato', quantity: '1 large' },
            { name: 'turmeric', quantity: '1 tsp' },
            { name: 'cumin', quantity: '1 tsp' },
            { name: 'coriander', quantity: '1 tsp' },
            { name: 'onion', quantity: '1 medium' },
            { name: 'spinach', quantity: '2 cups' }
        ],
        instructions: [
            'Rinse lentils thoroughly',
            'Dice sweet potato and onion',
            'Heat oil in a large pot over medium heat',
            'Sauté onion until translucent',
            'Add spices and cook for 1 minute',
            'Add lentils, sweet potato, and coconut milk',
            'Simmer for 20-25 minutes until lentils are tender',
            'Stir in spinach and cook until wilted',
            'Season with salt and serve hot'
        ],
        dietaryPreference: ['Vegetarian', 'Vegan', 'High Fiber'],
        additionalInformation: {
            cookingTime: '30 minutes',
            difficulty: 'Easy',
            servings: '6',
            tips: 'Don\'t overcook the lentils - they should be tender but not mushy.',
            variations: 'Add chickpeas or paneer for extra protein',
            servingSuggestions: 'Serve with basmati rice and naan bread',
            nutritionalInformation: 'High in fiber, protein, and healthy fats'
        },
        openaiPromptId: 'coconut-lentil-curry',
        createdAt: new Date('2024-01-19'),
        updatedAt: new Date('2024-01-19')
    },
    {
        _id: '6',
        name: 'Authentic Italian Margherita Pizza',
        description: 'A classic Italian pizza with a thin, crispy crust, fresh mozzarella, basil, and San Marzano tomatoes. Simple perfection that showcases quality ingredients.',
        ingredients: [
            { name: 'pizza dough', quantity: '1 ball' },
            { name: 'fresh mozzarella', quantity: '200g' },
            { name: 'san marzano tomatoes', quantity: '1 can' },
            { name: 'fresh basil', quantity: '1/2 cup' },
            { name: 'olive oil', quantity: '2 tbsp' },
            { name: 'garlic', quantity: '2 cloves' },
            { name: 'oregano', quantity: '1 tsp' }
        ],
        instructions: [
            'Preheat oven to 500°F (260°C) with pizza stone',
            'Stretch pizza dough into a thin circle',
            'Crush tomatoes and season with salt and oregano',
            'Spread tomato sauce over dough',
            'Tear mozzarella and distribute evenly',
            'Bake for 8-10 minutes until crust is golden',
            'Remove from oven and add fresh basil',
            'Drizzle with olive oil and serve immediately'
        ],
        dietaryPreference: ['Vegetarian', 'Italian', 'Quick & Easy'],
        additionalInformation: {
            cookingTime: '25 minutes',
            difficulty: 'Medium',
            servings: '4',
            tips: 'Use a pizza stone for the crispiest crust possible.',
            variations: 'Add prosciutto or arugula for extra flavor',
            servingSuggestions: 'Serve with a simple green salad',
            nutritionalInformation: 'Moderate calories, good source of protein'
        },
        openaiPromptId: 'margherita-pizza',
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20')
    }
];

// Meaningful popular tags that can actually filter recipes
export const staticPopularTags = [
    { _id: 'High Protein', count: 4 },      // Thai Chicken, Carbonara, Asian Stir Fry, Pizza
    { _id: 'Vegetarian', count: 3 },        // Quinoa Bowl, Lentil Curry, Pizza
    { _id: 'Quick & Easy', count: 5 },      // Thai Chicken, Carbonara, Asian Stir Fry, Lentil Curry, Pizza
    { _id: 'Italian', count: 2 },           // Carbonara, Pizza
    { _id: 'Asian', count: 2 },             // Thai Chicken, Asian Stir Fry
    { _id: 'High Fiber', count: 2 },        // Quinoa Bowl, Lentil Curry
    { _id: 'Vegan', count: 1 },             // Lentil Curry
    { _id: 'Gluten Free', count: 1 },       // Thai Chicken
    { _id: 'Low Carb', count: 1 },          // Asian Stir Fry
    { _id: 'Protein Rich', count: 1 }       // Quinoa Bowl
];

// Helper function to filter recipes by search query
export const filterRecipesBySearch = (recipes: ExtendedRecipe[], query: string): ExtendedRecipe[] => {
    if (!query.trim()) return recipes;
    
    const searchTerm = query.toLowerCase();
    return recipes.filter(recipe => 
        recipe.name.toLowerCase().includes(searchTerm) ||
        recipe.description.toLowerCase().includes(searchTerm) ||
        recipe.ingredients.some(ing => ing.name.toLowerCase().includes(searchTerm)) ||
        recipe.dietaryPreference.some(pref => pref.toLowerCase().includes(searchTerm))
    );
};

// Helper function to filter recipes by tag/category
export const filterRecipesByTag = (recipes: ExtendedRecipe[], tag: string): ExtendedRecipe[] => {
    if (!tag.trim()) return recipes;
    
    const tagLower = tag.toLowerCase();
    return recipes.filter(recipe => 
        recipe.dietaryPreference.some(pref => pref.toLowerCase().includes(tagLower)) ||
        recipe.name.toLowerCase().includes(tagLower) ||
        recipe.description.toLowerCase().includes(tagLower)
    );
}; 