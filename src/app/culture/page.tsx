import { prisma } from '@/lib/db';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import PlaceCard from '@/components/PlaceCard';
import CultureExplorer from '@/components/CultureExplorer';
import { CULTURE_DATA, CultureHeritageItem } from '@/data/cultureData';
import { Place } from '@/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

async function getCultureItems(): Promise<CultureHeritageItem[]> {
  try {
    const dbCultures = await prisma.cultureItem.findMany({
      orderBy: [{ sort_order: 'asc' }, { id: 'asc' }],
    });

    if (dbCultures && dbCultures.length > 0) {
      return dbCultures.map((db) => {
        const curated = CULTURE_DATA.find((c) => c.id === db.id || c.title.toLowerCase() === db.title.toLowerCase());

        const textToScan = `${db.title} ${db.badge} ${db.tagline}`.toLowerCase();
        let inferredTag: CultureHeritageItem['tag'] = 'unesco';
        if (textToScan.includes('unesco')) inferredTag = 'unesco';
        else if (textToScan.includes('temple') || textToScan.includes('sacred') || textToScan.includes('kovil') || textToScan.includes('tooth')) inferredTag = 'temples';
        else if (textToScan.includes('fort') || textToScan.includes('citadel') || textToScan.includes('palace') || textToScan.includes('ruin')) inferredTag = 'citadels';
        else if (textToScan.includes('ritual') || textToScan.includes('dance') || textToScan.includes('perahera')) inferredTag = 'rituals';
        else if (textToScan.includes('mask') || textToScan.includes('craft') || textToScan.includes('art') || textToScan.includes('carving') || textToScan.includes('batik')) inferredTag = 'crafts';
        else if (textToScan.includes('peak') || textToScan.includes('pilgrim') || textToScan.includes('pada') || textToScan.includes('mountain')) inferredTag = 'pilgrimage';

        return {
          id: db.id,
          slug: curated?.slug || db.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          title: db.title,
          sinhalaName: curated?.sinhalaName || db.tagline || db.title,
          tagline: db.tagline || curated?.tagline || 'Ancient Heritage of Sri Lanka',
          sub: db.period || curated?.sub || 'Sri Lanka',
          tag: curated?.tag || inferredTag,
          categoryLabel: db.badge || curated?.categoryLabel || 'Heritage',
          epoch: db.period || curated?.epoch || 'Ancient Ceylon',
          badge: db.badge || curated?.badge || 'Heritage',
          timing: curated?.timing || 'Daytime / Open Daily',
          entryInfo: curated?.entryInfo || 'Check at site entrance',
          preservation: curated?.preservation || 'Protected Cultural Monument of Sri Lanka',
          dressCode: curated?.dressCode || 'Modest attire covering shoulders and knees at sacred sites',
          locations: db.period || curated?.locations || 'Sri Lanka',
          img: db.image || curated?.img || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=85',
          seed: `culture-${db.id}`,
          desc: db.desc,
          heritage: curated?.heritage || db.desc,
          ancientRoots: curated?.ancientRoots || db.tagline || db.desc,
          varieties: curated?.varieties && curated.varieties.length > 0 ? curated.varieties : [{ name: db.title, tag: db.badge || 'Heritage', desc: db.desc }],
          architecturalElements: curated?.architecturalElements || 'Traditional Sri Lankan architectural craftsmanship and historical stonework.',
          etiquetteTips: curated?.etiquetteTips || 'Remove shoes and headwear when entering sacred enclosures. Avoid turning your back to sacred statues.',
          nearbySites: curated?.nearbySites,
        };
      });
    }

    return [];
  } catch (err) {
    console.error('Error fetching cultures:', err);
    return [];
  }
}

export default async function CulturePage() {
  const [heritagePlaces, allCultures] = await Promise.all([
    getHeritageDestinations(),
    getCultureItems(),
  ]);

  const jsonLdCulture = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Culture & Heritage of Sri Lanka',
    description: 'Explore 2,500 years of living history across Sri Lanka: ancient rock citadels, sacred temples, and living traditions.',
    itemListElement: allCultures.map((c, idx) => ({
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
      <CultureExplorer initialCultures={allCultures} />

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
