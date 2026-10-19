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

      const slug = String(item.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-')).trim();
      const sinhalaName = String(item.sinhalaName || item.sinhala_name || '').trim();
      const tagline = String(item.tagline || '').trim();
      const image = String(item.image || item.image_url || item.img || '').trim();
      const badge = String(item.badge || item.categoryLabel || 'Heritage').trim();
      const tag = String(item.tag || 'unesco').trim();
      const period = String(item.period || item.epoch || item.era || '').trim();
      const locations = String(item.locations || item.sub || period || '').trim();
      const timing = String(item.timing || item.bestTime || item.best_time || '').trim();
      const entryInfo = String(item.entryInfo || item.entry || item.entry_info || '').trim();
      const dressCode = String(item.dressCode || item.dress_code || '').trim();
      const preservation = String(item.preservation || item.conservation || '').trim();
      const heritage = String(item.heritage || item.history || desc).trim();
      const ancientRoots = String(item.ancientRoots || item.origins || tagline || '').trim();
      const architecturalElements = String(item.architecturalElements || item.architecture || '').trim();
      const etiquetteTips = String(item.etiquetteTips || item.etiquette || item.tips || '').trim();
      
      const varietiesString = Array.isArray(item.varieties)
        ? JSON.stringify(item.varieties)
        : typeof item.varieties === 'string'
        ? item.varieties
        : '[]';

      const sort_order = Number(item.sort_order || item.id || createdCount + 1);

      try {
        await prisma.cultureItem.create({
          data: {
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
            varieties: varietiesString,
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
