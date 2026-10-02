import { getDb } from '@/lib/db';
import { Place } from '@/types';
import HeroSection from '@/components/HeroSection';
import PlacesGrid from '@/components/PlacesGrid';
import PlaceCard from '@/components/PlaceCard';
import RegionImageSlider from '@/components/RegionImageSlider';
import JourneyCategoriesSection from '@/components/JourneyCategoriesSection';
import { AnimatedDrop, AnimatedFadeUp } from '@/components/AnimatedReveal';
import Link from 'next/link';
import { ArrowRight, Map, MapPin } from 'lucide-react';

export const revalidate = 60;

async function getPlaces(): Promise<Place[]> {
  try {
    return getDb().prepare('SELECT * FROM places ORDER BY featured DESC, rating DESC').all() as Place[];
  } catch (error) {
    console.error('Error fetching places:', error);
    return [];
  }
}

async function getSettings(): Promise<Record<string, string>> {
  try {
    const db = getDb();
    const rows = db.prepare('SELECT key, value FROM site_settings').all() as { key: string; value: string }[];
    const settings: Record<string, string> = {};
    for (const row of rows) {
      settings[row.key] = row.value;
    }
    return settings;
  } catch {
    return {};
  }
}

export default async function HomePage() {
  const [places, settings] = await Promise.all([getPlaces(), getSettings()]);
  const featured = places.filter((place) => place.featured === 1).slice(0, 3);
  const hiddenGems = places.filter((place) => place.category === 'Hidden Gems').slice(0, 2);

  return (
    <div className="min-h-screen w-full max-w-none bg-[#f8fafc] text-slate-900">
      {/* ━━━ HERO SECTION ━━━ */}
      <HeroSection />

      {/* ━━━ START YOUR JOURNEY (ANIMATED CATEGORIES DROP-IN) ━━━ */}
      <JourneyCategoriesSection places={places} />

      {/* ━━━ EDITOR'S ROUTE (HIDDEN GEMS) ━━━ */}
      <section className="border-y border-slate-200/80 bg-slate-100/60">
        <div className="mx-auto w-full max-w-7xl px-3 py-10 sm:px-6 sm:py-20 lg:px-8">
          <AnimatedDrop className="text-center mb-6 sm:mb-10">
            <p className="mb-2 sm:mb-3 text-[11px] sm:text-xs font-bold uppercase tracking-[0.16em] text-sky-700">
              Editor&apos;s route
            </p>
            <h2 className="text-xl font-semibold leading-tight text-slate-900 sm:text-3xl lg:text-4xl tracking-tight">
              Remarkable places, thoughtfully collected.
            </h2>
            <p className="mx-auto mt-2 sm:mt-4 max-w-xl text-xs sm:text-base leading-relaxed text-slate-600">
              A slower, clearer way to plan an island escape: real places, practical details, and room for a little wonder.
            </p>
            <Link
              href="/?category=Hidden+Gems#explore"
              className="mt-3 sm:mt-6 inline-flex items-center gap-1.5 border-b-2 border-sky-600 pb-0.5 text-xs sm:text-sm font-bold text-sky-600 hover:text-sky-700 transition-colors group"
            >
              <span>See hidden gems</span>
              <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </AnimatedDrop>

          <div className="mx-auto grid w-full max-w-4xl grid-cols-2 gap-2.5 sm:gap-6">
            {hiddenGems.map((place, index) => (
              <PlaceCard key={place.id} place={place} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ TRAVELERS' FAVOURITES (FEATURED) ━━━ */}
      <section className="py-10 sm:py-20 lg:py-24">
        <div className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8">
          <AnimatedDrop className="mb-6 sm:mb-12 text-center">
            <div>
              <p className="mb-2 sm:mb-3 text-[11px] sm:text-xs font-bold uppercase tracking-[0.16em] text-sky-700">
                Most loved
              </p>
              <h2 className="text-xl font-semibold leading-tight text-slate-900 sm:text-3xl lg:text-4xl tracking-tight">
                Travelers&apos; favourites
              </h2>
            </div>
            <Link
              href="/#explore"
              className="mt-2.5 sm:mt-4 inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-sky-600 hover:text-sky-700 transition-colors group"
            >
              <span>All destinations</span>
              <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </AnimatedDrop>

          <div className="grid w-full grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-6">
            {featured.map((place, index) => (
              <PlaceCard key={place.id} place={place} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ EXPLORE BY REGION (FEATURED PROMOTIONAL BANNER) ━━━ */}
      <section className="w-full pb-10 sm:pb-20 lg:pb-24">
        <div className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8">
          <AnimatedFadeUp>
            <div className="grid overflow-hidden rounded-2xl bg-[#0a192f] shadow-xl shadow-sky-950/20 lg:grid-cols-[1fr_0.9fr]">
              <div className="p-5 sm:p-12 lg:p-16 text-white">
                <MapPin className="h-5 sm:h-6 w-5 sm:w-6 text-amber-400" />
                <p className="mt-3 sm:mt-8 text-[11px] sm:text-xs font-bold uppercase tracking-[0.16em] text-sky-300">
                  {settings.region_tagline || 'Explore by region'}
                </p>
                <h2 className="mt-2 sm:mt-3 max-w-md text-xl sm:text-4xl font-semibold leading-tight">
                  {settings.region_title || 'Every corner of the island has a different story.'}
                </h2>
                <p className="mt-2 sm:mt-5 max-w-md text-xs sm:text-base leading-relaxed text-slate-300">
                  {settings.region_description || 'Choose a province, follow the map, and make your own route across Sri Lanka.'}
                </p>
                <Link
                  href={settings.region_button_link || '/map'}
                  className="mt-4 sm:mt-8 inline-flex items-center gap-2 rounded-xl bg-sky-500 hover:bg-sky-400 px-4 sm:px-6 py-2.5 sm:py-3.5 text-xs sm:text-sm font-bold text-white transition-all shadow-lg shadow-sky-500/25 cursor-pointer"
                >
                  {settings.region_button_text || 'Open the map'} <Map className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Link>
              </div>
              <div className="relative min-h-52 sm:min-h-72 lg:min-h-full">
                <RegionImageSlider />
              </div>
            </div>
          </AnimatedFadeUp>
        </div>
      </section>

      {/* ━━━ ALL DESTINATIONS GRID ━━━ */}
      <PlacesGrid initialPlaces={places} />

      {/* ━━━ FOOTER TEASER ━━━ */}
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-10 sm:px-6 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <MapPin className="h-6 w-6 text-sky-600" />
            <p className="text-sm text-slate-600">New places and routes are being added regularly.</p>
          </div>
          <Link href="/#explore" className="text-sm font-bold text-sky-600 hover:text-sky-700">
            Explore Sri Lanka
          </Link>
        </div>
      </section>
    </div>
  );
}
