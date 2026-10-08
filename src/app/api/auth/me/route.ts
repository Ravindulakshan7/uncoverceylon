import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Session verification error:', error);
    return NextResponse.json({ user: null });
  }
}
