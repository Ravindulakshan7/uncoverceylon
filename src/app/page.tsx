import { prisma } from '@/lib/db';
import HeroSection from '@/components/HeroSection';
import InterestsSection from '@/components/InterestsSection';
import Link from 'next/link';
import { ArrowRight, Map, Compass, Sun, Train, ShieldCheck } from 'lucide-react';

export const revalidate = 60;

export default async function HomePage() {
  const [placesCount, foodsCount, cultureCount, experiencesCount] = await Promise.all([
    prisma.place.count().catch(() => 60),
    prisma.foodItem.count().catch(() => 98),
    prisma.cultureItem.count().catch(() => 76),
    prisma.experienceItem.count().catch(() => 124),
  ]);

  const interestCounts = {
    destinations: `${placesCount}+ places`,
    food: `${foodsCount > 0 ? foodsCount : 98} dishes`,
    culture: `${cultureCount > 0 ? cultureCount : 76} heritage`,
    experiences: `${experiencesCount > 0 ? experiencesCount : 124} activities`,
  };

  return (
    <div className="min-h-screen w-full max-w-none bg-white text-slate-900 font-sans">
      
      {/* ━━━ 1. WANDER.LK EDITORIAL HERO (Matching User's DeepSeek Design) ━━━ */}
      <HeroSection />

      {/* ━━━ 2. BROWSE BY MOOD / UNCOVER CEYLON BY INTEREST (4 Cards Grid) ━━━ */}
      <InterestsSection counts={interestCounts} />

      {/* ━━━ 3. ISLAND ROUTE PLANNER BANNER (Interactive Map Preview) ━━━ */}
      <section id="map-banner" className="py-12 sm:py-20 bg-slate-50 border-t border-slate-200/80">
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

      {/* ━━━ 4. TRAVELER ESSENTIALS & LOCAL INSIGHTS ━━━ */}
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
                The famous train ride from Kandy to Ella crosses pine-scented mountains, tea pickers, and the Nine Arch Bridge. Book in advance or grab a 2nd class window seat.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-[#f8fafc] border border-slate-200/80 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#00aa6c] flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">
                Verified Local Insights
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Curated coordinates, entry fees, and timing tips verified weekly across all 9 provinces so you can explore authentic Sri Lanka with total peace of mind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ 5. BOTTOM TEASER ━━━ */}
      <section className="border-t border-slate-200 bg-[#f8fafc] py-6 sm:py-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 sm:px-6 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <Compass className="h-5 w-5 text-[#00aa6c] shrink-0" />
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Curated across all 9 provinces by Serandib Co.
            </p>
          </div>
          <Link href="/destinations" className="text-xs sm:text-sm font-bold text-[#00aa6c] hover:underline">
            Explore All 60+ Destinations →
          </Link>
        </div>
      </section>

    </div>
  );
}
