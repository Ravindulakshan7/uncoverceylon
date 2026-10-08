import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyPassword, createSessionToken, AUTH_COOKIE_NAME } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Please enter both email and password.' }, { status: 400 });
    }

    const cleanEmail = String(email).trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    if (!user.password_hash) {
      return NextResponse.json({
        error: 'This account was created with Google Sign-In. Please sign in using Google.',
      }, { status: 400 });
    }

    const isValid = verifyPassword(String(password), user.password_hash);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
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
      message: `Welcome back, ${user.name}!`,
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
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Failed to sign in. Please try again.' }, { status: 500 });
  }
}
