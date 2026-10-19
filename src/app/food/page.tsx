import { prisma } from '@/lib/db';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import PlaceCard from '@/components/PlaceCard';
import FoodExplorer from '@/components/FoodExplorer';
import { FOODS_DATA, FoodDishItem } from '@/data/foodsData';
import { Place } from '@/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Food & Flavors — Authentic Sri Lankan Cuisine & Street Food Guide',
  description: 'From sizzling street kottu to sweet coconut treacle — taste the island, one bite at a time. Curated Sri Lankan culinary guide.',
  keywords: [
    'Sri Lanka food',
    'Ceylon tea',
    'Sri Lankan rice and curry',
    'Kottu roti Colombo',
    'Hoppers Appa Sri Lanka',
    'Jaffna crab curry',
    'Sri Lanka street food',
    'Serandib cuisine',
  ],
  alternates: {
    canonical: 'https://uncoverceylon.com/food',
  },
  openGraph: {
    title: 'Food & Flavors — Uncover Ceylon',
    description: 'From sizzling street kottu to sweet coconut treacle — taste the island, one bite at a time.',
    url: 'https://uncoverceylon.com/food',
    siteName: 'Uncover Ceylon',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=1200&h=630&q=85',
        width: 1200,
        height: 630,
        alt: 'Sri Lankan Spices and Flavors',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

async function getFoodDestinations(): Promise<Place[]> {
  try {
    const raw = await prisma.place.findMany({
      where: {
        OR: [
          { category: 'Historical' },
          { name: { contains: 'Tea', mode: 'insensitive' } },
          { location: { contains: 'Galle', mode: 'insensitive' } },
          { location: { contains: 'Ella', mode: 'insensitive' } },
        ],
      },
      take: 6,
    });
    return raw.map((p) => ({
      ...p,
      created_at: p.created_at.toISOString(),
    }));
  } catch {
    return [];
  }
}

async function getFoodItems(): Promise<FoodDishItem[]> {
  try {
    const dbFoods = await prisma.foodItem.findMany({
      orderBy: [{ sort_order: 'asc' }, { id: 'asc' }],
    });

    if (dbFoods && dbFoods.length > 0) {
      const mappedDb: FoodDishItem[] = dbFoods.map((dbFood) => {
        let parsedVarieties: FoodDishItem['varieties'] = [];
        if (dbFood.varieties) {
          try {
            const parsed = typeof dbFood.varieties === 'string' ? JSON.parse(dbFood.varieties) : dbFood.varieties;
            if (Array.isArray(parsed) && parsed.length > 0) parsedVarieties = parsed;
          } catch {
            parsedVarieties = [];
          }
        }
        if (!parsedVarieties || parsedVarieties.length === 0) {
          parsedVarieties = [{ name: dbFood.title, tag: dbFood.badge || 'Classic', desc: dbFood.desc }];
        }

        return {
          id: dbFood.id,
          slug: dbFood.slug || dbFood.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          title: dbFood.title,
          tagline: dbFood.tagline || '',
          sub: dbFood.locations || dbFood.regions || 'Sri Lanka',
          tag: dbFood.tag || 'curry',
          cuisine: dbFood.cuisine || dbFood.badge || 'Sri Lankan',
          meal: dbFood.meal || 'Lunch / Dinner',
          price: dbFood.price || 'LKR 400 – LKR 1,200',
          spice: dbFood.spice || 'Medium to Fiery',
          serving: dbFood.serving || 'Traditional Service',
          locations: dbFood.locations || dbFood.regions || 'Island-wide',
          img: dbFood.image || 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=1000&q=85',
          seed: `food-${dbFood.id}`,
          desc: dbFood.desc,
          heritage: dbFood.heritage || dbFood.desc,
          varieties: parsedVarieties,
          ingredients: dbFood.ingredients || '',
          howToEat: dbFood.howToEat || '',
        };
      });

      const dbIds = new Set(mappedDb.map((f) => f.id));
      const remainingFoods = FOODS_DATA.filter((f) => !dbIds.has(f.id));
      return [...mappedDb, ...remainingFoods];
    }
    return FOODS_DATA;
  } catch (err) {
    console.error('Error fetching foods for food explorer:', err);
    return FOODS_DATA;
  }
}

export default async function FoodPage() {
  const [foodPlaces, allFoods] = await Promise.all([
    getFoodDestinations(),
    getFoodItems(),
  ]);

  const jsonLdFood = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Food & Flavors of Sri Lanka',
    description: 'From sizzling street kottu to sweet coconut treacle — taste the island, one bite at a time.',
    itemListElement: allFoods.map((f, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: f.title,
      description: f.sub,
      image: f.img,
    })),
  };

  return (
    <div className="min-h-screen bg-white text-[#111111] pb-12 font-['Plus_Jakarta_Sans',system-ui,-apple-system,sans-serif]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFood) }}
      />

      {/* ━━━ Main Pinterest-Style Food & Flavors Experience (Matching deepseek_html_20261015_381141.html) ━━━ */}
      <FoodExplorer initialFoods={allFoods} />

      {/* ━━━ Foodie Hotspots & Towns (Optional Contextual Destinations) ━━━ */}
      {foodPlaces.length > 0 && (
        <section className="bg-[#fafafa] py-8 sm:py-14 border-t border-[#e9e9e9] mt-6 sm:mt-8">
          <div className="w-full max-w-[1400px] mx-auto px-3.5 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-3 sm:gap-4">
              <div>
                <span className="text-[#00aa6c] text-[11px] sm:text-xs font-black uppercase tracking-wider">
                  Culinary Destinations
                </span>
                <h2 className="text-xl sm:text-3xl font-extrabold text-[#111111] tracking-tight mt-1">
                  Destinations with Legendary Dining
                </h2>
              </div>
              <Link
                href="/destinations"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#00aa6c] hover:underline"
              >
                <span>View all destinations</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6">
              {foodPlaces.slice(0, 3).map((place, index) => (
                <PlaceCard key={place.id} place={place} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
