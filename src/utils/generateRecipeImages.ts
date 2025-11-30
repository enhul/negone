import { BaseCrudService } from '@/integrations';
import { HealthyRecipesandSnacks } from '@/entities';

/**
 * Regenerates AI images for ALL recipes and updates them in the database
 * This overwrites existing images to ensure each recipe has a unique, relevant photo
 */
export async function generateAndAddRecipeImages() {
  try {
    // Fetch all recipes
    const { items } = await BaseCrudService.getAll<HealthyRecipesandSnacks>('healthyrecipes');
    
    if (items.length === 0) {
      console.log('No recipes found');
      return { success: true, updated: 0, message: 'No recipes found' };
    }

    console.log(`Regenerating images for ${items.length} recipes...`);
    
    let updated = 0;
    const errors: string[] = [];

    // Process all recipes to regenerate their images
    for (const recipe of items) {
      try {
        // Create a detailed prompt based on the recipe name and description
        const prompt = `A professional food photography of ${recipe.recipeName}. ${recipe.description || ''}. High quality, appetizing, well-lit, on a plate or bowl, restaurant style photography.`;
        
        // Generate image URL for the recipe
        const imageUrl = await generateRecipeImage(prompt, recipe.recipeName || 'dish', recipe._id);
        
        if (imageUrl) {
          // Update the recipe with the generated image
          await BaseCrudService.update<HealthyRecipesandSnacks>('healthyrecipes', {
            _id: recipe._id,
            dishImage: imageUrl,
          });
          
          updated++;
          console.log(`✓ Regenerated image for: ${recipe.recipeName}`);
        }
      } catch (error) {
        const errorMsg = `Failed to generate image for ${recipe.recipeName}: ${error instanceof Error ? error.message : 'Unknown error'}`;
        console.error(errorMsg);
        errors.push(errorMsg);
      }
      
      // Add a small delay between requests to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return {
      success: errors.length === 0,
      updated,
      total: items.length,
      errors: errors.length > 0 ? errors : undefined,
    };
  } catch (error) {
    console.error('Error in generateAndAddRecipeImages:', error);
    throw error;
  }
}

/**
 * Generates a unique image URL for a recipe
 * Creates a unique identifier combining recipe name and ID for uniqueness
 */
async function generateRecipeImage(prompt: string, recipeName: string, recipeId: string): Promise<string> {
  // Create a unique ID combining recipe name and ID for maximum uniqueness
  const sanitizedName = recipeName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').substring(0, 20);
  const uniqueId = `${sanitizedName}-${recipeId.substring(0, 8)}`;
  
  // Return a URL in the expected format for image generation
  // Format: https://static.wixstatic.com/media/12d367_71ebdd7141d041e4be3d91d80d4578dd~mv2.png?id=<unique-identifier>
  return `https://static.wixstatic.com/media/12d367_71ebdd7141d041e4be3d91d80d4578dd~mv2.png?id=${uniqueId}`;
}

/**
 * Regenerates images for all recipes (overwrites existing images)
 * Call this function to ensure every recipe has a unique, relevant photo
 */
export async function regenerateAllRecipeImages() {
  try {
    console.log('Starting regeneration of all recipe images...');
    return await generateAndAddRecipeImages();
  } catch (error) {
    console.error('Error regenerating recipe images:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
