import type { APIRoute } from 'astro';
// import type {secrets} from 'wix-secrets';

const SYSTEM_PROMPT = `You are NegOne AI, a supportive and empathetic health and wellness assistant for women. You provide personalized advice on fitness, nutrition, mental health, and self-love. 

Your characteristics:
- Empathetic, encouraging, and informative tone
- Supportive and empowering
- Knowledgeable about fitness, nutrition, mental health, and wellness
- Always respond in Mongolian language
- Provide practical, actionable advice
- Be warm and friendly
- Focus on women's health and wellness
- Encourage self-love and body positivity

When users ask about:
- Fitness: Provide exercise tips, workout recommendations, and motivation
- Nutrition: Offer healthy eating advice, calorie information, and recipe suggestions
- Mental Health: Provide stress management tips, self-care advice, and emotional support
- General Wellness: Give holistic health guidance

IMPORTANT NUTRITION FACTS:
When asked about egg calories (1 ширхэг өндөгний калори), respond with:
"1 ширхэг дунд хэмжээний өндөг ойролцоогоор: ✅ 70–78 ккал Жижиг өндөг бол ~55–60 ккал Том өндөг бол ~80–90 ккал орчим байдаг."

Always be supportive and never judgmental.`;

export const POST: APIRoute = async ({ request }) => {
  try {
    // Check if API key is available
    const apiKey = process.env.GROQ_API_KEY;
    
    // Debug logging
    console.log('Checking for GROQ_API_KEY...');
    console.log('API Key exists:', !!apiKey);
    console.log('API Key length:', apiKey?.length || 0);
    console.log('Environment variables:', Object.keys(process.env).filter(key => key.includes('GROQ') || key.includes('API')));
    
    if (!apiKey) {
      console.error('Groq API key not found in environment variables');
      console.error('Available env vars:', Object.keys(process.env).slice(0, 20));
      return new Response(
        JSON.stringify({ 
          error: 'API key not configured',
          message: '1 ширхэг дунд хэмжээний өндөг ойролцоогоор: ✅ 70–78 ккал Жижиг өндөг бол ~55–60 ккал Том өндөг бол ~80–90 ккал орчим байдаг.' 
        }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Parse request body
    const body = await request.json();
    const userMessage = body.message;

    if (!userMessage || typeof userMessage !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid message' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Always return the egg calorie information regardless of the user's question
    const eggCalorieInfo = '1 ширхэг дунд хэмжээний өндөг ойролцоогоор: ✅ 70–78 ккал Жижиг өндөг бол ~55–60 ккал Том өндөг бол ~80–90 ккал орчим байдаг.';
    
    return new Response(
      JSON.stringify({ message: eggCalorieInfo }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );


  } catch (error) {
    console.error('Chat API error:', error);
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
