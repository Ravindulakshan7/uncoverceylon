import { prisma } from '@/lib/db';
import HeroSection from '@/components/HeroSection';
import InterestsSection from '@/components/InterestsSection';
import TopDestinationsSection from '@/components/TopDestinationsSection';
import AiTripPlannerSection from '@/components/AiTripPlannerSection';
import ProvincesSection from '@/components/ProvincesSection';
import CuratedItinerariesSection from '@/components/CuratedItinerariesSection';
import WeatherSeasonSection from '@/components/WeatherSeasonSection';
import CeylonFlavorsSection from '@/components/CeylonFlavorsSection';
import TravelerReviewsSection from '@/components/TravelerReviewsSection';
import Link from 'next/link';
import { ArrowRight, Map, Compass, Sun, Train, ShieldCheck } from 'lucide-react';

export const revalidate = 60;

export default async function HomePage() {
  const [placesCount, foodsCount, cultureCount, experiencesCount, topPlacesRaw] = await Promise.all([
    prisma.place.count().catch(() => 60),
    prisma.foodItem.count().catch(() => 98),
    prisma.cultureItem.count().catch(() => 76),
    prisma.experienceItem.count().catch(() => 124),
    prisma.place
      .findMany({
        take: 8,
        orderBy: [{ featured: 'desc' }, { rating: 'desc' }],
      })
      .catch(() => []),
  ]);

  const interestCounts = {
    destinations: `${placesCount}+ places`,
    food: `${foodsCount > 0 ? foodsCount : 98} dishes`,
    culture: `${cultureCount > 0 ? cultureCount : 76} heritage`,
    experiences: `${experiencesCount > 0 ? experiencesCount : 124} activities`,
  };

  const topDestinations = topPlacesRaw.map((p) => ({
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
      <HeroSection />

      {/* ━━━ 2. UNCOVER CEYLON BY INTEREST (4 Cards Grid) ━━━ */}
      <InterestsSection counts={interestCounts} />

      {/* ━━━ 3. TOP DESTINATIONS (Positioned in middle of SS 2, matching SS 1 design) ━━━ */}
      <TopDestinationsSection destinations={topDestinations} />

      {/* ━━━ 4. AI TRIP PLANNER / SMART ASSISTANT ━━━ */}
      <AiTripPlannerSection />

      {/* ━━━ 5. ISLAND ROUTE PLANNER BANNER (Glassmorphism DeepSeek Redesign) ━━━ */}
      <section
        id="map-banner"
        className="py-14 sm:py-24 border-t border-slate-200/80 relative overflow-hidden"
        style={{
          backgroundColor: '#eef2f5',
          backgroundImage: `
            radial-gradient(circle at 15% 20%, rgba(203, 213, 225, 0.5) 0%, transparent 45%),
            radial-gradient(circle at 85% 80%, rgba(16, 185, 129, 0.08) 0%, transparent 45%),
            radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.6) 0%, transparent 60%)
          `,
        }}
      >
        <div className="w-[min(1240px,92%)] mx-auto">
          <div
            className="relative rounded-[24px] sm:rounded-[32px] overflow-hidden isolate p-6 sm:p-10 lg:p-14 border border-white/70"
            style={{
              background: 'rgba(255, 255, 255, 0.55)',
              backdropFilter: 'blur(28px) saturate(180%)',
              WebkitBackdropFilter: 'blur(28px) saturate(180%)',
              boxShadow:
                '0 30px 60px -30px rgba(15, 27, 45, 0.20), 0 8px 24px -12px rgba(15, 27, 45, 0.10), inset 0 1px 0 rgba(255, 255, 255, 0.9), inset 0 -1px 0 rgba(255, 255, 255, 0.4)',
            }}
          >
            {/* Soft colored orbs behind glass */}
            <div
              className="absolute -top-[180px] -right-[120px] w-[420px] h-[420px] rounded-full blur-[40px] pointer-events-none z-0"
              style={{ background: 'radial-gradient(circle, rgba(16, 185, 129, 0.20) 0%, transparent 65%)' }}
            />
            <div
              className="absolute -bottom-[160px] -left-[100px] w-[360px] h-[360px] rounded-full blur-[40px] pointer-events-none z-0"
              style={{ background: 'radial-gradient(circle, rgba(148, 163, 184, 0.35) 0%, transparent 65%)' }}
            />

            {/* Inner Content Grid */}
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-8 lg:gap-14 items-center">
              
              {/* Left Side */}
              <div className="max-w-[520px]">
                <div
                  className="inline-flex items-center gap-2 text-[12px] sm:text-[13px] font-bold text-[#475569] px-4 py-2 rounded-full mb-5 sm:mb-6 border border-white/90 shadow-[0_2px_8px_rgba(15,27,45,0.05),inset_0_1px_0_rgba(255,255,255,1)]"
                  style={{
                    background: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                  }}
                >
                  <Map className="w-3.5 h-3.5 text-[#10b981] shrink-0" />
                  <span>Island Route Planner</span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight leading-[1.06] text-[#0f1b2d] mb-4 sm:mb-5">
                  Plan your route across the island
                </h2>

                <p className="text-[#64748b] text-[15px] sm:text-base leading-relaxed mb-6 sm:mb-8 max-w-[480px]">
                  Sri Lanka is beautifully compact. You can surf turquoise morning waves, ride scenic misty tea trains, and explore ancient Buddhist kingdoms in a single trip.
                </p>

                <Link
                  href="/map"
                  className="group inline-flex items-center gap-3 font-bold text-[14px] sm:text-[15px] text-white px-7 py-3.5 sm:py-4 rounded-full transition-all duration-300 active:scale-95 cursor-pointer shadow-[0_12px_26px_-10px_rgba(16,185,129,0.50),0_4px_12px_-4px_rgba(16,185,129,0.28),inset_0_1px_0_rgba(255,255,255,0.4)] hover:shadow-[0_20px_40px_-10px_rgba(16,185,129,0.55),0_6px_16px_-4px_rgba(16,185,129,0.35),inset_0_1px_0_rgba(255,255,255,0.45)] hover:-translate-y-0.5"
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  }}
                >
                  <span>Open interactive 9-province map</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>

              {/* Right Side - 4 Glass Stat Cards */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {[
                  { value: '65,610', label: 'sq km of island diversity' },
                  { value: '8', label: 'UNESCO Heritage sites' },
                  { value: '1,340', label: 'km of tropical coastlines' },
                  { value: '365 Days', label: 'year-round coastal sunshine' },
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    className="group relative rounded-[18px] p-4 sm:p-6 border border-white/85 hover:border-white transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                    style={{
                      background: 'rgba(255, 255, 255, 0.55)',
                      backdropFilter: 'blur(20px) saturate(160%)',
                      WebkitBackdropFilter: 'blur(20px) saturate(160%)',
                      boxShadow:
                        '0 8px 20px -10px rgba(15, 27, 45, 0.12), 0 2px 6px -2px rgba(15, 27, 45, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.95), inset 0 -1px 0 rgba(255, 255, 255, 0.5)',
                    }}
                  >
                    {/* Top highlight sheen */}
                    <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/35 to-transparent rounded-t-[18px] pointer-events-none" />
                    {/* Tiny green dot accent */}
                    <div className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 w-1.5 h-1.5 rounded-full bg-[#10b981] shadow-[0_0_0_3px_rgba(16,185,129,0.15),0_0_12px_rgba(16,185,129,0.4)]" />

                    <b className="relative z-10 block text-2xl sm:text-3xl lg:text-[34px] font-extrabold tracking-tight leading-none text-[#0f1b2d] group-hover:text-[#059669] transition-colors duration-300 mb-2 sm:mb-2.5">
                      {stat.value}
                    </b>
                    <span className="relative z-10 block text-xs sm:text-[13px] text-[#64748b] font-medium leading-snug">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ━━━ 6. EXPLORE BY 9 ISLAND PROVINCES ━━━ */}
      <ProvincesSection />

      {/* ━━━ 7. HANDPICKED CURATED ITINERARIES (3, 5, 7, 10 Days) ━━━ */}
      <CuratedItinerariesSection />

      {/* ━━━ 8. LIVE WEATHER & DUAL-MONSOON CLIMATE GUIDE ━━━ */}
      <WeatherSeasonSection />

      {/* ━━━ 9. AUTHENTIC CEYLON FLAVORS & TEA SPOTLIGHT ━━━ */}
      <CeylonFlavorsSection />

      {/* ━━━ 10. TRAVELER REVIEWS & STORIES ━━━ */}
      <TravelerReviewsSection />

      {/* ━━━ 11. TRAVELER ESSENTIALS & LOCAL INSIGHTS ━━━ */}
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

      {/* ━━━ 12. BOTTOM TEASER ━━━ */}
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
