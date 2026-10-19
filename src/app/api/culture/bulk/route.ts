import { NextRequest, NextResponse } from 'next/server';
import { prisma, logActivity } from '@/lib/db';
import { verifyAdminPassword } from '@/lib/auth';

export async function GET() {
  try {
    const cultures = await prisma.cultureItem.findMany({
      orderBy: [{ sort_order: 'asc' }, { id: 'asc' }],
    });
    return NextResponse.json({ cultures, count: cultures.length });
  } catch (error) {
    console.error('GET /api/culture/bulk error:', error);
    return NextResponse.json({ error: 'Failed to export culture items' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cultures, items, admin_password } = body;

    if (!verifyAdminPassword(admin_password)) {
      return NextResponse.json({ error: 'Unauthorized: Invalid admin password' }, { status: 401 });
    }

    const list = Array.isArray(cultures) ? cultures : Array.isArray(items) ? items : [];
    if (list.length === 0) {
      return NextResponse.json(
        { error: 'Invalid payload: must be a non-empty array of culture items' },
        { status: 400 }
      );
    }

    let createdCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      const title = String(item.title || item.name || '').trim();
      const desc = String(item.desc || item.description || '').trim();

      if (!title || !desc) {
        errors.push(`Item at index ${i} skipped: title and desc are required.`);
        continue;
      }

      const tagline = String(item.tagline || '').trim();
      const image = String(item.image || item.image_url || item.img || '').trim();
      const badge = String(item.badge || 'Heritage').trim();
      const period = String(item.period || item.era || '').trim();
      const sort_order = Number(item.sort_order || item.id || createdCount + 1);

      try {
        await prisma.cultureItem.create({
          data: {
            title,
            tagline,
            desc,
            image,
            badge,
            period,
            sort_order,
          },
        });
        createdCount++;
      } catch (err: any) {
        errors.push(`Item "${title}" failed: ${err.message || 'database error'}`);
      }
    }

    await logActivity(
      'BULK_IMPORT_CULTURE',
      'culture_items',
      `bulk-${Date.now()}`,
      `Imported ${createdCount} culture items from JSON.`
    );

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${createdCount} culture items`,
      createdCount,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('POST /api/culture/bulk error:', error);
    return NextResponse.json({ error: 'Failed to process bulk culture import' }, { status: 500 });
  }
}
