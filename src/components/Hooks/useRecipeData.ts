import { useEffect, useState } from 'react';
import { call_api } from '../../utils/utils';
import { ExtendedRecipe } from '../../types';

export const useRecipeData = (recipeId?: string) => {
  const [recipeData, setRecipeData] = useState<ExtendedRecipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!recipeId) return;

    const fetchRecipe = async () => {
      try {
        console.log('Fetching recipe data for ID:', recipeId);
        const data = await call_api({
          address: `/api/get-single-recipe?recipeId=${recipeId}`,
        });
        setRecipeData(data);
      } catch (err: any) {
        console.error('Error fetching recipe:', err);
        // Handle specific error types
        if (err?.response?.status === 401) {
          setError('You must be logged in to access this recipe.');
        } else if (err?.response?.status === 404) {
          setError('Recipe not found.');
        } else {
          setError(err?.message || 'Failed to load recipe data.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [recipeId]);

  return { recipeData, loading, error, setRecipeData, setLoading };
};
