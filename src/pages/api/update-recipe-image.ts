import type { APIRoute } from 'astro';
import { BaseCrudService } from '@/integrations';
import { HealthyRecipesandSnacks } from '@/entities';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { recipeName, imageUrl } = await request.json();

    if (!recipeName || !imageUrl) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing recipeName or imageUrl' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Fetch all recipes to find the one we need to update
    const { items } = await BaseCrudService.getAll<HealthyRecipesandSnacks>('healthyrecipes');
    
    // Find the recipe by name
    const recipe = items.find(r => r.recipeName === recipeName);
    if (!recipe) {
      return new Response(
        JSON.stringify({ success: false, error: `Recipe "${recipeName}" not found` }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Update the recipe with the new image
    await BaseCrudService.update<HealthyRecipesandSnacks>('healthyrecipes', {
      _id: recipe._id,
      dishImage: imageUrl,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: `Recipe "${recipeName}" image updated successfully`,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error updating recipe image:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
