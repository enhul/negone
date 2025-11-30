import { BaseCrudService } from '@/integrations';
import { HealthyRecipesandSnacks } from '@/entities';

export async function updateRecipeImage(recipeName: string, imageUrl: string) {
  try {
    // Fetch all recipes to find the one we need to update
    const { items } = await BaseCrudService.getAll<HealthyRecipesandSnacks>('healthyrecipes');
    
    // Find the recipe by name
    const recipe = items.find(r => r.recipeName === recipeName);
    if (!recipe) {
      throw new Error(`Recipe "${recipeName}" not found`);
    }
    
    // Update the recipe with the new image
    await BaseCrudService.update<HealthyRecipesandSnacks>('healthyrecipes', {
      _id: recipe._id,
      dishImage: imageUrl
    });
    
    console.log(`Recipe "${recipeName}" image updated successfully`);
    return true;
  } catch (error) {
    console.error('Error updating recipe image:', error);
    throw error;
  }
}
