import { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://uncoverceylon.com';

  let places: { id: number; created_at: Date }[] = [];
  try {
    places = await prisma.place.findMany({
      select: { id: true, created_at: true },
      orderBy: { id: 'desc' },
    });
  } catch (error) {
    console.error('Error fetching places for sitemap:', error);
  }

  // 1. Dynamic Destination URLs (Priority 0.85)
  const destinationUrls: MetadataRoute.Sitemap = places.map((place) => ({
    url: `${baseUrl}/places/${place.id}`,
    lastModified: place.created_at || new Date(),
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // 2. High-Intent Category URLs
  const categories = [
    'Beaches',
    'Waterfalls',
    'Mountains',
    'Ancient Sites',
    'Wildlife',
    'Hidden Gems',
    'Historical',
    'Religious Places',
  ];
  const categoryUrls: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/destinations?category=${encodeURIComponent(cat)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // 3. Core High-Value Pillar Pages
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/destinations`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/food`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/culture`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/experiences`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/map`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  return [...staticUrls, ...categoryUrls, ...destinationUrls];
}
