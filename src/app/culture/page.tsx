import { prisma } from '@/lib/db';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import PlaceCard from '@/components/PlaceCard';
import CultureExplorer from '@/components/CultureExplorer';
import { CULTURE_DATA } from '@/data/cultureData';
import { Place } from '@/types';

export const revalidate = 60;

export const metadata = {
  title: 'Culture & Heritage — Ancient Kingdoms, Temples & Legends of Sri Lanka',
  description: 'Explore 2,500 years of living history across Sri Lanka: ancient rock fortress Sigiriya, sacred Temple of the Tooth in Kandy, Galle Fort ramparts, and UNESCO world heritage treasures.',
  keywords: [
    'Sri Lanka culture',
    'Cultural Triangle Sri Lanka',
    'Sigiriya Rock Fortress',
    'Temple of the Sacred Tooth Kandy',
    'Galle Fort',
    'Dambulla Cave Temple',
    'Anuradhapura stupas',
    'Polonnaruwa ruins',
    'Sri Lanka heritage',
    'UNESCO Sri Lanka',
  ],
  alternates: {
    canonical: 'https://uncoverceylon.com/culture',
  },
  openGraph: {
    title: 'Culture & Heritage of Sri Lanka — 2,500 Years of Living History',
    description: 'Ancient rock citadels, sacred Buddhist relics, colonial ramparts, and sacred pageants across Ceylon.',
    url: 'https://uncoverceylon.com/culture',
    siteName: 'Uncover Ceylon',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&h=630&q=85',
        width: 1200,
        height: 630,
        alt: 'Sigiriya Rock Fortress UNESCO Sri Lanka',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

async function getHeritageDestinations(): Promise<Place[]> {
  try {
    const raw = await prisma.place.findMany({
      where: {
        OR: [
          { category: 'Ancient Sites' },
          { category: 'Religious Places' },
          { category: 'Historical' },
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

export default async function CulturePage() {
  const heritagePlaces = await getHeritageDestinations();

  const jsonLdCulture = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Culture & Heritage of Sri Lanka',
    description: 'Explore 2,500 years of living history across Sri Lanka: ancient rock citadels, sacred temples, and living traditions.',
    itemListElement: CULTURE_DATA.map((c, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: c.title,
      description: c.desc,
      image: c.img,
    })),
  };

  return (
    <div className="min-h-screen bg-white text-[#111111] pb-12 font-['Plus_Jakarta_Sans',system-ui,-apple-system,sans-serif]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdCulture) }}
      />

      {/* ━━━ Main Pinterest-Style Culture & Heritage Experience ━━━ */}
      <CultureExplorer />

      {/* ━━━ Verified Heritage Destinations from Database ━━━ */}
      {heritagePlaces.length > 0 && (
        <section className="bg-[#fafafa] py-8 sm:py-14 border-t border-[#e9e9e9] mt-6 sm:mt-8">
          <div className="w-full max-w-[1400px] mx-auto px-3.5 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-3 sm:gap-4">
              <div>
                <span className="text-[#00aa6c] text-[11px] sm:text-xs font-black uppercase tracking-wider">
                  Verified Sacred Sites
                </span>
                <h2 className="text-xl sm:text-3xl font-black text-[#111111] tracking-tight mt-1">
                  Heritage Destinations Across the Island
                </h2>
              </div>
              <Link
                href="/destinations?category=Ancient+Sites"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#00aa6c] hover:underline"
              >
                <span>View all historical places</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {heritagePlaces.map((place, index) => (
                <PlaceCard key={place.id} place={place} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
