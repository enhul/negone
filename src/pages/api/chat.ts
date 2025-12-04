import type { APIRoute } from 'astro';

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

Always be supportive and never judgmental.`;

export const POST: APIRoute = async ({ request }) => {
  try {
    // Check if API key is available
   const apiKey = process.env.GROQ_API_KEY; 

    
    if (!apiKey) {
      console.error('OpenAI API key not found in environment variables');
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

    // Call OpenAI API
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT,
          },
          {
            role: 'user',
            content: userMessage,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Groq API error:', errorData);
      return new Response(
        JSON.stringify({ 
          error: 'API request failed',
          message: 'Уучлаарай, хариулт авахад алдаа гарлаа. Дахин оролдоно уу.' 
        }),
        { 
          status: response.status,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const data = await response.json();
    const aiMessage = data.choices?.[0]?.message?.content || 'Уучлаарай, хариулт авч чадсангүй.';

    return new Response(
      JSON.stringify({ message: aiMessage }),
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
        message: 'Уучлаарай, алдаа гарлаа. Дахин оролдоно уу.' 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};