import { NextRequest, NextResponse } from 'next/server';
import { prisma, logActivity } from '@/lib/db';
import { verifyAdminPassword } from '@/lib/auth';

export async function GET() {
  try {
    const experiences = await prisma.experienceItem.findMany({
      orderBy: [{ sort_order: 'asc' }, { id: 'asc' }],
    });
    return NextResponse.json({ experiences });
  } catch (error) {
    console.error('GET /api/experiences error:', error);
    return NextResponse.json({ error: 'Failed to fetch experiences' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, tagline, desc, image, badge, seasons, sort_order, admin_password } = body;

    if (!verifyAdminPassword(admin_password)) {
      return NextResponse.json({ error: 'Unauthorized: Invalid admin password' }, { status: 401 });
    }

    if (!title || !desc) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    const newExperience = await prisma.experienceItem.create({
      data: {
        title: String(title).trim(),
        tagline: String(tagline || '').trim(),
        desc: String(desc).trim(),
        image: String(image || '').trim(),
        badge: String(badge || 'Popular').trim(),
        seasons: String(seasons || '').trim(),
        sort_order: Number(sort_order) || 0,
      },
    });

    await logActivity('CREATE_EXP', 'experience_items', String(newExperience.id), `Added experience: ${newExperience.title}`);

    return NextResponse.json({ success: true, experience: newExperience }, { status: 201 });
  } catch (error) {
    console.error('POST /api/experiences error:', error);
    return NextResponse.json({ error: 'Failed to create experience' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, tagline, desc, image, badge, seasons, sort_order, admin_password } = body;

    if (!verifyAdminPassword(admin_password)) {
      return NextResponse.json({ error: 'Unauthorized: Invalid admin password' }, { status: 401 });
    }

    if (!id || !title || !desc) {
      return NextResponse.json({ error: 'ID, title and description are required' }, { status: 400 });
    }

    const updated = await prisma.experienceItem.update({
      where: { id: Number(id) },
      data: {
        title: String(title).trim(),
        tagline: String(tagline || '').trim(),
        desc: String(desc).trim(),
        image: String(image || '').trim(),
        badge: String(badge || 'Popular').trim(),
        seasons: String(seasons || '').trim(),
        sort_order: Number(sort_order) || 0,
      },
    });

    await logActivity('UPDATE_EXP', 'experience_items', String(id), `Updated experience: ${updated.title}`);

    return NextResponse.json({ success: true, experience: updated });
  } catch (error) {
    console.error('PUT /api/experiences error:', error);
    return NextResponse.json({ error: 'Failed to update experience' }, { status: 500 });
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
      return NextResponse.json({ error: 'Missing experience ID' }, { status: 400 });
    }

    await prisma.experienceItem.delete({
      where: { id: Number(id) },
    });

    await logActivity('DELETE_EXP', 'experience_items', id, `Deleted experience #${id}`);

    return NextResponse.json({ success: true, message: 'Experience item deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/experiences error:', error);
    return NextResponse.json({ error: 'Failed to delete experience' }, { status: 500 });
  }
}
