import { NextRequest, NextResponse } from 'next/server';
import { getActivityLogs, clearActivityLogs } from '@/lib/db';
import { verifyAdminPassword } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '100', 10), 200);

    const logs = getActivityLogs(limit);
    return NextResponse.json({ logs });
  } catch (error) {
    console.error('GET /api/admin/logs error:', error);
    return NextResponse.json({ error: 'Failed to fetch activity logs' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!verifyAdminPassword(password)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const success = clearActivityLogs();
    if (!success) {
      return NextResponse.json({ error: 'Failed to clear activity logs' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Activity logs cleared' });
  } catch (error) {
    console.error('DELETE /api/admin/logs error:', error);
    return NextResponse.json({ error: 'Failed to delete activity logs' }, { status: 500 });
  }
}
