import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;

  if (!clientId || clientId.trim() === '') {
    return NextResponse.json(
      {
        error: 'Google OAuth Client ID is not configured. Please set NEXT_PUBLIC_GOOGLE_CLIENT_ID in .env.',
      },
      { status: 400 }
    );
  }

  const { searchParams } = new URL(request.url);
  const returnTo = searchParams.get('return_to') || '/';

  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000';
  const isLocal = host.startsWith('localhost') || host.startsWith('127.0.0.1');
  const protocol = isLocal
    ? 'http'
    : (request.headers.get('x-forwarded-proto') || (process.env.NODE_ENV === 'production' ? 'https' : 'http'));
  const redirectUri = `${protocol}://${host}/api/auth/google/callback`;

  const state = Buffer.from(JSON.stringify({ return_to: returnTo })).toString('base64');

  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  googleAuthUrl.searchParams.set('client_id', clientId.trim());
  googleAuthUrl.searchParams.set('redirect_uri', redirectUri);
  googleAuthUrl.searchParams.set('response_type', 'code');
  googleAuthUrl.searchParams.set('scope', 'openid email profile');
  googleAuthUrl.searchParams.set('access_type', 'offline');
  googleAuthUrl.searchParams.set('prompt', 'select_account');
  googleAuthUrl.searchParams.set('state', state);

  return NextResponse.redirect(googleAuthUrl.toString());
}
