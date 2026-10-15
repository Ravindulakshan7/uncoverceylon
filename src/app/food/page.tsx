import { prisma } from '@/lib/db';
import Image from 'next/image';
import Link from 'next/link';
import { Utensils, ArrowRight } from 'lucide-react';
import PlaceCard from '@/components/PlaceCard';
import FoodExplorer, { ALL_FOOD_DISHES, FoodDish } from '@/components/FoodExplorer';
import { Place } from '@/types';

export const revalidate = 60;

export const metadata = {
  title: 'Food & Flavors — Authentic Sri Lankan Cuisine & Street Food Guide',
  description: 'Embark on a culinary journey across Sri Lanka: spicy village clay pot curries, sizzling midnight kottu roti, Jaffna fiery crab, crispy egg hoppers, and misty highland Ceylon tea.',
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
    title: 'Food & Flavors of Ceylon — Sri Lanka Culinary Travel Guide',
    description: 'Explore spicy clay pot curries, street food kottu, and highland tea feasts across Sri Lanka.',
    url: 'https://uncoverceylon.com/food',
    siteName: 'Uncover Ceylon',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=1200&h=630&q=85',
        width: 1200,
        height: 630,
        alt: 'Sri Lankan Spices and Clay Pots',
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

async function getFoodItems(): Promise<FoodDish[]> {
  try {
    const dbFoods = await prisma.foodItem.findMany({
      orderBy: [{ sort_order: 'asc' }, { id: 'asc' }],
    });
    if (dbFoods.length > 0) {
      return dbFoods.map((f, idx) => ({
        id: f.id,
        title: f.title,
        kicker: ALL_FOOD_DISHES[idx]?.kicker || `0${idx + 1} · Island favourite`,
        tagline: f.tagline,
        badge: f.badge,
        desc: f.desc,
        image: f.image || ALL_FOOD_DISHES[idx]?.image || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=85',
        tags: ALL_FOOD_DISHES[idx]?.tags || ['traditional'],
        search: `${f.title} ${f.tagline} ${f.regions} ${f.desc}`.toLowerCase(),
        location: f.regions.split('•')[0]?.trim() || 'Island-wide',
        price: ALL_FOOD_DISHES[idx]?.price || 'Local favourite',
        regions: f.regions,
      }));
    }
  } catch (e) {
    console.error('Error fetching foods from DB:', e);
  }
  return ALL_FOOD_DISHES;
}

export default async function FoodPage() {
  const [foods, foodPlaces] = await Promise.all([
    getFoodItems(),
    getFoodDestinations(),
  ]);

  const jsonLdFood = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Top Sri Lankan Dishes & Culinary Specialties',
    description: 'Iconic street eats, clay pot feasts, and authentic tastes across Sri Lanka.',
    itemListElement: foods.map((f, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: f.title,
      description: f.desc,
      image: f.image || undefined,
    })),
  };

  return (
    <div className="min-h-screen bg-[#f8fbf9] text-slate-900 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFood) }}
      />
      
      {/* ━━━ Compact Hero Banner (Screenshot section reduced in height as requested) ━━━ */}
      <section className="relative bg-[#0f1b2d] text-white py-10 sm:py-14 overflow-hidden isolate">
        <div className="absolute inset-0 z-0 opacity-25">
          <Image
            src="https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=2000&q=85"
            alt="Sri Lankan food spices and clay pots"
            fill
            className="object-cover"
            unoptimized
            priority
          />
        </div>
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#0f1b2d] via-[#0f1b2d]/85 to-transparent" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 backdrop-blur-md text-amber-300 text-[10px] sm:text-xs font-black uppercase tracking-wider mb-2.5 border border-amber-400/30">
            <Utensils className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>Ceylon Gastronomy & Street Eats</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
            Spices, Clay Pots & Coastal Feasts
          </h1>

          <p className="text-white/80 text-xs sm:text-sm md:text-base font-normal mt-2.5 max-w-xl mx-auto leading-relaxed">
            Sri Lankan food is an explosion of freshly ground spices, rich coconut milk, fiery chili relishes, and ocean catches. Explore the island through its unforgettable flavors.
          </p>
        </div>
      </section>

      {/* ━━━ Main Food Experience Section (Matching uncoverceylon_food_test.html) ━━━ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FoodExplorer initialDishes={foods} />
      </div>

      {/* ━━━ Stays & Towns Famous for Food (Destinations with Legendary Dining) ━━━ */}
      {foodPlaces.length > 0 && (
        <section className="bg-white py-12 sm:py-16 border-t border-slate-200/80 mt-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4">
              <div>
                <span className="text-[#087f68] text-xs font-black uppercase tracking-wider">
                  Foodie Hotspots
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#152b2a] tracking-tight mt-1">
                  Destinations with Legendary Dining
                </h2>
              </div>
              <Link
                href="/destinations"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#087f68] hover:underline"
              >
                <span>View all destinations</span>
                <ArrowRight className="w-4 h-4" />
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
