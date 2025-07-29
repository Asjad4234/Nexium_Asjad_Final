/**
 * @jest-environment node
 */
import { generateRecipe, generateImages, validateIngredient, generateRecipeTags, generateChatResponse } from "../../src/lib/gemini";
import aigenerated from "../../src/models/aigenerated";
import recipe from "../../src/models/recipe";
import { GoogleGenerativeAI } from '@google/generative-ai';
import { stubRecipeBatch } from "../stub";

/* Mock Gemini API */
jest.mock('@google/generative-ai', () => {
    const mockGeminiInstance = {
        getGenerativeModel: jest.fn(() => ({
            generateContent: jest.fn(),
            startChat: jest.fn()
        }))
    };
    return {
        GoogleGenerativeAI: jest.fn(() => mockGeminiInstance)
    };
});

// mock db connection
jest.mock("../../src/lib/mongodb", () => ({
    connectDB: () => Promise.resolve()
}));

describe('generating recipes from Gemini', () => {
    let genAI: any;
    let mockModel: any;

    beforeEach(() => {
        genAI = new GoogleGenerativeAI();
        mockModel = {
            generateContent: jest.fn(),
            startChat: jest.fn()
        };
        genAI.getGenerativeModel = jest.fn(() => mockModel);
    });

    afterEach(() => {
        genAI = undefined;
        mockModel = undefined;
    });

    it('shall generate recipes given ingredients', async () => {
        // mock Gemini generate content
        const mockResponse = {
            response: {
                text: () => '["TEST-RECIPE-A", "TEST-RECIPE-B"]',
                usageMetadata: { totalTokenCount: 100 }
            }
        };
        mockModel.generateContent = jest.fn().mockImplementation(() => Promise.resolve(mockResponse));

        // mock db create query
        aigenerated.create = jest.fn().mockImplementation(
            () => Promise.resolve({ _id: 1234 }),
        );

        const ingredients = [
            {
                name: 'ingredient-1',
                id: '1'
            },
            {
                name: 'ingredient-2',
                id: '2'
            }
        ];

        const result = await generateRecipe(ingredients, ['Keto', 'Vegetarian'], 'mockUserId');
        
        expect(result).toEqual({
            recipes: '["TEST-RECIPE-A", "TEST-RECIPE-B"]',
            geminiPromptId: 1234
        });
        
        expect(mockModel.generateContent).toHaveBeenCalled();
    });

    it('shall throw error if gemini can not respond', async () => {
        mockModel.generateContent = jest.fn().mockImplementation(() => Promise.reject(new Error('API Error')));

        const ingredients = [{ name: 'ingredient-1', id: '1' }];
        
        await expect(generateRecipe(ingredients, [], 'mockUserId')).rejects.toThrow('Failed to generate recipe');
    });
});

describe('validating ingredients from Gemini', () => {
    let genAI: any;
    let mockModel: any;

    beforeEach(() => {
        genAI = new GoogleGenerativeAI();
        mockModel = {
            generateContent: jest.fn()
        };
        genAI.getGenerativeModel = jest.fn(() => mockModel);
    });

    afterEach(() => {
        genAI = undefined;
        mockModel = undefined;
    });

    it('shall validate ingredient given ingredient name', async () => {
        const mockResponse = {
            response: {
                text: () => '{"isValid": true, "possibleVariations": ["tomato", "cherry tomato"]}',
                usageMetadata: { totalTokenCount: 50 }
            }
        };
        mockModel.generateContent = jest.fn().mockImplementation(() => Promise.resolve(mockResponse));

        aigenerated.create = jest.fn().mockImplementation(
            () => Promise.resolve({ _id: "null-prompt-id" }),
        );

        const result = await validateIngredient('tomatoes', 'mockUserId');
        expect(result).toBe('{"isValid": true, "possibleVariations": ["tomato", "cherry tomato"]}');
        expect(mockModel.generateContent).toHaveBeenCalled();
    });

    it('shall throw error if gemini can not respond', async () => {
        mockModel.generateContent = jest.fn().mockImplementation(() => Promise.reject(new Error('API Error')));

        await expect(validateIngredient('tomatoes', 'mockUserId')).rejects.toThrow('Failed to validate ingredient');
    });
});

