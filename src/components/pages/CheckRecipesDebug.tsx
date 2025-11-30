import { useEffect, useState } from 'react';
import { BaseCrudService } from '@/integrations';
import { HealthyRecipesandSnacks } from '@/entities';

export default function CheckRecipesDebug() {
  const [recipes, setRecipes] = useState<HealthyRecipesandSnacks[]>([]);

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const { items } = await BaseCrudService.getAll<HealthyRecipesandSnacks>('healthyrecipes');
        setRecipes(items || []);
        console.log('Recipes:', items);
      } catch (err) {
        console.error('Failed to load recipes:', err);
      }
    };

    loadRecipes();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Recipes Debug</h1>
      <pre className="bg-gray-100 p-4 rounded overflow-auto">
        {JSON.stringify(recipes, null, 2)}
      </pre>
    </div>
  );
}
