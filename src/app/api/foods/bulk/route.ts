import { NextRequest, NextResponse } from 'next/server';
import { prisma, logActivity } from '@/lib/db';
import { verifyAdminPassword } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const foods = await prisma.foodItem.findMany({
      orderBy: [{ sort_order: 'asc' }, { id: 'asc' }],
    });
    return NextResponse.json({ foods, count: foods.length });
  } catch (error) {
    console.error('GET /api/foods/bulk error:', error);
    return NextResponse.json({ error: 'Failed to export foods' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { foods, admin_password } = body;

    if (!verifyAdminPassword(admin_password)) {
      return NextResponse.json({ error: 'Unauthorized: Invalid admin password' }, { status: 401 });
    }

    if (!Array.isArray(foods) || foods.length === 0) {
      return NextResponse.json(
        { error: 'Invalid payload: "foods" must be a non-empty array of food items' },
        { status: 400 }
      );
    }

    let createdCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < foods.length; i++) {
      const item = foods[i];
      const title = String(item.title || item.name || '').trim();
      const desc = String(item.desc || item.description || '').trim();

      if (!title || !desc) {
        errors.push(`Item at index ${i} skipped: title and desc are required.`);
        continue;
      }

      const tagline = String(item.tagline || '').trim();
      const image = String(item.image || item.img || '').trim();
      const badge = String(item.badge || item.cuisine || 'Must Try').trim();
      const regions = String(item.regions || item.locations || item.sub || '').trim();
      const sort_order = Number(item.sort_order || item.id || createdCount + 1);

      try {
        await prisma.foodItem.create({
          data: {
            title,
            tagline,
            desc,
            image,
            badge,
            regions,
            sort_order,
          },
        });
        createdCount++;
      } catch (err: any) {
        errors.push(`Item "${title}" failed: ${err.message || 'database error'}`);
      }
    }

    await logActivity(
      'BULK_IMPORT_FOODS',
      'food_items',
      `bulk-${Date.now()}`,
      `Imported ${createdCount} food items from JSON.`
    );

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${createdCount} foods`,
      createdCount,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('POST /api/foods/bulk error:', error);
    return NextResponse.json({ error: 'Failed to process bulk food import' }, { status: 500 });
  }
}
