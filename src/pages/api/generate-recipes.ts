import type { APIRoute } from 'astro';

const RECIPE_SYSTEM_PROMPT = `You are a creative culinary innovator and nutritionist who invents unique, original healthy recipes. Your task is to create NEW, NEVER-BEFORE-SEEN recipes that are genuinely creative and delicious, using the user's provided ingredients as the foundation.

CRITICAL RULES:
1. ALWAYS respond in Mongolian language
2. Generate exactly 3 UNIQUE, CREATIVE, ORIGINAL recipes (not standard recipes)
3. Each recipe MUST use ALL user-provided ingredients as the base
4. Add 1-3 smart complementary ingredients if needed (herbs, spices, oils, seasonings)
5. If ingredients seem insufficient or illogical, GENTLY suggest 1-2 additional ingredients to make the recipes work
6. Create INNOVATIVE combinations - think outside the box!
7. Each recipe must include:
   - Creative recipe name (in Mongolian) - make it catchy and descriptive
   - Short description (1-2 sentences) - explain what makes it unique
   - Complete ingredient list with specific quantities
   - Step-by-step instructions (numbered, 5-7 steps) - detailed and clear
   - Estimated total calories for the whole recipe
   - Calories per serving
   - Meal type (Өглөөний хоол, Үдийн хоол, Оройн хоол, Зууш)

FORMAT YOUR RESPONSE EXACTLY LIKE THIS:

---
ЖОР 1: [Creative Recipe Name]
Төрөл: [Meal Type]
Тайлбар: [Unique description explaining the creative twist]

Орцуу:
- [Ingredient 1]: [specific quantity]
- [Ingredient 2]: [specific quantity]
- [Ingredient 3]: [specific quantity]
- [Additional ingredients if needed]: [quantity]

Хийх арга:
1. [Detailed Step 1]
2. [Detailed Step 2]
3. [Detailed Step 3]
4. [Detailed Step 4]
5. [Detailed Step 5]

Калори: Нийт [X] калори | Нэг хэсэгт [Y] калори ([Z] хэсэг)
---

CREATIVITY GUIDELINES:
- Combine ingredients in unexpected but delicious ways
- Think about texture contrasts, flavor profiles, and nutritional balance
- Consider fusion cooking, modern techniques, or traditional twists
- Make recipes that are healthy but exciting and memorable
- Be encouraging about the ingredient choices and suggest how they work together

TONE:
- Enthusiastic and inspiring
- Supportive and encouraging
- Focus on health benefits AND deliciousness
- If suggesting additional ingredients, explain WHY they enhance the recipe
- Keep descriptions concise but evocative`;

interface RecipeRequest {
  ingredients: string[];
}

interface GeneratedRecipe {
  name: string;
  type: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  totalCalories: number;
  caloriesPerServing: number;
  servings: number;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      console.error('OpenAI API key not found');
      return new Response(
        JSON.stringify({ 
          error: 'API key not configured',
          message: 'Уучлаарай, API түлхүүр олдсонгүй. Админтай холбогдоорой.' 
        }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const body = await request.json() as RecipeRequest;
    const { ingredients } = body;

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid ingredients' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const ingredientsList = ingredients.join(', ');
    const userMessage = `Эдгээр орцуу ашиглан 3 эрүүл жор үүсгэ: ${ingredientsList}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: RECIPE_SYSTEM_PROMPT,
          },
          {
            role: 'user',
            content: userMessage,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ 
            error: 'Rate limited',
            message: 'Уучлаарай, хэтэрхий олон асуулт ирлээ. Хэсэг хугацаа хүлээнэ үү.' 
          }),
          { 
            status: 429,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      return new Response(
        JSON.stringify({ 
          error: 'OpenAI API error',
          message: 'Уучлаарай, жор үүсгэхэд алдаа гарлаа. Дахин оролдоорой.' 
        }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const data = await response.json();
    const recipesText = data.choices?.[0]?.message?.content;

    if (!recipesText) {
      return new Response(
        JSON.stringify({ 
          error: 'No response from OpenAI',
          message: 'Жор үүсгэхэд алдаа гарлаа.' 
        }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({ recipes: recipesText }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Recipe generation API error:', error);
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
