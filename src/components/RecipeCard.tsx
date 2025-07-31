import { Switch, Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { Recipe } from '../types/index';
import { useState } from 'react';
import RecipeImage from './RecipeImage';

interface RecipeCardProps {
    recipe: Recipe;
    handleRecipeSelection?: (id: string) => void;
    selectedRecipes: string[];
    showSwitch?: boolean;
    removeMargin?: boolean;
}

const RecipeCard = ({ recipe, handleRecipeSelection, selectedRecipes, showSwitch, removeMargin }: RecipeCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const parentClassName = `max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden relative ${removeMargin ? '' : 'mt-10 mb-5'}`;

    // Extract ingredient names for keyword matching
    const ingredientNames = recipe.ingredients?.map(ing => ing.name).filter(Boolean) || [];

    return (
        <div className={`${parentClassName} overflow-x-hidden`} key={recipe.name}>
            {/* Recipe Image - Fixed height with explicit styling */}
            <div 
                className="relative w-full overflow-hidden bg-gray-100"
                style={{ 
                    height: '192px', 
                    minHeight: '192px',
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
                    className="transition-transform duration-300 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
            </div>

            <div className="px-6 py-4 relative">

                {/* === Recipe Title and Optional Switch === */}
                <div className="flex justify-between items-stretch w-full">
                    {/* Recipe Name - Expandable Only If Switch Exists */}
                    <div
                        className={`font-bold text-lg sm:text-xl lg:text-2xl mb-4 
            ${showSwitch && !isExpanded ? 'truncate max-w-[65%] sm:max-w-[75%] lg:max-w-[85%]' : 'w-full'}
            ${showSwitch ? 'cursor-pointer' : ''}
        `}
                        onClick={() => showSwitch && setIsExpanded(!isExpanded)}
                        title={!showSwitch ? (recipe.name || 'Untitled Recipe') : ''} // Tooltip for non-switch titles
                    >
                        {recipe.name || 'Untitled Recipe'}
                    </div>

                    {/* Optional Switch to Select Recipe */}
                    {showSwitch && (
                        <Switch
                            checked={selectedRecipes.includes(recipe.openaiPromptId || '')}
                            onChange={() =>
                                handleRecipeSelection ? handleRecipeSelection(recipe.openaiPromptId || '') : undefined
                            }
                            className={`
                relative inline-flex flex-shrink-0
                ${selectedRecipes.includes(recipe.openaiPromptId || '') ? 'bg-brand-500' : 'bg-gray-300'}
                h-[20px] w-[40px] sm:h-[28px] sm:w-[54px]
                cursor-pointer rounded-full border-2 border-transparent
                transition-colors duration-200 ease-in-out focus:outline-none
            `}
                        >
                            <span className="sr-only">Use setting</span>
                            <span
                                aria-hidden="true"
                                className={`
                    pointer-events-none inline-block
                    h-[16px] w-[16px] sm:h-[24px] sm:w-[23px]
                    ${selectedRecipes.includes(recipe.openaiPromptId || '') ? 'translate-x-5 sm:translate-x-7' : 'translate-x-0'}
                    transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out
                `}
                            />
                        </Switch>
                    )}
                </div>


                {/* === Ingredients Section === */}
                <h3 className="text-gray-700 font-semibold text-lg">Ingredients:</h3>
                <ul className="mb-4 flex flex-wrap gap-2">
                    {recipe.ingredients && Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 ? (
                        recipe.ingredients.map((ingredient, index) => (
                            <li key={ingredient.name || index}>
                                <span className="bg-brand-100 text-brand-800 text-sm font-medium px-2.5 py-0.5 rounded">
                                    {`${ingredient.name}${ingredient.quantity ? ` (${ingredient.quantity})` : ''}`}
                                </span>
                            </li>
                        ))
                    ) : (
                        <li className="text-gray-500 italic">No ingredients available</li>
                    )}
                </ul>

                {/* === Dietary Preferences === */}
                <h3 className="text-gray-700 font-semibold text-lg">Dietary Preference:</h3>
                <div className="mb-5 mt-2 flex flex-wrap gap-2">
                    {recipe.dietaryPreference && Array.isArray(recipe.dietaryPreference) && recipe.dietaryPreference.length > 0 ? (
                        recipe.dietaryPreference.map((preference) => (
                            <span
                                key={preference}
                                className="bg-purple-100 text-purple-800 text-sm font-medium px-2.5 py-0.5 rounded"
                            >
                                {preference}
                            </span>
                        ))
                    ) : (
                        <span className="text-gray-500 italic">No dietary preferences specified</span>
                    )}
                </div>

                {/* === Collapsible: Instructions === */}
                <Disclosure>
                    {({ open }) => (
                        <>
                            <DisclosureButton className="flex justify-between w-full px-4 py-2 text-lg font-semibold text-left text-brand-900 bg-brand-100 rounded-lg hover:bg-brand-200 focus:outline-none">
                                <span>Instructions</span>
                                <ChevronDownIcon className={`w-5 h-5 transform transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
                            </DisclosureButton>

                            <DisclosurePanel
                                className={`mt-2 px-4 pt-4 pb-2 text-sm leading-relaxed bg-gray-50 border border-gray-200 rounded-lg space-y-2 transition-all duration-300 ease-in-out ${open ? 'opacity-100 max-h-none' : 'opacity-0 max-h-0'
                                    } overflow-hidden`}
                            >
                                <ol className="list-decimal ml-5 space-y-2">
                                    {recipe.instructions && Array.isArray(recipe.instructions) && recipe.instructions.length > 0 ? (
                                        recipe.instructions.map((instruction, idx) => (
                                            <li key={idx} className="mb-2">
                                                {instruction.replace(/^\d+\.\s*/, '')} {/* Remove any manual numbering */}
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-gray-500 italic">No instructions available</li>
                                    )}
                                </ol>
                            </DisclosurePanel>
                        </>
                    )}
                </Disclosure>

                {/* === Collapsible: Additional Information === */}
                <Disclosure as="div" className="mt-4">
                    {({ open }) => (
                        <>
                            <DisclosureButton className="flex justify-between w-full px-4 py-2 text-lg font-semibold text-left text-brand-900 bg-brand-100 rounded-lg hover:bg-brand-200 focus:outline-none">
                                <span>Additional Information</span>
                                <ChevronDownIcon className={`w-5 h-5 transform transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
                            </DisclosureButton>

                            <DisclosurePanel
                                className={`mt-2 px-4 pt-4 pb-2 text-sm leading-relaxed bg-gray-50 border border-gray-200 rounded-lg space-y-2 transition-all duration-300 ease-in-out ${open ? 'opacity-100 max-h-none' : 'opacity-0 max-h-0'
                                    } overflow-hidden`}
                            >
                                <div className="mb-2"><strong>Tips:</strong> {recipe.additionalInformation?.tips || 'No tips available'}</div>
                                <div className="mb-2"><strong>Variations:</strong> {recipe.additionalInformation?.variations || 'No variations available'}</div>
                                <div className="mb-2"><strong>Serving Suggestions:</strong> {recipe.additionalInformation?.servingSuggestions || 'No serving suggestions available'}</div>
                                <div className="mb-2"><strong>Nutritional Information:</strong> {recipe.additionalInformation?.nutritionalInformation || 'No nutritional information available'}</div>
                            </DisclosurePanel>
                        </>
                    )}
                </Disclosure>
            </div>
        </div>
    );
};

export default RecipeCard;
