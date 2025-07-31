// Utility functions for recipe difficulty and rating generation

export const getDifficultyLevel = (recipeName: string): 'Easy' | 'Medium' | 'Hard' => {
    // Use recipe name to generate consistent difficulty
    const hash = recipeName.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
    }, 0);
    
    const difficultyIndex = Math.abs(hash) % 3;
    const difficulties: ('Easy' | 'Medium' | 'Hard')[] = ['Easy', 'Medium', 'Hard'];
    return difficulties[difficultyIndex];
};

export const getDifficultyColor = (difficulty: 'Easy' | 'Medium' | 'Hard'): string => {
    switch (difficulty) {
        case 'Easy': return 'bg-green-500';
        case 'Medium': return 'bg-yellow-500';
        case 'Hard': return 'bg-red-500';
        default: return 'bg-green-500';
    }
};

export const getRating = (recipeName: string): number => {
    // Use recipe name to generate consistent rating between 4.5-5.0
    const hash = recipeName.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
    }, 0);
    
    // Generate rating between 4.5 and 5.0
    const baseRating = 4.5;
    const variation = (Math.abs(hash) % 6) * 0.1; // 0.0 to 0.5
    return Math.round((baseRating + variation) * 10) / 10; // Round to 1 decimal place
};

// Additional utility functions for recipe display
export const getCookingTime = (recipeName: string): string => {
    const hash = recipeName.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
    }, 0);
    
    const times = ['15-20 min', '25-30 min', '35-40 min', '45-50 min', '55-60 min'];
    const timeIndex = Math.abs(hash) % times.length;
    return times[timeIndex];
};

export const getServings = (recipeName: string): number => {
    const hash = recipeName.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
    }, 0);
    
    const servings = [2, 3, 4, 6, 8];
    const servingIndex = Math.abs(hash) % servings.length;
    return servings[servingIndex];
}; 