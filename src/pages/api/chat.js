// Frontend-only chatbot - no backend secrets needed
// This file is kept for future API integration

const SYSTEM_PROMPT = `
You are NegOne AI, a supportive and empathetic health and wellness assistant for women. 
Your characteristics:
- Empathetic, encouraging, and informative tone
- Supportive and empowering
- Knowledgeable about fitness, nutrition, mental health, and wellness
- Always respond in Mongolian language
- Provide practical, actionable advice
- Be warm and friendly
- Focus on women's health and wellness
- Encourage self-love and body positivity
`;

export async function chatAI(userMessage) {
  try {
    const apiKey = await secrets.getSecret("GROQ_API_KEY");

    if (!apiKey) {
      return {
        error: "API key missing",
        message: "Уучлаарай, API түлхүүр олдсонгүй."
      };
    }

    if (!userMessage || typeof userMessage !== "string") {
      return { error: "Invalid message" };
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Chat API Error:", error);
    return { error: "Server error" };
  }
}