describe('generating recipe tags from Gemini', () => {
    let genAI: any;
    let mockModel: any;

    beforeEach(() => {
        genAI = new GoogleGenerativeAI();
        mockModel = {
            generateContent: jest.fn()
        };
        genAI.getGenerativeModel = jest.fn(() => mockModel);
    });

    afterEach(() => {
        genAI = undefined;
        mockModel = undefined;
    });

    it('shall generate tags for recipe', async () => {
        const mockResponse = {
            response: {
                text: () => '["italian", "pasta", "quick-meal"]',
                usageMetadata: { totalTokenCount: 30 }
            }
        };
        mockModel.generateContent = jest.fn().mockImplementation(() => Promise.resolve(mockResponse));

        aigenerated.create = jest.fn().mockImplementation(
            () => Promise.resolve({ _id: 1234 }),
        );

        recipe.findByIdAndUpdate = jest.fn().mockImplementation(() => Promise.resolve());

        const mockRecipe = {
            _id: 'recipe-id',
            name: 'Test Recipe',
            ingredients: [{ name: 'pasta', quantity: '200g' }],
            instructions: ['Cook pasta'],
            dietaryPreference: ['vegetarian'],
            additionalInformation: {
                tips: 'Cook al dente',
                variations: 'Add vegetables',
                servingSuggestions: 'Serve hot',
                nutritionalInformation: 'High carbs'
            }
        };

        await generateRecipeTags(mockRecipe, 'mockUserId');

        expect(mockModel.generateContent).toHaveBeenCalled();
        expect(recipe.findByIdAndUpdate).toHaveBeenCalledWith('recipe-id', {
            $set: { tags: [{ tag: 'italian' }, { tag: 'pasta' }, { tag: 'quick-meal' }] }
        });
    });

    it('shall throw error if gemini can not respond', async () => {
        mockModel.generateContent = jest.fn().mockImplementation(() => Promise.reject(new Error('API Error')));

        const mockRecipe = {
            _id: 'recipe-id',
            name: 'Test Recipe',
            ingredients: [],
            instructions: [],
            dietaryPreference: [],
            additionalInformation: {}
        };

        await expect(generateRecipeTags(mockRecipe, 'mockUserId')).rejects.toThrow('Failed to generate tags for the recipe');
    });

    it('shall throw error if gemini returns invalid JSON', async () => {
        const mockResponse = {
            response: {
                text: () => 'invalid json',
                usageMetadata: { totalTokenCount: 10 }
            }
        };
        mockModel.generateContent = jest.fn().mockImplementation(() => Promise.resolve(mockResponse));

        aigenerated.create = jest.fn().mockImplementation(
            () => Promise.resolve({ _id: 1234 }),
        );

        const mockRecipe = {
            _id: 'recipe-id',
            name: 'Test Recipe',
            ingredients: [],
            instructions: [],
            dietaryPreference: [],
            additionalInformation: {}
        };

        await expect(generateRecipeTags(mockRecipe, 'mockUserId')).rejects.toThrow('Failed to generate tags for the recipe');
    });
});

describe('generating chat response from Gemini', () => {
    let genAI: any;
    let mockModel: any;
    let mockChat: any;

    beforeEach(() => {
        genAI = new GoogleGenerativeAI();
        mockChat = {
            sendMessage: jest.fn()
        };
        mockModel = {
            startChat: jest.fn(() => mockChat)
        };
        genAI.getGenerativeModel = jest.fn(() => mockModel);
    });

    afterEach(() => {
        genAI = undefined;
        mockModel = undefined;
        mockChat = undefined;
    });

    it('shall return AI response from Gemini given message and history', async () => {
        const mockResponse = {
            response: {
                text: () => 'This is a helpful cooking tip!',
                usageMetadata: { totalTokenCount: 50 }
            }
        };
        mockChat.sendMessage = jest.fn().mockResolvedValue(mockResponse);

        aigenerated.create = jest.fn().mockImplementation(
            () => Promise.resolve({ _id: 1234 }),
        );

        const mockRecipe = {
            _id: 'recipe-id',
            name: 'Test Recipe',
            ingredients: [],
            instructions: [],
            dietaryPreference: [],
            additionalInformation: {}
        };

        const result = await generateChatResponse('How do I cook this?', mockRecipe, [], 'mockUserId');

        expect(result).toEqual({
            reply: 'This is a helpful cooking tip!',
            totalTokens: 50
        });
        expect(mockModel.startChat).toHaveBeenCalled();
        expect(mockChat.sendMessage).toHaveBeenCalled();
    });

    it('shall return fallback message if Gemini fails', async () => {
        mockChat.sendMessage = jest.fn().mockRejectedValue(new Error('API Error'));

        const mockRecipe = {
            _id: 'recipe-id',
            name: 'Test Recipe',
            ingredients: [],
            instructions: [],
            dietaryPreference: [],
            additionalInformation: {}
        };

        const result = await generateChatResponse('How do I cook this?', mockRecipe, [], 'mockUserId');

        expect(result).toEqual({
            reply: 'Sorry, I had trouble responding.',
            totalTokens: 0
        });
    });
}); 