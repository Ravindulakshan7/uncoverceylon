import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EXPERIENCES_DATA, IslandExperienceItem } from '@/data/experiencesData';
import { prisma } from '@/lib/db';
import ExperienceDetailClient from '@/components/ExperienceDetailClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * Resolve experience item by integer id or matching title from database only
 */
async function resolveExperience(idParam: string): Promise<IslandExperienceItem | null> {
  const numId = parseInt(idParam, 10);

  try {
    const db = await prisma.experienceItem.findFirst({
      where: !isNaN(numId)
        ? { id: numId }
        : { title: { equals: idParam, mode: 'insensitive' } },
    });

    if (db) {
      const curated = EXPERIENCES_DATA.find((e) => e.id === db.id || e.title.toLowerCase() === db.title.toLowerCase());
      const textToScan = `${db.title} ${db.badge} ${db.tagline}`.toLowerCase();
      let inferredTag: IslandExperienceItem['tag'] = 'surf';
      if (textToScan.includes('surf') || textToScan.includes('wave') || textToScan.includes('beach')) inferredTag = 'surf';
      else if (textToScan.includes('safari') || textToScan.includes('leopard') || textToScan.includes('elephant') || textToScan.includes('wildlife')) inferredTag = 'safari';
      else if (textToScan.includes('train') || textToScan.includes('rail') || textToScan.includes('scenic')) inferredTag = 'rail';
      else if (textToScan.includes('hike') || textToScan.includes('trek') || textToScan.includes('peak') || textToScan.includes('mountain') || textToScan.includes('forest')) inferredTag = 'hiking';
      else if (textToScan.includes('whale') || textToScan.includes('dolphin') || textToScan.includes('ocean') || textToScan.includes('sea') || textToScan.includes('dive') || textToScan.includes('snorkel')) inferredTag = 'ocean';
      else if (textToScan.includes('raft') || textToScan.includes('water') || textToScan.includes('adrenaline') || textToScan.includes('thrill')) inferredTag = 'adrenaline';

      let parsedVarieties: any[] = [];
      if (db.varieties) {
        try {
          const parsed = JSON.parse(db.varieties);
          if (Array.isArray(parsed) && parsed.length > 0) {
            parsedVarieties = parsed;
          }
        } catch {}
      }
      if (parsedVarieties.length === 0 && curated?.varieties && curated.varieties.length > 0) {
        parsedVarieties = curated.varieties;
      }
      if (parsedVarieties.length === 0) {
        parsedVarieties = [{ name: db.title, tag: db.badge || 'Popular', desc: db.desc }];
      }

      return {
        id: db.id,
        slug: db.slug || curated?.slug || db.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title: db.title,
        tagline: db.tagline || curated?.tagline || 'Island Adventure in Sri Lanka',
        sub: db.locations || db.seasons || curated?.sub || 'Sri Lanka',
        tag: (db.tag as any) || curated?.tag || inferredTag,
        categoryLabel: db.badge || curated?.categoryLabel || 'Adventure',
        season: db.seasons || curated?.season || 'Year-round',
        badge: db.badge || curated?.badge || 'Popular',
        timing: db.timing || curated?.timing || 'Early Morning or Sunset Hours',
        entryInfo: db.entryInfo || curated?.entryInfo || 'Inquire with local licensed operators',
        difficulty: db.difficulty || curated?.difficulty || 'All Levels',
        locations: db.locations || db.seasons || curated?.locations || 'Sri Lanka',
        img: db.image || curated?.img || 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1200&q=85',
        seed: `exp-${db.id}`,
        desc: db.desc,
        heritage: db.heritage || curated?.heritage || db.desc,
        ancientRoots: db.ancientRoots || curated?.ancientRoots || db.tagline || db.desc,
        varieties: parsedVarieties,
        gearChecklist: db.gearChecklist || curated?.gearChecklist || 'Comfortable outdoor attire, sturdy footwear, sun protection, hydration.',
        localSafetyTips: db.localSafetyTips || curated?.localSafetyTips || 'Follow certified guides and local weather / safety advisories.',
        nearbySpots: curated?.nearbySpots,
      };
    }
  } catch (err) {
    console.error('Error fetching experience from DB:', err);
  }

  return null;
}

async function getRelatedExperiences(currentId: number): Promise<IslandExperienceItem[]> {
  try {
    const raw = await prisma.experienceItem.findMany({
      where: { id: { not: currentId } },
      take: 3,
      orderBy: { sort_order: 'asc' },
    });
    return raw.map((db) => {
      const curated = EXPERIENCES_DATA.find((e) => e.id === db.id || e.title.toLowerCase() === db.title.toLowerCase());
      return {
        id: db.id,
        slug: curated?.slug || db.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title: db.title,
        tagline: db.tagline || '',
        sub: db.seasons || 'Sri Lanka',
        tag: curated?.tag || 'surf',
        categoryLabel: db.badge || 'Adventure',
        season: db.seasons || 'Year-round',
        badge: db.badge || 'Popular',
        timing: curated?.timing || '',
        entryInfo: curated?.entryInfo || '',
        difficulty: curated?.difficulty || 'All Levels',
        locations: db.seasons || 'Sri Lanka',
        img: db.image || curated?.img || 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1200&q=85',
        seed: `exp-${db.id}`,
        desc: db.desc,
        heritage: db.desc,
        ancientRoots: db.desc,
        varieties: [{ name: db.title, tag: db.badge || 'Popular', desc: db.desc }],
        gearChecklist: '',
        localSafetyTips: '',
      };
    });
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const item = await resolveExperience(id);

  if (!item) {
    return {
      title: 'Experience Not Found — Uncover Ceylon',
    };
  }

  const title = `${item.title} — Sri Lanka Adventure & Experience Guide`;
  const description = `${item.tagline}. ${item.desc} Discover seasons, equipment, difficulty, and local insider tips.`;

  return {
    title,
    description,
    keywords: [
      item.title,
      'Sri Lanka adventure',
      'Things to do in Sri Lanka',
      item.season,
      item.categoryLabel,
      item.difficulty,
      ...item.locations.split('·').map((s) => s.trim()),
      'Ceylon travel experience',
    ],
    alternates: {
      canonical: `https://uncoverceylon.com/experiences/${item.id}`,
    },
    openGraph: {
      title,
      description,
      url: `https://uncoverceylon.com/experiences/${item.id}`,
      siteName: 'Uncover Ceylon',
      images: [
        {
          url: item.img,
          width: 1200,
          height: 630,
          alt: item.title,
        },
      ],
      locale: 'en_US',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [item.img],
    },
  };
}

export default async function ExperienceDetailPage({ params }: PageProps) {
  const { id } = await params;
  const item = await resolveExperience(id);

  if (!item) {
    notFound();
  }

  // Pick 3 related items from database
  const relatedItems = await getRelatedExperiences(item.id);

  // Structured Data (JSON-LD)
  const jsonLdExperience = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: item.title,
    description: item.desc,
    image: [item.img],
    touristType: ['Adventure', 'Outdoor', 'Sports', 'Nature'],
    address: {
      '@type': 'PostalAddress',
      addressLocality: item.locations,
      addressCountry: 'LK',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdExperience) }}
      />
      <ExperienceDetailClient item={item} relatedItems={relatedItems} />
    </>
  );
}
