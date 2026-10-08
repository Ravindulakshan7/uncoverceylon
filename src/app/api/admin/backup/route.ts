import { NextRequest, NextResponse } from 'next/server';
import { prisma, logActivity } from '@/lib/db';
import { verifyAdminPassword } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryPass = searchParams.get('password');
    const headerPass = request.headers.get('x-admin-password');
    const password = queryPass || headerPass;

    if (!verifyAdminPassword(password)) {
      return NextResponse.json({ error: 'Unauthorized access to database backup' }, { status: 401 });
    }

    const [places, heroSlides, reviews, settings] = await Promise.all([
      prisma.place.findMany({ orderBy: { id: 'asc' } }),
      prisma.heroSlide.findMany({ orderBy: { sort_order: 'asc' } }),
      prisma.review.findMany({ orderBy: { id: 'asc' } }),
      prisma.siteSetting.findMany(),
    ]);

    const backupData = {
      timestamp: new Date().toISOString(),
      platform: 'Supabase PostgreSQL',
      counts: {
        places: places.length,
        heroSlides: heroSlides.length,
        reviews: reviews.length,
        settings: settings.length,
      },
      places,
      heroSlides,
      reviews,
      settings,
    };

    const jsonStr = JSON.stringify(backupData, null, 2);
    const dateStr = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `uncoverceylon-supabase-backup-${dateStr}.json`;

    await logActivity('BACKUP_DOWNLOAD', 'database', 'supabase', `Cloud database JSON backup exported (${places.length} places)`);

    return new NextResponse(jsonStr, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error) {
    console.error('GET /api/admin/backup error:', error);
    return NextResponse.json({ error: 'Failed to generate database backup' }, { status: 500 });
  }
}
