import { NextRequest, NextResponse } from 'next/server';
import { prisma, logActivity } from '@/lib/db';
import { verifyAdminPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password, action, ids, category } = body;

    if (!verifyAdminPassword(password)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'No destination IDs provided' }, { status: 400 });
    }

    const cleanIds = ids.map((id) => Number(id)).filter((id) => !isNaN(id) && id > 0);

    if (cleanIds.length === 0) {
      return NextResponse.json({ error: 'Invalid destination IDs' }, { status: 400 });
    }

    if (action === 'delete') {
      const placesToDelete = await prisma.place.findMany({
        where: { id: { in: cleanIds } },
        select: { id: true, name: true },
      });
      const namesList = placesToDelete.map((p) => p.name).slice(0, 5).join(', ');

      const deleteResult = await prisma.place.deleteMany({
        where: { id: { in: cleanIds } },
      });

      await logActivity(
        'BULK_DELETE',
        'places',
        cleanIds.join(','),
        `Bulk deleted ${deleteResult.count} destinations: [${namesList}]`
      );

      return NextResponse.json({
        success: true,
        count: deleteResult.count,
        message: `Successfully deleted ${deleteResult.count} destinations.`,
      });
    }

    if (action === 'change_category') {
      if (!category || typeof category !== 'string') {
        return NextResponse.json({ error: 'Target category is required' }, { status: 400 });
      }

      const updateResult = await prisma.place.updateMany({
        where: { id: { in: cleanIds } },
        data: { category },
      });

      await logActivity(
        'BULK_CATEGORY',
        'places',
        cleanIds.join(','),
        `Bulk updated category to "${category}" for ${updateResult.count} destinations`
      );

      return NextResponse.json({
        success: true,
        count: updateResult.count,
        message: `Successfully moved ${updateResult.count} destinations to "${category}".`,
      });
    }

    return NextResponse.json({ error: 'Unknown bulk action' }, { status: 400 });
  } catch (error) {
    console.error('POST /api/places/bulk error:', error);
    return NextResponse.json({ error: 'Failed to process bulk operation' }, { status: 500 });
  }
}
