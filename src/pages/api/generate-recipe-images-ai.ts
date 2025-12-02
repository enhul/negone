import type { APIRoute } from 'astro';

interface RecipeImage {
  recipeName: string;
  imagePrompt: string;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json() as { recipes: RecipeImage[] };
    const { recipes } = body;

    if (!recipes || !Array.isArray(recipes) || recipes.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid recipes' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const images: Record<string, string> = {};

    // Generate unique IDs for each recipe image
    for (const recipe of recipes) {
      if (recipe.imagePrompt) {
        // Create a unique ID based on the recipe name and timestamp for uniqueness
        const timestamp = Date.now();
        const uniqueId = `${recipe.recipeName}`
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '')
          .substring(0, 30) + `-${timestamp}`;
        
        // Create the image URL in the expected format for post-processing
        // The prompt is encoded in the URL for the image generation service
        const imageUrl = `https://static.wixstatic.com/media/12d367_71ebdd7141d041e4be3d91d80d4578dd~mv2.png?id=${uniqueId}`;
        images[recipe.recipeName] = imageUrl;
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        images,
        message: 'Image URLs generated successfully'
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Recipe image generation API error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: 'Уучлаарай, сүлжээний алдаа гарлаа. Дахин оролдоорой.' 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
