import { NextRequest, NextResponse } from 'next/server';
import { prisma, logActivity } from '@/lib/db';
import { verifyAdminPassword } from '@/lib/auth';

export async function GET() {
  try {
    const slides = await prisma.regionSlide.findMany({
      orderBy: [{ sort_order: 'asc' }, { id: 'asc' }],
    });
    return NextResponse.json({ slides });
  } catch (error) {
    console.error('GET /api/region-slides error:', error);
    return NextResponse.json({ error: 'Failed to fetch region slides' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { image_url, title, region, password } = await request.json();

    if (!verifyAdminPassword(password)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!image_url || !title) {
      return NextResponse.json({ error: 'image_url and title are required' }, { status: 400 });
    }

    const maxSlide = await prisma.regionSlide.findFirst({
      orderBy: { sort_order: 'desc' },
      select: { sort_order: true },
    });

    const nextOrder = (maxSlide?.sort_order ?? -1) + 1;

    const newSlide = await prisma.regionSlide.create({
      data: {
        image_url,
        title,
        region: region || 'Sri Lanka',
        sort_order: nextOrder,
      },
    });

    await logActivity('CREATE_REGION_SLIDE', 'region_slides', newSlide.id, `Added region slide "${title}"`);

    return NextResponse.json({ id: newSlide.id, message: 'Region slide added successfully!' }, { status: 201 });
  } catch (error) {
    console.error('POST /api/region-slides error:', error);
    return NextResponse.json({ error: 'Failed to add region slide' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id, password } = await request.json();

    if (!verifyAdminPassword(password)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const slideId = parseInt(id, 10);
    const existing = await prisma.regionSlide.findUnique({
      where: { id: slideId },
      select: { title: true },
    });

    await prisma.regionSlide.delete({
      where: { id: slideId },
    });

    await logActivity('DELETE_REGION_SLIDE', 'region_slides', slideId, `Deleted region slide "${existing?.title || slideId}"`);

    return NextResponse.json({ message: 'Region slide deleted successfully!' });
  } catch (error) {
    console.error('DELETE /api/region-slides error:', error);
    return NextResponse.json({ error: 'Failed to delete region slide' }, { status: 500 });
  }
}
