import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Supabase database seed from clean backup...');

  const backupPath = path.join(process.cwd(), 'data', 'database_backup_clean.json');
  if (!fs.existsSync(backupPath)) {
    console.error('Backup file not found at:', backupPath);
    process.exit(1);
  }

  const raw = fs.readFileSync(backupPath, 'utf8');
  const backup = JSON.parse(raw);

  // 1. Seed Places
  console.log(`📦 Seeding ${backup.places.length} places into Supabase...`);
  for (const p of backup.places) {
    await prisma.place.upsert({
      where: { id: p.id },
      update: {},
      create: {
        id: p.id,
        name: p.name,
        description: p.description,
        short_description: p.short_description,
        location: p.location,
        province: p.province,
        category: p.category,
        lat: Number(p.lat),
        lng: Number(p.lng),
        image_url: p.image_url || '',
        gallery: typeof p.gallery === 'string' ? p.gallery : JSON.stringify(p.gallery || []),
        tips: p.tips || '',
        best_time: p.best_time || '',
        entry_fee: p.entry_fee || 'Free',
        distance_km: Number(p.distance_km || 0),
        rating: Number(p.rating || 0),
        review_count: Number(p.review_count || 0),
        featured: Number(p.featured || 0),
      },
    });
  }

  // 2. Seed Hero Slides
  console.log(`🖼️ Seeding ${backup.heroSlides.length} hero slides into Supabase...`);
  for (const s of backup.heroSlides) {
    await prisma.heroSlide.upsert({
      where: { id: s.id },
      update: {},
      create: {
        id: s.id,
        image_url: s.image_url,
        location: s.location,
        province: s.province,
        sort_order: Number(s.sort_order || 0),
      },
    });
  }

  // 3. Seed Reviews
  console.log(`💬 Seeding ${backup.reviews.length} reviews into Supabase...`);
  for (const r of backup.reviews) {
    await prisma.review.upsert({
      where: { id: r.id },
      update: {},
      create: {
        id: r.id,
        place_id: r.place_id,
        author: r.author,
        rating: Number(r.rating),
        comment: r.comment,
        status: r.status || 'approved',
      },
    });
  }

  // 4. Seed Settings
  console.log(`⚙️ Seeding ${backup.settings.length} site settings into Supabase...`);
  for (const st of backup.settings) {
    await prisma.siteSetting.upsert({
      where: { key: st.key },
      update: { value: st.value },
      create: {
        key: st.key,
        value: st.value,
      },
    });
  }

  // 5. Reset auto-increment sequences so new inserts work cleanly
  console.log('⚡ Updating PostgreSQL ID sequences...');
  try {
    await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('places', 'id'), COALESCE(MAX(id), 1)) FROM places;`);
    await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('reviews', 'id'), COALESCE(MAX(id), 1)) FROM reviews;`);
    await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('hero_slides', 'id'), COALESCE(MAX(id), 1)) FROM hero_slides;`);
  } catch (seqErr) {
    console.warn('Sequence update notice:', seqErr);
  }

  const placesCount = await prisma.place.count();
  console.log(`✅ SUCCESS! Supabase now contains ${placesCount} destinations!`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
