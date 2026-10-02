import { NextRequest, NextResponse } from 'next/server';
import { getDb, logActivity } from '@/lib/db';
import { verifyAdminPassword } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryPass = searchParams.get('password');
    const headerPass = request.headers.get('x-admin-password');
    const password = queryPass || headerPass;

    if (!verifyAdminPassword(password)) {
      return NextResponse.json({ error: 'Unauthorized access to database backup' }, { status: 401 });
    }

    const db = getDb();
    // Flush WAL to ensure main SQLite file has the absolute latest committed writes
    try {
      db.pragma('wal_checkpoint(TRUNCATE)');
    } catch (e) {
      console.warn('WAL checkpoint warning during backup:', e);
    }

    const dbPath = path.join(process.cwd(), 'data', 'uncoverceylon.db');
    if (!fs.existsSync(dbPath)) {
      return NextResponse.json({ error: 'Database file not found' }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(dbPath);
    const dateStr = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `uncoverceylon-backup-${dateStr}.db`;

    // Record activity log
    logActivity('BACKUP_DOWNLOAD', 'database', 'uncoverceylon.db', `One-click database backup downloaded (${(fileBuffer.length / 1024).toFixed(1)} KB)`);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.sqlite3',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error) {
    console.error('GET /api/admin/backup error:', error);
    return NextResponse.json({ error: 'Failed to generate database backup' }, { status: 500 });
  }
}
