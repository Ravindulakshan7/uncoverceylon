import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientId, clientSecret } = body;

    if (!clientId || typeof clientId !== 'string' || clientId.trim() === '') {
      return NextResponse.json({ error: 'Client ID is required' }, { status: 400 });
    }

    const cleanClientId = clientId.trim();
    const cleanSecret = (clientSecret || '').trim();

    // Update .env and .env.local
    const envPaths = [
      path.join(process.cwd(), '.env'),
      path.join(process.cwd(), '.env.local'),
    ];

    for (const envPath of envPaths) {
      if (fs.existsSync(envPath)) {
        let content = fs.readFileSync(envPath, 'utf8');

        // Update NEXT_PUBLIC_GOOGLE_CLIENT_ID
        if (content.includes('NEXT_PUBLIC_GOOGLE_CLIENT_ID=')) {
          content = content.replace(/NEXT_PUBLIC_GOOGLE_CLIENT_ID=.*/g, `NEXT_PUBLIC_GOOGLE_CLIENT_ID="${cleanClientId}"`);
        } else {
          content += `\nNEXT_PUBLIC_GOOGLE_CLIENT_ID="${cleanClientId}"`;
        }

        // Update GOOGLE_CLIENT_SECRET
        if (cleanSecret) {
          if (content.includes('GOOGLE_CLIENT_SECRET=')) {
            content = content.replace(/GOOGLE_CLIENT_SECRET=.*/g, `GOOGLE_CLIENT_SECRET="${cleanSecret}"`);
          } else {
            content += `\nGOOGLE_CLIENT_SECRET="${cleanSecret}"`;
          }
        }

        fs.writeFileSync(envPath, content, 'utf8');
      }
    }

    // Update runtime env
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID = cleanClientId;
    if (cleanSecret) {
      process.env.GOOGLE_CLIENT_SECRET = cleanSecret;
    }

    return NextResponse.json({
      success: true,
      message: 'Google OAuth credentials saved successfully! Real Google Sign-In is now active.',
      clientId: cleanClientId,
    });
  } catch (error) {
    console.error('Error saving Google credentials:', error);
    return NextResponse.json({ error: 'Failed to update credentials file' }, { status: 500 });
  }
}
