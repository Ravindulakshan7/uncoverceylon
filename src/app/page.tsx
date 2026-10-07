import { getDb } from '@/lib/db';
import { Place } from '@/types';
import HeroSection from '@/components/HeroSection';
import PlacesGrid from '@/components/PlacesGrid';
import PlaceCard from '@/components/PlaceCard';
import Link from 'next/link';
import { ArrowRight, Map, MapPin, Sparkles, Compass, ShieldCheck, Sun, Train, WifiOff } from 'lucide-react';

export const revalidate = 60;

async function getPlaces(): Promise<Place[]> {
  try {
    return getDb().prepare('SELECT * FROM places ORDER BY featured DESC, rating DESC').all() as Place[];
  } catch (error) {
    console.error('Error fetching places:', error);
    return [];
  }
}

export default async function HomePage() {
  const places = await getPlaces();
  const hiddenGems = places.filter((place) => place.category === 'Hidden Gems').slice(0, 2);

  return (
    <div className="min-h-screen w-full max-w-none bg-white text-slate-900 font-sans">
      
      {/* ━━━ 1. TRIPADVISOR-INFLUENCED HERO (Where to? + Pill Search + 4 Interest Cards) ━━━ */}
      <HeroSection />

      {/* ━━━ 2. CURATED EDITOR'S COLLECTION (TripAdvisor "Top Experiences" Style) ━━━ */}
      {hiddenGems.length > 0 && (
        <section id="curated" className="py-12 sm:py-20 bg-[#f8fafc] border-b border-slate-200/80 scroll-mt-20">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#00aa6c] text-[11px] font-black uppercase tracking-wider border border-emerald-200">
                  <Sparkles className="w-3.5 h-3.5" />
                  Curated Collection
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight mt-2.5">
                  Remarkable places, thoughtfully collected
                </h2>
                <p className="text-slate-500 text-xs sm:text-base font-medium mt-1 max-w-xl">
                  A slower, clearer way to explore Sri Lanka: secret viewpoints, ancient legends, and verified traveler notes.
                </p>
              </div>
              <Link
                href="/?category=Hidden+Gems#destinations"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#00aa6c] hover:text-[#008f5a] hover:underline shrink-0"
              >
                <span>View all hidden gems</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8">
              {hiddenGems.map((place, index) => (
                <PlaceCard key={place.id} place={place} index={index} variant="horizontal" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ━━━ 3. POPULAR DESTINATIONS (Core Places Filter & Dynamic Grid) ━━━ */}
      <PlacesGrid initialPlaces={places} />

      {/* ━━━ 4. ISLAND ROUTE PLANNER BANNER (Interactive Map Preview) ━━━ */}
      <section id="map-banner" className="py-12 sm:py-20 bg-white border-t border-slate-200/80">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[32px] bg-gradient-to-br from-slate-950 via-[#06261c] to-slate-950 border border-slate-800 p-7 sm:p-12 lg:p-14 text-white shadow-xl shadow-slate-950/10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative overflow-hidden">
            
            {/* Background glowing ambient light */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#00aa6c]/15 rounded-full blur-3xl pointer-events-none" />

            {/* Left Content */}
            <div className="lg:col-span-6 space-y-4 relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-300 text-xs font-bold border border-white/15">
                <Map className="w-3.5 h-3.5" />
                Island Route Planner
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                Plan your route across the island
              </h2>
              <p className="text-slate-300 text-xs sm:text-base font-normal leading-relaxed max-w-lg">
                Sri Lanka is beautifully compact. You can surf turquoise morning waves, ride scenic misty tea trains, and explore ancient Buddhist kingdoms in a single trip.
              </p>
              <div className="pt-2">
                <Link
                  href="/map"
                  className="inline-flex items-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full font-bold text-xs sm:text-sm bg-[#00aa6c] hover:bg-[#008f5a] text-white shadow-lg shadow-emerald-950/40 transition-all active:scale-95 cursor-pointer"
                >
                  <span>Open interactive 9-province map</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right: 4 Island Quick-Stats Cards */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-3 sm:gap-4 relative z-10">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/10 hover:border-white/20 transition-all">
                <b className="text-2xl sm:text-3xl font-black text-emerald-400 block leading-none">
                  65,610
                </b>
                <span className="text-[11px] sm:text-xs font-semibold text-slate-300 mt-2 block">
                  sq km of island diversity
                </span>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/10 hover:border-white/20 transition-all">
                <b className="text-2xl sm:text-3xl font-black text-emerald-400 block leading-none">
                  8
                </b>
                <span className="text-[11px] sm:text-xs font-semibold text-slate-300 mt-2 block">
                  UNESCO Heritage sites
                </span>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/10 hover:border-white/20 transition-all">
                <b className="text-2xl sm:text-3xl font-black text-emerald-400 block leading-none">
                  1,340
                </b>
                <span className="text-[11px] sm:text-xs font-semibold text-slate-300 mt-2 block">
                  km of tropical coastlines
                </span>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/10 hover:border-white/20 transition-all">
                <b className="text-2xl sm:text-3xl font-black text-emerald-400 block leading-none">
                  365 Days
                </b>
                <span className="text-[11px] sm:text-xs font-semibold text-slate-300 mt-2 block">
                  year-round coastal sunshine
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ━━━ 5. TRAVELER ESSENTIALS & LOCAL INSIGHTS (TripAdvisor style value props) ━━━ */}
      <section className="py-12 sm:py-20 bg-white border-t border-slate-200/80">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Essential tips for your Sri Lanka journey
            </h2>
            <p className="text-slate-500 text-xs sm:text-base font-medium mt-1.5">
              Everything you need to know before stepping onto the island.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#f8fafc] border border-slate-200/80 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#00aa6c] flex items-center justify-center font-bold">
                <Sun className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">
                Two Seasons, Always Sunshine
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                When it’s monsoon season in the Southwest (May–Sept), the East Coast (Arugam Bay, Trincomalee) has glass-flat surf and bright blue skies. Sri Lanka is truly year-round.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-[#f8fafc] border border-slate-200/80 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#00aa6c] flex items-center justify-center font-bold">
                <Train className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">
                Iconic Blue Mountain Trains
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                The famous train ride from Kandy to Ella crosses pine-scented mountains, tea pickers, and the Nine Arch Bridge. Book 30 days in advance or jump on 2nd class unreserved.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-[#f8fafc] border border-slate-200/80 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#00aa6c] flex items-center justify-center font-bold">
                <WifiOff className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">
                100% Offline PWA Ready
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Uncover Ceylon works completely offline without costly roaming SIMs. Save your favorite destinations and routes to access maps and facts in remote jungle locations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ 6. BOTTOM TEASER ━━━ */}
      <section className="border-t border-slate-200 bg-[#f8fafc] py-6 sm:py-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 sm:px-6 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <Compass className="h-5 w-5 text-[#00aa6c] shrink-0" />
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Curated and verified weekly across all 9 provinces by Serandib Co.
            </p>
          </div>
          <Link href="/about" className="text-xs sm:text-sm font-bold text-[#00aa6c] hover:underline">
            Learn more about Serandib Co. →
          </Link>
        </div>
      </section>

    </div>
  );
}
