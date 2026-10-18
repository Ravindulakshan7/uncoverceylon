import { NextRequest, NextResponse } from 'next/server';
import { prisma, logActivity } from '@/lib/db';
import { verifyAdminPassword } from '@/lib/auth';

export async function GET() {
  try {
    const foods = await prisma.foodItem.findMany({
      orderBy: [{ sort_order: 'asc' }, { id: 'asc' }],
    });
    return NextResponse.json({ foods });
  } catch (error) {
    console.error('GET /api/foods error:', error);
    return NextResponse.json({ error: 'Failed to fetch foods' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      tagline,
      desc,
      image,
      img,
      badge,
      regions,
      tag,
      cuisine,
      meal,
      price,
      spice,
      serving,
      locations,
      heritage,
      ingredients,
      howToEat,
      varieties,
      sort_order,
      admin_password,
    } = body;

    if (!verifyAdminPassword(admin_password)) {
      return NextResponse.json({ error: 'Unauthorized: Invalid admin password' }, { status: 401 });
    }

    if (!title || !desc) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    const cleanTitle = String(title).trim();
    const cleanSlug = String(
      slug || cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    ).trim();

    const cleanImg = String(image || img || '').trim();
    const cleanLocations = String(locations || regions || '').trim();
    const cleanVarieties = typeof varieties === 'string'
      ? varieties
      : JSON.stringify(Array.isArray(varieties) ? varieties : []);

    const newFood = await prisma.foodItem.create({
      data: {
        title: cleanTitle,
        slug: cleanSlug,
        tagline: String(tagline || '').trim(),
        desc: String(desc).trim(),
        image: cleanImg,
        badge: String(badge || cuisine || 'Must Try').trim(),
        regions: cleanLocations,
        tag: String(tag || 'curry').toLowerCase().trim(),
        cuisine: String(cuisine || badge || 'Sri Lankan').trim(),
        meal: String(meal || 'Lunch / Dinner').trim(),
        price: String(price || '').trim(),
        spice: String(spice || 'Medium to Fiery').trim(),
        serving: String(serving || 'Traditional Service').trim(),
        locations: cleanLocations,
        heritage: String(heritage || desc || '').trim(),
        ingredients: String(ingredients || '').trim(),
        howToEat: String(howToEat || '').trim(),
        varieties: cleanVarieties,
        sort_order: Number(sort_order) || 0,
      },
    });

    await logActivity('CREATE_FOOD', 'food_items', String(newFood.id), `Added food: ${newFood.title}`);

    return NextResponse.json({ success: true, food: newFood }, { status: 201 });
  } catch (error) {
    console.error('POST /api/foods error:', error);
    return NextResponse.json({ error: 'Failed to create food' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      title,
      slug,
      tagline,
      desc,
      image,
      img,
      badge,
      regions,
      tag,
      cuisine,
      meal,
      price,
      spice,
      serving,
      locations,
      heritage,
      ingredients,
      howToEat,
      varieties,
      sort_order,
      admin_password,
    } = body;

    if (!verifyAdminPassword(admin_password)) {
      return NextResponse.json({ error: 'Unauthorized: Invalid admin password' }, { status: 401 });
    }

    if (!id || !title || !desc) {
      return NextResponse.json({ error: 'ID, title and description are required' }, { status: 400 });
    }

    const cleanTitle = String(title).trim();
    const cleanSlug = String(
      slug || cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    ).trim();

    const cleanImg = String(image || img || '').trim();
    const cleanLocations = String(locations || regions || '').trim();
    const cleanVarieties = typeof varieties === 'string'
      ? varieties
      : JSON.stringify(Array.isArray(varieties) ? varieties : []);

    const updated = await prisma.foodItem.update({
      where: { id: Number(id) },
      data: {
        title: cleanTitle,
        slug: cleanSlug,
        tagline: String(tagline || '').trim(),
        desc: String(desc).trim(),
        image: cleanImg,
        badge: String(badge || cuisine || 'Must Try').trim(),
        regions: cleanLocations,
        tag: String(tag || 'curry').toLowerCase().trim(),
        cuisine: String(cuisine || badge || 'Sri Lankan').trim(),
        meal: String(meal || 'Lunch / Dinner').trim(),
        price: String(price || '').trim(),
        spice: String(spice || 'Medium to Fiery').trim(),
        serving: String(serving || 'Traditional Service').trim(),
        locations: cleanLocations,
        heritage: String(heritage || desc || '').trim(),
        ingredients: String(ingredients || '').trim(),
        howToEat: String(howToEat || '').trim(),
        varieties: cleanVarieties,
        sort_order: Number(sort_order) || 0,
      },
    });

    await logActivity('UPDATE_FOOD', 'food_items', String(id), `Updated food: ${updated.title}`);

    return NextResponse.json({ success: true, food: updated });
  } catch (error) {
    console.error('PUT /api/foods error:', error);
    return NextResponse.json({ error: 'Failed to update food' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const adminPassword = searchParams.get('admin_password') || request.headers.get('x-admin-password');

    if (!verifyAdminPassword(adminPassword)) {
      return NextResponse.json({ error: 'Unauthorized: Invalid admin password' }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ error: 'Missing food ID' }, { status: 400 });
    }

    await prisma.foodItem.delete({
      where: { id: Number(id) },
    });

    await logActivity('DELETE_FOOD', 'food_items', id, `Deleted food #${id}`);

    return NextResponse.json({ success: true, message: 'Food item deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/foods error:', error);
    return NextResponse.json({ error: 'Failed to delete food' }, { status: 500 });
  }
}
