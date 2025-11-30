import type { APIRoute } from 'astro';

const RECIPE_SYSTEM_PROMPT = `You are a professional nutritionist and chef specializing in healthy recipes. Your task is to generate healthy recipes based on user-provided ingredients.

IMPORTANT RULES:
1. Always respond in Mongolian language
2. Generate exactly 3 recipes (or fewer if ingredients are very limited)
3. Each recipe MUST use the user's provided ingredients as the base
4. You can add 1-3 common complementary ingredients if needed (salt, oil, spices, etc.)
5. Each recipe must include:
   - Recipe name (in Mongolian)
   - Short description (1-2 sentences)
   - Complete ingredient list with quantities
   - Step-by-step instructions (numbered, 4-6 steps)
   - Total calories for the whole recipe
   - Calories per serving
   - Meal type (Өглөөний хоол, Үдийн хоол, Оройн хоол, Зууш)

FORMAT YOUR RESPONSE EXACTLY LIKE THIS (use this structure for each recipe):

---
ЖОР 1: [Recipe Name]
Төрөл: [Meal Type]
Тайлбар: [Short description]

Орцуу:
- [Ingredient 1]: [quantity]
- [Ingredient 2]: [quantity]
- [Ingredient 3]: [quantity]

Хийх арга:
1. [Step 1]
2. [Step 2]
3. [Step 3]
4. [Step 4]

Калори: Нийт [X] калори | Нэг хэсэгт [Y] калори (Z хэсэг)
---

TONE:
- Be encouraging and supportive
- If user's ingredients are limited, gently suggest complementary ingredients
- Focus on health benefits
- Keep descriptions concise and practical`;

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
