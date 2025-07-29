import { GoogleGenerativeAI } from '@google/generative-ai';
import { Ingredient, DietaryPreference, Recipe, ExtendedRecipe } from '../types/index';
import aiGenerated from '../models/aigenerated';
import { connectDB } from '../lib/mongodb';
import recipeModel from '../models/recipe';
import {
    getRecipeGenerationPrompt,
    getImageGenerationPrompt,
    getIngredientValidationPrompt,
    getRecipeTaggingPrompt,
    getChatAssistantSystemPrompt
} from './prompts';

// Initialize Gemini client with API key from environment
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Save Gemini responses in the database for logging/tracking
type SaveGeminiResponsesType = {
    userId: string;
    prompt: string;
    response: any;
    model?: string;
};

const saveGeminiResponses = async ({ userId, prompt, response, model }: SaveGeminiResponsesType) => {
    try {
        await connectDB();
        const { _id } = await aiGenerated.create({
            userId,
            prompt,
            response,
            model,
        });
        return _id;
    } catch (error) {
        console.error('Failed to save response to db:', error);
        return null;
    }
};

type ResponseType = {
    recipes: string | null;
    geminiPromptId: string;
};

// Generate recipes by sending a prompt to Gemini using ingredients and dietary preferences
export const generateRecipe = async (ingredients: Ingredient[], dietaryPreferences: DietaryPreference[], userId: string): Promise<ResponseType> => {
    try {
        const prompt = getRecipeGenerationPrompt(ingredients, dietaryPreferences);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        const _id = await saveGeminiResponses({ 
            userId, 
            prompt, 
            response: { text, usageMetadata: result.response.usageMetadata }, 
            model: 'gemini-2.0-flash-exp' 
        });
        
        return { recipes: text, geminiPromptId: _id || 'null-prompt-id' };
    } catch (error) {
        console.error('Failed to generate recipe:', error);
        throw new Error('Failed to generate recipe');
    }
};

// Image generation moved to n8n workflow
// This function will be replaced with a call to n8n webhook
export const generateImages = async (recipes: Recipe[], userId: string) => {
    try {
        // Call n8n webhook to generate images
        const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
        if (!n8nWebhookUrl) {
            throw new Error('N8N webhook URL not configured');
        }

        const response = await fetch(n8nWebhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                recipes: recipes.map(recipe => ({
                    name: recipe.name,
                    ingredients: recipe.ingredients,
                    userId: userId
                }))
            })
        });

        if (!response.ok) {
            throw new Error('Failed to generate images via n8n');
        }

        const result = await response.json();
        return result.images || [];
    } catch (error) {
        console.error('Error generating images via n8n:', error);
        throw new Error('Failed to generate images');
    }
};

// Validate an ingredient name by sending a prompt to Gemini and returning its response
export const validateIngredient = async (ingredientName: string, userId: string): Promise<string | null> => {
    try {
        const prompt = getIngredientValidationPrompt(ingredientName);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        await saveGeminiResponses({ 
            userId, 
            prompt, 
            response: { text, usageMetadata: result.response.usageMetadata }, 
            model: 'gemini-2.0-flash-exp' 
        });
        
        return text;
    } catch (error) {
        console.error('Failed to validate ingredient:', error);
        throw new Error('Failed to validate ingredient');
    }
};

// Generate tags for a recipe by sending a tagging prompt to Gemini and updating the recipe document in the database
export const generateRecipeTags = async (recipe: ExtendedRecipe, userId: string): Promise<undefined> => {
    try {
        const prompt = getRecipeTaggingPrompt(recipe);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const rawTags = response.text().trim();
        
        await saveGeminiResponses({ 
            userId, 
            prompt, 
            response: { text: rawTags, usageMetadata: result.response.usageMetadata }, 
            model: 'gemini-2.0-flash-exp' 
        });
        
        let tagsArray: string[] = [];
        if (rawTags) {
            try {
                tagsArray = JSON.parse(rawTags);
                if (!Array.isArray(tagsArray) || tagsArray.some(tag => typeof tag !== 'string')) {
                    throw new Error('Invalid JSON structure: Expected an array of strings.');
                }
            } catch (jsonError) {
                console.error('JSON parsing error:', jsonError);
                console.error('Received malformed JSON:', rawTags);
                throw new Error(`Failed to parse tags from Gemini response. --> ${jsonError}`);
            }
        }
        
        if (tagsArray.length) {
            const tags = tagsArray.map((tag: string) => ({ tag: tag.toLowerCase() }));
            const update = { $set: { tags } };
            console.info(`Adding tags -> ${tagsArray} for new recipe -> ${recipe.name} from Gemini api`);
            await recipeModel.findByIdAndUpdate(recipe._id, update);
        }
        return;
    } catch (error) {
        console.error('Failed to generate tags for the recipe:', error);
        throw new Error(`Failed to generate tags for the recipe --> ${error}`);
    }
};

// Generate a chat response by sending a message to Gemini and returning the assistant's reply
export const generateChatResponse = async (
    message: string,
    recipe: ExtendedRecipe,
    history: any[],
    userId: string
): Promise<{ reply: string; totalTokens: number }> => {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
        
        // Convert history to Gemini format
        const chat = model.startChat({
            history: history.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }]
            })),
            generationConfig: {
                maxOutputTokens: 1000,
            },
        });

        const systemPrompt = getChatAssistantSystemPrompt(recipe);
        const fullMessage = `${systemPrompt}\n\nUser: ${message}`;
        
        const result = await chat.sendMessage(fullMessage);
        const response = await result.response;
        const reply = response.text() || 'Sorry, I had trouble responding.';
        const totalTokens = result.response.usageMetadata?.totalTokenCount || 0;

        // Save to DB only on first message
        if (history.length === 1) {
            await saveGeminiResponses({
                userId,
                prompt: `Chat session started for recipe: ${recipe.name}, first message: ${message}`,
                response: { text: reply, usageMetadata: result.response.usageMetadata },
                model: 'gemini-2.0-flash-exp',
            });
        }

        return { reply, totalTokens };
    } catch (error) {
        console.error('Failed to generate chat response:', error);
        return { reply: 'Sorry, I had trouble responding.', totalTokens: 0 };
    }
}; 