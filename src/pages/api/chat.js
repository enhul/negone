// backend/chat.jsw
import { fetch } from 'wix-fetch';

export async function chat(request) {
  const { message } = request.body;

  if (!message) {
    return { status: 400, body: { error: 'Message missing' } };
  }

  // Жишээ API call (тоглоомын хувилбар)
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'You are NegOne AI, answer in Mongolian.' },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 500
      }),
    });

    const data = await response.json();
    const botMessage = data.choices?.[0]?.message?.content || 'Хариулт олдсонгүй';
    return { status: 200, body: { message: botMessage } };

  } catch (err) {
    return { status: 500, body: { error: 'Server error', details: err.message } };
  }
}
