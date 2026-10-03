import Database from 'better-sqlite3';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();
const sqlitePath = path.join(process.cwd(), 'data', 'uncoverceylon.db');

interface SqlitePlace {
  id: number;
  name: string;
  description: string;
  short_description: string;
  location: string;
  province: string;
  category: string;
  lat: number;
  lng: number;
  image_url: string | null;
  gallery: string | null;
  tips: string | null;
  best_time: string | null;
  entry_fee: string | null;
  distance_km: number | null;
  rating: number | null;
  review_count: number | null;
  featured: number | null;
}

interface SqliteReview {
  id: number;
  place_id: number;
  author: string;
  rating: number;
  comment: string;
  status: string | null;
}

interface SqliteHeroSlide {
  id: number;
  image_url: string;
  location: string;
  province: string;
  sort_order: number | null;
}

interface SqliteRegionSlide {
  id: number;
  image_url: string;
  title: string;
  region: string;
  sort_order: number | null;
}

interface SqliteSiteSetting {
  key: string;
  value: string;
}

async function migrate() {
  if (!fs.existsSync(sqlitePath)) {
    console.error('❌ SQLite database file not found at:', sqlitePath);
    process.exit(1);
  }

  const sqlite = new Database(sqlitePath, { readonly: true });
  console.log('🔄 Connected to SQLite. Starting PostgreSQL migration...');

  try {
    // 1. Migrate Places
    const places = sqlite.prepare('SELECT * FROM places').all() as SqlitePlace[];
    console.log(`📦 Found ${places.length} places in SQLite...`);
    for (const p of places) {
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
          gallery: p.gallery || '[]',
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

    // 2. Migrate Reviews
    const reviews = sqlite.prepare('SELECT * FROM reviews').all() as SqliteReview[];
    console.log(`💬 Found ${reviews.length} reviews...`);
    for (const r of reviews) {
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

    // 3. Migrate Hero Slides
    const heroSlides = sqlite.prepare('SELECT * FROM hero_slides').all() as SqliteHeroSlide[];
    console.log(`🖼️ Found ${heroSlides.length} hero slides...`);
    for (const s of heroSlides) {
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

    // 4. Migrate Region Slides
    const regionSlides = sqlite.prepare('SELECT * FROM region_slides').all() as SqliteRegionSlide[];
    console.log(`🌄 Found ${regionSlides.length} region slides...`);
    for (const rs of regionSlides) {
      await prisma.regionSlide.upsert({
        where: { id: rs.id },
        update: {},
        create: {
          id: rs.id,
          image_url: rs.image_url,
          title: rs.title,
          region: rs.region,
          sort_order: Number(rs.sort_order || 0),
        },
      });
    }

    // 5. Migrate Site Settings
    const settings = sqlite.prepare('SELECT * FROM site_settings').all() as SqliteSiteSetting[];
    console.log(`⚙️ Found ${settings.length} site settings...`);
    for (const st of settings) {
      await prisma.siteSetting.upsert({
        where: { key: st.key },
        update: { value: st.value },
        create: { key: st.key, value: st.value },
      });
    }

    // 6. Reset PostgreSQL auto-increment sequences
    console.log('⚡ Resetting auto-increment sequences...');
    await prisma.$executeRawUnsafe(`
      SELECT setval(pg_get_serial_sequence('places', 'id'), COALESCE(MAX(id), 1)) FROM places;
      SELECT setval(pg_get_serial_sequence('reviews', 'id'), COALESCE(MAX(id), 1)) FROM reviews;
      SELECT setval(pg_get_serial_sequence('hero_slides', 'id'), COALESCE(MAX(id), 1)) FROM hero_slides;
      SELECT setval(pg_get_serial_sequence('region_slides', 'id'), COALESCE(MAX(id), 1)) FROM region_slides;
    `);

    console.log('✅ Migration to PostgreSQL completed with 0 data loss!');
  } catch (err) {
    console.error('❌ Migration failed:', err);
  } finally {
    sqlite.close();
    await prisma.$disconnect();
  }
}

migrate();
