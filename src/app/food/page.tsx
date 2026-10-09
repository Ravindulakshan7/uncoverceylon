import { prisma } from '@/lib/db';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Utensils, MapPin, Star, Flame, Coffee } from 'lucide-react';
import PlaceCard from '@/components/PlaceCard';
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

const FOOD_HIGHLIGHTS = [
  {
    id: 1,
    title: 'Village Rice & Curry',
    tagline: '7-Curry Clay Pot Feast',
    desc: 'Slow-cooked in clay pots over cinnamon wood. Fragrant red rice served with jackfruit polos curry, tempered dhal, coconut pol sambol, and crispy papadum.',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    badge: 'Must Try',
    regions: 'Island-wide • Matale • Ella',
  },
  {
    id: 2,
    title: 'Midnight Kottu Roti',
    tagline: 'The Sound of Sri Lankan Nights',
    desc: 'The rhythmic clatter of metal blades slicing godamba roti, fresh vegetables, eggs, and rich spicy chicken or cheese curry on a sizzling hot plate.',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80',
    badge: 'Street Icon',
    regions: 'Colombo • Galle Face • Kandy',
  },
  {
    id: 3,
    title: 'Jaffna & Coastal Seafood',
    tagline: 'Fiery Crab & Ocean Grills',
    desc: 'World-renowned Jaffna crab curry infused with roasted curry powder, moringa leaves, and coconut milk, alongside fresh catch grilled right on the beach.',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
    badge: 'Seafood',
    regions: 'Jaffna • Negombo • Mirissa',
  },
  {
    id: 4,
    title: 'Crispy Hoppers (Appa)',
    tagline: 'Bowl-Shaped Coconut Pancakes',
    desc: 'Crisp lacy golden edges with a soft, pillowy coconut center. Enjoyed plain, with a runny steamed egg, and fiery lunu miris onion relish.',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    badge: 'Breakfast & Dinner',
    regions: 'All Provinces',
  },
  {
    id: 5,
    title: 'Highland Ceylon Tea',
    tagline: 'The World’s Finest Brew',
    desc: 'Handpicked two leaves and a bud from misty mountains above 1,800m. Golden liquor with subtle floral notes, served with traditional English cake.',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    badge: 'Highland Heritage',
    regions: 'Nuwara Eliya • Kandy • Ella',
  },
  {
    id: 6,
    title: 'Curd & Kithul Treacle',
    tagline: 'Ancient Natural Sweetness',
    desc: 'Rich, thick water buffalo curd poured with smoky, amber-gold sweet nectar tapped from wild highland Kithul palm trees. A centuries-old dessert.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    badge: 'Dessert',
    regions: 'Southern Province • Tissamaharama',
  },
];

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

async function getFoodItems() {
  try {
    const dbFoods = await prisma.foodItem.findMany({
      orderBy: [{ sort_order: 'asc' }, { id: 'asc' }],
    });
    if (dbFoods.length > 0) return dbFoods;
  } catch (e) {
    console.error('Error fetching foods from DB:', e);
  }
  return FOOD_HIGHLIGHTS;
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
    <div className="min-h-screen bg-white text-slate-900 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFood) }}
      />
      
      {/* ━━━ Hero Banner ━━━ */}
      <section className="relative bg-[#0f1b2d] text-white py-16 sm:py-24 overflow-hidden isolate">
        <div className="absolute inset-0 z-0 opacity-30">
          <Image
            src="https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=2000&q=85"
            alt="Sri Lankan food spices and clay pots"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#0f1b2d] via-[#0f1b2d]/80 to-transparent" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 backdrop-blur-md text-amber-300 text-xs font-black uppercase tracking-wider mb-4 border border-amber-400/30">
            <Utensils className="w-3.5 h-3.5" />
            <span>Ceylon Gastronomy & Street Eats</span>
          </div>

          <h1 className="text-3xl sm:text-6xl font-black tracking-tight leading-tight text-white">
            Spices, Clay Pots & Coastal Feasts
          </h1>

          <p className="text-white/80 text-sm sm:text-lg font-medium mt-4 max-w-2xl mx-auto leading-relaxed">
            Sri Lankan food is an explosion of freshly ground spices, rich coconut milk, fiery chili relishes, and ocean catches. Explore the island through its unforgettable flavors.
          </p>
        </div>
      </section>

      {/* ━━━ 6 Iconic Food Pillars ━━━ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="mb-10 sm:mb-14 text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Iconic Dishes You Must Experience
          </h2>
          <p className="text-slate-500 text-xs sm:text-base font-medium mt-1.5">
            Every province tells a story through its distinctive spices, heirloom rice, and heritage recipes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {foods.map((item, idx) => {
            const foodId = item.id || idx + 1;
            return (
              <Link
                key={foodId}
                href={`/food/${foodId}`}
                className="group rounded-3xl bg-white border border-slate-200/90 hover:border-[#00aa6c]/50 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col cursor-pointer block"
              >
                {/* Image */}
                <div className="relative h-56 w-full overflow-hidden bg-slate-900">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    unoptimized
                  />
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#0f1b2d] text-xs font-black shadow-md">
                      {item.badge}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 block">
                      {item.tagline}
                    </span>
                    <h3 className="text-xl font-black text-slate-900 mt-1 group-hover:text-[#00aa6c] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2 font-normal line-clamp-3">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-500 font-semibold truncate">
                      <MapPin className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                      <span className="truncate">{item.regions}</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[#00aa6c] font-black group-hover:translate-x-1 transition-transform flex-shrink-0">
                      Explore <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ━━━ Stays & Towns Famous for Food ━━━ */}
      {foodPlaces.length > 0 && (
        <section className="bg-slate-50 py-14 sm:py-20 border-t border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
              <div>
                <span className="text-[#00aa6c] text-xs font-black uppercase tracking-wider">
                  Foodie Hotspots
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight mt-1">
                  Destinations with Legendary Dining
                </h2>
              </div>
              <Link
                href="/destinations"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#00aa6c] hover:underline"
              >
                <span>View all destinations</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
