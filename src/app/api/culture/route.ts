import { NextRequest, NextResponse } from 'next/server';
import { prisma, logActivity } from '@/lib/db';
import { verifyAdminPassword } from '@/lib/auth';

export async function GET() {
  try {
    const cultures = await prisma.cultureItem.findMany({
      orderBy: [{ sort_order: 'asc' }, { id: 'asc' }],
    });
    return NextResponse.json({ cultures });
  } catch (error) {
    console.error('GET /api/culture error:', error);
    return NextResponse.json({ error: 'Failed to fetch culture items' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      sinhalaName,
      tagline,
      desc,
      image,
      badge,
      tag,
      period,
      locations,
      timing,
      entryInfo,
      dressCode,
      preservation,
      heritage,
      ancientRoots,
      architecturalElements,
      etiquetteTips,
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

    const varietiesString = Array.isArray(varieties)
      ? JSON.stringify(varieties)
      : typeof varieties === 'string'
      ? varieties
      : '[]';

    const newCulture = await prisma.cultureItem.create({
      data: {
        title: String(title).trim(),
        slug: String(slug || '').trim(),
        sinhalaName: String(sinhalaName || '').trim(),
        tagline: String(tagline || '').trim(),
        desc: String(desc).trim(),
        image: String(image || '').trim(),
        badge: String(badge || 'Heritage').trim(),
        tag: String(tag || 'unesco').trim(),
        period: String(period || '').trim(),
        locations: String(locations || '').trim(),
        timing: String(timing || '').trim(),
        entryInfo: String(entryInfo || '').trim(),
        dressCode: String(dressCode || '').trim(),
        preservation: String(preservation || '').trim(),
        heritage: String(heritage || '').trim(),
        ancientRoots: String(ancientRoots || '').trim(),
        architecturalElements: String(architecturalElements || '').trim(),
        etiquetteTips: String(etiquetteTips || '').trim(),
        varieties: varietiesString,
        sort_order: Number(sort_order) || 0,
      },
    });

    await logActivity('CREATE_CULTURE', 'culture_items', String(newCulture.id), `Added culture: ${newCulture.title}`);

    return NextResponse.json({ success: true, culture: newCulture }, { status: 201 });
  } catch (error) {
    console.error('POST /api/culture error:', error);
    return NextResponse.json({ error: 'Failed to create culture item' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      title,
      slug,
      sinhalaName,
      tagline,
      desc,
      image,
      badge,
      tag,
      period,
      locations,
      timing,
      entryInfo,
      dressCode,
      preservation,
      heritage,
      ancientRoots,
      architecturalElements,
      etiquetteTips,
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

    const varietiesString = Array.isArray(varieties)
      ? JSON.stringify(varieties)
      : typeof varieties === 'string'
      ? varieties
      : '[]';

    const updated = await prisma.cultureItem.update({
      where: { id: Number(id) },
      data: {
        title: String(title).trim(),
        slug: String(slug || '').trim(),
        sinhalaName: String(sinhalaName || '').trim(),
        tagline: String(tagline || '').trim(),
        desc: String(desc).trim(),
        image: String(image || '').trim(),
        badge: String(badge || 'Heritage').trim(),
        tag: String(tag || 'unesco').trim(),
        period: String(period || '').trim(),
        locations: String(locations || '').trim(),
        timing: String(timing || '').trim(),
        entryInfo: String(entryInfo || '').trim(),
        dressCode: String(dressCode || '').trim(),
        preservation: String(preservation || '').trim(),
        heritage: String(heritage || '').trim(),
        ancientRoots: String(ancientRoots || '').trim(),
        architecturalElements: String(architecturalElements || '').trim(),
        etiquetteTips: String(etiquetteTips || '').trim(),
        varieties: varietiesString,
        sort_order: Number(sort_order) || 0,
      },
    });

    await logActivity('UPDATE_CULTURE', 'culture_items', String(id), `Updated culture: ${updated.title}`);

    return NextResponse.json({ success: true, culture: updated });
  } catch (error) {
    console.error('PUT /api/culture error:', error);
    return NextResponse.json({ error: 'Failed to update culture item' }, { status: 500 });
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
      return NextResponse.json({ error: 'Missing culture ID' }, { status: 400 });
    }

    await prisma.cultureItem.delete({
      where: { id: Number(id) },
    });

    await logActivity('DELETE_CULTURE', 'culture_items', id, `Deleted culture #${id}`);

    return NextResponse.json({ success: true, message: 'Culture item deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/culture error:', error);
    return NextResponse.json({ error: 'Failed to delete culture item' }, { status: 500 });
  }
}
