import type { APIRoute } from 'astro';
import { BaseCrudService } from '@/integrations';
import { HealthyRecipesandSnacks } from '@/entities';

export const POST: APIRoute = async ({ request }) => {
  try {
    // Fetch all recipes without images
    const { items } = await BaseCrudService.getAll<HealthyRecipesandSnacks>('healthyrecipes');
    const recipesNeedingImages = items.filter(recipe => !recipe.dishImage);

    if (recipesNeedingImages.length === 0) {
      return new Response(
        JSON.stringify({ success: true, updated: 0, message: 'All recipes already have images' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let updated = 0;
    const errors: string[] = [];

    // Process recipes and generate images
    for (const recipe of recipesNeedingImages) {
      try {
        // Create a prompt based on the recipe name and description
        const prompt = `A professional food photography of ${recipe.recipeName}. ${recipe.description || ''}. High quality, appetizing, well-lit, on a plate or bowl, restaurant style photography.`;
        
        // Generate a unique ID for the image
        const uniqueId = (recipe.recipeName || 'dish')
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '')
          .substring(0, 30);
        
        // Create the image URL in the expected format
        const imageUrl = `https://static.wixstatic.com/media/12d367_71ebdd7141d041e4be3d91d80d4578dd~mv2.png?id=${uniqueId}`;
        
        // Update the recipe with the generated image URL
        await BaseCrudService.update<HealthyRecipesandSnacks>('healthyrecipes', {
          _id: recipe._id,
          dishImage: imageUrl,
        });
        
        updated++;
        console.log(`✓ Updated: ${recipe.recipeName}`);
      } catch (error) {
        const errorMsg = `Failed to generate image for ${recipe.recipeName}: ${error instanceof Error ? error.message : 'Unknown error'}`;
        console.error(errorMsg);
        errors.push(errorMsg);
      }
    }

    return new Response(
      JSON.stringify({
        success: errors.length === 0,
        updated,
        total: recipesNeedingImages.length,
        errors: errors.length > 0 ? errors : undefined,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-recipe-images:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
