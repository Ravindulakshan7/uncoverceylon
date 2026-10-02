import { NextRequest, NextResponse } from 'next/server';
import { getDb, logActivity } from '@/lib/db';
import { Place } from '@/types';
import { verifyAdminPassword } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();
    const place = db.prepare('SELECT * FROM places WHERE id = ?').get(id) as Place | undefined;

    if (!place) {
      return NextResponse.json({ error: 'Place not found' }, { status: 404 });
    }

    const reviews = db.prepare('SELECT * FROM reviews WHERE place_id = ? ORDER BY created_at DESC').all(id);

    return NextResponse.json({ place, reviews });
  } catch (error) {
    console.error('GET /api/places/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch place' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { password, ...data } = body;

    if (!verifyAdminPassword(password)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getDb();
    const result = db.prepare(`
      UPDATE places SET
        name = ?, description = ?, short_description = ?,
        location = ?, province = ?, category = ?,
        lat = ?, lng = ?, image_url = ?, gallery = ?,
        tips = ?, best_time = ?, entry_fee = ?,
        distance_km = ?, featured = ?
      WHERE id = ?
    `).run(
      data.name, data.description, data.short_description,
      data.location, data.province, data.category,
      data.lat, data.lng, data.image_url, JSON.stringify(data.gallery || []),
      data.tips, data.best_time, data.entry_fee,
      data.distance_km, data.featured ? 1 : 0, id
    );

    if (result.changes > 0) {
      logActivity('UPDATE_PLACE', 'places', id, `Updated destination "${data.name}" (ID #${id})`);
    }

    return NextResponse.json({ message: 'Place updated successfully!' });
  } catch (error) {
    console.error('PUT /api/places/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update place' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { password } = await request.json();

    if (!verifyAdminPassword(password)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getDb();
    const existing = db.prepare('SELECT name FROM places WHERE id = ?').get(id) as { name: string } | undefined;
    const placeName = existing ? existing.name : `Destination #${id}`;

    // Delete associated reviews
    db.prepare('DELETE FROM reviews WHERE place_id = ?').run(id);
    db.prepare('DELETE FROM places WHERE id = ?').run(id);

    logActivity('DELETE_PLACE', 'places', id, `Deleted destination "${placeName}" (ID #${id})`);

    return NextResponse.json({ message: 'Place deleted successfully!' });
  } catch (error) {
    console.error('DELETE /api/places/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete place' }, { status: 500 });
  }
}
