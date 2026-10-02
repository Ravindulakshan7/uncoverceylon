import { NextRequest, NextResponse } from 'next/server';
import { getDb, logActivity } from '@/lib/db';
import { Place } from '@/types';
import { verifyAdminPassword } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');

    let query = 'SELECT * FROM places WHERE 1=1';
    const params: (string | number)[] = [];

    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (name LIKE ? OR location LIKE ? OR description LIKE ? OR province LIKE ?)';
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam, searchParam);
    }

    if (featured === 'true') {
      query += ' AND featured = 1';
    }

    query += ' ORDER BY featured DESC, rating DESC';

    const places = db.prepare(query).all(...params) as Place[];
    return NextResponse.json({ places, total: places.length });
  } catch (error) {
    console.error('GET /api/places error:', error);
    return NextResponse.json({ error: 'Failed to fetch places' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name, description, short_description, location, province,
      category, lat, lng, image_url, gallery, tips, best_time,
      entry_fee, distance_km, featured, password
    } = body;

    // Admin password check
    if (!verifyAdminPassword(password)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!name || !description || !location || !category || !lat || !lng) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = getDb();
    const result = db.prepare(`
      INSERT INTO places (name, description, short_description, location, province, category, lat, lng, image_url, gallery, tips, best_time, entry_fee, distance_km, featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      name, description, short_description || '', location, province || '',
      category, lat, lng, image_url || '', JSON.stringify(gallery || []),
      tips || '', best_time || '', entry_fee || 'Free', distance_km || 0,
      featured ? 1 : 0
    );

    const newId = result.lastInsertRowid;
    logActivity('CREATE_PLACE', 'places', newId, `Added new destination "${name}" (${category}, ${province || location})`);

    return NextResponse.json({ id: newId, message: 'Place added successfully!' }, { status: 201 });
  } catch (error) {
    console.error('POST /api/places error:', error);
    return NextResponse.json({ error: 'Failed to add place' }, { status: 500 });
  }
}
