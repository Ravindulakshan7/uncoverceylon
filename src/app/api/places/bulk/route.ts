import { NextRequest, NextResponse } from 'next/server';
import { getDb, logActivity } from '@/lib/db';
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

    const db = getDb();
    const cleanIds = ids.map((id) => Number(id)).filter((id) => !isNaN(id) && id > 0);

    if (cleanIds.length === 0) {
      return NextResponse.json({ error: 'Invalid destination IDs' }, { status: 400 });
    }

    const placeholders = cleanIds.map(() => '?').join(',');

    if (action === 'delete') {
      // Fetch names before deleting to log them nicely
      const placesToDelete = db.prepare(`SELECT id, name FROM places WHERE id IN (${placeholders})`).all(...cleanIds) as { id: number; name: string }[];
      const namesList = placesToDelete.map((p) => p.name).slice(0, 5).join(', ') + (placesToDelete.length > 5 ? ` +${placesToDelete.length - 5} more` : '');

      // Delete associated reviews first (cascade)
      db.prepare(`DELETE FROM reviews WHERE place_id IN (${placeholders})`).run(...cleanIds);
      // Delete places
      const deleteResult = db.prepare(`DELETE FROM places WHERE id IN (${placeholders})`).run(...cleanIds);

      logActivity(
        'BULK_DELETE',
        'places',
        cleanIds.join(','),
        `Bulk deleted ${deleteResult.changes} destinations: [${namesList}]`
      );

      return NextResponse.json({
        success: true,
        count: deleteResult.changes,
        message: `Successfully deleted ${deleteResult.changes} destinations.`,
      });
    }

    if (action === 'change_category') {
      if (!category || typeof category !== 'string') {
        return NextResponse.json({ error: 'Target category is required' }, { status: 400 });
      }

      const updateResult = db.prepare(`
        UPDATE places
        SET category = ?
        WHERE id IN (${placeholders})
      `).run(category, ...cleanIds);

      logActivity(
        'BULK_CATEGORY',
        'places',
        cleanIds.join(','),
        `Bulk updated category to "${category}" for ${updateResult.changes} destinations (IDs: ${cleanIds.slice(0, 8).join(', ')}${cleanIds.length > 8 ? '...' : ''})`
      );

      return NextResponse.json({
        success: true,
        count: updateResult.changes,
        message: `Successfully moved ${updateResult.changes} destinations to "${category}".`,
      });
    }

    return NextResponse.json({ error: 'Unknown bulk action' }, { status: 400 });
  } catch (error) {
    console.error('POST /api/places/bulk error:', error);
    return NextResponse.json({ error: 'Failed to process bulk operation' }, { status: 500 });
  }
}
