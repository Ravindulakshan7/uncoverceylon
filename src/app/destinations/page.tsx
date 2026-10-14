import { prisma } from '@/lib/db';
import { Place } from '@/types';
import PlacesGrid from '@/components/PlacesGrid';
import DestinationsHero from '@/components/DestinationsHero';
import Link from 'next/link';
import { Compass, MapPin, ArrowRight } from 'lucide-react';

export const revalidate = 60;

export const metadata = {
  title: 'Destinations in Sri Lanka — 60+ Curated Places & Hidden Gems Guide',
  description: 'Explore 60+ curated places, misty mountains, ancient citadels, pristine beaches, and hidden waterfalls across all 9 provinces of Sri Lanka with interactive maps and reviews.',
  keywords: [
    'Sri Lanka destinations',
    'Places to visit in Sri Lanka',
    'Sri Lanka hidden gems',
    'Best beaches Sri Lanka',
    'Sri Lanka waterfalls',
    'Ella Sri Lanka',
    'Sigiriya fortress',
    'Galle Fort',
    'Mirissa beach',
    'Sri Lanka travel guide',
  ],
  alternates: {
    canonical: 'https://uncoverceylon.com/destinations',
  },
  openGraph: {
    title: 'Explore All Destinations in Sri Lanka — Uncover Ceylon',
    description: 'Discover 60+ curated attractions, beaches, waterfalls, and cultural wonders across Sri Lanka.',
    url: 'https://uncoverceylon.com/destinations',
    siteName: 'Uncover Ceylon',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1200&h=630&q=85',
        width: 1200,
        height: 630,
        alt: 'Sri Lanka Travel Destinations',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

async function getPlaces(): Promise<Place[]> {
  try {
    const rawPlaces = await prisma.place.findMany({
      orderBy: [
        { featured: 'desc' },
        { rating: 'desc' },
      ],
    });
    return rawPlaces.map((p) => ({
      ...p,
      created_at: p.created_at.toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return [];
  }
}

export default async function DestinationsPage() {
  const places = await getPlaces();

  const jsonLdDestinations = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Curated Destinations & Hidden Gems in Sri Lanka',
    description: 'Explore verified attractions, beaches, mountains, waterfalls, and cultural heritage across Sri Lanka.',
    itemListElement: places.slice(0, 30).map((p, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: p.name,
      description: p.description?.slice(0, 150),
      image: p.image_url,
      url: `https://uncoverceylon.com/places/${p.id}`,
    })),
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdDestinations) }}
      />
      
      {/* ━━━ Page Header & Hero Banner (Auto-collapses on mobile after a moment or scroll) ━━━ */}
      <DestinationsHero totalPlaces={places.length} />

      {/* ━━━ Interactive Places Grid with Categories, Search & Filters ━━━ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2 sm:mt-4">
        <PlacesGrid initialPlaces={places} />
      </div>

    </div>
  );
}
