import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CULTURE_DATA, CultureHeritageItem } from '@/data/cultureData';
import { prisma } from '@/lib/db';
import CultureDetailClient from '@/components/CultureDetailClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * Resolve cultural heritage item by integer id or matching title from database only
 */
async function resolveCulture(idParam: string): Promise<CultureHeritageItem | null> {
  const numId = parseInt(idParam, 10);
  const normalizedSlug = idParam.toLowerCase().trim();

  try {
    const db = await prisma.cultureItem.findFirst({
      where: !isNaN(numId)
        ? { id: numId }
        : { title: { equals: idParam, mode: 'insensitive' } },
    });

    if (db) {
      const curated = CULTURE_DATA.find((c) => c.id === db.id || c.title.toLowerCase() === db.title.toLowerCase());
      const textToScan = `${db.title} ${db.badge} ${db.tagline}`.toLowerCase();
      let inferredTag: CultureHeritageItem['tag'] = 'unesco';
      if (textToScan.includes('unesco')) inferredTag = 'unesco';
      else if (textToScan.includes('temple') || textToScan.includes('sacred') || textToScan.includes('kovil') || textToScan.includes('tooth')) inferredTag = 'temples';
      else if (textToScan.includes('fort') || textToScan.includes('citadel') || textToScan.includes('palace') || textToScan.includes('ruin')) inferredTag = 'citadels';
      else if (textToScan.includes('ritual') || textToScan.includes('dance') || textToScan.includes('perahera')) inferredTag = 'rituals';
      else if (textToScan.includes('mask') || textToScan.includes('craft') || textToScan.includes('art') || textToScan.includes('carving') || textToScan.includes('batik')) inferredTag = 'crafts';
      else if (textToScan.includes('peak') || textToScan.includes('pilgrim') || textToScan.includes('pada') || textToScan.includes('mountain')) inferredTag = 'pilgrimage';

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
        parsedVarieties = [{ name: db.title, tag: db.badge || 'Heritage', desc: db.desc }];
      }

      return {
        id: db.id,
        slug: db.slug || curated?.slug || db.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title: db.title,
        sinhalaName: db.sinhalaName || curated?.sinhalaName || db.tagline || db.title,
        tagline: db.tagline || curated?.tagline || 'Ancient Heritage of Sri Lanka',
        sub: db.locations || db.period || curated?.sub || 'Sri Lanka',
        tag: (db.tag as any) || curated?.tag || inferredTag,
        categoryLabel: db.badge || curated?.categoryLabel || 'Heritage',
        epoch: db.period || curated?.epoch || 'Ancient Ceylon',
        badge: db.badge || curated?.badge || 'Heritage',
        timing: db.timing || curated?.timing || 'Daytime / Open Daily',
        entryInfo: db.entryInfo || curated?.entryInfo || 'Check at site entrance',
        preservation: db.preservation || curated?.preservation || 'Protected Cultural Monument of Sri Lanka',
        dressCode: db.dressCode || curated?.dressCode || 'Modest attire covering shoulders and knees at sacred sites',
        locations: db.locations || db.period || curated?.locations || 'Sri Lanka',
        img: db.image || curated?.img || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=85',
        seed: `culture-${db.id}`,
        desc: db.desc,
        heritage: db.heritage || curated?.heritage || db.desc,
        ancientRoots: db.ancientRoots || curated?.ancientRoots || db.tagline || db.desc,
        varieties: parsedVarieties,
        architecturalElements: db.architecturalElements || curated?.architecturalElements || 'Traditional Sri Lankan architectural craftsmanship and historical stonework.',
        etiquetteTips: db.etiquetteTips || curated?.etiquetteTips || 'Remove shoes and headwear when entering sacred enclosures. Avoid turning your back to sacred statues.',
        nearbySites: curated?.nearbySites,
      };
    }
  } catch (err) {
    console.error('Error fetching culture from DB:', err);
  }

  return null;
}

async function getRelatedCultures(currentId: number): Promise<CultureHeritageItem[]> {
  try {
    const raw = await prisma.cultureItem.findMany({
      where: { id: { not: currentId } },
      take: 3,
      orderBy: { sort_order: 'asc' },
    });
    return raw.map((db) => {
      const curated = CULTURE_DATA.find((c) => c.id === db.id || c.title.toLowerCase() === db.title.toLowerCase());
      return {
        id: db.id,
        slug: curated?.slug || db.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title: db.title,
        sinhalaName: curated?.sinhalaName || db.tagline || db.title,
        tagline: db.tagline || '',
        sub: db.period || 'Sri Lanka',
        tag: curated?.tag || 'unesco',
        categoryLabel: db.badge || 'Heritage',
        epoch: db.period || 'Ancient Ceylon',
        badge: db.badge || 'Heritage',
        timing: curated?.timing || '',
        entryInfo: curated?.entryInfo || '',
        preservation: curated?.preservation || '',
        dressCode: curated?.dressCode || '',
        locations: db.period || 'Sri Lanka',
        img: db.image || curated?.img || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=85',
        seed: `culture-${db.id}`,
        desc: db.desc,
        heritage: db.desc,
        ancientRoots: db.desc,
        varieties: [{ name: db.title, tag: db.badge || 'Heritage', desc: db.desc }],
        architecturalElements: '',
        etiquetteTips: '',
      };
    });
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const item = await resolveCulture(id);

  if (!item) {
    return {
      title: 'Heritage Site Not Found — Uncover Ceylon',
    };
  }

  const title = `${item.title} — Ancient Heritage & Travel Guide`;
  const description = `${item.tagline}. ${item.desc} Discover history, visiting hours, rituals, and architecture.`;

  return {
    title,
    description,
    keywords: [
      item.title,
      item.sinhalaName,
      'Sri Lanka culture',
      'Ancient Ceylon heritage',
      item.epoch,
      item.categoryLabel,
      ...item.locations.split('·').map((s) => s.trim()),
      'UNESCO World Heritage Sri Lanka',
    ],
    alternates: {
      canonical: `https://uncoverceylon.com/culture/${item.id}`,
    },
    openGraph: {
      title,
      description,
      url: `https://uncoverceylon.com/culture/${item.id}`,
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

export default async function CultureDetailPage({ params }: PageProps) {
  const { id } = await params;
  const item = await resolveCulture(id);

  if (!item) {
    notFound();
  }

  // Pick 3 related items from database
  const relatedItems = await getRelatedCultures(item.id);

  // Structured Data (JSON-LD)
  const jsonLdHeritage = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: item.title,
    alternateName: item.sinhalaName,
    description: item.desc,
    image: [item.img],
    touristType: ['Cultural', 'Historical', 'Religious'],
    telephone: '+94 11 242 6900',
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHeritage) }}
      />
      <CultureDetailClient item={item} relatedItems={relatedItems} />
    </>
  );
}
