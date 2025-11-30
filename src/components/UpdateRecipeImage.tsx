import { useEffect, useState } from 'react';
import { BaseCrudService } from '@/integrations';
import { HealthyRecipesandSnacks } from '@/entities';

interface UpdateRecipeImageProps {
  recipeName: string;
  newImageUrl: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function UpdateRecipeImage({
  recipeName,
  newImageUrl,
  onSuccess,
  onError,
}: UpdateRecipeImageProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const updateRecipe = async () => {
      try {
        setIsUpdating(true);

        // Get all recipes to find the one we need to update
        const { items } = await BaseCrudService.getAll<HealthyRecipesandSnacks>(
          'healthyrecipes'
        );

        // Find the recipe by name
        const recipeToUpdate = items?.find(
          (recipe) =>
            recipe.recipeName?.toLowerCase() === recipeName.toLowerCase()
        );

        if (!recipeToUpdate) {
          throw new Error(`Recipe "${recipeName}" not found`);
        }

        // Update the recipe with the new image
        await BaseCrudService.update<HealthyRecipesandSnacks>('healthyrecipes', {
          _id: recipeToUpdate._id,
          dishImage: newImageUrl,
        });

        console.log(`Recipe "${recipeName}" updated successfully with new image`);
        onSuccess?.();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to update recipe image';
        console.error('Error updating recipe:', errorMessage);
        onError?.(errorMessage);
      } finally {
        setIsUpdating(false);
      }
    };

    updateRecipe();
  }, [recipeName, newImageUrl, onSuccess, onError]);

  return null; // This component doesn't render anything
}
