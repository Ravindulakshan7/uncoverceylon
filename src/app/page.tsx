import { prisma } from '@/lib/db';
import HeroSection from '@/components/HeroSection';
import InterestsSection from '@/components/InterestsSection';
import HomeDiscovery from '@/components/HomeDiscovery';
import { FOODS_DATA } from '@/data/foodsData';
import { CULTURE_DATA } from '@/data/cultureData';
import { EXPERIENCES_DATA } from '@/data/experiencesData';

export const revalidate = 60;

export default async function HomePage() {
  const [placesCount, topPlacesRaw, heroSlides] = await Promise.all([
    prisma.place.count().catch(() => 0),
    prisma.place
      .findMany({
        select: { id: true, name: true, category: true, rating: true, review_count: true, province: true, location: true, entry_fee: true, image_url: true },
        orderBy: [{ featured: 'desc' }, { rating: 'desc' }],
      })
      .catch(() => []),
    prisma.heroSlide
      .findMany({
        orderBy: { sort_order: 'asc' },
      })
      .catch(() => []),
  ]);

  const interestCounts = {
    destinations: placesCount > 0 ? `${placesCount}+ places` : 'Curated places',
    food: `${FOODS_DATA.length} dishes`,
    culture: `${CULTURE_DATA.length} sites`,
    experiences: `${EXPERIENCES_DATA.length} experiences`,
  };

  const topDestinations = topPlacesRaw.slice(0, 8).map((p) => ({
    id: p.id,
    name: p.name,
    tagline: p.category,
    rating: p.rating > 0 ? p.rating : 4.8,
    reviews: `${p.review_count > 0 ? p.review_count : '1.4k'}`,
    location: `${p.province}, ${p.location}`,
    entry_fee: p.entry_fee && p.entry_fee !== 'Free' ? `starts at ${p.entry_fee}` : 'Free Entry',
    image: p.image_url || 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=900&q=80',
  }));

  return (
    <div className="min-h-screen w-full max-w-none bg-white text-slate-900 font-sans">
      
      {/* ━━━ 1. WANDER.LK FULL-SCREEN ROUNDED HERO SLIDER ━━━ */}
      <HeroSection initialSlides={heroSlides} />

      {/* ━━━ 2. UNCOVER CEYLON BY INTEREST (4 Cards Grid) ━━━ */}
      <InterestsSection counts={interestCounts} />

      <HomeDiscovery destinations={topDestinations} provinces={[
        'Southern', 'Central', 'Uva', 'Eastern', 'Western', 'North Central', 'Northern', 'North Western', 'Sabaragamuwa',
      ].map(name => {
        const places = topPlacesRaw.filter(place => place.province.replace(/ Province$/i, '').trim() === name);
        const preferred = name === 'Central' ? /sigiriya rock/i : name === 'Uva' ? /nine arch/i : /beach|national park|fort/i;
        const photo = places.find(place => preferred.test(place.name) && place.image_url) || places.find(place => place.image_url && !place.image_url.includes('icon') && !place.image_url.endsWith('.svg'));
        return { name, count: places.length, image: photo?.image_url || '', placeName: photo?.name || '' };
      })} />
    </div>
  );
}
