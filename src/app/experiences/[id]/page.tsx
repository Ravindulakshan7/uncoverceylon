import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EXPERIENCES_DATA, IslandExperienceItem } from '@/data/experiencesData';
import ExperienceDetailClient from '@/components/ExperienceDetailClient';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * Resolve experience item by integer id, slug, or matching title
 */
async function resolveExperience(idParam: string): Promise<IslandExperienceItem | null> {
  const numId = parseInt(idParam, 10);

  // 1. Check EXPERIENCES_DATA by numeric ID
  if (!isNaN(numId)) {
    const foundById = EXPERIENCES_DATA.find((e) => e.id === numId);
    if (foundById) return foundById;
  }

  // 2. Check EXPERIENCES_DATA by slug
  const normalizedSlug = idParam.toLowerCase().trim();
  const foundBySlug = EXPERIENCES_DATA.find((e) => e.slug.toLowerCase() === normalizedSlug);
  if (foundBySlug) return foundBySlug;

  // 3. Check EXPERIENCES_DATA by title normalized
  const foundByTitle = EXPERIENCES_DATA.find(
    (e) => e.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === normalizedSlug
  );
  if (foundByTitle) return foundByTitle;

  return null;
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

  // Pick 3 related items
  const relatedItems = EXPERIENCES_DATA.filter((e) => e.id !== item.id).slice(0, 3);

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
