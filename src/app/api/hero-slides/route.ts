import { NextRequest, NextResponse } from 'next/server';
import { getDb, logActivity } from '@/lib/db';
import { verifyAdminPassword } from '@/lib/auth';

export interface HeroSlide {
  id: number;
  image_url: string;
  location: string;
  province: string;
  sort_order: number;
  created_at: string;
}

// GET all hero slides
export async function GET() {
  try {
    const db = getDb();
    const slides = db.prepare('SELECT * FROM hero_slides ORDER BY sort_order ASC').all() as HeroSlide[];
    return NextResponse.json({ slides });
  } catch (error) {
    console.error('GET /api/hero-slides error:', error);
    return NextResponse.json({ error: 'Failed to fetch slides' }, { status: 500 });
  }
}

// POST — add a new slide
export async function POST(request: NextRequest) {
  try {
    const { image_url, location, province, password } = await request.json();

    if (!verifyAdminPassword(password)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!image_url || !location) {
      return NextResponse.json({ error: 'image_url and location are required' }, { status: 400 });
    }

    const db = getDb();
    const maxOrder = (db.prepare('SELECT MAX(sort_order) as m FROM hero_slides').get() as { m: number | null }).m ?? -1;

    const result = db.prepare(
      'INSERT INTO hero_slides (image_url, location, province, sort_order) VALUES (?, ?, ?, ?)'
    ).run(image_url, location, province || '', maxOrder + 1);

    const slideId = result.lastInsertRowid;
    logActivity('CREATE_HERO_SLIDE', 'slides', slideId, `Added hero slide for "${location}" (${province || 'Sri Lanka'})`);

    return NextResponse.json({ id: slideId, message: 'Slide added!' }, { status: 201 });
  } catch (error) {
    console.error('POST /api/hero-slides error:', error);
    return NextResponse.json({ error: 'Failed to add slide' }, { status: 500 });
  }
}

// DELETE — remove a slide
export async function DELETE(request: NextRequest) {
  try {
    const { id, password } = await request.json();

    if (!verifyAdminPassword(password)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getDb();
    const slide = db.prepare('SELECT location FROM hero_slides WHERE id = ?').get(id) as { location: string } | undefined;
    const loc = slide ? slide.location : `Slide #${id}`;

    db.prepare('DELETE FROM hero_slides WHERE id = ?').run(id);
    logActivity('DELETE_HERO_SLIDE', 'slides', id, `Deleted hero slide for "${loc}" (ID #${id})`);

    return NextResponse.json({ message: 'Slide deleted!' });
  } catch (error) {
    console.error('DELETE /api/hero-slides error:', error);
    return NextResponse.json({ error: 'Failed to delete slide' }, { status: 500 });
  }
}
