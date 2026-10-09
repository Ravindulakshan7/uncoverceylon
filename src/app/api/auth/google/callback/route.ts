import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createSessionToken, AUTH_COOKIE_NAME } from '@/lib/auth';

function getBaseRedirectUrl(request: NextRequest, path: string): URL {
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000';
  const isLocal = host.startsWith('localhost') || host.startsWith('127.0.0.1');
  const protocol = isLocal
    ? 'http'
    : (request.headers.get('x-forwarded-proto') || (process.env.NODE_ENV === 'production' ? 'https' : 'http'));

  const cleanPath = path && path.startsWith('/') ? path : `/${path || ''}`;
  return new URL(cleanPath, `${protocol}://${host}`);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    let returnTo = '/';
    if (state) {
      try {
        const decoded = JSON.parse(Buffer.from(state, 'base64').toString('utf8'));
        if (decoded.return_to && typeof decoded.return_to === 'string') {
          returnTo = decoded.return_to;
        }
      } catch {
        // ignore
      }
    }

    if (error || !code) {
      const redirectUrl = getBaseRedirectUrl(request, returnTo);
      redirectUrl.searchParams.set('auth_error', error || 'Google sign in was cancelled');
      return NextResponse.redirect(redirectUrl);
    }

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      const redirectUrl = getBaseRedirectUrl(request, returnTo);
      redirectUrl.searchParams.set('auth_error', 'Google OAuth credentials missing on server');
      return NextResponse.redirect(redirectUrl);
    }

    const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000';
    const isLocal = host.startsWith('localhost') || host.startsWith('127.0.0.1');
    const protocol = isLocal
      ? 'http'
      : (request.headers.get('x-forwarded-proto') || (process.env.NODE_ENV === 'production' ? 'https' : 'http'));
    const redirectUri = `${protocol}://${host}/api/auth/google/callback`;

    // 1. Exchange authorization code for tokens with Google
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId.trim(),
        client_secret: clientSecret.trim(),
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.access_token) {
      console.error('Google token exchange error:', tokenData);
      const redirectUrl = getBaseRedirectUrl(request, returnTo);
      redirectUrl.searchParams.set('auth_error', 'Failed to exchange token with Google');
      return NextResponse.redirect(redirectUrl);
    }

    // 2. Fetch real user profile from Google's official userinfo endpoint
    const userinfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const userinfo = await userinfoRes.json();

    if (!userinfoRes.ok || !userinfo.email) {
      console.error('Google userinfo fetch error:', userinfo);
      const redirectUrl = getBaseRedirectUrl(request, returnTo);
      redirectUrl.searchParams.set('auth_error', 'Failed to retrieve profile from Google');
      return NextResponse.redirect(redirectUrl);
    }

    const email = String(userinfo.email).trim().toLowerCase();
    const name = String(userinfo.name || userinfo.given_name || email.split('@')[0]).trim();
    const picture =
      userinfo.picture ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=00aa6c&color=fff&size=128`;

    // 3. Upsert user in Supabase PostgreSQL
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: name || user.name,
          image: picture || user.image,
          provider: 'google',
        },
      });
    } else {
      user = await prisma.user.create({
        data: {
          email,
          name,
          image: picture,
          provider: 'google',
          role: 'customer',
        },
      });
    }

    // 4. Create session token
    const userSession = {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      provider: user.provider,
      role: user.role,
    };

    const sessionToken = createSessionToken(userSession);

    // 5. Redirect back to destination with session cookie
    const redirectUrl = getBaseRedirectUrl(request, returnTo);
    redirectUrl.searchParams.set('auth_success', 'google');
    const response = NextResponse.redirect(redirectUrl);

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' && !isLocal,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    const redirectUrl = getBaseRedirectUrl(request, '/');
    redirectUrl.searchParams.set('auth_error', 'unexpected_error');
    return NextResponse.redirect(redirectUrl);
  }
}
