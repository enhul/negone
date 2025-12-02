import type { APIRoute } from 'astro';
import { BaseCrudService } from '@/integrations';
import { HealthyRecipesandSnacks } from '@/entities';

interface RecipeImageUpdate {
  recipeName: string;
  imagePrompt: string;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    // Fetch all recipes from the database
    const { items } = await BaseCrudService.getAll<HealthyRecipesandSnacks>('healthyrecipes');

    if (!items || items.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'No recipes found in database',
          message: 'Өгөгдлийн сангаас жор олдсонгүй' 
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Filter recipes that don't have images
    const recipesWithoutImages = items.filter(recipe => !recipe.dishImage);

    if (recipesWithoutImages.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'All recipes already have images',
          recipesUpdated: 0,
          totalRecipes: items.length,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Prepare recipes for image generation
    const recipesForImageGeneration: RecipeImageUpdate[] = recipesWithoutImages.map(recipe => ({
      recipeName: recipe.recipeName || 'Unknown Recipe',
      imagePrompt: `A delicious and appetizing photo of ${recipe.recipeName || 'a healthy dish'}, professional food photography, high quality, well-lit, mouth-watering presentation`
    }));

    // Generate images using the AI image generation endpoint
    const imageResponse = await fetch(new URL('/api/generate-recipe-images-ai', request.url), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipes: recipesForImageGeneration }),
    });

    if (!imageResponse.ok) {
      throw new Error('Failed to generate images');
    }

    const imageData = await imageResponse.json();

    // Update recipes with their new images
    const updatePromises = recipesWithoutImages.map(async (recipe) => {
      if (imageData.images && imageData.images[recipe.recipeName || '']) {
        const newImageUrl = imageData.images[recipe.recipeName || ''];
        
        await BaseCrudService.update<HealthyRecipesandSnacks>('healthyrecipes', {
          _id: recipe._id,
          dishImage: newImageUrl,
        });
      }
    });

    await Promise.all(updatePromises);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully generated images for ${recipesWithoutImages.length} recipes without images`,
        recipesUpdated: recipesWithoutImages.length,
        totalRecipes: items.length,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error generating missing recipe images:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Зургийг үүсгэхэд алдаа гарлаа',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
