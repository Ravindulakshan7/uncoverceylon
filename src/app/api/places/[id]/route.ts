import { NextRequest, NextResponse } from 'next/server';
import { prisma, logActivity } from '@/lib/db';
import { verifyAdminPassword } from '@/lib/auth';
import { getSupabaseClient, SUPABASE_STORAGE_BUCKET } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return NextResponse.json({ error: 'Invalid place ID' }, { status: 400 });
    }

    const place = await prisma.place.findUnique({
      where: { id: numericId },
      include: {
        reviews: {
          where: { status: 'approved' },
          orderBy: { created_at: 'desc' },
        },
      },
    });

    if (!place) {
      return NextResponse.json({ error: 'Place not found' }, { status: 404 });
    }

    const { reviews, ...placeData } = place;
    return NextResponse.json({ place: placeData, reviews });
  } catch (error) {
    console.error('GET /api/places/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch place' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return NextResponse.json({ error: 'Invalid place ID' }, { status: 400 });
    }

    const body = await request.json();
    const { password, ...data } = body;

    if (!verifyAdminPassword(password)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.place.update({
      where: { id: numericId },
      data: {
        name: data.name,
        description: data.description,
        short_description: data.short_description,
        location: data.location,
        province: data.province,
        category: data.category,
        lat: Number(data.lat),
        lng: Number(data.lng),
        image_url: data.image_url,
        gallery: typeof data.gallery === 'string' ? data.gallery : JSON.stringify(data.gallery || []),
        tips: data.tips,
        best_time: data.best_time,
        entry_fee: data.entry_fee,
        distance_km: Number(data.distance_km || 0),
        featured: data.featured ? 1 : 0,
      },
    });

    await logActivity('UPDATE_PLACE', 'places', numericId, `Updated destination "${data.name}"`);

    return NextResponse.json({ message: 'Place updated successfully!' });
  } catch (error) {
    console.error('PUT /api/places/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update place' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return NextResponse.json({ error: 'Invalid place ID' }, { status: 400 });
    }

    const { password } = await request.json();

    if (!verifyAdminPassword(password)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existing = await prisma.place.findUnique({
      where: { id: numericId },
      select: { name: true, image_url: true, gallery: true },
    });

    if (existing) {
      // Collect image URLs associated with this destination
      const imagesToDelete: string[] = [];
      if (existing.image_url) imagesToDelete.push(existing.image_url);
      try {
        const parsed = JSON.parse(existing.gallery || '[]');
        if (Array.isArray(parsed)) {
          parsed.forEach((img: any) => {
            if (typeof img === 'string' && !imagesToDelete.includes(img)) {
              imagesToDelete.push(img);
            }
          });
        }
      } catch {}

      // 1. Delete from Supabase Storage bucket
      const supabase = getSupabaseClient();
      if (supabase && imagesToDelete.length > 0) {
        const supabaseFileNames: string[] = [];
        imagesToDelete.forEach((url) => {
          if (url.includes(`/storage/v1/object/public/${SUPABASE_STORAGE_BUCKET}/`)) {
            const fileName = url.split(`/storage/v1/object/public/${SUPABASE_STORAGE_BUCKET}/`)[1];
            if (fileName) supabaseFileNames.push(fileName);
          }
        });
        if (supabaseFileNames.length > 0) {
          try {
            await supabase.storage.from(SUPABASE_STORAGE_BUCKET).remove(supabaseFileNames);
          } catch (storageErr) {
            console.error('Failed to remove images from Supabase Storage:', storageErr);
          }
        }
      }

      // 2. Also clean up local disk backup files if they exist in public/uploads/
      for (const url of imagesToDelete) {
        if (url.startsWith('/uploads/')) {
          const localPath = path.join(process.cwd(), 'public', url);
          try {
            if (fs.existsSync(localPath)) {
              fs.unlinkSync(localPath);
            }
          } catch {}
        }
      }
    }

    await prisma.place.delete({
      where: { id: numericId },
    });

    await logActivity('DELETE_PLACE', 'places', numericId, `Deleted destination "${existing?.name || numericId}"`);

    return NextResponse.json({ message: 'Place deleted successfully!' });
  } catch (error) {
    console.error('DELETE /api/places/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete place' }, { status: 500 });
  }
}
