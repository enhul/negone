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

    // Prepare recipes for image generation with hyper-realistic 4K prompts
    const recipesForImageGeneration: RecipeImageUpdate[] = items.map(recipe => {
      const recipeName = recipe.recipeName || 'Unknown Recipe';
      const ingredients = recipe.ingredients ? recipe.ingredients.split('\n').slice(0, 5).join(', ') : '';
      const description = recipe.description || '';
      
      // Determine if Mongolian or Western recipe
      const isMongolian = recipeName.match(/[а-яёА-ЯЁ]/);
      const style = isMongolian ? 'traditional Mongolian' : 'Western';
      
      // Create hyper-realistic 4K food photography prompt
      const imagePrompt = `Image: ${recipeName} – hyper-realistic professional food photo, 4K resolution, top-view and 45-degree angle composition, studio lighting, shallow depth of field, food styling. ${style} cuisine. Showing ${recipeName}${ingredients ? ` with visible ingredients: ${ingredients}` : ''}. ${description ? `${description}. ` : ''}Vibrant colors, mouth-watering presentation, commercial food photography quality, sharp focus, appetizing, professional plating, natural lighting, high detail, food magazine style`;
      
      return {
        recipeName,
        imagePrompt
      };
    });

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

    // Update all recipes with their new images
    let updatedCount = 0;
    const updatePromises = items.map(async (recipe) => {
      if (imageData.images && imageData.images[recipe.recipeName || '']) {
        const newImageUrl = imageData.images[recipe.recipeName || ''];
        
        await BaseCrudService.update<HealthyRecipesandSnacks>('healthyrecipes', {
          _id: recipe._id,
          dishImage: newImageUrl,
        });
        updatedCount++;
      }
    });

    await Promise.all(updatePromises);

    return new Response(
      JSON.stringify({
        success: true,
        message: `DONE – All ${items.length} recipe images updated with hyper-realistic 4K food photos`,
        recipesUpdated: updatedCount,
        totalRecipes: items.length,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error regenerating recipe images:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Зургийг дахин үүсгэхэд алдаа гарлаа',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
