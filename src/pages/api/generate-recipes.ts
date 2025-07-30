import type { NextApiRequest, NextApiResponse } from 'next';
import { apiMiddleware } from '../../lib/apiMiddleware';

/**
 * API handler for generating recipes based on provided ingredients and dietary preferences.
 * @param req - The Next.js API request object.
 * @param res - The Next.js API response object.
 */
const handler = async (req: NextApiRequest, res: NextApiResponse, session: any) => {
    try {
        // Extract ingredients and dietary preferences from request body
        const { ingredients, dietaryPreferences } = req.body;

        // Validate ingredients input
        if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
            return res.status(400).json({ error: 'Ingredients are required' });
        }

        // Call n8n workflow to generate recipe with image
        console.info('Generating recipe via n8n workflow...');
        const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/generate-recipe';
        if (!n8nWebhookUrl) {
            return res.status(500).json({ error: 'N8N webhook URL not configured' });
        }

        const response = await fetch(n8nWebhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ingredients,
                dietaryPreferences,
                userId: session.user.id,
                sessionId: `user-${session.user.id}-${Date.now()}`
            })
        });

        if (!response.ok) {
            throw new Error('Failed to generate recipe via n8n');
        }

        const result = await response.json();
        
        // Debug logging
        console.log('n8n response:', JSON.stringify(result, null, 2));
        
        // Ensure we have a valid recipe from n8n
        if (!result.recipe || !result.success) {
            throw new Error('Invalid recipe response from n8n');
        }

        // Convert the single recipe to an array and stringify it for the frontend
        const recipesArray = [result.recipe];
        const recipesJson = JSON.stringify(recipesArray);
        
        // Debug logging
        console.log('Sending to frontend:', {
            recipes: recipesJson,
            geminiPromptId: result.recipe.openaiPromptId
        });
        
        // Return the complete recipe with image
        res.status(200).json({
            recipes: recipesJson,
            geminiPromptId: result.recipe.openaiPromptId
        });
    } catch (error) {
        // Handle any errors that occur during recipe generation
        console.error(error);
        res.status(500).json({ error: 'Failed to generate recipes' });
    }
};

export default apiMiddleware(['POST'], handler);
