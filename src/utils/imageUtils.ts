// Local images from public/images folder
const localImages = [
    '/images/Spicy_Thai_Basil_Chicken1.png',
    '/images/Spicy_Thai_Basil_Chicken2.jpg',
    '/images/Pasta1.jpeg',
    '/images/Pasta2.jpeg',
    '/images/Pasta3.jpeg',
    '/images/Mediterranean_Quinoa_Bowl1.jpeg',
    '/images/Mediterranean_Quinoa_Bowl2.jpeg',
    '/images/Mediterranean_Quinoa_Bowl3.jpg',
    '/images/Italian1.jpeg',
    '/images/Italian2.jpg',
    '/images/Italian3.jpg',
    '/images/Healthy_Asian_Stir_Fry1.jpg',
    '/images/Healthy_Asian_Stir_Fry2.jpg',
    '/images/Healthy_Asian_Stir_Fry3.jpg',
    '/images/Creamy_Coconut_Lentil_and_Sweet_Potato_Curry1.jpg',
    '/images/Creamy_Coconut_Lentil_and_Sweet_Potato_Curry2.jpg',
];

// Static fallback images (local images only)
const fallbackImages = [
    '/images/Spicy_Thai_Basil_Chicken1.png',
    '/images/Pasta1.jpeg',
    '/images/Mediterranean_Quinoa_Bowl1.jpeg',
    '/images/Italian1.jpeg',
    '/images/Healthy_Asian_Stir_Fry1.jpg',
];

let currentImageIndex = 0;

/**
 * Get a local image URL for recipe cards
 * Cycles through local images to provide variety
 */
export const getLocalImage = (): string => {
    const image = localImages[currentImageIndex];
    currentImageIndex = (currentImageIndex + 1) % localImages.length;
    return image;
};

/**
 * Get a fallback image (local static images) if specific images fail
 */
export const getFallbackImage = (): string => {
    const fallbackIndex = Math.floor(Math.random() * fallbackImages.length);
    return fallbackImages[fallbackIndex];
};

/**
 * Get a recipe-specific image based on recipe name and ingredients
 * Enhanced keyword matching with more specific patterns and multiple image options
 */
export const getRecipeSpecificImage = (recipeName: string, ingredients?: string[]): string => {
    const name = recipeName.toLowerCase();
    const ingredientList = ingredients?.join(' ').toLowerCase() || '';
    const combinedText = `${name} ${ingredientList}`;
    
    // More specific keyword matching to avoid conflicts
    
    // 1. Thai Basil Chicken - very specific to this dish
    if (combinedText.includes('thai basil chicken') || 
        (combinedText.includes('thai') && combinedText.includes('basil') && combinedText.includes('chicken'))) {
        return '/images/Spicy_Thai_Basil_Chicken1.png';
    }
    
    // 2. Pasta Carbonara - specific to carbonara
    if (combinedText.includes('carbonara') || 
        (combinedText.includes('pasta') && combinedText.includes('pancetta') && combinedText.includes('parmesan'))) {
        return '/images/Pasta1.jpeg';
    }
    
    // 3. Mediterranean Quinoa Bowl - specific to quinoa bowls
    if (combinedText.includes('quinoa bowl') || 
        (combinedText.includes('mediterranean') && combinedText.includes('quinoa'))) {
        return '/images/Mediterranean_Quinoa_Bowl1.jpeg';
    }
    
    // 4. Margherita Pizza - specific to pizza
    if (combinedText.includes('margherita') || combinedText.includes('pizza') || 
        (combinedText.includes('mozzarella') && combinedText.includes('tomato'))) {
        return '/images/Italian1.jpeg';
    }
    
    // 5. Asian Stir Fry - specific to stir fry
    if (combinedText.includes('stir fry') || combinedText.includes('stir-fry') || 
        (combinedText.includes('asian') && combinedText.includes('stir'))) {
        return '/images/Healthy_Asian_Stir_Fry1.jpg';
    }
    
    // 6. Coconut Lentil Curry - specific to curry
    if (combinedText.includes('lentil curry') || combinedText.includes('coconut curry') || 
        (combinedText.includes('curry') && combinedText.includes('lentil'))) {
        return '/images/Creamy_Coconut_Lentil_and_Sweet_Potato_Curry1.jpg';
    }
    
    // Fallback patterns for broader categories (using different images)
    
    // General Thai dishes (use second image)
    if (combinedText.includes('thai') && !combinedText.includes('basil chicken')) {
        return '/images/Spicy_Thai_Basil_Chicken2.jpg';
    }
    
    // General pasta dishes (use second pasta image)
    if (combinedText.includes('pasta') && !combinedText.includes('carbonara')) {
        return '/images/Pasta2.jpeg';
    }
    
    // General Mediterranean dishes (use second quinoa image)
    if (combinedText.includes('mediterranean') && !combinedText.includes('quinoa bowl')) {
        return '/images/Mediterranean_Quinoa_Bowl2.jpeg';
    }
    
    // General Italian dishes (use second Italian image)
    if (combinedText.includes('italian') && !combinedText.includes('pizza') && !combinedText.includes('carbonara')) {
        return '/images/Italian2.jpg';
    }
    
    // General Asian dishes (use second stir fry image)
    if (combinedText.includes('asian') && !combinedText.includes('stir fry')) {
        return '/images/Healthy_Asian_Stir_Fry2.jpg';
    }
    
    // General curry dishes (use second curry image)
    if (combinedText.includes('curry') && !combinedText.includes('lentil')) {
        return '/images/Creamy_Coconut_Lentil_and_Sweet_Potato_Curry2.jpg';
    }
    
    // Vegetarian/Vegan dishes (use third quinoa image)
    if (combinedText.includes('vegetarian') || combinedText.includes('vegan') || 
        combinedText.includes('tofu') || combinedText.includes('tempeh')) {
        return '/images/Mediterranean_Quinoa_Bowl3.jpg';
    }
    
    // Quick/Easy dishes (use third pasta image)
    if (combinedText.includes('quick') || combinedText.includes('easy') || 
        combinedText.includes('simple') || combinedText.includes('fast')) {
        return '/images/Pasta3.jpeg';
    }
    
    // Spicy dishes (use third stir fry image)
    if (combinedText.includes('spicy') && !combinedText.includes('thai basil chicken')) {
        return '/images/Healthy_Asian_Stir_Fry3.jpg';
    }
    
    // Default to cycling through local images
    return getLocalImage();
};

/**
 * Get the background image for the hero section
 * Updated to use bg3.jpg
 */
export const getHeroBackgroundImage = (): string => {
    return '/images/bg3.jpg';
};

/**
 * Preload images for better performance
 */
export const preloadImages = (): void => {
    // Preload local recipe images
    localImages.forEach((src) => {
        const img = new Image();
        img.src = src;
    });
    
    // Preload hero background image
    const heroImg = new Image();
    heroImg.src = getHeroBackgroundImage();
};

/**
 * Initialize image utilities
 */
export const initializeImageUtils = (): void => {
    preloadImages();
}; 