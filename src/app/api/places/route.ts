import { NextRequest, NextResponse } from 'next/server';
import { prisma, logActivity } from '@/lib/db';
import { verifyAdminPassword } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');

    const where: any = {};

    if (category && category !== 'All') {
      where.category = category;
    }

    if (featured === 'true') {
      where.featured = 1;
    }

    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { location: { contains: q, mode: 'insensitive' } },
        { province: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }

    const places = await prisma.place.findMany({
      where,
      orderBy: [
        { featured: 'desc' },
        { rating: 'desc' },
      ],
    });

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

    const newPlace = await prisma.place.create({
      data: {
        name,
        description,
        short_description: short_description || '',
        location,
        province: province || '',
        category,
        lat: Number(lat),
        lng: Number(lng),
        image_url: image_url || '',
        gallery: typeof gallery === 'string' ? gallery : JSON.stringify(gallery || []),
        tips: tips || '',
        best_time: best_time || '',
        entry_fee: entry_fee || 'Free',
        distance_km: Number(distance_km || 0),
        featured: featured ? 1 : 0,
      },
    });

    await logActivity('CREATE_PLACE', 'places', newPlace.id, `Added new destination "${name}" (${category})`);

    return NextResponse.json({ id: newPlace.id, message: 'Place added successfully!' }, { status: 201 });
  } catch (error) {
    console.error('POST /api/places error:', error);
    return NextResponse.json({ error: 'Failed to add place' }, { status: 500 });
  }
}
