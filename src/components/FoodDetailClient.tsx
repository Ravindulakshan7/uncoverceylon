'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Flame,
  Clock,
  Utensils,
  DollarSign,
  MapPin,
  ChevronDown,
  Layers,
  Heart,
  ArrowLeft,
  Share2,
  Check,
  Compass
} from 'lucide-react';
import { FoodDishItem } from '@/data/foodsData';
import { useWishlist } from '@/context/WishlistContext';

interface FoodDetailClientProps {
  dish: FoodDishItem;
  relatedDishes: FoodDishItem[];
}

export default function FoodDetailClient({ dish, relatedDishes }: FoodDetailClientProps) {
  const router = useRouter();
  const { isFoodSaved, toggleFoodWishlist } = useWishlist();
  const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({
    ingredients: true,
    howToEat: false,
  });
  const [toastMsg, setToastMsg] = useState<string>('');
  const [showToast, setShowToast] = useState(false);

  const isSaved = isFoodSaved(dish.id);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2200);
  };

  const handleToggleSave = () => {
    toggleFoodWishlist(dish.id, dish.title);
    triggerToast(isSaved ? `Removed "${dish.title}" from Saved` : `Saved "${dish.title}" to Flavors! ❤️`);
  };

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${dish.title} — Uncover Ceylon`,
          text: `Check out authentic ${dish.title} in Sri Lanka!`,
          url,
        });
        return;
      } catch {}
    }
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      triggerToast('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#000a12] font-['Plus_Jakarta_Sans',system-ui,-apple-system,sans-serif] antialiased">
      {/* Toast popup */}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] bg-[#000a12] text-white px-5 py-3 rounded-full text-sm font-bold shadow-2xl flex items-center gap-2 transition-all duration-300 pointer-events-none ${
          showToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-[#00aa6c]" />
        <span>{toastMsg}</span>
      </div>

      <div className="w-full max-w-[1240px] mx-auto px-3.5 sm:px-6 pt-3 sm:pt-6 pb-16 sm:pb-20">
        
        {/* ============================================
             BREADCRUMB
             ============================================ */}
        <nav aria-label="Breadcrumb" className="py-2.5 sm:py-3 text-[11px] sm:text-sm text-[#767676] flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <Link href="/" className="hover:text-[#00aa6c] transition-colors font-medium">
            Home
          </Link>
          <span className="text-[#c0c0c0]">/</span>
          <Link href="/food" className="hover:text-[#00aa6c] transition-colors font-medium">
            Food &amp; Flavors
          </Link>
          <span className="text-[#c0c0c0]">/</span>
          <span className="text-[#000a12] font-bold truncate max-w-[200px] sm:max-w-none">
            {dish.title}
          </span>
        </nav>

        {/* ============================================
             HERO SECTION (Matching reference HTML)
             ============================================ */}
        <section className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-6 sm:gap-8 lg:gap-12 py-4 sm:py-8 items-center border-b border-[#f2f2f2] pb-6 sm:pb-10">
          {/* Left Column */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="bg-[#00aa6c] text-white text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider px-3 py-0.5 sm:px-3.5 sm:py-1 rounded-full shadow-xs">
                Must Try
              </span>
              <span className="bg-[#fff5d6] text-[#78350f] border border-[#fde68a] text-[11px] sm:text-xs font-bold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full">
                {dish.cuisine} · {dish.meal}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-[44px] font-extrabold tracking-[-0.035em] text-[#000a12] leading-[1.15]">
              {dish.title}
            </h1>

            <div className="text-[#008a58] font-bold text-sm sm:text-lg">
              {dish.tagline}
            </div>

            <p className="text-[#545454] text-xs sm:text-[15px] leading-relaxed max-w-xl">
              {dish.desc}
            </p>

            <div className="pt-3 sm:pt-4 border-t border-[#e9e9e9] flex items-center gap-2 text-xs sm:text-sm text-[#545454]">
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00aa6c] flex-shrink-0" />
              <span>
                Popular Locations: <b className="text-[#000a12] font-bold">{dish.locations}</b>
              </span>
            </div>
          </div>

          {/* Right Column: Hero Image */}
          <div className="relative rounded-[16px] sm:rounded-[20px] overflow-hidden aspect-[5/4] bg-[#eaeaea] shadow-[0_12px_30px_-15px_rgba(0,0,0,0.2)] sm:shadow-[0_20px_44px_-22px_rgba(0,0,0,0.25)] group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={dish.img}
              alt={dish.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.onerror = null;
                target.src = `https://picsum.photos/seed/${dish.seed}/800/640`;
              }}
            />

            {/* Save Button Top Right */}
            <button
              type="button"
              onClick={handleToggleSave}
              className={`absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 z-10 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-[11px] sm:text-xs font-black tracking-wide transition-all shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                isSaved
                  ? 'bg-[#000a12] text-white hover:bg-black'
                  : 'bg-[#ff3347] text-white hover:bg-[#e11d33] shadow-[0_4px_14px_rgba(255,51,71,0.35)]'
              }`}
            >
              <Heart className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isSaved ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>

            {/* Bottom Left Badge */}
            <span className="absolute bottom-2.5 left-2.5 sm:bottom-3.5 sm:left-3.5 bg-white/95 backdrop-blur-md px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold text-[#000a12] shadow-sm flex items-center gap-1 sm:gap-1.5">
              <span className="text-[#00aa6c] font-black">✦</span>
              <span>Authentic Ceylon Recipe</span>
            </span>

            {/* Bottom Right Meal Badge */}
            <span className="absolute bottom-2.5 right-2.5 sm:bottom-3.5 sm:right-3.5 bg-[#000a12] text-white px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold">
              {dish.meal}
            </span>
          </div>
        </section>

        {/* ============================================
             QUICK FACTS BAR (Flame, Clock, Utensils, Dollar: 2x2 on Mobile)
             ============================================ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 bg-white border border-[#e9e9e9] rounded-[14px] p-2.5 sm:p-4 my-5 sm:my-8 shadow-[0_4px_14px_-8px_rgba(0,0,0,0.06)]">
          {/* Fact 1: Spice */}
          <div className="flex items-center gap-2 sm:gap-3 p-1 sm:p-1.5">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#f7f7f7] text-[#00aa6c] flex items-center justify-center flex-shrink-0">
              <Flame className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#767676]">
                Spice Intensity
              </div>
              <div className="text-xs sm:text-sm font-bold text-[#000a12] leading-tight truncate max-w-[120px] sm:max-w-none">
                {dish.spice}
              </div>
            </div>
          </div>

          {/* Fact 2: Meal Time */}
          <div className="flex items-center gap-2 sm:gap-3 p-1 sm:p-1.5">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#f7f7f7] text-[#00aa6c] flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#767676]">
                Best Meal Time
              </div>
              <div className="text-xs sm:text-sm font-bold text-[#000a12] leading-tight">
                {dish.meal}
              </div>
            </div>
          </div>

          {/* Fact 3: Serving */}
          <div className="flex items-center gap-2 sm:gap-3 p-1 sm:p-1.5">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#f7f7f7] text-[#00aa6c] flex items-center justify-center flex-shrink-0">
              <Utensils className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#767676]">
                Traditional Serving
              </div>
              <div className="text-xs sm:text-sm font-bold text-[#000a12] leading-tight truncate max-w-[120px] sm:max-w-none">
                {dish.serving}
              </div>
            </div>
          </div>

          {/* Fact 4: Price */}
          <div className="flex items-center gap-2 sm:gap-3 p-1 sm:p-1.5">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#f7f7f7] text-[#00aa6c] flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#767676]">
                Price Expectation
              </div>
              <div className="text-xs sm:text-sm font-bold text-[#000a12] leading-tight">
                {dish.price}
                <span className="block text-[10px] sm:text-[11px] font-normal text-[#767676]">Approx. local</span>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================
             MAIN 2-COLUMN LAYOUT (1fr 320px)
             ============================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 lg:gap-12 pb-14 items-start">
          
          {/* Main Content Column */}
          <main className="space-y-8">
            
            {/* Section 1: Culinary History & Heritage */}
            {dish.heritage && (
              <section className="pb-8 border-b border-[#f2f2f2]">
                <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#00aa6c] mb-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00aa6c]" />
                  <span>Culinary History &amp; Heritage</span>
                </div>
                
                <h2 className="text-2xl sm:text-[26px] font-extrabold tracking-[-0.025em] text-[#000a12] mb-3 leading-tight">
                  The Heritage Story of {dish.title}
                </h2>
                
                <p className="text-[#545454] text-sm sm:text-base leading-relaxed">
                  {dish.heritage}
                </p>

                {/* Amber Ancient Roots Box */}
                <div className="bg-[#fffbeb] border-l-4 border-[#f59e0b] rounded-r-xl p-4 sm:p-5 mt-5 flex gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-[#fef3c7] text-[#b45309] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-[#78350f] mb-1">
                      Ancient Roots
                    </h4>
                    <p className="text-xs sm:text-sm text-[#92400e] leading-relaxed">
                      Dating back over two millennia, this dish is part of Sri Lanka&apos;s living culinary heritage — cooked in village clay pots and passed down through generations.
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* Section 2: Signature Varieties Grid */}
            {dish.varieties && dish.varieties.length > 0 && (
              <section className="pb-8 border-b border-[#f2f2f2]">
                <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#00aa6c] mb-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00aa6c]" />
                  <span>Anatomy of the Dish</span>
                </div>

                <h2 className="text-2xl sm:text-[26px] font-extrabold tracking-[-0.025em] text-[#000a12] mb-4 leading-tight">
                  Signature Varieties ({dish.varieties.length})
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {dish.varieties.map((v, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-[#f7f7f7] border border-[#e9e9e9] rounded-xl hover:bg-white hover:shadow-[0_8px_20px_-12px_rgba(0,0,0,0.1)] transition-all"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <h4 className="text-sm sm:text-base font-extrabold text-[#000a12] tracking-tight">
                          {v.name}
                        </h4>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white text-[#00aa6c] border border-[#e9e9e9]">
                          {v.tag}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-[#545454] leading-relaxed">
                        {v.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Section 3: Interactive Accordions */}
            <section className="space-y-3 pt-2">
              {/* Accordion 1: Core Ingredients */}
              {dish.ingredients && (
                <div className="border border-[#e9e9e9] rounded-[14px] overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => toggleAccordion('ingredients')}
                    className="w-full flex items-center gap-3.5 p-4 sm:p-5 text-left hover:bg-[#f7f7f7] transition-colors cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#e6f7f0] text-[#00aa6c] flex items-center justify-center flex-shrink-0">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm sm:text-base font-extrabold text-[#000a12]">
                        Core Ingredients &amp; Natural Spices
                      </div>
                      <div className="text-xs text-[#767676] mt-0.5">
                        Aromatic island spices, coconut extracts, and fresh herbs
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-[#767676] transition-transform duration-300 ${
                        openAccordions.ingredients ? 'rotate-180 text-[#00aa6c]' : ''
                      }`}
                    />
                  </button>
                  {openAccordions.ingredients && (
                    <div className="px-5 pb-5 text-sm text-[#545454] leading-relaxed border-t border-[#f2f2f2] pt-4">
                      {dish.ingredients}
                    </div>
                  )}
                </div>
              )}

              {/* Accordion 2: How to Eat */}
              {dish.howToEat && (
                <div className="border border-[#e9e9e9] rounded-[14px] overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => toggleAccordion('howToEat')}
                    className="w-full flex items-center gap-3.5 p-4 sm:p-5 text-left hover:bg-[#f7f7f7] transition-colors cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#e6f7f0] text-[#00aa6c] flex items-center justify-center flex-shrink-0">
                      <Utensils className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm sm:text-base font-extrabold text-[#000a12]">
                        How to Eat &amp; Order Like a Local
                      </div>
                      <div className="text-xs text-[#767676] mt-0.5">
                        Dining etiquette, ordering phrases, heat levels &amp; drink pairings
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-[#767676] transition-transform duration-300 ${
                        openAccordions.howToEat ? 'rotate-180 text-[#00aa6c]' : ''
                      }`}
                    />
                  </button>
                  {openAccordions.howToEat && (
                    <div className="px-5 pb-5 text-sm text-[#545454] leading-relaxed border-t border-[#f2f2f2] pt-4">
                      {dish.howToEat}
                    </div>
                  )}
                </div>
              )}
            </section>

          </main>

          {/* Sticky Sidebar */}
          <aside className="lg:sticky lg:top-24 space-y-4">
            <div className="border border-[#e9e9e9] rounded-[14px] p-5 bg-white shadow-sm">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#b45309] bg-[#fef3c7] px-2.5 py-0.5 rounded-full mb-3.5">
                Must Try
              </span>

              {/* Mini Image */}
              <div className="aspect-[16/10] rounded-xl overflow-hidden bg-[#eaeaea] mb-3.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={dish.img}
                  alt={dish.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.onerror = null;
                    target.src = `https://picsum.photos/seed/${dish.seed}/400/250`;
                  }}
                />
              </div>

              <h3 className="text-lg font-extrabold text-[#000a12] leading-snug mb-1">
                {dish.title}
              </h3>
              <p className="text-xs font-semibold text-[#767676] mb-3.5">
                {dish.tagline}
              </p>

              {/* Info Table */}
              <div className="py-3 border-y border-[#f2f2f2] space-y-2 text-xs mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-[#767676]">Spice Level</span>
                  <span className="font-bold text-[#000a12]">{dish.spice}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#767676]">Best Time</span>
                  <span className="font-bold text-[#000a12]">{dish.meal}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#767676]">Est. Price</span>
                  <span className="font-bold text-[#000a12]">{dish.price}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#767676]">Region</span>
                  <span className="font-bold text-[#000a12] text-right truncate max-w-[160px]">
                    {dish.locations}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                {/* Save to Wishlist Button */}
                <button
                  type="button"
                  onClick={handleToggleSave}
                  className={`w-full py-3 px-4 rounded-full text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isSaved
                      ? 'bg-[#000a12] text-white shadow-md hover:bg-black'
                      : 'bg-[#ff3347] text-white hover:bg-[#e11d33] shadow-[0_4px_14px_rgba(255,51,71,0.35)]'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
                  <span>{isSaved ? 'Saved to Flavors' : 'Save to Flavors'}</span>
                </button>

                {/* Explore Food Destinations Button */}
                <Link
                  href="/map"
                  className="w-full py-3 px-4 rounded-full text-xs sm:text-sm font-bold bg-[#00aa6c] text-white hover:bg-[#008a58] transition-colors flex items-center justify-center gap-2 shadow-[0_8px_20px_-8px_rgba(0,170,108,0.45)]"
                >
                  <Compass className="w-4 h-4" />
                  <span>Explore Food Destinations</span>
                </Link>

                {/* Back to Food & Flavors Button */}
                <Link
                  href="/food"
                  className="w-full py-3 px-4 rounded-full text-xs sm:text-sm font-bold bg-white text-[#000a12] border border-[#e9e9e9] hover:bg-[#f7f7f7] hover:border-[#cfcfcf] transition-all flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Food &amp; Flavors</span>
                </Link>
              </div>
            </div>
          </aside>

        </div>

        {/* ============================================
             RELATED DISHES SECTION (3-column grid)
             ============================================ */}
        {relatedDishes && relatedDishes.length > 0 && (
          <section className="pt-10 border-t border-[#f2f2f2]">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#00aa6c] block mb-1">
                  Continue Tasting Ceylon
                </span>
                <h2 className="text-2xl sm:text-[26px] font-extrabold tracking-[-0.025em] text-[#000a12]">
                  More Iconic Island Dishes
                </h2>
              </div>
              <Link
                href="/food"
                className="text-xs sm:text-sm font-bold text-[#00aa6c] hover:underline inline-flex items-center gap-1"
              >
                <span>View All Food Pillars</span>
                <span>→</span>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-5">
              {relatedDishes.map((rel, idx) => (
                <article
                  key={rel.id}
                  className={`group border border-[#e9e9e9] rounded-[12px] sm:rounded-[14px] overflow-hidden bg-white hover:-translate-y-1 hover:shadow-[0_16px_36px_-18px_rgba(0,0,0,0.18)] transition-all duration-300 flex flex-col ${
                    idx === 2 ? 'col-span-2 md:col-span-1' : ''
                  }`}
                >
                  <Link href={`/food/${rel.id}`} className="block flex-1 flex flex-col">
                    <div className="relative aspect-[4/3] bg-[#eaeaea] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={rel.img}
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.onerror = null;
                          target.src = `https://picsum.photos/seed/${rel.seed}/600/450`;
                        }}
                      />
                      <span className="absolute top-2 left-2 sm:top-3 sm:left-3 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-white text-[#000a12] shadow-sm">
                        {rel.cuisine}
                      </span>
                    </div>

                    <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#767676] mb-0.5 sm:mb-1 truncate">
                          {rel.tagline}
                        </div>
                        <h4 className="text-xs sm:text-base font-extrabold text-[#000a12] leading-tight sm:leading-snug mb-1 sm:mb-2 group-hover:text-[#00aa6c] transition-colors line-clamp-1 sm:line-clamp-none">
                          {rel.title}
                        </h4>
                        <p className="text-[11px] sm:text-xs text-[#545454] line-clamp-2 leading-relaxed mb-2 sm:mb-4">
                          {rel.desc}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-[11px] sm:text-xs pt-2 sm:pt-3 border-t border-[#f2f2f2]">
                        <span className="text-[#767676] truncate max-w-[100px] sm:max-w-[150px]">
                          {rel.locations.split(' · ')[0]}
                        </span>
                        <span className="font-bold text-[#00aa6c] flex items-center gap-0.5">
                          View →
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
