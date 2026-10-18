import { NextRequest, NextResponse } from 'next/server';

interface ChatMessage {
  role: 'user' | 'assistant' | 'model';
  content: string;
}

const FALLBACK_MODELS = [
  'gemini-2.5-flash',
  'gemini-flash-latest',
  'gemini-2.5-flash-lite',
];

export async function POST(req: NextRequest) {
  try {
    const { messages, message } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not configured on the server.' },
        { status: 500 }
      );
    }

    const conversationHistory: ChatMessage[] = Array.isArray(messages)
      ? messages
      : message
      ? [{ role: 'user', content: String(message) }]
      : [];

    if (conversationHistory.length === 0) {
      return NextResponse.json(
        { error: 'Please provide a message to chat.' },
        { status: 400 }
      );
    }

    const systemInstruction = `You are "Serandib AI", the friendly, knowledgeable digital travel concierge for "Uncover Ceylon" (Sri Lanka's premier authentic travel guide).
Tone & Personality:
- Warm, welcoming ("Ayubowan!"), knowledgeable, authentic, and culturally respectful.
- You have expert local knowledge about all 9 Sri Lankan provinces, hidden gems, street foods, train journeys (e.g. Kandy-to-Ella scenic blue train), wildlife safaris (Yala, Minneriya elephant gathering, Wilpattu), beaches (Mirissa, Hiriketiya, Arugam Bay, Nilaveli), and sacred cultural sites (Sigiriya, Temple of the Tooth, Dambulla).
- Provide practical travel tips: transportation (tuk-tuks, PickMe/Uber, scenic trains), safety, local currency (Sri Lankan Rupees - LKR), seasonal weather (best months for west/south vs east coast), and temple etiquette (covering shoulders & knees, removing footwear).
- Keep answers concise, clear, and well-structured using markdown bullet points and emojis. Do not write overwhelming essays unless asked for a complete plan.`;

    // Map conversation history to Gemini contents format
    const contents = conversationHistory.map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    let lastError: any = null;

    for (const model of FALLBACK_MODELS) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: systemInstruction }],
            },
            contents,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1000,
            },
          }),
        });

        if (!res.ok) {
          const errText = await res.text();
          console.warn(`Gemini chat ${model} ${res.status}:`, errText);
          lastError = new Error(`Gemini ${model} ${res.status}`);
          continue;
        }

        const data = await res.json();
        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!reply) {
          lastError = new Error('No reply from Gemini');
          continue;
        }

        return NextResponse.json({
          success: true,
          model,
          reply,
        });
      } catch (err: any) {
        lastError = err;
        console.warn(`Error chatting with ${model}:`, err?.message);
      }
    }

    throw lastError || new Error('All models failed');
  } catch (error: any) {
    console.error('AI Chat Error:', error);
    return NextResponse.json(
      {
        error: error?.message || 'Failed to chat with AI',
      },
      { status: 500 }
    );
  }
}
