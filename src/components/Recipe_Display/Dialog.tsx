import { useEffect, useState } from 'react';
import { DialogBackdrop, Dialog, DialogPanel } from '@headlessui/react';
import Image from 'next/image';
import { EllipsisVerticalIcon } from '@heroicons/react/16/solid'
import useActionPopover from '../Hooks/useActionPopover';
import RecipeCard from '../RecipeCard';
import Loading from '../Loading';
import { ActionPopover } from './ActionPopover';
import UserLink from '../UserLink';
import { formatDate } from '../../utils/utils';
import { ExtendedRecipe } from '../../types';

interface RecipeDialogProps {
    isOpen: boolean;
    close: () => void;
    recipe: ExtendedRecipe | null;
    removeRecipe: ({ message, error }: { message: string, error: string }) => void;
    handleRecipeListUpdate: (r: ExtendedRecipe | null, deleteId?: string | undefined) => void
}

export default function RecipeDisplayModal({ isOpen, close, recipe, removeRecipe, handleRecipeListUpdate }: RecipeDialogProps) {
    const [isLoading, setIsLoading] = useState(false)



    const {
        handleClone,
        handleCopy,
        handleDeleteDialog,
        handleDeleteRecipe,
        linkCopied,
        isDeleteDialogOpen
    } = useActionPopover(recipe);



    const deleteAndRemoveRecipe = async () => {
        try {
            setIsLoading(true)
            const { message, error } = await handleDeleteRecipe();
            setIsLoading(false)
            removeRecipe({ message, error })
        } catch (error) {
            console.error(error)
        }
    }

    if (!recipe) return null;

    return (
        <>
            <Dialog open={isOpen} as="div" className="relative z-modal focus:outline-none" onClose={close}>
                <DialogBackdrop className="fixed inset-0 bg-black/50" />
                <div className="fixed inset-0 z-overlay w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <DialogPanel
                            className="w-full max-w-md rounded-xl bg-white p-1 backdrop-blur-2xl duration-300 ease-out"
                        >
                            <div className="flex flex-col items-center">
                                {
                                    <div className="flex justify-between items-start w-full">
                                        <div className="flex items-center mb-2 mt-2 ml-2 bg-gray-100 p-2 rounded-lg">
                                            <div className="ml-2">
                                                <p className="text-lg font-semibold text-gray-900">
                                                    <UserLink
                                                        userId={recipe.owner?._id || ''}
                                                        name={recipe.owner?.name || 'Unknown User'}
                                                    />
                                                </p>
                                                <p className="text-sm text-gray-500">{formatDate(recipe.createdAt)}</p>
                                            </div>
                                        </div>
                                        <ActionPopover
                                            handlers={{
                                                handleClone,
                                                handleCopy,
                                                closeDialog: close,
                                                deleteDialog: handleDeleteDialog,
                                                deleteRecipe: deleteAndRemoveRecipe,
                                            }}
                                            states={{
                                                linkCopied,
                                                isDeleteDialogOpen,
                                            }}
                                            data={{
                                                recipe,
                                                buttonType: <EllipsisVerticalIcon className="h-6 w-6 text-gray-700" />,
                                            }}

                                        />
                                    </div>
                                }
                                {
                                    isLoading ?
                                        <Loading />
                                        :
                                        <RecipeCard recipe={recipe} selectedRecipes={[]} removeMargin />
                                }
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </>
    );
}
