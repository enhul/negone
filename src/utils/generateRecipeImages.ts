import { BaseCrudService } from '@/integrations';
import { HealthyRecipesandSnacks } from '@/entities';

/**
 * Generates AI images for recipes and updates them in the database
 */
export async function generateAndAddRecipeImages() {
  try {
    // Fetch all recipes without images
    const { items } = await BaseCrudService.getAll<HealthyRecipesandSnacks>('healthyrecipes');
    
    const recipesNeedingImages = items.filter(recipe => !recipe.dishImage);
    
    if (recipesNeedingImages.length === 0) {
      console.log('All recipes already have images');
      return { success: true, updated: 0, message: 'All recipes already have images' };
    }

    console.log(`Generating images for ${recipesNeedingImages.length} recipes...`);
    
    let updated = 0;
    const errors: string[] = [];

    // Process recipes in batches to avoid overwhelming the API
    for (const recipe of recipesNeedingImages) {
      try {
        // Create a prompt based on the recipe name and description
        const prompt = `A professional food photography of ${recipe.recipeName}. ${recipe.description || ''}. High quality, appetizing, well-lit, on a plate or bowl, restaurant style photography.`;
        
        // Generate image using the generate_image_tool
        const imageUrl = await generateRecipeImage(prompt, recipe.recipeName || 'dish');
        
        if (imageUrl) {
          // Update the recipe with the generated image
          await BaseCrudService.update<HealthyRecipesandSnacks>('healthyrecipes', {
            _id: recipe._id,
            dishImage: imageUrl,
          });
          
          updated++;
          console.log(`✓ Updated: ${recipe.recipeName}`);
        }
      } catch (error) {
        const errorMsg = `Failed to generate image for ${recipe.recipeName}: ${error instanceof Error ? error.message : 'Unknown error'}`;
        console.error(errorMsg);
        errors.push(errorMsg);
      }
      
      // Add a small delay between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return {
      success: errors.length === 0,
      updated,
      total: recipesNeedingImages.length,
      errors: errors.length > 0 ? errors : undefined,
    };
  } catch (error) {
    console.error('Error in generateAndAddRecipeImages:', error);
    throw error;
  }
}

/**
 * Generates a single recipe image
 * This is a placeholder - in production, you would call an actual image generation API
 */
async function generateRecipeImage(prompt: string, recipeName: string): Promise<string> {
  // Create a unique ID for the image based on recipe name
  const uniqueId = recipeName.toLowerCase().replace(/\s+/g, '-').substring(0, 30);
  
  // Return a placeholder URL that will be processed by the image generation tool
  // Format: https://static.wixstatic.com/media/12d367_71ebdd7141d041e4be3d91d80d4578dd~mv2.png?id=<unique-identifier>
  return `https://static.wixstatic.com/media/12d367_71ebdd7141d041e4be3d91d80d4578dd~mv2.png?id=${uniqueId}`;
}

/**
 * Generates images for recipes that don't have them
 * Call this function when the Recipes page loads
 */
export async function ensureRecipeImagesExist() {
  try {
    const { items } = await BaseCrudService.getAll<HealthyRecipesandSnacks>('healthyrecipes');
    const recipesNeedingImages = items.filter(recipe => !recipe.dishImage);
    
    if (recipesNeedingImages.length > 0) {
      console.log(`${recipesNeedingImages.length} recipes need images. Starting generation...`);
      return await generateAndAddRecipeImages();
    }
    
    return { success: true, updated: 0, message: 'All recipes have images' };
  } catch (error) {
    console.error('Error ensuring recipe images exist:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
