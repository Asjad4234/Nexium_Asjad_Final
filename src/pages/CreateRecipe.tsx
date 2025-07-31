import { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import Loading from '../components/Loading';
import StepComponent from '../components/Recipe_Creation/StepComponent';
import ReviewComponent from '../components/Recipe_Creation/ReviewIngredients';
import SelectRecipesComponent from '../components/Recipe_Creation/SelectRecipes';
import LimitReached from '../components/Recipe_Creation/LimitReached';
import { call_api, getServerSidePropsUtility } from '../utils/utils';
import { Ingredient, DietaryPreference, Recipe, IngredientDocumentType } from '../types/index';

const steps = [
  'Choose Ingredients',
  'Choose Diet',
  'Review and Create Recipes',
  'Select Recipes',
];

const initialIngredients: Ingredient[] = [];
const initialPreferences: DietaryPreference[] = [];
const initialRecipes: Recipe[] = [];
const initialSelectedIds: string[] = [];

function Navigation({
  recipeCreationData,
}: {
  recipeCreationData: {
    ingredientList: IngredientDocumentType[];
    reachedLimit: boolean;
  };
}) {
  const [step, setStep] = useState(0);
  const [ingredients, setIngredients] = useState(initialIngredients);
  const [preferences, setPreferences] = useState(initialPreferences);
  const [generatedRecipes, setGeneratedRecipes] = useState(initialRecipes);
  const [selectedRecipeIds, setSelectedRecipeIds] = useState(initialSelectedIds);
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [loadingType, setLoadingType] = useState<'generation' | 'saving'>('generation')

  const router = useRouter();
  const { oldIngredients } = router.query;

  useEffect(() => {
    if (oldIngredients && Array.isArray(oldIngredients)) {
      setIngredients(
        oldIngredients.map((i) => ({ name: i, quantity: null, id: uuidv4() }))
      );
    }
  }, [oldIngredients]);


  const handleIngredientSubmit = async () => {
    try {
      setIsLoading(true);
      setIsComplete(false);
      setLoadingType('generation');

      const { recipes, geminiPromptId } = await call_api({
        address: '/api/generate-recipes',
        method: 'post',
        payload: {
          ingredients,
          dietaryPreferences: preferences,
        },
      });
      
      // Debug logging
      console.log('API response:', { recipes, geminiPromptId });
      
      let parsedRecipes = JSON.parse(recipes);
      
      // Debug logging
      console.log('Parsed recipes:', parsedRecipes);
      
      parsedRecipes = parsedRecipes.map((recipe: Recipe, idx: number) => ({
        ...recipe,
        openaiPromptId: `${geminiPromptId}-${idx}`, // Make unique for client key iteration
      }));
      
      // Debug logging
      console.log('Final recipes with IDs:', parsedRecipes);
      
      setGeneratedRecipes(parsedRecipes);
      setIsComplete(true);
      setTimeout(() => {
        setIsLoading(false);
        setStep(step + 1);
      }, 500); // Smooth transition after completion
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleRecipeSubmit = async (recipes: Recipe[]) => {
    try {
      setIsLoading(true);
      setIsComplete(false);
      setLoadingType('saving');
      await call_api({
        address: '/api/save-recipes',
        method: 'post',
        payload: { recipes },
      });
      setIsComplete(true);

      setTimeout(() => {
        setIsLoading(false);
        setIngredients(initialIngredients);
        setPreferences(initialPreferences);
        setGeneratedRecipes(initialRecipes);
        setSelectedRecipeIds(initialSelectedIds);
        setStep(0);
        router.push('/Profile');
      }, 500);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };


  return recipeCreationData.reachedLimit ? (
    <LimitReached
      message="You have reached the maximum number of interactions with our AI services. Please try again later."
      actionText="Go to Home"
      fullHeight
    />
  ) : (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Create Amazing <span className="text-orange-500">Recipes</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Let AI help you transform your ingredients into delicious recipes tailored to your preferences.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className={`w-full space-y-6 ${generatedRecipes.length ? 'max-w-7xl' : 'max-w-3xl'} mx-auto`}> 
        {generatedRecipes.length === 0 ? (
          steps.slice(0, 3).map((title, idx) => (
            <div key={title} className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              <button
                className={`w-full flex items-center justify-between p-6 font-semibold text-left transition-all duration-300 ${
                  step === idx ? 'bg-white text-gray-800 border-b border-gray-100' : 'bg-white/50 text-gray-700 hover:bg-white/80'
                }`}
                onClick={() => setStep(step === idx ? -1 : idx)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step === idx ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {idx + 1}
                  </div>
                  <span className="text-lg">{title}</span>
                </div>
                <ChevronDownIcon
                  className={`w-6 h-6 transform transition-transform duration-300 ${step === idx ? 'rotate-180' : ''}`}
                />
              </button>
              {step === idx && (
                <div className="p-6 bg-white">
                  {isLoading ? (
                    <Loading isProgressBar isComplete={isComplete} loadingType={loadingType} />
                  ) : (
                    <StepComponent
                      step={idx}
                      ingredientList={recipeCreationData.ingredientList}
                      ingredients={ingredients}
                      updateIngredients={setIngredients}
                      preferences={preferences}
                      updatePreferences={setPreferences}
                      editInputs={() => setStep(0)}
                      handleIngredientSubmit={handleIngredientSubmit}
                      generatedRecipes={generatedRecipes}
                    />
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <>
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              <div className="p-6">
                <ReviewComponent
                  ingredients={ingredients}
                  dietaryPreference={preferences}
                  onSubmit={() => {}}
                  onEdit={() => {}}
                  generatedRecipes={generatedRecipes}
                />
              </div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden p-6">
              {isLoading ? (
                <Loading isProgressBar isComplete={isComplete} loadingType={loadingType} />
              ) : (
                <SelectRecipesComponent
                  generatedRecipes={generatedRecipes}
                  selectedRecipes={selectedRecipeIds}
                  updateSelectedRecipes={setSelectedRecipeIds}
                  handleRecipeSubmit={handleRecipeSubmit}
                />
              )}
            </div>
          </>
        )}
        </div>
      </div>

    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return await getServerSidePropsUtility(context, 'api/get-ingredients', 'recipeCreationData');
};

export default Navigation;