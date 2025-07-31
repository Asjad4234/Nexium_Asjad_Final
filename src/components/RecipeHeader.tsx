import Image from 'next/image';
import UserLink from './UserLink';
import { formatDate } from '../utils/utils';
import { ExtendedRecipe } from '../types';

interface RecipeHeaderProps {
    recipeData: ExtendedRecipe;
}

const RecipeHeader = ({ recipeData }: RecipeHeaderProps) => {
    return (
        <>
            {/* Recipe Image using Next.js Image component */}
            <div className="relative w-full h-80">
                <Image
                    src={recipeData.imgLink} // Image source from recipe data
                    alt={recipeData.name} // Alt text for accessibility
                    fill // Fill the parent container
                    style={{ objectFit: 'cover' }} // Ensure the image covers the container without distortion
                    className="transform hover:scale-105 transition-transform duration-300" // Add hover effect for scaling
                    priority // Load the image with high priority
                />
            </div>
            <div className="pl-6 pt-6 pr-6">
                {/* Recipe Title */}
                <h2 className="text-2xl font-bold mb-2 mt-2">{recipeData.name}</h2> {/* Title with styling */}

                {/* Owner Information */}
                <div className="flex items-center mb-6">
                    <div>
                        <span className="text-gray-700 text-lg">By <UserLink
                            userId={recipeData.owner?._id || ''}
                            name={recipeData.owner?.name || 'Unknown User'}
                        /></span>
                        <p className="text-sm text-gray-500">{formatDate(recipeData.createdAt)}</p>
                    </div>
                </div>

                {/* Dietary Preferences */}
                <div className="mb-0">
                    <h3 className="text-lg font-semibold mb-2">Dietary Preferences</h3>
                    <div className="flex flex-wrap gap-2">
                        {recipeData.dietaryPreference.map((preference) => (
                            <span key={preference} className="px-3 py-1 bg-brand-100 text-brand-800 text-sm font-medium rounded-full">
                                {preference}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default RecipeHeader;
