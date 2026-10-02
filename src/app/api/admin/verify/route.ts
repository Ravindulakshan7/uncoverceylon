import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!verifyAdminPassword(password)) {
      return NextResponse.json(
        { error: 'Incorrect admin password. Please check your password.' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Authenticated successfully',
    });
  } catch (error) {
    console.error('POST /api/admin/verify error:', error);
    return NextResponse.json(
      { error: 'Server authentication verification failed' },
      { status: 500 }
    );
  }
}
