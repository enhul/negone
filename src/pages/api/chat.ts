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
//    const apiKey = process.env.OPENAI_API_KEY;
    const apiKey = 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

    
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

      if (response.status === 401) {
        return new Response(
          JSON.stringify({ 
            error: 'Unauthorized',
            message: 'Уучлаарай, API түлхүүр буруу байна. Админтай холбогдоорой.' 
          }),
          { 
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      return new Response(
        JSON.stringify({ 
          error: 'OpenAI API error',
          message: 'Уучлаарай, хариулт авахад алдаа гарлаа. Дахин оролдоорой.' 
        }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const data = await response.json();
    const botMessage = data.choices?.[0]?.message?.content;

    if (!botMessage) {
      return new Response(
        JSON.stringify({ 
          error: 'No response from OpenAI',
          message: 'Хариулт авахад алдаа гарлаа.' 
        }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({ message: botMessage }),
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
