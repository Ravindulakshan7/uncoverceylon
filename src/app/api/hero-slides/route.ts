import { NextRequest, NextResponse } from 'next/server';
import { prisma, logActivity } from '@/lib/db';
import { verifyAdminPassword } from '@/lib/auth';

export async function GET() {
  try {
    const slides = await prisma.heroSlide.findMany({
      orderBy: { sort_order: 'asc' },
    });
    return NextResponse.json({ slides });
  } catch (error) {
    console.error('GET /api/hero-slides error:', error);
    return NextResponse.json({ error: 'Failed to fetch slides' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { image_url, location, province, password } = await request.json();

    if (!verifyAdminPassword(password)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!image_url || !location) {
      return NextResponse.json({ error: 'image_url and location are required' }, { status: 400 });
    }

    const maxSlide = await prisma.heroSlide.findFirst({
      orderBy: { sort_order: 'desc' },
      select: { sort_order: true },
    });

    const nextOrder = (maxSlide?.sort_order ?? -1) + 1;

    const newSlide = await prisma.heroSlide.create({
      data: {
        image_url,
        location,
        province: province || '',
        sort_order: nextOrder,
      },
    });

    await logActivity('CREATE_HERO_SLIDE', 'slides', newSlide.id, `Added hero slide for "${location}"`);

    return NextResponse.json({ id: newSlide.id, message: 'Slide added!' }, { status: 201 });
  } catch (error) {
    console.error('POST /api/hero-slides error:', error);
    return NextResponse.json({ error: 'Failed to add slide' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id, password } = await request.json();

    if (!verifyAdminPassword(password)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const slideId = parseInt(id, 10);
    const existing = await prisma.heroSlide.findUnique({
      where: { id: slideId },
      select: { location: true },
    });

    await prisma.heroSlide.delete({
      where: { id: slideId },
    });

    await logActivity('DELETE_HERO_SLIDE', 'slides', slideId, `Deleted hero slide for "${existing?.location || slideId}"`);

    return NextResponse.json({ message: 'Slide deleted!' });
  } catch (error) {
    console.error('DELETE /api/hero-slides error:', error);
    return NextResponse.json({ error: 'Failed to delete slide' }, { status: 500 });
  }
}
