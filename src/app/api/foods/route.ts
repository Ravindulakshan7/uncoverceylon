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
    const { title, tagline, desc, image, badge, regions, sort_order, admin_password } = body;

    if (!verifyAdminPassword(admin_password)) {
      return NextResponse.json({ error: 'Unauthorized: Invalid admin password' }, { status: 401 });
    }

    if (!title || !desc) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    const newFood = await prisma.foodItem.create({
      data: {
        title: String(title).trim(),
        tagline: String(tagline || '').trim(),
        desc: String(desc).trim(),
        image: String(image || '').trim(),
        badge: String(badge || 'Must Try').trim(),
        regions: String(regions || '').trim(),
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
    const { id, title, tagline, desc, image, badge, regions, sort_order, admin_password } = body;

    if (!verifyAdminPassword(admin_password)) {
      return NextResponse.json({ error: 'Unauthorized: Invalid admin password' }, { status: 401 });
    }

    if (!id || !title || !desc) {
      return NextResponse.json({ error: 'ID, title and description are required' }, { status: 400 });
    }

    const updated = await prisma.foodItem.update({
      where: { id: Number(id) },
      data: {
        title: String(title).trim(),
        tagline: String(tagline || '').trim(),
        desc: String(desc).trim(),
        image: String(image || '').trim(),
        badge: String(badge || 'Must Try').trim(),
        regions: String(regions || '').trim(),
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
