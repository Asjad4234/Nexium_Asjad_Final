import React, { useEffect, useState } from 'react';
import {
  Description, Dialog, DialogPanel,
  DialogTitle, DialogBackdrop,
  Button, Input, Field, Label
} from '@headlessui/react';
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import pluralize from 'pluralize';
import clsx from 'clsx';
import { call_api } from '../../utils/utils';
import Loading from '../Loading';
import { IngredientDocumentType } from '../../types/index';

interface NewIngredientDialogProps {
  ingredientList: IngredientDocumentType[],
  updateIngredientList: (newIngredient: IngredientDocumentType) => void
}

function NewIngredientDialog({ ingredientList, updateIngredientList }: NewIngredientDialogProps) {
  const [isOpen, setIsOpen] = useState(false); // State to manage dialog visibility
  const [ingredientName, setIngredientName] = useState(''); // State to manage the ingredient name input
  const [isLoading, setIsLoading] = useState(false); // State to manage the loading state
  const [message, setMessage] = useState(''); // State to manage feedback messages
  const [isDisabled, setIsDisabled] = useState(false); // State to manage the disabled state of the submit button

  useEffect(() => {
    setIngredientName('');
    setMessage('');
  }, [isOpen]); // Reset ingredient name and message when dialog is opened/closed

  // Handle input change for the ingredient name
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIngredientName(e.target.value);
    setMessage('');
    setIsDisabled(false);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!ingredientName.trim()) return;
    if (ingredientName.trim().length > 20) {
      setMessage('This ingredient name is too long!');
      setIsDisabled(true);
      return;
    }

    const ingredient = ingredientName.trim().toLowerCase();
    const availableIngredients = ingredientList.map(i => i.name.toLowerCase());
    const pluralizedIngredient = pluralize(ingredient);
    const singularizedIngredient = pluralize.singular(ingredient);
    const isAvailable = availableIngredients.includes(ingredient) ||
      availableIngredients.includes(pluralizedIngredient) ||
      availableIngredients.includes(singularizedIngredient);

    if (isAvailable) {
      setMessage('This ingredient is already available');
      setIsDisabled(true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await call_api({ address: '/api/validate-ingredient', method: 'post', payload: { ingredientName } });
      const { message: responseMessage, error } = response;

      if (error) {
        throw new Error(error)
      }

      if (responseMessage === 'Success') {
        const possibleSuggestions = response.suggested.join(', ');
        setMessage(`Successfully added: ${response.newIngredient.name}${possibleSuggestions ? `\nAdditional suggestions: ${possibleSuggestions}` : ''}`);
        updateIngredientList(response.newIngredient);
        setIngredientName('');
      } else if (responseMessage === 'Invalid') {
        const possibleSuggestions = response.suggested.join(', ');
        setMessage(`${ingredientName} is invalid. ${possibleSuggestions ? `Try the following suggestions: ${possibleSuggestions}` : ''}`);
        setIngredientName('');
      } else {
        setMessage(`An error occurred with validation... check back later: ${responseMessage}`);
        setIngredientName('');
      }
    } catch (error) {
      console.error(error);
      setMessage('Failed to add ingredient');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-full hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 shadow-lg transition duration-300 transform hover:scale-105">
        <PlusCircleIcon className="block mr-2 h-6 w-6" />
        Add New Ingredient
      </Button>
      <Dialog open={isOpen} onClose={() => { }} className="relative z-modal">
        <DialogBackdrop className="fixed inset-0 bg-black/50" />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-lg space-y-4 border bg-white p-12 rounded-lg shadow-lg">
            <DialogTitle className="text-xl font-bold">Add New Ingredient</DialogTitle>
            <Description className="text-sm text-gray-500">If you can&apos;t find your ingredient in the list, enter its name here. We&apos;ll validate it before adding to the database.</Description>
            <Field className="mb-4">
              <Label htmlFor="ingredientName" className="block text-sm font-medium text-gray-700">Ingredient Name</Label>
              <Input
                type="text"
                id="ingredientName"
                name="ingredientName"
                className={clsx(
                  'mt-3 block w-full rounded-lg border-none bg-black/5 py-1.5 px-3 text-sm/6 text-black',
                  'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                )}
                value={ingredientName}
                onChange={handleInputChange}
              />
            </Field>
            <div className="text-red-500 font-bold mb-2" style={{ whiteSpace: 'pre-line' }}>
              <span>{message}</span>
            </div>
            {isLoading ? <Loading /> :
              <div className="flex gap-4 flex-end">
                <Button className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button
                  className="bg-brand-600 text-white px-4 py-2 rounded-md hover:bg-brand-700 data-[disabled]:bg-gray-200"
                  onClick={handleSubmit}
                  disabled={!ingredientName.trim() || isDisabled}
                >
                  Submit
                </Button>
              </div>}
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}

export default NewIngredientDialog;
