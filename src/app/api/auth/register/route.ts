import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword, createSessionToken, AUTH_COOKIE_NAME } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json({ error: 'Please provide a valid name (at least 2 characters).' }, { status: 400 });
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists. Please sign in.' }, { status: 409 });
    }

    const password_hash = hashPassword(password);

    // Default image: beautiful colorful avatar with first initial
    const initial = cleanName.charAt(0).toUpperCase();
    const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName)}&background=00aa6c&color=fff&size=128`;

    const newUser = await prisma.user.create({
      data: {
        name: cleanName,
        email: cleanEmail,
        password_hash,
        image: defaultAvatar,
        provider: 'email',
        role: 'customer',
      },
    });

    const userSession = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      image: newUser.image,
      provider: newUser.provider,
      role: newUser.role,
    };

    const token = createSessionToken(userSession);

    const response = NextResponse.json({
      success: true,
      message: 'Account created successfully! Welcome to Uncover Ceylon.',
      user: userSession,
    }, { status: 201 });

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
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Failed to create account. Please try again.' }, { status: 500 });
  }
}
