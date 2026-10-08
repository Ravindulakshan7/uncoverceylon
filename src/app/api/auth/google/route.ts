import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createSessionToken, AUTH_COOKIE_NAME } from '@/lib/auth';

interface GooglePayload {
  email: string;
  name: string;
  picture?: string;
  sub?: string;
}

function parseGoogleJwt(credential: string): GooglePayload | null {
  try {
    const parts = credential.split('.');
    if (parts.length < 2) return null;
    const payloadStr = Buffer.from(parts[1], 'base64').toString('utf8');
    return JSON.parse(payloadStr);
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let email = '';
    let name = '';
    let picture = '';

    if (body.credential && typeof body.credential === 'string') {
      const parsed = parseGoogleJwt(body.credential);
      if (!parsed || !parsed.email) {
        return NextResponse.json({ error: 'Invalid Google credential.' }, { status: 400 });
      }
      email = parsed.email;
      name = parsed.name || parsed.email.split('@')[0];
      picture = parsed.picture || '';
    } else if (body.email && body.name) {
      email = String(body.email).trim().toLowerCase();
      name = String(body.name).trim();
      picture = body.picture || body.image || '';
    } else {
      return NextResponse.json({ error: 'Missing Google authentication payload.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (user) {
      // If user exists, update image if Google has a fresh high-res photo
      if (picture && user.image !== picture) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            image: picture,
            name: user.name || cleanName,
          },
        });
      }
    } else {
      // Create new Google customer
      user = await prisma.user.create({
        data: {
          name: cleanName,
          email: cleanEmail,
          image: picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName)}&background=00aa6c&color=fff&size=128`,
          provider: 'google',
          role: 'customer',
        },
      });
    }

    const userSession = {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      provider: user.provider,
      role: user.role,
    };

    const token = createSessionToken(userSession);

    const response = NextResponse.json({
      success: true,
      message: `Signed in with Google as ${user.name}!`,
      user: userSession,
    });

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
  } catch (error) {
    console.error('Google Auth error:', error);
    return NextResponse.json({ error: 'Failed to authenticate with Google. Please try again.' }, { status: 500 });
  }
}
