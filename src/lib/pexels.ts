// Pexels API integration for recipe images
const PEXELS_API_KEY = process.env.NEXT_PUBLIC_PEXELS_API_KEY || 'YOUR_PEXELS_API_KEY';
const PEXELS_API_URL = 'https://api.pexels.com/v1';

// Food-related search terms for recipe images
const FOOD_SEARCH_TERMS = [
    'food',
    'cooking',
    'recipe',
    'delicious',
    'homemade',
    'fresh food',
    'healthy food',
    'gourmet',
    'cuisine',
    'meal',
    'dish',
    'ingredients',
    'cooking ingredients',
    'fresh ingredients',
    'organic food',
    'home cooking',
    'kitchen',
    'chef',
    'restaurant food',
    'traditional food'
];

// Cache for storing fetched images
let imageCache: string[] = [];
let lastFetchTime = 0;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export interface PexelsImage {
    id: number;
    width: number;
    height: number;
    url: string;
    photographer: string;
    photographer_url: string;
    src: {
        original: string;
        large2x: string;
        large: string;
        medium: string;
        small: string;
        portrait: string;
        landscape: string;
        tiny: string;
    };
}

export interface PexelsResponse {
    photos: PexelsImage[];
    total_results: number;
    page: number;
    per_page: number;
    next_page?: string;
}

/**
 * Fetch food images from Pexels API
 */
export async function fetchFoodImages(count: number = 20, forceRefresh: boolean = false): Promise<string[]> {
    // Check cache first (unless force refresh is requested)
    if (!forceRefresh && imageCache.length > 0 && Date.now() - lastFetchTime < CACHE_DURATION) {
        return imageCache.slice(0, count);
    }

    try {
        const randomTerm = FOOD_SEARCH_TERMS[Math.floor(Math.random() * FOOD_SEARCH_TERMS.length)];
        const response = await fetch(
            `${PEXELS_API_URL}/search?query=${encodeURIComponent(randomTerm)}&per_page=${count}&orientation=landscape`,
            {
                headers: {
                    'Authorization': PEXELS_API_KEY,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Pexels API error: ${response.status}`);
        }

        const data: PexelsResponse = await response.json();
        
        // Extract image URLs (using medium size for good quality and performance)
        const imageUrls = data.photos.map(photo => photo.src.medium);
        
        // Update cache
        imageCache = imageUrls;
        lastFetchTime = Date.now();
        
        return imageUrls;
    } catch (error) {
        console.error('Error fetching Pexels images:', error);
        
        // Return fallback images if API fails
        return getFallbackImages();
    }
}

/**
 * Get a random food image URL
 */
export async function getRandomFoodImage(): Promise<string> {
    // Always try to fetch fresh images from Pexels API
    try {
        const images = await fetchFoodImages(20, true); // Force refresh for fresh images
        if (images.length > 0) {
            return images[Math.floor(Math.random() * images.length)];
        }
    } catch (error) {
        console.error('Failed to fetch from Pexels API:', error);
    }
    
    // Only use fallback if API completely fails
    const fallbackImages = getFallbackImages();
    return fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
}

/**
 * Fallback images in case Pexels API is unavailable
 */
function getFallbackImages(): string[] {
    return [
        'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
        'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
        'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
        'https://images.pexels.com/photos/1640775/pexels-photo-1640775.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
        'https://images.pexels.com/photos/1640776/pexels-photo-1640776.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
        'https://images.pexels.com/photos/1640778/pexels-photo-1640778.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
        'https://images.pexels.com/photos/1640779/pexels-photo-1640779.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
        'https://images.pexels.com/photos/1640780/pexels-photo-1640780.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
        'https://images.pexels.com/photos/1640781/pexels-photo-1640781.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
        'https://images.pexels.com/photos/1640782/pexels-photo-1640782.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
        'https://images.pexels.com/photos/1640783/pexels-photo-1640783.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
        'https://images.pexels.com/photos/1640784/pexels-photo-1640784.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
        'https://images.pexels.com/photos/1640785/pexels-photo-1640785.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
        'https://images.pexels.com/photos/1640786/pexels-photo-1640786.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
        'https://images.pexels.com/photos/1640787/pexels-photo-1640787.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
    ];
}

/**
 * Get a recipe-specific image from Pexels API
 */
export async function getRecipeImage(recipeName: string): Promise<string> {
    try {
        const searchTerm = encodeURIComponent(recipeName + ' food');
        const response = await fetch(
            `${PEXELS_API_URL}/search?query=${searchTerm}&per_page=1&orientation=landscape`,
            {
                headers: {
                    'Authorization': PEXELS_API_KEY,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Pexels API error: ${response.status}`);
        }

        const data: PexelsResponse = await response.json();
        
        if (data.photos && data.photos.length > 0) {
            return data.photos[0].src.medium;
        }
    } catch (error) {
        console.error('Error fetching recipe-specific image from Pexels:', error);
    }
    
    // Return a random food image if recipe-specific search fails
    return getRandomFoodImage();
}

/**
 * Update existing recipe images from Unsplash to Pexels
 */
export async function updateRecipeImagesToPexels(recipes: any[]): Promise<any[]> {
    const updatedRecipes = await Promise.all(
        recipes.map(async (recipe) => {
            // Check if recipe has Unsplash image or no image
            if (!recipe.imgLink || recipe.imgLink.includes('unsplash.com')) {
                try {
                    const pexelsImage = await getRecipeImage(recipe.name);
                    return {
                        ...recipe,
                        imgLink: pexelsImage
                    };
                } catch (error) {
                    console.error(`Failed to update image for recipe ${recipe.name}:`, error);
                    return recipe;
                }
            }
            return recipe;
        })
    );
    
    return updatedRecipes;
}

/**
 * Initialize Pexels images on app startup
 */
export async function initializePexelsImages(): Promise<void> {
    try {
        await fetchFoodImages(20);
        console.log('Pexels images initialized successfully');
    } catch (error) {
        console.error('Failed to initialize Pexels images:', error);
    }
} 