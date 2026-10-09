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

  let foods: { id: number; created_at: Date }[] = [];
  try {
    foods = await prisma.foodItem.findMany({
      select: { id: true, created_at: true },
      orderBy: { id: 'asc' },
    });
  } catch (error) {
    console.error('Error fetching foods for sitemap:', error);
  }

  let cultures: { id: number; created_at: Date }[] = [];
  try {
    cultures = await prisma.cultureItem.findMany({
      select: { id: true, created_at: true },
      orderBy: { id: 'asc' },
    });
  } catch (error) {
    console.error('Error fetching culture items for sitemap:', error);
  }

  let experiences: { id: number; created_at: Date }[] = [];
  try {
    experiences = await prisma.experienceItem.findMany({
      select: { id: true, created_at: true },
      orderBy: { id: 'asc' },
    });
  } catch (error) {
    console.error('Error fetching experiences for sitemap:', error);
  }

  // 1. Dynamic Destination URLs (Priority 0.85)
  const destinationUrls: MetadataRoute.Sitemap = places.map((place) => ({
    url: `${baseUrl}/places/${place.id}`,
    lastModified: place.created_at || new Date(),
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // 1b. Dynamic Food Specialty URLs (Priority 0.85)
  const foodFallbackIds = [1, 2, 3, 4, 5, 6];
  const foodUrls: MetadataRoute.Sitemap = (foods.length > 0 ? foods : foodFallbackIds.map((id) => ({ id, created_at: new Date() }))).map((f) => ({
    url: `${baseUrl}/food/${f.id}`,
    lastModified: f.created_at || new Date(),
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // 1c. Dynamic Culture Heritage URLs (Priority 0.85)
  const cultureFallbackIds = [1, 2, 3, 4, 5, 6];
  const cultureUrls: MetadataRoute.Sitemap = (cultures.length > 0 ? cultures : cultureFallbackIds.map((id) => ({ id, created_at: new Date() }))).map((c) => ({
    url: `${baseUrl}/culture/${c.id}`,
    lastModified: c.created_at || new Date(),
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // 1d. Dynamic Experience & Adventure URLs (Priority 0.85)
  const expFallbackIds = [1, 2, 3, 4, 5, 6];
  const experienceUrls: MetadataRoute.Sitemap = (experiences.length > 0 ? experiences : expFallbackIds.map((id) => ({ id, created_at: new Date() }))).map((e) => ({
    url: `${baseUrl}/experiences/${e.id}`,
    lastModified: e.created_at || new Date(),
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

  return [
    ...staticUrls,
    ...categoryUrls,
    ...destinationUrls,
    ...foodUrls,
    ...cultureUrls,
    ...experienceUrls,
  ];
}
