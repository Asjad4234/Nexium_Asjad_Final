import React from 'react';
import RecipeImage from '../RecipeImage';
import { ExtendedRecipe } from '../../types';
import { getDifficultyLevel, getDifficultyColor, getRating } from '../../utils/recipeUtils';

interface FrontDisplayProps {
    recipe: ExtendedRecipe;
    showRecipe: (recipe: ExtendedRecipe) => void;
    updateRecipeList: (recipe: ExtendedRecipe) => void
}

const FrontDisplay = React.forwardRef<HTMLDivElement, FrontDisplayProps>(
    ({ recipe, showRecipe, updateRecipeList }, ref) => {
        // Generate dynamic difficulty and rating based on recipe name
        const difficulty = getDifficultyLevel(recipe.name);
        const difficultyColor = getDifficultyColor(difficulty);
        const rating = getRating(recipe.name);
        
        // Extract ingredient names for keyword matching
        const ingredientNames = recipe.ingredients?.map(ing => ing.name).filter(Boolean) || [];
        
        return (
            <div ref={ref} className="recipe-card bg-white rounded-2xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-2 flex flex-col h-full overflow-hidden animate-fadeInUp group">
                {/* Image Container - Fixed height with explicit styling */}
                <div 
                    className="relative w-full overflow-hidden rounded-t-2xl bg-gray-100"
                    style={{ 
                        height: '256px', 
                        minHeight: '256px',
                        position: 'relative'
                    }}
                >
                    <RecipeImage
                        src=""
                        alt={recipe.name}
                        fill
                        priority
                        recipeName={recipe.name}
                        ingredients={ingredientNames}
                        className="group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Recipe Title Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                        <h3 className="text-lg font-bold mb-1">{recipe.name}</h3>
                        <p className="text-sm opacity-90">{recipe.additionalInformation.cookingTime || 'Quick & Easy'}</p>
                    </div>
                    
                    {/* Difficulty Badge */}
                    <div className="absolute top-3 left-3">
                        <span className={`${difficultyColor} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
                            {difficulty}
                        </span>
                    </div>
                    
                    {/* Rating Badge */}
                    <div className="absolute top-3 right-3">
                        <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                            </svg>
                            {rating}
                        </span>
                    </div>
                </div>
                
                {/* Content Section */}
                <div className="p-6 flex-grow flex flex-col">
                    {/* Description */}
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
                        {recipe.description || recipe.additionalInformation.nutritionalInformation}
                    </p>
                    

                    
                    {/* Dietary Preferences */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {recipe.dietaryPreference.slice(0, 3).map((preference) => (
                            <span 
                                key={preference} 
                                className="px-3 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full"
                            >
                                {preference}
                            </span>
                        ))}
                        {recipe.dietaryPreference.length > 3 && (
                            <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                                +{recipe.dietaryPreference.length - 3} more
                            </span>
                        )}
                    </div>
                    
                    {/* Action Button */}
                    <div className="mt-auto">
                        <button
                            onClick={() => showRecipe(recipe)}
                            className="w-full bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-300 shadow-lg hover:shadow-xl"
                        >
                            View Recipe
                        </button>
                    </div>
                </div>
            </div>
        );
    }
);

FrontDisplay.displayName = 'FrontDisplay';

export default FrontDisplay;


