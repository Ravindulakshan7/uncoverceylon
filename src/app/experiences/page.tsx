import { prisma } from '@/lib/db';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import PlaceCard from '@/components/PlaceCard';
import ExperienceExplorer from '@/components/ExperienceExplorer';
import { EXPERIENCES_DATA } from '@/data/experiencesData';
import { Place } from '@/types';

export const revalidate = 60;

export const metadata = {
  title: 'Island Experiences & Outdoor Adventures — Sri Lanka Travel Guide',
  description: 'Unforgettable adventures across Sri Lanka: surfing world-class breaks, scenic blue trains from Kandy to Ella, wild leopard safaris in Yala, whale watching, and cloud forest trekking.',
  keywords: [
    'Sri Lanka experiences',
    'Sri Lanka adventure travel',
    'Surfing Weligama Arugam Bay',
    'Kandy Ella train journey',
    'Yala safari leopards',
    'Mirissa whale watching',
    'Adams Peak hike',
    'Kitulgala white water rafting',
    'Things to do in Sri Lanka',
  ],
  alternates: {
    canonical: 'https://uncoverceylon.com/experiences',
  },
  openGraph: {
    title: 'Top Experiences & Adventures in Sri Lanka — Uncover Ceylon',
    description: 'Surfing, high mountain scenic trains, wild leopard safaris, and rainforest expeditions.',
    url: 'https://uncoverceylon.com/experiences',
    siteName: 'Uncover Ceylon',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1200&h=630&q=85',
        width: 1200,
        height: 630,
        alt: 'Surfing breaking waves in Sri Lanka',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

async function getExperienceDestinations(): Promise<Place[]> {
  try {
    const raw = await prisma.place.findMany({
      where: {
        OR: [
          { category: 'Beaches' },
          { category: 'Waterfalls' },
          { category: 'Mountains' },
          { category: 'Wildlife' },
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

export default async function ExperiencesPage() {
  const expPlaces = await getExperienceDestinations();

  const jsonLdExp = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Top Experiences & Adventures in Sri Lanka',
    description: 'Peeling surf breaks, scenic mountain rail trips, wild leopard safaris, and cloud forest hikes.',
    itemListElement: EXPERIENCES_DATA.map((e, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: e.title,
      description: e.desc,
      image: e.img,
    })),
  };

  return (
    <div className="min-h-screen bg-white text-[#111111] pb-12 font-['Plus_Jakarta_Sans',system-ui,-apple-system,sans-serif]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdExp) }}
      />

      {/* ━━━ Main Pinterest-Style Island Experiences ━━━ */}
      <ExperienceExplorer />

      {/* ━━━ Adventure Hotspots from Database ━━━ */}
      {expPlaces.length > 0 && (
        <section className="bg-[#fafafa] py-8 sm:py-14 border-t border-[#e9e9e9] mt-6 sm:mt-8">
          <div className="w-full max-w-[1400px] mx-auto px-3.5 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-3 sm:gap-4">
              <div>
                <span className="text-[#00aa6c] text-[11px] sm:text-xs font-black uppercase tracking-wider">
                  Adventure Terrains
                </span>
                <h2 className="text-xl sm:text-3xl font-black text-[#111111] tracking-tight mt-1">
                  Top Outdoor Destinations Nearby
                </h2>
              </div>
              <Link
                href="/destinations"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#00aa6c] hover:underline"
              >
                <span>View all outdoor spots</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {expPlaces.map((place, index) => (
                <PlaceCard key={place.id} place={place} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
