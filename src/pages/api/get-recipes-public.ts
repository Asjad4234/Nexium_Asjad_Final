import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../../lib/mongodb';
import Recipe from '../../models/recipe';
import { paginationQueryHelper } from '../../utils/utils';
import { ExtendedRecipe, PaginationQueryType } from '../../types';
import { PipelineStage } from 'mongoose';

const aggreagteHelper = (sortOption: string, skip: number, limit: number): PipelineStage[] => {
  const base: PipelineStage[] = [
    { $skip: skip }, // Apply pagination AFTER sorting
    { $limit: limit },
    { $lookup: { from: "users", localField: "owner", foreignField: "_id", as: "owner" } }, // Fetch owner details
    { $unwind: "$owner" }, // Convert `owner` from an array to a single object
    { $lookup: { from: "comments", localField: "comments.user", foreignField: "_id", as: "comments.user" } } // Populate comments with user details
  ];

  return [
    { $sort: { createdAt: -1, _id: -1 } }, // Sort by creation date, field already exists no need for $set
    ...base
  ];
};

/**
 * Public API handler for fetching paginated and sorted recipes (no authentication required).
 * @param req - The Next.js API request object.
 * @param res - The Next.js API response object.
 */

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Validate HTTP method
    if (req.method !== 'GET') {
      res.setHeader('Allow', ['GET']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }

    // Connect to the database
    await connectDB();

    const { page, limit, sortOption, skip } = paginationQueryHelper(req.query as unknown as PaginationQueryType)
    
    // Execute all queries in parallel using Promise.all()
    const [allRecipes, popularTags, totalRecipes] = await Promise.all([
      // Query 1: Fetch sorted & paginated recipes
      Recipe.aggregate(aggreagteHelper(sortOption, skip, limit)) as unknown as ExtendedRecipe[],

      // Query 2: Compute the most common tags from `tags.tags`
      Recipe.aggregate([
        { $unwind: "$tags" }, // Unwind `tags` sub-document first
        { $unwind: "$tags.tag" }, // Then unwind `tags.tags` array inside it
        { $group: { _id: "$tags.tag", count: { $sum: 1 } } }, // Count occurrences of each tag
        { $sort: { count: -1 } }, // Sort tags by frequency (descending)
        { $limit: 20 } // Get the top 20 most popular tags
      ]),

      // Query 3: Get total number of recipes for pagination
      Recipe.countDocuments()
    ]);

    // For public API, we don't filter by user ownership
    const publicRecipes = allRecipes.map(recipe => ({
      ...recipe,
      owns: false // Public users don't own any recipes
    }));

    res.status(200).json({
      recipes: publicRecipes,
      totalRecipes,
      totalPages: Math.ceil(totalRecipes / limit),
      currentPage: page,
      popularTags
    });

  } catch (error) {
    // 🔴 Handle any errors that occur during fetching recipes
    console.error('Public get-recipes error:', error);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
};

export default handler; 