import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { Place, Review } from '@/types';
import PlaceDetailView from './PlaceDetailView';

interface PlacePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PlacePageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const numericId = parseInt(id, 10);
    const place = isNaN(numericId)
      ? null
      : ((await prisma.place.findUnique({ where: { id: numericId } })) as Place | null);
    if (!place) {
      return {
        title: 'Destination Not Found — UncoverCeylon',
      };
    }

    const title = `${place.name} — Sri Lanka Travel Guide & Highlights | Uncover Ceylon`;
    const desc = place.short_description || `Discover ${place.name} in ${place.location}, ${place.province}, Sri Lanka. Complete travel guide, entrance tickets (${place.entry_fee || 'Free'}), best season to visit, photos, reviews, and interactive directions.`;
    const img = place.image_url || 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=1200&h=630&fit=crop&q=85';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://uncoverceylon.com';

    return {
      title,
      description: desc,
      alternates: {
        canonical: `${siteUrl}/places/${place.id}`,
      },
      keywords: [
        place.name,
        `${place.name} Sri Lanka`,
        `${place.location} travel guide`,
        `${place.province} attractions`,
        `${place.category} in Sri Lanka`,
        'visit Sri Lanka',
        'Ceylon travel guide',
      ],
      openGraph: {
        title: `${place.name} — Sri Lanka Travel Guide | Uncover Ceylon`,
        description: desc,
        url: `${siteUrl}/places/${place.id}`,
        siteName: 'Uncover Ceylon',
        images: [
          {
            url: img,
            width: 1200,
            height: 630,
            alt: `${place.name} - ${place.location}, Sri Lanka`,
          },
        ],
        locale: 'en_US',
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${place.name} — Sri Lanka Travel Guide`,
        description: desc,
        images: [img],
      },
    };
  } catch {
    return {
      title: 'UncoverCeylon — Discover Sri Lanka',
    };
  }
}

async function getPlaceDetails(id: string): Promise<{
  place: Place;
  reviews: Review[];
  relatedPlaces: Place[];
  nearbyAttractions: Place[];
} | null> {
  try {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) return null;

    const rawPlace = await prisma.place.findUnique({
      where: { id: numericId },
    });
    if (!rawPlace) return null;

    const place: Place = {
      ...rawPlace,
      created_at: rawPlace.created_at.toISOString(),
    };

    const rawReviews = await prisma.review.findMany({
      where: { place_id: numericId, status: 'approved' },
      orderBy: { created_at: 'desc' },
    });
    const reviews: Review[] = rawReviews.map((r) => ({
      ...r,
      created_at: r.created_at.toISOString(),
    }));

    const rawRelated = await prisma.place.findMany({
      where: { category: place.category, NOT: { id: numericId } },
      orderBy: { rating: 'desc' },
      take: 3,
    });
    const relatedPlaces: Place[] = rawRelated.map((p) => ({
      ...p,
      created_at: p.created_at.toISOString(),
    }));

    // Fetch real nearby places from the same province first
    const sameProvinceNearby = await prisma.place.findMany({
      where: { province: place.province, NOT: { id: numericId } },
      orderBy: { rating: 'desc' },
      take: 6,
    });

    let combinedNearby = [...sameProvinceNearby];
    if (combinedNearby.length < 6) {
      const remaining = 6 - combinedNearby.length;
      const excludeIds = [numericId, ...combinedNearby.map((p) => p.id)];
      const otherNearby = await prisma.place.findMany({
        where: { id: { notIn: excludeIds } },
        orderBy: { rating: 'desc' },
        take: remaining,
      });
      combinedNearby = [...combinedNearby, ...otherNearby];
    }

    const nearbyAttractions: Place[] = combinedNearby.map((p) => ({
      ...p,
      created_at: p.created_at.toISOString(),
    }));

    return { place, reviews, relatedPlaces, nearbyAttractions };
  } catch {
    return null;
  }
}

function getGalleryImages(place: Place): string[] {
  let images: string[] = [];
  try {
    const parsed = JSON.parse(place.gallery || '[]');
    if (Array.isArray(parsed) && parsed.length > 0) {
      images = parsed.filter((img) => typeof img === 'string' && img.trim().length > 0);
    }
  } catch {
    // ignore
  }

  if (place.image_url && !images.includes(place.image_url)) {
    images.unshift(place.image_url);
  }

  // Only if the place has zero images at all, use a single scenic fallback
  if (images.length === 0) {
    images = [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1600&q=85',
    ];
  }

  return images;
}

function getThingsToDo(place: Place): { title: string; desc: string; icon: string }[] {
  const cat = place.category;
  if (cat === 'Ancient Sites' || cat === 'Historical') {
    return [
      { title: 'Explore the Ancient Ruins & Citadel', desc: 'Walk through centuries-old royal chambers, water gardens, and stone corridors.', icon: '🏛️' },
      { title: 'Ascend to the Panoramic Summit Viewpoint', desc: 'Climb the historic stairway for 360-degree views stretching across endless green valleys.', icon: '🧗' },
      { title: 'Golden Hour Architectural Photography', desc: 'Capture sunrise or sunset light reflecting upon ancient granite monuments and frescoes.', icon: '📸' },
      { title: 'Discover Royal Inscriptions & Museum', desc: 'Learn about royal dynasties, engineering feats, and archaeological artifacts.', icon: '📜' },
    ];
  } else if (cat === 'Mountains') {
    return [
      { title: 'Sunrise Mountain Summit Hike', desc: 'Embark on an early morning trek above clouds and rolling mountain ranges.', icon: '🌄' },
      { title: 'Highland Ceylon Tea Estate Walk', desc: 'Stroll among misty green tea plantations and meet local Ceylon tea growers.', icon: '🍃' },
      { title: 'Panoramic Gap & Viaduct Photography', desc: 'Spot scenic railway passes, pine forests, and cascading waterfalls in the valleys.', icon: '📸' },
      { title: 'Relax at Hill Country Cafes', desc: 'Enjoy fresh mountain brews, warm rotis, and cool fresh air in the hill towns.', icon: '☕' },
    ];
  } else if (cat === 'Beaches') {
    return [
      { title: 'Ocean Whale Watching Safari', desc: 'Take a boat expedition to observe gentle Blue Whales and playful spinner dolphins.', icon: '🐋' },
      { title: 'Coconut Grove Sunset Stroll', desc: 'Watch golden hour colors wash over palm-fringed shorelines and turquoise bays.', icon: '🌅' },
      { title: 'Surfing & Coral Reef Snorkeling', desc: 'Catch beginner and advanced waves or snorkel alongside sea turtles.', icon: '🏄' },
      { title: 'Fresh Beachside Seafood Dining', desc: 'Sample locally caught lobster, jumbo prawns, and tropical fruit shakes.', icon: '🦞' },
    ];
  } else if (cat === 'Waterfalls') {
    return [
      { title: 'Natural Rock Pool Refreshment', desc: 'Swim in cool, pure freshwater natural pools fed by mountain springs.', icon: '🏊' },
      { title: 'Misty Cascade Photography', desc: 'Capture stunning long-exposure shots of tumbling white water amidst granite cliffs.', icon: '📸' },
      { title: 'Jungle Canopy Trekking', desc: 'Hike through lush rainforest paths teeming with birds and wild tropical flora.', icon: '🦜' },
      { title: 'Scenic Picnic by the Rushing Waters', desc: 'Relax to the tranquil sound of roaring cascades surrounded by jungle shade.', icon: '🧺' },
    ];
  } else if (cat === 'Wildlife') {
    return [
      { title: '4x4 Open-Top Jungle Safari', desc: 'Venture through scrub jungles, coastal lagoons, and grasslands with local trackers.', icon: '🚙' },
      { title: 'Wild Leopard & Sloth Bear Tracking', desc: 'Visit renowned natural reserves holding the highest density of wild leopards in the world.', icon: '🐆' },
      { title: 'Wild Elephant Herd Observations', desc: 'Witness herds of Asian elephants drinking and dust-bathing at watering holes.', icon: '🐘' },
      { title: 'Wetland Birdwatching', desc: 'Spot painted storks, white-bellied sea eagles, and rare migratory bird flocks.', icon: '🦅' },
    ];
  } else {
    return [
      { title: 'Scenic Exploration & Trekking', desc: 'Discover quiet trails and secret viewpoints away from tourist crowds.', icon: '🥾' },
      { title: 'Panoramic Island Photography', desc: 'Capture Sri Lanka’s lush diversity and vibrant natural landscapes.', icon: '📷' },
      { title: 'Cultural & Heritage Immersion', desc: 'Experience warm local hospitality and discover regional legends and traditions.', icon: '🏺' },
      { title: 'Tranquil Nature Retreat', desc: 'Unwind amidst birdsong, fresh breezes, and pristine tropical scenery.', icon: '✨' },
    ];
  }
}

interface SeasonMonth {
  name: string;
  status: 'peak' | 'good' | 'monsoon';
  label: string;
}

function getClimateAndSeasonality(place: Place) {
  const prov = (place.province || '').toLowerCase();
  const cat = (place.category || '').toLowerCase();
  const name = (place.name || '').toLowerCase();

  let climateType = 'Tropical Warm & Breezy';
  let tempRange = '27°C – 32°C';
  let humidity = '65% – 75% (Moderate)';
  let weatherNote = 'Tropical sunshine, warm sea breezes, and pleasant island evenings.';
  let primeHours = '6:30 AM – 10:00 AM & 4:00 PM – 6:30 PM';
  let recommendedDuration = '2.5 – 4 Hours';

  const isHighland =
    prov.includes('central') ||
    prov.includes('uva') ||
    prov.includes('sabaragamuwa') ||
    cat.includes('mountain') ||
    name.includes('ella') ||
    name.includes('horton') ||
    name.includes('nuwara') ||
    name.includes('adam');

  const isEastCoast =
    prov.includes('eastern') ||
    name.includes('arugam') ||
    name.includes('trincomalee') ||
    name.includes('pasikudah');

  const isRainforest =
    name.includes('sinharaja') ||
    name.includes('kithulgala');

  if (isRainforest) {
    climateType = 'Tropical Rainforest';
    tempRange = '21°C – 28°C';
    humidity = '80% – 90% (Lush Canopy)';
    weatherNote = 'Vibrant rainforest canopy with misty morning trails and afternoon showers.';
    primeHours = '6:00 AM – 11:00 AM';
    recommendedDuration = '4 – 6 Hours';
  } else if (isHighland) {
    climateType = 'Cool Montane / Hill Country';
    tempRange = '14°C – 22°C';
    humidity = '60% – 70% (Crisp & Fresh)';
    weatherNote = 'Crisp mountain air, rolling morning mist, and golden afternoon sun among tea hills.';
    primeHours = '6:00 AM – 9:30 AM';
    recommendedDuration = '3 – 5 Hours';
  } else if (isEastCoast) {
    climateType = 'Sunny Coastal & Surf';
    tempRange = '28°C – 34°C';
    humidity = '60% – 70% (Ocean Breeze)';
    weatherNote = 'Prime dry season with offshore winds, calm swimming bays, and peak surfing swells.';
    primeHours = '6:30 AM – 10:30 AM & 3:30 PM – 6:00 PM';
    recommendedDuration = 'Full Day / Half Day';
  } else if (prov.includes('north central') || prov.includes('northern')) {
    climateType = 'Dry Zone Historical Plains';
    tempRange = '27°C – 34°C';
    humidity = '55% – 65% (Dry & Warm)';
    weatherNote = 'Bright sunny skies with low rainfall. Early morning exploration avoids high midday heat.';
    primeHours = '6:00 AM – 9:00 AM & 4:30 PM – 6:30 PM';
    recommendedDuration = '3 – 4 Hours';
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonthIdx = new Date().getMonth();

  const monthStatuses: SeasonMonth[] = months.map((m, index) => {
    if (isEastCoast) {
      if (index >= 4 && index <= 8) {
        return { name: m, status: 'peak', label: 'Prime Season (Dry & Surf)' };
      } else if (index === 3 || index === 9) {
        return { name: m, status: 'good', label: 'Shoulder (Fair Skies)' };
      } else {
        return { name: m, status: 'monsoon', label: 'North-East Monsoon Showers' };
      }
    } else if (isHighland) {
      if ((index >= 11 || index <= 3) || (index === 6 || index === 7)) {
        return { name: m, status: 'peak', label: 'Prime Season (Clear Views)' };
      } else if (index === 4 || index === 8) {
        return { name: m, status: 'good', label: 'Lush & Pleasant' };
      } else {
        return { name: m, status: 'monsoon', label: 'Monsoon Rain & Mist' };
      }
    } else {
      if (index >= 11 || index <= 3) {
        return { name: m, status: 'peak', label: 'Peak Season (Dry & Sunny)' };
      } else if (index === 6 || index === 7) {
        return { name: m, status: 'good', label: 'Inter-monsoon Window' };
      } else {
        return { name: m, status: 'monsoon', label: 'South-West Monsoon' };
      }
    }
  });

  const currentStatus = monthStatuses[currentMonthIdx];

  return {
    climateType,
    tempRange,
    humidity,
    weatherNote,
    primeHours,
    recommendedDuration,
    monthStatuses,
    currentStatus,
    currentMonthName: months[currentMonthIdx],
  };
}

export default async function PlacePage({ params }: PlacePageProps) {
  const { id } = await params;
  const data = await getPlaceDetails(id);
  if (!data) notFound();

  const { place, reviews, relatedPlaces, nearbyAttractions } = data;
  const galleryImages = getGalleryImages(place);
  const thingsToDo = getThingsToDo(place);
  const seasonality = getClimateAndSeasonality(place);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://uncoverceylon.com';

  const jsonLdDestination = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: place.name,
    description: place.short_description || place.description,
    image: galleryImages,
    touristType: [place.category, 'Sightseeing', 'Adventure', 'Nature'],
    geo: {
      '@type': 'GeoCoordinates',
      latitude: place.lat,
      longitude: place.lng,
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: place.location,
      addressRegion: place.province,
      addressCountry: 'LK',
    },
    isAccessibleForFree: (place.entry_fee || '').toLowerCase().includes('free'),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: place.rating > 0 ? place.rating : 4.8,
      reviewCount: place.review_count > 0 ? place.review_count : Math.max(reviews.length, 1),
      bestRating: 5,
      worstRating: 1,
    },
    url: `${siteUrl}/places/${place.id}`,
  };

  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Destinations',
        item: `${siteUrl}/destinations`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: place.category,
        item: `${siteUrl}/destinations?category=${encodeURIComponent(place.category)}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: place.name,
        item: `${siteUrl}/places/${place.id}`,
      },
    ],
  };

  return (
    <>
      {/* ━━━ JSON-LD STRUCTURED DATA FOR SUPER SEO ━━━ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdDestination) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />

      <PlaceDetailView
        place={place}
        reviews={reviews}
        relatedPlaces={relatedPlaces}
        nearbyAttractions={nearbyAttractions}
        galleryImages={galleryImages}
        thingsToDo={thingsToDo}
        seasonality={seasonality}
      />
    </>
  );
}
