import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CULTURE_DATA, CultureHeritageItem } from '@/data/cultureData';
import CultureDetailClient from '@/components/CultureDetailClient';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * Resolve cultural heritage item by integer id, slug, or matching title
 */
async function resolveCulture(idParam: string): Promise<CultureHeritageItem | null> {
  const numId = parseInt(idParam, 10);

  // 1. Check CULTURE_DATA by numeric ID
  if (!isNaN(numId)) {
    const foundById = CULTURE_DATA.find((c) => c.id === numId);
    if (foundById) return foundById;
  }

  // 2. Check CULTURE_DATA by slug
  const normalizedSlug = idParam.toLowerCase().trim();
  const foundBySlug = CULTURE_DATA.find((c) => c.slug.toLowerCase() === normalizedSlug);
  if (foundBySlug) return foundBySlug;

  // 3. Check CULTURE_DATA by title normalized
  const foundByTitle = CULTURE_DATA.find(
    (c) => c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === normalizedSlug
  );
  if (foundByTitle) return foundByTitle;

  return null;
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

  // Pick 3 related items
  const relatedItems = CULTURE_DATA.filter((c) => c.id !== item.id).slice(0, 3);

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
