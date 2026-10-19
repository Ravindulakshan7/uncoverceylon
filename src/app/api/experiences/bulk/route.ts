import { NextRequest, NextResponse } from 'next/server';
import { prisma, logActivity } from '@/lib/db';
import { verifyAdminPassword } from '@/lib/auth';

export async function GET() {
  try {
    const experiences = await prisma.experienceItem.findMany({
      orderBy: [{ sort_order: 'asc' }, { id: 'asc' }],
    });
    return NextResponse.json({ experiences, count: experiences.length });
  } catch (error) {
    console.error('GET /api/experiences/bulk error:', error);
    return NextResponse.json({ error: 'Failed to export experiences' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { experiences, items, admin_password } = body;

    if (!verifyAdminPassword(admin_password)) {
      return NextResponse.json({ error: 'Unauthorized: Invalid admin password' }, { status: 401 });
    }

    const list = Array.isArray(experiences) ? experiences : Array.isArray(items) ? items : [];
    if (list.length === 0) {
      return NextResponse.json(
        { error: 'Invalid payload: must be a non-empty array of experience items' },
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
      const tagline = String(item.tagline || '').trim();
      const image = String(item.image || item.image_url || item.img || '').trim();
      const badge = String(item.badge || item.categoryLabel || 'Popular').trim();
      const tag = String(item.tag || 'surf').trim();
      const seasons = String(item.seasons || item.season || item.best_time || '').trim();
      const locations = String(item.locations || item.sub || seasons || '').trim();
      const timing = String(item.timing || item.bestTime || item.best_time || '').trim();
      const entryInfo = String(item.entryInfo || item.entry || item.cost || item.price || '').trim();
      const difficulty = String(item.difficulty || 'All Levels').trim();
      const heritage = String(item.heritage || item.whatToExpect || item.what_to_expect || desc).trim();
      const ancientRoots = String(item.ancientRoots || item.localKnowledge || item.insider_tips || tagline || '').trim();
      const gearChecklist = String(item.gearChecklist || item.whatToBring || item.gear || '').trim();
      const localSafetyTips = String(item.localSafetyTips || item.safety || item.tips || '').trim();

      const varietiesString = Array.isArray(item.varieties)
        ? JSON.stringify(item.varieties)
        : typeof item.varieties === 'string'
        ? item.varieties
        : '[]';

      const sort_order = Number(item.sort_order || item.id || createdCount + 1);

      try {
        await prisma.experienceItem.create({
          data: {
            title,
            slug,
            tagline,
            desc,
            image,
            badge,
            tag,
            seasons,
            locations,
            timing,
            entryInfo,
            difficulty,
            heritage,
            ancientRoots,
            gearChecklist,
            localSafetyTips,
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
      'BULK_IMPORT_EXP',
      'experience_items',
      `bulk-${Date.now()}`,
      `Imported ${createdCount} experience items from JSON.`
    );

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${createdCount} experience items`,
      createdCount,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('POST /api/experiences/bulk error:', error);
    return NextResponse.json({ error: 'Failed to process bulk experience import' }, { status: 500 });
  }
}
