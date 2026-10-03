import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDb } from '@/lib/db';
import { Place, Review } from '@/types';
import ReviewSection from './ReviewSection';
import DestinationGallery from './DestinationGallery';
import PlaceMap from './PlaceMap';
import PlaceCard from '@/components/PlaceCard';
import WishlistButton from '@/components/WishlistButton';
import OfflineGuideButton from '@/components/OfflineGuideButton';
import PlaceSidebarQuickFacts from './PlaceSidebarQuickFacts';
import {
  MapPin, Star, Clock, Tag, Ticket, Calendar, ChevronLeft,
  ArrowUpRight, Heart, Share2, CheckCircle2, Map,
  AlertCircle, ShieldCheck, Sun, Info, ArrowRight, Eye,
  CloudSun, CloudRain, Thermometer, Wind, Umbrella, Sparkles
} from 'lucide-react';

interface PlacePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PlacePageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const db = getDb();
    const place = db.prepare('SELECT * FROM places WHERE id = ?').get(id) as Place | undefined;
    if (!place) {
      return {
        title: 'Destination Not Found — UncoverCeylon',
      };
    }

    const title = `${place.name} — UncoverCeylon`;
    const desc = place.short_description || `Discover ${place.name} in ${place.location}, Sri Lanka. Travel guide, best season to visit, photos, and reviews.`;
    const img = place.image_url || 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=1200&h=630&fit=crop&q=85';

    return {
      title,
      description: desc,
      openGraph: {
        title: `${place.name} — Sri Lanka Travel Guide | UncoverCeylon`,
        description: desc,
        url: `/places/${place.id}`,
        siteName: 'UncoverCeylon',
        images: [
          {
            url: img,
            width: 1200,
            height: 630,
            alt: place.name,
          },
        ],
        locale: 'en_US',
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${place.name} — UncoverCeylon`,
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
    const db = getDb();
    const place = db.prepare('SELECT * FROM places WHERE id = ?').get(id) as Place | undefined;
    if (!place) return null;

    const reviews = db.prepare(
      'SELECT * FROM reviews WHERE place_id = ? ORDER BY created_at DESC'
    ).all(id) as Review[];

    const relatedPlaces = db.prepare(
      'SELECT * FROM places WHERE category = ? AND id != ? ORDER BY rating DESC LIMIT 3'
    ).all(place.category, id) as Place[];

    const nearbyAttractions = db.prepare(
      'SELECT * FROM places WHERE province = ? AND id != ? ORDER BY rating DESC LIMIT 3'
    ).all(place.province, id) as Place[];

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

  const infoItems = [
    { icon: MapPin, label: 'Location', value: place.location },
    { icon: Tag, label: 'Province', value: place.province },
    { icon: Tag, label: 'Category', value: place.category },
    { icon: Ticket, label: 'Entry Fee', value: place.entry_fee || 'Free' },
    { icon: Calendar, label: 'Best Season', value: place.best_time || 'Year-round' },
    { icon: Clock, label: 'From Colombo', value: place.distance_km > 0 ? `${place.distance_km} km` : 'Scenic drive' },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 pt-20 sm:pt-24 pb-28">
      
      {/* ━━━ TOP BREADCRUMB & ACTIONS BAR ━━━ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex items-center justify-between gap-4">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-500">
            <Link href="/" className="hover:text-sky-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href={`/?category=${encodeURIComponent(place.category)}#explore`} className="hover:text-sky-600 transition-colors">
              {place.category}
            </Link>
            <span>/</span>
            <span className="text-slate-900 truncate max-w-[200px] sm:max-w-none">{place.name}</span>
          </div>

          {/* Quick Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <OfflineGuideButton place={place} variant="pill" />
            <WishlistButton placeId={place.id} placeName={place.name} variant="pill" />
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 bg-white border border-slate-200 hover:border-sky-300 text-slate-700 hover:text-slate-900 font-bold px-4 py-2 rounded-xl text-xs sm:text-sm shadow-xs transition-all active:scale-95"
            >
              <ChevronLeft className="w-4 h-4 text-sky-600" />
              <span className="hidden sm:inline">Back to Explore</span>
              <span className="sm:hidden">Back</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ━━━ DESTINATION TITLE HEADER ━━━ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="bg-sky-50 text-sky-700 text-xs font-bold px-3 py-1 rounded-full border border-sky-200">
                {place.category}
              </span>
              <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full border border-slate-200">
                {place.province}
              </span>
              {place.featured === 1 && (
                <span className="bg-amber-50 text-amber-800 text-xs font-bold px-3 py-1 rounded-full border border-amber-200 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  Featured Destination
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              {place.name}
            </h1>

            <div className="flex items-center gap-2 text-slate-500 text-sm mt-2">
              <MapPin className="w-4 h-4 text-sky-600 flex-shrink-0" />
              <span>{place.location}, Sri Lanka</span>
            </div>
          </div>

          {/* Rating Summary Block */}
          <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl p-3.5 shadow-sm self-start md:self-auto">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-500 flex-shrink-0">
              <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black text-slate-900">{place.rating.toFixed(1)}</span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  / 5.0
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {place.review_count.toLocaleString()} traveler reviews
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ━━━ 1. LARGE HERO GALLERY & IMAGE SLIDER ━━━ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <DestinationGallery
          images={galleryImages}
          title={place.name}
          category={place.category}
          location={place.location}
        />
      </div>

      {/* ━━━ MAIN CONTENT & SIDEBAR WORKSPACE ━━━ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* ━━━━ LEFT COLUMN (8 COLS): OVERVIEW, BEST TIME, THINGS TO DO, TIPS, MAP, REVIEWS ━━━━ */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* ━━━ 2. DESTINATION OVERVIEW ━━━ */}
            <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center flex-shrink-0">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Destination Overview
                  </h2>
                  <p className="text-slate-500 text-xs sm:text-sm">
                    Essential background & heritage of {place.name}
                  </p>
                </div>
              </div>

              {/* Highlight summary lead */}
              <p className="text-slate-900 text-lg sm:text-xl font-medium leading-relaxed border-l-4 border-sky-600 pl-4 py-2 bg-sky-50/60 rounded-r-xl">
                {place.short_description}
              </p>

              {/* Full Description */}
              <div className="text-slate-600 leading-relaxed text-base space-y-4 whitespace-pre-line pt-2">
                {place.description}
              </div>

              {/* Quick highlight tags */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                  Scenic Viewpoint
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                  Photography Permitted
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                  Local Guide Recommended
                </span>
              </div>
            </section>

            {/* ━━━ 3. THINGS TO DO SECTION ━━━ */}
            <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-sky-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Things To Do & Experiences
                  </h3>
                  <p className="text-slate-500 text-xs sm:text-sm">
                    Curated activities recommended by local explorers
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {thingsToDo.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-sky-300 hover:bg-white transition-all shadow-xs space-y-2 group"
                  >
                    <div className="text-2xl mb-1">{item.icon}</div>
                    <h4 className="font-extrabold text-slate-900 text-base group-hover:text-sky-600 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* ━━━ 4. SEASONALITY & WEATHER GUIDE ━━━ */}
            <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-7">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/60 flex items-center justify-center flex-shrink-0">
                    <Sun className="w-5 h-5 fill-amber-400/30 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                      Seasonality & Weather Guide
                    </h3>
                    <p className="text-slate-500 text-xs sm:text-sm">
                      Real-time climate profile, temperature ranges & month-by-month travel matrix
                    </p>
                  </div>
                </div>

                {/* Live Current Month Status Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 border border-slate-200 self-start sm:self-auto">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      seasonality.currentStatus.status === 'peak'
                        ? 'bg-emerald-400'
                        : seasonality.currentStatus.status === 'good'
                        ? 'bg-amber-400'
                        : 'bg-sky-400'
                    }`}></span>
                    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                      seasonality.currentStatus.status === 'peak'
                        ? 'bg-emerald-500'
                        : seasonality.currentStatus.status === 'good'
                        ? 'bg-amber-500'
                        : 'bg-sky-500'
                    }`}></span>
                  </span>
                  <span className="text-slate-900">
                    {seasonality.currentMonthName}: {seasonality.currentStatus.label}
                  </span>
                </div>
              </div>

              {/* Climate Summary Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    <CloudSun className="w-3.5 h-3.5 text-sky-600" />
                    <span>Climate Zone</span>
                  </div>
                  <div className="text-sm sm:text-base font-extrabold text-slate-900">
                    {seasonality.climateType}
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    <Thermometer className="w-3.5 h-3.5 text-amber-500" />
                    <span>Avg Temperature</span>
                  </div>
                  <div className="text-sm sm:text-base font-extrabold text-slate-900">
                    {seasonality.tempRange}
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    <Wind className="w-3.5 h-3.5 text-sky-600" />
                    <span>Humidity & Air</span>
                  </div>
                  <div className="text-sm sm:text-base font-extrabold text-slate-900">
                    {seasonality.humidity}
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>Prime Window</span>
                  </div>
                  <div className="text-sm sm:text-base font-extrabold text-slate-900 truncate">
                    {place.best_time || 'Nov to Apr'}
                  </div>
                </div>
              </div>

              {/* 12-Month Seasonality Calendar Bar */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Month-by-Month Travel Conditions:</span>
                  <span className="text-slate-500 font-normal hidden sm:inline">12-month climate outlook</span>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-1.5">
                  {seasonality.monthStatuses.map((m, idx) => {
                    const isCurrent = m.name === seasonality.currentMonthName;
                    const isPeak = m.status === 'peak';
                    const isGood = m.status === 'good';

                    return (
                      <div
                        key={idx}
                        className={`rounded-xl p-2.5 text-center flex flex-col items-center justify-between border transition-all ${
                          isCurrent ? 'ring-2 ring-sky-600 shadow-sm' : ''
                        } ${
                          isPeak
                            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                            : isGood
                            ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                            : 'bg-sky-50/70 border-sky-200 text-sky-950'
                        }`}
                        title={`${m.name}: ${m.label}`}
                      >
                        <span className="text-[11px] font-bold">{m.name}</span>
                        <span className="text-base my-0.5">
                          {isPeak ? '☀️' : isGood ? '🌤️' : '🌧️'}
                        </span>
                        <span className="text-[9px] font-semibold uppercase tracking-tight opacity-80">
                          {isPeak ? 'Peak' : isGood ? 'Good' : 'Wet'}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Calendar Legend */}
                <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span><strong>Peak Season:</strong> Clear skies, calm seas & dry hiking</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <span><strong>Good / Shoulder:</strong> Mild weather & fewer crowds</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
                    <span><strong>Monsoon / Wet:</strong> Lush foliage, misty falls & low rates</span>
                  </div>
                </div>
              </div>

              {/* Timing & Pacing Advices */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-sky-600 shrink-0 font-bold">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Optimal Daily Hours
                    </span>
                    <span className="text-sm font-extrabold text-slate-900">
                      {seasonality.primeHours}
                    </span>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Best lighting for photography and cooler walking temperature.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-sky-600 shrink-0 font-bold">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Local Weather Advice
                    </span>
                    <span className="text-sm font-extrabold text-slate-900">
                      {seasonality.weatherNote}
                    </span>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Recommended stay duration: {seasonality.recommendedDuration}.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* ━━━ 5. TRAVEL TIPS & VISITOR ADVISORY ━━━ */}
            {place.tips && (
              <section className="bg-gradient-to-br from-amber-50/70 to-amber-100/40 border border-amber-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-900 flex items-center justify-center flex-shrink-0 font-bold">
                    <Info className="w-4 h-4" />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    Visitor Tips & Advisory
                  </h3>
                </div>

                <p className="text-slate-700 leading-relaxed text-sm sm:text-base whitespace-pre-line pl-1">
                  {place.tips}
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="text-xs font-semibold text-amber-900 bg-white/80 border border-amber-200 px-3 py-1 rounded-full">
                    💡 Carry drinking water
                  </span>
                  <span className="text-xs font-semibold text-amber-900 bg-white/80 border border-amber-200 px-3 py-1 rounded-full">
                    👟 Wear sturdy footwear
                  </span>
                  <span className="text-xs font-semibold text-amber-900 bg-white/80 border border-amber-200 px-3 py-1 rounded-full">
                    👒 Bring sun protection
                  </span>
                </div>
              </section>
            )}

            {/* ━━━ 6. INTERACTIVE MAP SECTION ━━━ */}
            <section>
              <PlaceMap place={place} />
            </section>

            {/* ━━━ 7. REVIEWS SECTION ━━━ */}
            <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm">
              <ReviewSection placeId={place.id} initialReviews={reviews} />
            </section>
          </div>

          {/* ━━━━ RIGHT COLUMN (4 COLS): STICKY BOOKING / QUICK INFO SIDEBAR ━━━━ */}
          <aside className="lg:col-span-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xl shadow-slate-900/5 sticky top-28 space-y-7">
              
              {/* Dynamic Admission Fee & Quick Facts (with Live GPS & Multi-Currency) */}
              <PlaceSidebarQuickFacts place={place} />

              {/* Action Buttons */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <WishlistButton placeId={place.id} placeName={place.name} variant="pill" className="w-full justify-center py-3.5" />

                <OfflineGuideButton place={place} variant="sidebar" />

                <a
                  href={`https://www.google.com/maps?q=${place.lat},${place.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-500 text-white font-bold py-3.5 px-6 rounded-2xl text-sm transition-all shadow-md shadow-sky-600/25 active:scale-95"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Open in Google Maps</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>

                <Link
                  href="/map"
                  className="w-full flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold py-3 px-6 rounded-2xl text-sm transition-all active:scale-95"
                >
                  <Map className="w-4 h-4 text-sky-600" />
                  <span>View on Ceylon Live Map</span>
                </Link>
              </div>

              {/* Trust & Safety Guarantees */}
              <div className="pt-4 border-t border-slate-100 flex items-center gap-3 text-xs text-slate-500">
                <ShieldCheck className="w-5 h-5 text-sky-600 flex-shrink-0" />
                <span>Verified travel information updated by Sri Lanka travel network.</span>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ━━━ 8. NEARBY ATTRACTIONS SECTION ━━━ */}
      {nearbyAttractions.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-sky-50 text-sky-700 text-xs font-bold px-3 py-1 rounded-full mb-2 border border-sky-200">
                <MapPin className="w-3.5 h-3.5 text-sky-600" />
                <span>Nearby in {place.province}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Nearby Attractions
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                Combine your visit with other remarkable destinations nearby
              </p>
            </div>

            <Link
              href={`/?province=${encodeURIComponent(place.province)}#explore`}
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-sky-600 hover:text-sky-500 group"
            >
              <span>Explore all in {place.province}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6">
            {nearbyAttractions.map((nearby, idx) => (
              <PlaceCard key={nearby.id} place={nearby} index={idx} />
            ))}
          </div>
        </section>
      )}

      {/* ━━━ 9. RELATED PLACES (SAME CATEGORY) ━━━ */}
      {relatedPlaces.length > 0 && (
        <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-12 sm:mt-20 pt-10 sm:pt-16 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-3 sm:gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-sky-50 text-sky-700 text-xs font-bold px-3 py-1 rounded-full mb-2 border border-sky-200">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span>More {place.category}</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Similar Destinations
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                More top-rated {place.category.toLowerCase()} across Sri Lanka
              </p>
            </div>

            <Link
              href={`/?category=${encodeURIComponent(place.category)}#explore`}
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-sky-600 hover:text-sky-500 group"
            >
              <span>View all {place.category}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6">
            {relatedPlaces.map((related, idx) => (
              <PlaceCard key={related.id} place={related} index={idx} />
            ))}
          </div>
        </section>
      )}

      {/* ━━━ 10. LUXURY MOBILE FLOATING ACTION BAR (Airbnb / TripAdvisor style) ━━━ */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200 px-4 py-3 shadow-[0_-8px_30px_rgba(15,23,42,0.1)]">
        <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Admission
            </span>
            <div className="flex items-baseline gap-1.5 truncate">
              <span className="text-base font-extrabold text-slate-900 truncate">
                {place.entry_fee || 'Free Entry'}
              </span>
              <span className="text-[11px] font-bold text-sky-600 flex items-center gap-0.5 shrink-0">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                {place.rating.toFixed(1)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <OfflineGuideButton place={place} variant="icon" />
            <WishlistButton placeId={place.id} placeName={place.name} variant="icon" />

            <Link
              href="/map"
              className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-sky-600 active:scale-95 transition-all"
              aria-label="View on map"
              title="View on Live Map"
            >
              <Map className="w-4 h-4" />
            </Link>

            <a
              href={`https://www.google.com/maps?q=${place.lat},${place.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm shadow-md shadow-sky-600/25 active:scale-95 transition-all"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-300" />
              <span>Open in Maps</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}
