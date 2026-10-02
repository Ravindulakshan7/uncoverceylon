import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DATA_DIR = path.join(process.cwd(), 'data');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    ensureDataDir();
    const DB_PATH = path.join(DATA_DIR, 'uncoverceylon.db');
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    initializeDb(db);
  }
  return db;
}

function initializeDb(database: Database.Database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS hero_slides (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      image_url TEXT NOT NULL,
      location TEXT NOT NULL,
      province TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS places (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      short_description TEXT NOT NULL,
      location TEXT NOT NULL,
      province TEXT NOT NULL,
      category TEXT NOT NULL,
      lat REAL NOT NULL,
      lng REAL NOT NULL,
      image_url TEXT DEFAULT '',
      gallery TEXT DEFAULT '[]',
      tips TEXT DEFAULT '',
      best_time TEXT DEFAULT '',
      entry_fee TEXT DEFAULT 'Free',
      distance_km INTEGER DEFAULT 0,
      rating REAL DEFAULT 0,
      review_count INTEGER DEFAULT 0,
      featured INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      place_id INTEGER NOT NULL,
      author TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
      comment TEXT NOT NULL,
      status TEXT DEFAULT 'approved',
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS region_slides (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      image_url TEXT NOT NULL,
      title TEXT NOT NULL,
      region TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS activity_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT DEFAULT '',
      details TEXT NOT NULL,
      actor TEXT DEFAULT 'Admin',
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // Migrate reviews table to support moderation status if missing
  try {
    const reviewCols = database.prepare("PRAGMA table_info(reviews)").all() as { name: string }[];
    const hasStatus = reviewCols.some((c) => c.name === 'status');
    if (!hasStatus) {
      database.exec("ALTER TABLE reviews ADD COLUMN status TEXT DEFAULT 'approved'");
    }
  } catch (migError) {
    console.error('Reviews status migration error:', migError);
  }

  const count = (database.prepare('SELECT COUNT(*) as count FROM places').get() as { count: number }).count;
  if (count === 0) {
    seedData(database);
  }

  const slideCount = (database.prepare('SELECT COUNT(*) as count FROM hero_slides').get() as { count: number }).count;
  if (slideCount === 0) {
    seedHeroSlides(database);
  }

  const regionSlideCount = (database.prepare('SELECT COUNT(*) as count FROM region_slides').get() as { count: number }).count;
  if (regionSlideCount === 0) {
    seedRegionSlides(database);
  }

  const settingsCount = (database.prepare('SELECT COUNT(*) as count FROM site_settings').get() as { count: number }).count;
  if (settingsCount === 0) {
    seedSiteSettings(database);
  }
}

function seedHeroSlides(database: Database.Database) {
  const insert = database.prepare(
    'INSERT INTO hero_slides (image_url, location, province, sort_order) VALUES (?, ?, ?, ?)'
  );
  const slides = [
    ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&q=90', 'Sigiriya Rock Fortress', 'Central Province', 0],
    ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=90', 'Southern Coastline', 'Southern Province', 1],
    ['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=90', 'Highland Mist', 'Central Province', 2],
    ['https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1920&q=90', 'Highland Tea Trails', 'Central Province', 3],
  ];
  database.transaction(() => {
    for (const [url, loc, prov, order] of slides) {
      insert.run(url, loc, prov, order);
    }
  })();
}

function seedRegionSlides(database: Database.Database) {
  const insert = database.prepare(
    'INSERT INTO region_slides (image_url, title, region, sort_order) VALUES (?, ?, ?, ?)'
  );
  const slides = [
    ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&q=85', 'Sigiriya Rock Fortress', 'Central Province', 0],
    ['https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&q=85', 'Nine Arch Bridge, Ella', 'Uva Province', 1],
    ['https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1200&q=85', 'Mirissa Coastal Palms', 'Southern Province', 2],
    ['https://images.unsplash.com/photo-1546708973-b339540b5162?w=1200&q=85', 'Nuwara Eliya Tea Highlands', 'Central Province', 3],
    ['https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=1200&q=85', 'Yala Wilderness Safari', 'Southern Province', 4],
    ['https://images.unsplash.com/photo-1588598198321-9735fd52455b?w=1200&q=85', 'Diyaluma Waterfall Cascades', 'Uva Province', 5],
  ];
  database.transaction(() => {
    for (const [url, title, reg, order] of slides) {
      insert.run(url, title, reg, order);
    }
  })();
}

function seedSiteSettings(database: Database.Database) {
  const insert = database.prepare('INSERT OR REPLACE INTO site_settings (key, value) VALUES (?, ?)');
  const defaultSettings: [string, string][] = [
    ['region_tagline', 'Explore by region'],
    ['region_title', 'Every corner of the island has a different story.'],
    ['region_description', 'Choose a province, follow the map, and make your own route across Sri Lanka.'],
    ['region_button_text', 'Open the map'],
    ['region_button_link', '/map'],
  ];
  database.transaction(() => {
    for (const [key, val] of defaultSettings) {
      insert.run(key, val);
    }
  })();
}

function seedData(database: Database.Database) {
  const insertPlace = database.prepare(`
    INSERT INTO places (name, description, short_description, location, province, category, lat, lng, image_url, gallery, tips, best_time, entry_fee, distance_km, rating, review_count, featured)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const places = [
    {
      name: 'Sigiriya Rock Fortress',
      description: "Rising dramatically 200 meters above the surrounding jungle, Sigiriya is one of Sri Lanka's most iconic landmarks. This ancient rock fortress was built by King Kashyapa in the 5th century AD and is a UNESCO World Heritage Site. The climb to the top rewards visitors with breathtaking panoramic views and features stunning ancient frescoes, a mirror wall, and the famous lion paws gateway.",
      short_description: 'Ancient rock fortress rising 200m above the jungle — a UNESCO World Heritage wonder.',
      location: 'Sigiriya, Matale District',
      province: 'Central Province',
      category: 'Ancient Sites',
      lat: 7.957, lng: 80.7597,
      image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
      gallery: JSON.stringify(['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80']),
      tips: 'Start early morning before 7 AM to avoid crowds and heat. Bring plenty of water. The climb takes about 1.5 hours. Watch out for wasps near the frescoes.',
      best_time: 'January to March, July to August',
      entry_fee: 'USD 30 (Foreign Adults)',
      distance_km: 170, rating: 4.8, review_count: 2847, featured: 1
    },
    {
      name: 'Ella Rock',
      description: 'Ella Rock offers one of the most rewarding hikes in Sri Lanka. At 1,041 meters above sea level, the summit provides spectacular 360-degree views of the surrounding valleys, tea plantations, and misty mountains. The hike takes you through lush jungle, past waterfalls, and tea estates, making it an unforgettable experience for adventure lovers.',
      short_description: 'Stunning summit hike through tea estates with panoramic valley views.',
      location: 'Ella, Badulla District',
      province: 'Uva Province',
      category: 'Mountains',
      lat: 6.8731, lng: 81.047,
      image_url: 'https://images.unsplash.com/photo-1576706374778-95a95efff7b1?w=800&q=80',
      gallery: JSON.stringify(['https://images.unsplash.com/photo-1576706374778-95a95efff7b1?w=800&q=80']),
      tips: 'Start the hike from Ella town or follow the railway tracks. Hire a guide for the first time. The hike takes 3-4 hours return. Best in the early morning for clear views.',
      best_time: 'December to April',
      entry_fee: 'Free',
      distance_km: 226, rating: 4.7, review_count: 1523, featured: 1
    },
    {
      name: 'Nine Arch Bridge',
      description: "The Nine Arch Bridge, also known as the 'Bridge in the Sky,' is a stunning colonial-era railway viaduct built entirely of stone, brick, and cement during British rule. Nestled between lush jungle and rolling hills, it's one of the best examples of colonial-era construction in Sri Lanka. Watching the blue train pass through creates a magical, cinematic moment.",
      short_description: 'Iconic colonial railway bridge surrounded by jungle — magical when the train passes.',
      location: 'Demodara, Ella',
      province: 'Uva Province',
      category: 'Hidden Gems',
      lat: 6.876, lng: 81.054,
      image_url: 'https://images.unsplash.com/photo-1535463731090-e34f4b5098c5?w=800&q=80',
      gallery: JSON.stringify(['https://images.unsplash.com/photo-1535463731090-e34f4b5098c5?w=800&q=80']),
      tips: 'Check the train schedule beforehand. The best viewpoint is from the hillside. Arrive early. Trains pass at around 9:15 AM and 3:30 PM.',
      best_time: 'Year-round (Dry season Dec-April preferred)',
      entry_fee: 'Free',
      distance_km: 222, rating: 4.9, review_count: 3102, featured: 1
    },
    {
      name: 'Mirissa Beach',
      description: "Mirissa is one of Sri Lanka's most beautiful and relaxed beaches, a crescent-shaped bay with golden sands, palm trees, and crystal-clear turquoise waters. Famous for incredible whale watching (Blue Whales and Sperm Whales), vibrant beach restaurants, and stunning sunsets. Parrot Rock, a small rocky outcrop you can swim to, adds to its charm.",
      short_description: 'Golden crescent bay famous for whale watching, sunsets, and laid-back vibes.',
      location: 'Mirissa, Matara District',
      province: 'Southern Province',
      category: 'Beaches',
      lat: 5.9487, lng: 80.4669,
      image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
      gallery: JSON.stringify(['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80']),
      tips: 'Book whale watching tours in advance (Nov-Apr is peak season). Visit Parrot Rock at sunrise for stunning photos. The beach gets crowded in December-January.',
      best_time: 'November to April',
      entry_fee: 'Free',
      distance_km: 160, rating: 4.6, review_count: 2234, featured: 1
    },
    {
      name: "Horton Plains National Park",
      description: "Horton Plains is a UNESCO World Heritage Site and one of Sri Lanka's most unique ecosystems. Located at 2,100 meters above sea level, this highland plateau features rolling grasslands, cloud forests, waterfalls, and the dramatic 'World's End' — a sheer cliff dropping 870 meters. Endemic wildlife includes sambar deer, purple-faced langurs, and over 80 bird species.",
      short_description: "UNESCO highland plateau with World's End cliff dropping 870m into misty valleys.",
      location: 'Nuwara Eliya District',
      province: 'Central Province',
      category: 'Wildlife',
      lat: 6.802, lng: 80.8045,
      image_url: 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=800&q=80',
      gallery: JSON.stringify(['https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=800&q=80']),
      tips: "Visit early morning (open from 6 AM) before clouds roll in to see World's End clearly. The 9.5 km circular trail takes 3-4 hours. Bring a jacket. No food available inside.",
      best_time: 'January to April',
      entry_fee: 'USD 15 (Foreigners)',
      distance_km: 188, rating: 4.7, review_count: 1876, featured: 0
    },
    {
      name: "Adam's Peak (Sri Pada)",
      description: "Adam's Peak is a 2,243-meter sacred mountain considered holy by four religions — Buddhists, Hindus, Muslims, and Christians. The summit features a sacred footprint. The night climb, ascending 5,500 steps in darkness with lanterns, culminating in a breathtaking sunrise at the summit, is one of the most spiritual and visually stunning experiences in Asia.",
      short_description: 'Sacred 2,243m peak — the night climb and sunrise at the summit is life-changing.',
      location: 'Dalhousie, Ratnapura District',
      province: 'Sabaragamuwa Province',
      category: 'Mountains',
      lat: 6.8096, lng: 80.4994,
      image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
      gallery: JSON.stringify(['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80']),
      tips: 'Start the climb around 2-3 AM to reach the summit for sunrise. Wear warm layers. The climb takes 3-4 hours. Pilgrimage season is December to May.',
      best_time: 'December to May (Pilgrimage Season)',
      entry_fee: 'Free',
      distance_km: 118, rating: 4.9, review_count: 4521, featured: 1
    },
    {
      name: 'Yala National Park',
      description: "Yala is Sri Lanka's most famous wildlife sanctuary and the world's best place to spot wild leopards. The park covers 979 square kilometers and is home to elephants, sloth bears, crocodiles, and hundreds of bird species. Block 1 has the highest density of leopards in the world — a dream for wildlife photographers.",
      short_description: "World's highest leopard density — home to elephants, bears, and incredible wildlife.",
      location: 'Tissamaharama, Hambantota',
      province: 'Southern Province',
      category: 'Wildlife',
      lat: 6.3731, lng: 81.5236,
      image_url: 'https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?w=800&q=80',
      gallery: JSON.stringify(['https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?w=800&q=80']),
      tips: 'Book jeep safaris in advance, especially Dec-Apr peak season. Early morning (6 AM) and late afternoon safaris have best wildlife sightings. Bring a zoom camera lens.',
      best_time: 'February to July (Park closed September)',
      entry_fee: 'USD 15 (Conservation levy) + Jeep hire',
      distance_km: 300, rating: 4.8, review_count: 3677, featured: 0
    },
    {
      name: 'Pidurangala Rock',
      description: "Pidurangala is Sigiriya's lesser-known but arguably more rewarding neighbor. This ancient monastic rock site features a reclining Buddha carved into the rock, a cave monastery, and a challenging but short climb to a summit with the most spectacular view of Sigiriya Rock you will ever see. Dramatically cheaper and far less crowded.",
      short_description: "Hidden gem — the best view of Sigiriya Rock, ancient monastery, at a fraction of the cost.",
      location: 'Sigiriya, Matale District',
      province: 'North Central Province',
      category: 'Hidden Gems',
      lat: 7.9583, lng: 80.7542,
      image_url: 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=800&q=80',
      gallery: JSON.stringify(['https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=800&q=80']),
      tips: 'Go for sunrise — arrive by 5:30 AM. Wear shoes with good grip, the final scramble is steep. The view of Sigiriya from the top is stunning, especially at golden hour.',
      best_time: 'Year-round (Sunrise highly recommended)',
      entry_fee: 'LKR 500',
      distance_km: 172, rating: 4.9, review_count: 2156, featured: 1
    },
    {
      name: 'Ravana Falls',
      description: "Ravana Falls is one of the widest waterfalls in Sri Lanka, cascading dramatically from a height of 25 meters. Located on the Ella-Wellawaya road, the falls are shrouded in legend — said to be where the mythical King Ravana hid Princess Sita in a cave. The surrounding rock face is ancient and dramatic.",
      short_description: 'Legendary 25m cascading waterfall with mythological ties to the Ramayana epic.',
      location: 'Ella-Wellawaya Road, Badulla',
      province: 'Uva Province',
      category: 'Waterfalls',
      lat: 6.9012, lng: 81.036,
      image_url: 'https://images.unsplash.com/photo-1467173572719-f14b9fb86e5f?w=800&q=80',
      gallery: JSON.stringify(['https://images.unsplash.com/photo-1467173572719-f14b9fb86e5f?w=800&q=80']),
      tips: 'Best visited during or just after rainy season (May-July) for powerful water flow. The pool at the base is swimmable in dry season. Can get crowded on weekends.',
      best_time: 'May to September for full flow',
      entry_fee: 'Free',
      distance_km: 218, rating: 4.4, review_count: 1243, featured: 0
    },
    {
      name: 'Galle Fort',
      description: 'The Galle Fort is a UNESCO World Heritage Site built by the Portuguese in 1588 and extensively fortified by the Dutch. Walking within its colonial ramparts feels like stepping back in time — cobblestone streets, Dutch colonial architecture, boutique hotels, galleries, cafes, and stunning ocean views from the bastions at sunset.',
      short_description: 'UNESCO colonial fortress city — cobblestone streets, ocean views, and a time-travel experience.',
      location: 'Galle, Southern Province',
      province: 'Southern Province',
      category: 'Historical',
      lat: 6.0269, lng: 80.2167,
      image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      gallery: JSON.stringify(['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80']),
      tips: 'Walk the full ramparts circuit at sunset for magical views. Explore smaller streets for hidden boutique shops and cafes. Avoid peak noon heat.',
      best_time: 'December to April',
      entry_fee: 'Free',
      distance_km: 116, rating: 4.7, review_count: 3891, featured: 1
    },
    {
      name: 'Dambulla Cave Temple',
      description: "The Dambulla Cave Temple is the largest and best-preserved cave temple complex in Sri Lanka, a UNESCO World Heritage Site with over 2,000 years of history. The five caves house 153 statues of the Buddha, three statues of Sri Lankan kings, and stunning ancient ceiling murals covering 2,100 square meters.",
      short_description: 'Ancient cave temples with 153 Buddha statues and 2,100 sqm of ancient ceiling murals.',
      location: 'Dambulla, Matale District',
      province: 'Central Province',
      category: 'Ancient Sites',
      lat: 7.8567, lng: 80.6492,
      image_url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80',
      gallery: JSON.stringify(['https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80']),
      tips: 'Remove shoes before entering. Dress modestly (shoulders and knees covered). Visit early morning to avoid crowds.',
      best_time: 'January to April, July to September',
      entry_fee: 'USD 15 (Foreigners)',
      distance_km: 148, rating: 4.6, review_count: 2543, featured: 0
    },
    {
      name: 'Knuckles Mountain Range',
      description: "The Knuckles Mountain Range, also known as Dumbara Kanduvetiya, is a UNESCO World Heritage Site named for its series of misty peaks that resemble a clenched fist. This biodiversity hotspot protects endemic species found nowhere else on Earth. Trek through cloud forests, past cascading streams, traditional villages, and look-out points with views that stretch forever.",
      short_description: 'Misty UNESCO-listed mountain range — a biodiversity hotspot with legendary trekking routes.',
      location: 'Kandy District',
      province: 'Central Province',
      category: 'Mountains',
      lat: 7.459, lng: 80.79,
      image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
      gallery: JSON.stringify(['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80']),
      tips: 'Hire a licensed guide — trails can be hard to follow. Bring waterproof clothing. Multi-day treks available with village homestays. Leeches are common in wet season, bring salt.',
      best_time: 'January to April',
      entry_fee: 'USD 15 (Permit required)',
      distance_km: 95, rating: 4.8, review_count: 987, featured: 0
    }
  ];

  const insertMany = database.transaction((items: typeof places) => {
    for (const place of items) {
      insertPlace.run(
        place.name, place.description, place.short_description,
        place.location, place.province, place.category,
        place.lat, place.lng, place.image_url, place.gallery,
        place.tips, place.best_time, place.entry_fee,
        place.distance_km, place.rating, place.review_count, place.featured
      );
    }
  });

  insertMany(places);
}

export function logActivity(
  action: string,
  entityType: string,
  entityId: string | number | bigint,
  details: string,
  actor = 'Admin'
) {
  try {
    const database = getDb();
    database.prepare(`
      INSERT INTO activity_logs (action, entity_type, entity_id, details, actor, created_at)
      VALUES (?, ?, ?, ?, ?, datetime('now'))
    `).run(action, entityType, String(entityId || ''), details, actor);
  } catch (err) {
    console.error('Error logging activity:', err);
  }
}

export function getActivityLogs(limit = 100) {
  try {
    const database = getDb();
    return database.prepare(`
      SELECT * FROM activity_logs ORDER BY id DESC LIMIT ?
    `).all(limit);
  } catch (err) {
    console.error('Error getting activity logs:', err);
    return [];
  }
}

export function clearActivityLogs() {
  try {
    const database = getDb();
    database.prepare('DELETE FROM activity_logs').run();
    logActivity('CLEAR_LOGS', 'system', 'logs', 'Admin cleared all activity history');
    return true;
  } catch (err) {
    console.error('Error clearing activity logs:', err);
    return false;
  }
}
