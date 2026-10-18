import { NextRequest, NextResponse } from 'next/server';

interface GeminiDayItem {
  day: string;
  title: string;
  desc: string;
  places: string[];
}

interface GeminiTripResult {
  title: string;
  duration: string;
  highlights: string[];
  days: GeminiDayItem[];
}

const FALLBACK_MODELS = [
  'gemini-2.5-flash',
  'gemini-flash-latest',
  'gemini-2.5-flash-lite',
];

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query || typeof query !== 'string' || !query.trim()) {
      return NextResponse.json(
        { error: 'Please provide a travel prompt or destination idea.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not configured on the server.' },
        { status: 500 }
      );
    }

    const systemPrompt = `You are an expert Sri Lankan native travel guide and tour curator for "Uncover Ceylon".
A traveler wants a custom Sri Lanka trip based on this request:
"${query.trim()}"

Create an authentic, practical, beautifully planned day-by-day Sri Lanka itinerary.
Rules:
1. Include real travel times between destinations in Sri Lanka (e.g., train rides, expressways, scenic routes).
2. Recommend authentic local Sri Lankan food spots or dishes to try each day (kottu, hoppers, tea, fresh seafood).
3. If the user doesn't specify duration, choose an ideal duration (typically 3 to 7 days).
4. Return ONLY a valid JSON object without markdown code blocks, matching this exact TypeScript structure:
{
  "title": "Inspiring trip title",
  "duration": "e.g. 5 Days / 4 Nights",
  "highlights": ["3 to 4 key highlights"],
  "days": [
    {
      "day": "Day 1",
      "title": "Catchy Day Title",
      "desc": "Engaging description with activities, travel route tips, and local experiences.",
      "places": ["Place 1", "Place 2", "Place 3"]
    }
  ]
}`;

    let lastError: any = null;

    // Attempt request across available models
    for (const model of FALLBACK_MODELS) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: systemPrompt }],
              },
            ],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.7,
            },
          }),
        });

        if (!res.ok) {
          const errText = await res.text();
          console.warn(`Gemini model ${model} returned ${res.status}:`, errText);
          lastError = new Error(`Gemini ${model} ${res.status}: ${errText}`);
          continue; // Try next model
        }

        const data = await res.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!rawText) {
          lastError = new Error('Empty response from Gemini');
          continue;
        }

        // Clean any accidental markdown wrappers (```json ... ```)
        const cleaned = rawText
          .replace(/^```json\s*/i, '')
          .replace(/^```\s*/i, '')
          .replace(/```$/i, '')
          .trim();

        const parsed: GeminiTripResult = JSON.parse(cleaned);

        return NextResponse.json({
          success: true,
          model,
          data: parsed,
        });
      } catch (err: any) {
        lastError = err;
        console.warn(`Error with ${model}:`, err?.message);
      }
    }

    throw lastError || new Error('All Gemini models failed');
  } catch (error: any) {
    console.error('AI Trip Planner Error:', error);
    return NextResponse.json(
      {
        error: error?.message || 'Failed to generate itinerary with AI',
      },
      { status: 500 }
    );
  }
}
