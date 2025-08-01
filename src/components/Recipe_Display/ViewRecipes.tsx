
import { useState } from 'react';
import FrontDisplay from './FrontDisplay'
import Dialog from './Dialog'
import { ExtendedRecipe } from '../../types';

interface ViewRecipesProps {
    recipes: ExtendedRecipe[]
    handleRecipeListUpdate: (r: ExtendedRecipe | null, deleteId?: string) => void
    lastRecipeRef?: React.RefObject<HTMLDivElement>
}
const initialDialogContents: ExtendedRecipe | null = null

function ViewRecipes({ recipes, handleRecipeListUpdate, lastRecipeRef }: ViewRecipesProps) {
    const [openDialog, setOpenDialog] = useState(initialDialogContents);

    const handleShowRecipe = (recipe: ExtendedRecipe) => {
        setOpenDialog(recipe)
    }
    const removeRecipe = async ({ message, error }:{message: string, error: string}) => {
        if (!openDialog) return;
        try {
            setOpenDialog(null)
            if (error) {
                throw new Error(error)
            }
            if (message) {
                handleRecipeListUpdate(null, openDialog._id)
            }
        } catch (error) {
            console.error(error)
        }
    }

    if (!recipes.length) return null;
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
                {recipes.map((recipe, index) => (
                    <FrontDisplay
                        key={recipe._id}
                        recipe={recipe}
                        showRecipe={handleShowRecipe}
                        updateRecipeList={handleRecipeListUpdate}
                        ref={index === recipes.length - 1 ? lastRecipeRef : undefined}
                    />
                ))}
            </div>
            <Dialog
                isOpen={Boolean(openDialog)}
                close={() => setOpenDialog(null)}
                recipe={openDialog}
                removeRecipe={removeRecipe}
                handleRecipeListUpdate={(args)=>{
                    handleRecipeListUpdate(args)
                    setOpenDialog(args)
                }}
            />
        </>
    )
}

export default ViewRecipes;