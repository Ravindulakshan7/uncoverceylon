import { NextRequest, NextResponse } from 'next/server';
import { getDb, logActivity } from '@/lib/db';
import { verifyAdminPassword } from '@/lib/auth';

export interface RegionSlide {
  id: number;
  image_url: string;
  title: string;
  region: string;
  sort_order: number;
}

// GET all region slides
export async function GET() {
  try {
    const db = getDb();
    const slides = db.prepare('SELECT * FROM region_slides ORDER BY sort_order ASC, id ASC').all() as RegionSlide[];
    return NextResponse.json({ slides });
  } catch (error) {
    console.error('GET /api/region-slides error:', error);
    return NextResponse.json({ error: 'Failed to fetch region slides' }, { status: 500 });
  }
}

// POST — add a new region slide
export async function POST(request: NextRequest) {
  try {
    const { image_url, title, region, password } = await request.json();

    if (!verifyAdminPassword(password)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!image_url || !title) {
      return NextResponse.json({ error: 'image_url and title are required' }, { status: 400 });
    }

    const db = getDb();
    const maxOrder = (db.prepare('SELECT MAX(sort_order) as m FROM region_slides').get() as { m: number | null }).m ?? -1;

    const result = db.prepare(
      'INSERT INTO region_slides (image_url, title, region, sort_order) VALUES (?, ?, ?, ?)'
    ).run(image_url, title, region || 'Sri Lanka', maxOrder + 1);

    const slideId = result.lastInsertRowid;
    logActivity('CREATE_REGION_SLIDE', 'region_slides', slideId, `Added region slide "${title}" (${region || 'Sri Lanka'})`);

    return NextResponse.json({ id: slideId, message: 'Region slide added successfully!' }, { status: 201 });
  } catch (error) {
    console.error('POST /api/region-slides error:', error);
    return NextResponse.json({ error: 'Failed to add region slide' }, { status: 500 });
  }
}

// DELETE — remove a region slide
export async function DELETE(request: NextRequest) {
  try {
    const { id, password } = await request.json();

    if (!verifyAdminPassword(password)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getDb();
    const slide = db.prepare('SELECT title FROM region_slides WHERE id = ?').get(id) as { title: string } | undefined;
    const title = slide ? slide.title : `Region Slide #${id}`;

    db.prepare('DELETE FROM region_slides WHERE id = ?').run(id);
    logActivity('DELETE_REGION_SLIDE', 'region_slides', id, `Deleted region slide "${title}" (ID #${id})`);

    return NextResponse.json({ message: 'Region slide deleted successfully!' });
  } catch (error) {
    console.error('DELETE /api/region-slides error:', error);
    return NextResponse.json({ error: 'Failed to delete region slide' }, { status: 500 });
  }
}
