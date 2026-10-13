const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ldhiegcbjngptvlcwuep.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const bucketName = process.env.SUPABASE_STORAGE_BUCKET || 'uploads';

if (!supabaseKey) {
  console.error('❌ Error: Supabase API Key (SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY) is not set in .env or .env.local');
  console.log('👉 Please add your Supabase key to .env.local and run this script again.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const prisma = new PrismaClient();

function getMimeType(ext) {
  switch (ext.toLowerCase()) {
    case '.webp': return 'image/webp';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.png': return 'image/png';
    case '.gif': return 'image/gif';
    case '.svg': return 'image/svg+xml';
    case '.avif': return 'image/avif';
    default: return 'application/octet-stream';
  }
}

async function migrate() {
  console.log('🚀 Starting Supabase Storage Migration...');
  console.log(`🌐 Supabase URL: ${supabaseUrl}`);
  console.log(`📦 Bucket: ${bucketName}`);

  const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    console.log('⚠️ No public/uploads folder found.');
    return;
  }

  const files = fs.readdirSync(uploadsDir).filter(f => !f.startsWith('.'));
  console.log(`📸 Found ${files.length} local images in public/uploads`);

  let uploadedCount = 0;
  const urlMap = new Map();

  for (const file of files) {
    const filePath = path.join(uploadsDir, file);
    const fileBuffer = fs.readFileSync(filePath);
    const ext = path.extname(file);
    const mimeType = getMimeType(ext);

    console.log(`Uploading ${file} (${mimeType})...`);
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(file, fileBuffer, {
        contentType: mimeType,
        upsert: true,
      });

    if (error) {
      console.warn(`  ⚠️ Failed to upload ${file}:`, error.message);
    } else {
      const { data: publicData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(file);

      const publicUrl = publicData.publicUrl;
      urlMap.set(`/uploads/${file}`, publicUrl);
      urlMap.set(`uploads/${file}`, publicUrl);
      uploadedCount++;
      console.log(`  ✅ Uploaded -> ${publicUrl}`);
    }
  }

  console.log(`\n🎉 Uploaded ${uploadedCount}/${files.length} images to Supabase Storage!`);

  if (urlMap.size > 0) {
    console.log('\n🔄 Updating database references...');

    // 1. Update Places images
    try {
      const places = await prisma.place.findMany();
      for (const place of places) {
        if (!place.images) continue;
        let images;
        try {
          images = typeof place.images === 'string' ? JSON.parse(place.images) : place.images;
        } catch {
          continue;
        }

        if (Array.isArray(images)) {
          let changed = false;
          const updated = images.map(img => {
            if (urlMap.has(img)) {
              changed = true;
              return urlMap.get(img);
            }
            return img;
          });

          if (changed) {
            await prisma.place.update({
              where: { id: place.id },
              data: { images: JSON.stringify(updated) },
            });
            console.log(`  Updated place images for: ${place.name}`);
          }
        }
      }
    } catch (e) {
      console.warn('Place table update notice:', e.message);
    }

    // 2. Update HeroSlide
    try {
      const slides = await prisma.heroSlide.findMany();
      for (const slide of slides) {
        if (urlMap.has(slide.imageUrl)) {
          await prisma.heroSlide.update({
            where: { id: slide.id },
            data: { imageUrl: urlMap.get(slide.imageUrl) },
          });
          console.log(`  Updated hero slide: ${slide.title}`);
        }
      }
    } catch (e) {
      console.warn('HeroSlide table update notice:', e.message);
    }

    // 3. Update RegionSlide
    try {
      const slides = await prisma.regionSlide.findMany();
      for (const slide of slides) {
        if (urlMap.has(slide.imageUrl)) {
          await prisma.regionSlide.update({
            where: { id: slide.id },
            data: { imageUrl: urlMap.get(slide.imageUrl) },
          });
          console.log(`  Updated region slide: ${slide.title}`);
        }
      }
    } catch (e) {
      console.warn('RegionSlide table update notice:', e.message);
    }

    // 4. Update Food
    try {
      const foods = await prisma.food.findMany();
      for (const food of foods) {
        if (urlMap.has(food.imageUrl)) {
          await prisma.food.update({
            where: { id: food.id },
            data: { imageUrl: urlMap.get(food.imageUrl) },
          });
          console.log(`  Updated food: ${food.name}`);
        }
      }
    } catch (e) {
      console.warn('Food table update notice:', e.message);
    }

    // 5. Update CultureItem
    try {
      const items = await prisma.cultureItem.findMany();
      for (const item of items) {
        if (urlMap.has(item.imageUrl)) {
          await prisma.cultureItem.update({
            where: { id: item.id },
            data: { imageUrl: urlMap.get(item.imageUrl) },
          });
          console.log(`  Updated culture item: ${item.title}`);
        }
      }
    } catch (e) {
      console.warn('CultureItem table update notice:', e.message);
    }

    // 6. Update Experience
    try {
      const items = await prisma.experience.findMany();
      for (const item of items) {
        if (urlMap.has(item.imageUrl)) {
          await prisma.experience.update({
            where: { id: item.id },
            data: { imageUrl: urlMap.get(item.imageUrl) },
          });
          console.log(`  Updated experience: ${item.title}`);
        }
      }
    } catch (e) {
      console.warn('Experience table update notice:', e.message);
    }
  }

  console.log('\n✨ Supabase Migration complete!');
  await prisma.$disconnect();
}

migrate().catch(err => {
  console.error('Migration error:', err);
  process.exit(1);
});
