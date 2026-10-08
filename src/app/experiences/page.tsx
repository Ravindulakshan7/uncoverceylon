import { prisma } from '@/lib/db';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Compass, Sparkles, MapPin, Waves, Mountain, PawPrint, Train, Sun, Anchor } from 'lucide-react';
import PlaceCard from '@/components/PlaceCard';
import { Place } from '@/types';

export const revalidate = 60;

export const metadata = {
  title: 'Island Experiences & Adventures — Uncover Ceylon',
  description: 'Unforgettable adventures across Sri Lanka: surfing golden breaks, scenic mountain trains, leopard safaris, and cloud forest trekking.',
};

const EXPERIENCES_LIST = [
  {
    id: 'surfing',
    title: 'World-Class Surfing',
    tagline: 'Year-Round Coastal Swells',
    desc: 'With two alternating monsoon seasons, Sri Lanka offers peeling waves 365 days a year. From gentle, sandy breaks in Weligama and horseshoe bay peelers in Hiriketiya to legendary point breaks in Arugam Bay.',
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80',
    seasons: 'South Coast (Nov–Apr) • East Coast (May–Sep)',
    icon: Waves,
    badge: 'Popular',
  },
  {
    id: 'trains',
    title: 'Blue Highland Train Journeys',
    tagline: 'The World’s Most Scenic Railway',
    desc: 'Winding through emerald tea estates, pine cloud forests, and colonial stone bridges. Hang out the open doorway as mist brushes past and cross the famous Demodara Nine Arch Bridge.',
    image: 'https://images.unsplash.com/photo-1535463731090-e34f4b5098c5?auto=format&fit=crop&w=800&q=80',
    seasons: 'Year-round • Kandy to Ella Route',
    icon: Train,
    badge: 'Must Do',
  },
  {
    id: 'safaris',
    title: 'Wild Leopard & Elephant Safaris',
    tagline: 'Untamed National Sanctuaries',
    desc: 'Home to the highest density of wild leopards on Earth in Yala Block 1, plus hundreds of free-roaming wild elephant herds across Udawalawe and the Minneriya gathering.',
    image: 'https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?auto=format&fit=crop&w=800&q=80',
    seasons: 'Best: Feb–July • Yala & Udawalawe',
    icon: PawPrint,
    badge: 'Wildlife',
  },
  {
    id: 'trekking',
    title: 'Peak Treks & Cloud Forests',
    tagline: 'Summits Above The Mist',
    desc: 'Scale 5,500 lantern-lit steps to Adam’s Peak for sunrise above the clouds, hike through the rolling tea trails to Ella Rock, or explore the endemic biodiversity of Knuckles Range.',
    image: 'https://images.unsplash.com/photo-1576706374778-95a95efff7b1?auto=format&fit=crop&w=800&q=80',
    seasons: 'Dec–Apr Pilgrimage • Ella & Knuckles',
    icon: Mountain,
    badge: 'Adventure',
  },
  {
    id: 'whales',
    title: 'Blue Whale & Dolphin Expeditions',
    tagline: 'Giants of the Indian Ocean',
    desc: 'The deep ocean trench just off Mirissa brings the largest animals to ever live on Earth within swimming distance of the coast. Spot Blue Whales, Sperm Whales, and pods of spinner dolphins.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
    seasons: 'November to April • Mirissa & Trincomalee',
    icon: Anchor,
    badge: 'Ocean Safari',
  },
  {
    id: 'rafting',
    title: 'White Water Rafting & Canyoning',
    tagline: 'Jungle River Rush',
    desc: 'Paddle through grade 3 and 4 churning rapids on the Kelani River in Kitulgala, surrounded by lush rainforest where ‘The Bridge on the River Kwai’ was filmed. Rock sliding and waterfall abseiling included.',
    image: 'https://images.unsplash.com/photo-1467173572719-f14b9fb86e5f?auto=format&fit=crop&w=800&q=80',
    seasons: 'Year-round • Kitulgala Rainforest',
    icon: Sun,
    badge: 'Adrenaline',
  },
];

async function getAdventureDestinations(): Promise<Place[]> {
  try {
    const raw = await prisma.place.findMany({
      where: {
        category: {
          in: ['Beaches', 'Mountains', 'Wildlife', 'Waterfalls'],
        },
        featured: 1,
      },
      orderBy: { rating: 'desc' },
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

async function getExperienceItems() {
  try {
    const dbExp = await prisma.experienceItem.findMany({
      orderBy: [{ sort_order: 'asc' }, { id: 'asc' }],
    });
    if (dbExp.length > 0) return dbExp;
  } catch (e) {
    console.error('Error fetching experiences from DB:', e);
  }
  return EXPERIENCES_LIST;
}

export default async function ExperiencesPage() {
  const [experiences, adventurePlaces] = await Promise.all([
    getExperienceItems(),
    getAdventureDestinations(),
  ]);

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-20">
      
      {/* ━━━ Hero Banner ━━━ */}
      <section className="relative bg-[#0f1b2d] text-white py-16 sm:py-24 overflow-hidden isolate">
        <div className="absolute inset-0 z-0 opacity-30">
          <Image
            src="https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=2000&q=85"
            alt="Surfing in Sri Lanka"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#0f1b2d] via-[#0f1b2d]/80 to-transparent" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#10b981]/20 backdrop-blur-md text-emerald-300 text-xs font-black uppercase tracking-wider mb-4 border border-[#10b981]/30">
            <Compass className="w-3.5 h-3.5" />
            <span>Adventures & Island Experiences</span>
          </div>

          <h1 className="text-3xl sm:text-6xl font-black tracking-tight leading-tight text-white">
            Surf, Summit, Safari & Explore
          </h1>

          <p className="text-white/80 text-sm sm:text-lg font-medium mt-4 max-w-2xl mx-auto leading-relaxed">
            Sri Lanka is an outdoor playground. Ride world-class surf breaks at dawn, trek misty tea ridges by afternoon, and track wild leopards in deep tropical forests by sunset.
          </p>
        </div>
      </section>

      {/* ━━━ 6 Curated Experiences ━━━ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="mb-10 sm:mb-14 text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Curated Experiences
          </h2>
          <p className="text-slate-500 text-xs sm:text-base font-medium mt-1.5">
            Every coast and mountain range has a different pulse. Find your adventure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {experiences.map((item, idx) => {
            const IconComp = (item as any).icon || Compass;
            return (
              <div
                key={item.id}
                id={String(item.id)}
                className="group rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col scroll-mt-24"
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
                    <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#0f1b2d] text-xs font-black shadow-md flex items-center gap-1.5">
                      <IconComp className="w-3.5 h-3.5 text-[#0aa06e]" />
                      <span>{item.badge}</span>
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#0aa06e] block">
                      {item.tagline}
                    </span>
                    <h3 className="text-xl font-black text-slate-900 mt-1">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2 font-normal">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{item.seasons}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ━━━ Featured Adventure Destinations from Supabase ━━━ */}
      {adventurePlaces.length > 0 && (
        <section className="bg-slate-50 py-14 sm:py-20 border-t border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
              <div>
                <span className="text-[#00aa6c] text-xs font-black uppercase tracking-wider">
                  Top Outdoor Spots
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight mt-1">
                  Adventure Destinations to Visit
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
              {adventurePlaces.map((place, index) => (
                <PlaceCard key={place.id} place={place} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
