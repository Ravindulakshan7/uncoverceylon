'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Clock,
  Landmark,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  ChevronDown,
  Layers,
  Heart,
  ArrowLeft,
  Share2,
  Compass,
  ArrowRight
} from 'lucide-react';
import { CultureHeritageItem } from '@/data/cultureData';
import { useWishlist } from '@/context/WishlistContext';

interface CultureDetailClientProps {
  item: CultureHeritageItem;
  relatedItems: CultureHeritageItem[];
}

export default function CultureDetailClient({ item, relatedItems }: CultureDetailClientProps) {
  const router = useRouter();
  const { isCultureSaved, toggleCultureWishlist } = useWishlist();
  const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({
    elements: true,
    etiquette: false,
  });
  const [toastMsg, setToastMsg] = useState<string>('');
  const [showToast, setShowToast] = useState(false);

  const isSaved = isCultureSaved(item.id);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2200);
  };

  const handleToggleSave = () => {
    toggleCultureWishlist(item.id, item.title);
    triggerToast(isSaved ? `Removed "${item.title}" from Saved Heritage` : `Saved "${item.title}" to Heritage! ❤️`);
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
          title: `${item.title} — Uncover Ceylon`,
          text: `Explore the sacred heritage of ${item.title} in Sri Lanka!`,
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
          <Link href="/culture" className="hover:text-[#00aa6c] transition-colors font-medium">
            Culture &amp; Heritage
          </Link>
          <span className="text-[#c0c0c0]">/</span>
          <span className="text-[#000a12] font-bold truncate max-w-[200px] sm:max-w-none">
            {item.title}
          </span>
        </nav>

        {/* ============================================
             HERO SECTION (Warm Human Editorial Style)
             ============================================ */}
        <section className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-6 sm:gap-8 lg:gap-12 py-4 sm:py-8 items-center border-b border-[#f2f2f2] pb-6 sm:pb-10">
          {/* Left Column */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="bg-[#00aa6c] text-white text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider px-3 py-0.5 sm:px-3.5 sm:py-1 rounded-full shadow-xs">
                {item.badge}
              </span>
              <span className="bg-[#fff5d6] text-[#78350f] border border-[#fde68a] text-[11px] sm:text-xs font-bold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full">
                {item.epoch}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-[44px] font-extrabold tracking-[-0.035em] text-[#000a12] leading-[1.15]">
              {item.title}
            </h1>

            {item.sinhalaName && (
              <div className="text-[#008a58] font-bold text-sm sm:text-lg">
                {item.sinhalaName}
              </div>
            )}

            <div className="text-slate-700 font-semibold text-xs sm:text-sm">
              {item.tagline}
            </div>

            <p className="text-[#545454] text-xs sm:text-[15px] leading-relaxed max-w-xl">
              {item.desc}
            </p>

            <div className="pt-3 sm:pt-4 border-t border-[#e9e9e9] flex items-center gap-2 text-xs sm:text-sm text-[#545454]">
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00aa6c] flex-shrink-0" />
              <span>
                Historical Region: <b className="text-[#000a12] font-bold">{item.locations}</b>
              </span>
            </div>
          </div>

          {/* Right Column: Hero Image */}
          <div className="relative rounded-[16px] sm:rounded-[20px] overflow-hidden aspect-[5/4] bg-[#eaeaea] shadow-[0_12px_30px_-15px_rgba(0,0,0,0.2)] sm:shadow-[0_20px_44px_-22px_rgba(0,0,0,0.25)] group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.img}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.onerror = null;
                target.src = `https://picsum.photos/seed/${item.seed}/800/640`;
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
              <span>Living Cultural Treasure</span>
            </span>

            {/* Bottom Right Badge */}
            <span className="absolute bottom-2.5 right-2.5 sm:bottom-3.5 sm:right-3.5 bg-[#000a12] text-white px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold">
              {item.categoryLabel}
            </span>
          </div>
        </section>

        {/* ============================================
             QUICK FACTS BAR (Clock, Epoch, Preservation, Admission)
             ============================================ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 bg-white border border-[#e9e9e9] rounded-[14px] p-2.5 sm:p-4 my-5 sm:my-8 shadow-[0_4px_14px_-8px_rgba(0,0,0,0.06)]">
          {/* Fact 1: Timing */}
          <div className="flex items-center gap-2 sm:gap-3 p-1 sm:p-1.5">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#f7f7f7] text-[#00aa6c] flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#767676]">
                Best Timing
              </div>
              <div className="text-xs sm:text-sm font-bold text-[#000a12] leading-tight truncate max-w-[120px] sm:max-w-none">
                {item.timing}
              </div>
            </div>
          </div>

          {/* Fact 2: Epoch */}
          <div className="flex items-center gap-2 sm:gap-3 p-1 sm:p-1.5">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#f7f7f7] text-[#00aa6c] flex items-center justify-center flex-shrink-0">
              <Landmark className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#767676]">
                Historical Epoch
              </div>
              <div className="text-xs sm:text-sm font-bold text-[#000a12] leading-tight truncate max-w-[120px] sm:max-w-none">
                {item.epoch}
              </div>
            </div>
          </div>

          {/* Fact 3: Preservation */}
          <div className="flex items-center gap-2 sm:gap-3 p-1 sm:p-1.5">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#f7f7f7] text-[#00aa6c] flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#767676]">
                Preservation
              </div>
              <div className="text-xs sm:text-sm font-bold text-[#000a12] leading-tight truncate max-w-[120px] sm:max-w-none">
                {item.preservation}
              </div>
            </div>
          </div>

          {/* Fact 4: Admission */}
          <div className="flex items-center gap-2 sm:gap-3 p-1 sm:p-1.5">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#f7f7f7] text-[#00aa6c] flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#767676]">
                Admission Guide
              </div>
              <div className="text-xs sm:text-sm font-bold text-[#000a12] leading-tight truncate max-w-[120px] sm:max-w-none">
                {item.entryInfo}
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
            
            {/* Section 1: Historical Chronicles & Living Lore */}
            <section className="pb-8 border-b border-[#f2f2f2]">
              <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#00aa6c] mb-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00aa6c]" />
                <span>Historical Chronicles &amp; Living Lore</span>
              </div>
              
              <h2 className="text-2xl sm:text-[26px] font-extrabold tracking-[-0.025em] text-[#000a12] mb-3 leading-tight">
                The Living Story of {item.title}
              </h2>
              
              <p className="text-[#545454] text-sm sm:text-base leading-relaxed">
                {item.heritage}
              </p>

              {/* Amber Ancient Roots Box */}
              {item.ancientRoots && (
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
                      Ancient Roots &amp; Dynastic Origins
                    </h4>
                    <p className="text-xs sm:text-sm text-[#92400e] leading-relaxed">
                      {item.ancientRoots}
                    </p>
                  </div>
                </div>
              )}
            </section>

            {/* Section 2: Architectural & Sacred Anatomy */}
            {item.varieties && item.varieties.length > 0 && (
              <section className="pb-8 border-b border-[#f2f2f2]">
                <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#00aa6c] mb-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00aa6c]" />
                  <span>Anatomy of the Sacred Site</span>
                </div>

                <h2 className="text-2xl sm:text-[26px] font-extrabold tracking-[-0.025em] text-[#000a12] mb-4 leading-tight">
                  Signature Highlights ({item.varieties.length})
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {item.varieties.map((v, idx) => (
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
              {/* Accordion 1: Sacred Architecture & Relic Elements */}
              {item.architecturalElements && (
                <div className="border border-[#e9e9e9] rounded-[14px] overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => toggleAccordion('elements')}
                    className="w-full flex items-center gap-3.5 p-4 sm:p-5 text-left hover:bg-[#f7f7f7] transition-colors cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#e6f7f0] text-[#00aa6c] flex items-center justify-center flex-shrink-0">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm sm:text-base font-extrabold text-[#000a12]">
                        Sacred Architecture &amp; Relic Elements
                      </div>
                      <div className="text-xs text-[#767676] mt-0.5">
                        Granite carvings, hydraulic engineering &amp; timber craft
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-[#767676] transition-transform duration-300 ${
                        openAccordions.elements ? 'rotate-180 text-[#00aa6c]' : ''
                      }`}
                    />
                  </button>
                  {openAccordions.elements && (
                    <div className="px-5 pb-5 text-sm text-[#545454] leading-relaxed border-t border-[#f2f2f2] pt-4">
                      {item.architecturalElements}
                    </div>
                  )}
                </div>
              )}

              {/* Accordion 2: Etiquette & Visitor Wisdom */}
              {item.etiquetteTips && (
                <div className="border border-[#e9e9e9] rounded-[14px] overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => toggleAccordion('etiquette')}
                    className="w-full flex items-center gap-3.5 p-4 sm:p-5 text-left hover:bg-[#f7f7f7] transition-colors cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#e6f7f0] text-[#00aa6c] flex items-center justify-center flex-shrink-0">
                      <Compass className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm sm:text-base font-extrabold text-[#000a12]">
                        Sacred Etiquette &amp; Pilgrim Wisdom
                      </div>
                      <div className="text-xs text-[#767676] mt-0.5">
                        Temple dress codes, shoe protocol &amp; respectful postures
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-[#767676] transition-transform duration-300 ${
                        openAccordions.etiquette ? 'rotate-180 text-[#00aa6c]' : ''
                      }`}
                    />
                  </button>
                  {openAccordions.etiquette && (
                    <div className="px-5 pb-5 text-sm text-[#545454] leading-relaxed border-t border-[#f2f2f2] pt-4">
                      {item.etiquetteTips}
                    </div>
                  )}
                </div>
              )}
            </section>

          </main>

          {/* Sticky Sidebar */}
          <aside className="space-y-5 lg:sticky lg:top-24">
            
            {/* Quick Info Card */}
            <div className="bg-[#f7f7f7] border border-[#e9e9e9] rounded-[16px] p-5 space-y-4">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#000a12]">
                Heritage Dossier
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[#767676] block font-semibold">Location &amp; Province</span>
                  <span className="font-bold text-[#000a12] block mt-0.5">{item.locations}</span>
                </div>

                <div className="pt-2 border-t border-[#e9e9e9]">
                  <span className="text-[#767676] block font-semibold">Historical Period</span>
                  <span className="font-bold text-[#000a12] block mt-0.5">{item.epoch}</span>
                </div>

                <div className="pt-2 border-t border-[#e9e9e9]">
                  <span className="text-[#767676] block font-semibold">Dress Code</span>
                  <span className="font-bold text-[#000a12] block mt-0.5">{item.dressCode}</span>
                </div>

                <div className="pt-2 border-t border-[#e9e9e9]">
                  <span className="text-[#767676] block font-semibold">Preservation Status</span>
                  <span className="font-bold text-[#008a58] block mt-0.5">{item.preservation}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleToggleSave}
                  className={`w-full py-3 rounded-full text-xs font-black tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shadow-sm ${
                    isSaved
                      ? 'bg-[#000a12] text-white hover:bg-black'
                      : 'bg-[#ff3347] hover:bg-[#e11d33] text-white shadow-[0_4px_14px_rgba(255,51,71,0.35)]'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
                  <span>{isSaved ? 'Saved to Heritage' : 'Save to Heritage Wishlist'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="w-full py-2.5 rounded-full text-xs font-bold bg-white hover:bg-[#eaeaea] text-[#000a12] border border-[#e0e0e0] flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Heritage Site</span>
                </button>
              </div>
            </div>

            {/* Back link */}
            <div className="text-center">
              <Link
                href="/culture"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#767676] hover:text-[#00aa6c] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to All Heritage Sites</span>
              </Link>
            </div>

          </aside>

        </div>

        {/* ============================================
             RELATED HERITAGE SITES
             ============================================ */}
        {relatedItems.length > 0 && (
          <section className="pt-10 border-t border-[#f2f2f2] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <span className="text-[#00aa6c] text-xs font-black uppercase tracking-wider">
                  Ancient Island Wonder
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold tracking-[-0.025em] text-[#000a12] mt-0.5">
                  More Sacred Heritage to Explore
                </h3>
              </div>
              <Link
                href="/culture"
                className="text-xs sm:text-sm font-bold text-[#00aa6c] hover:underline flex items-center gap-1"
              >
                <span>View all sites</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-5">
              {relatedItems.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/culture/${rel.id}`}
                  className="group block bg-[#f7f7f7] border border-[#e9e9e9] rounded-2xl overflow-hidden hover:bg-white hover:shadow-lg transition-all"
                >
                  <div className="aspect-[4/3] bg-[#eaeaea] overflow-hidden relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={rel.img}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2 left-2 bg-[#000a12]/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {rel.categoryLabel}
                    </span>
                  </div>
                  <div className="p-3 sm:p-4">
                    <h4 className="text-xs sm:text-sm font-extrabold text-[#000a12] group-hover:text-[#00aa6c] transition-colors truncate">
                      {rel.title}
                    </h4>
                    <p className="text-[11px] text-[#767676] mt-0.5 truncate">
                      {rel.sub}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ============================================
             BOTTOM CTA BANNER (Warm Human Travel Feel)
             ============================================ */}
        <section className="mt-14 bg-gradient-to-br from-[#002b11] to-[#01471d] rounded-3xl p-7 sm:p-12 text-white text-center relative overflow-hidden isolate shadow-xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-400/30">
              <Compass className="w-3.5 h-3.5" />
              <span>Sacred Island Journeys</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Walk in the Footsteps of Ancient Kings
            </h2>
            <p className="text-white/80 text-xs sm:text-base leading-relaxed">
              From the mist-shrouded ruins of Anuradhapura to sacred cave temples painted two millennia ago, discover the spiritual soul of Ceylon.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/culture"
                className="px-6 py-3 rounded-full bg-emerald-400 hover:bg-emerald-300 text-[#002b11] font-bold text-xs sm:text-sm transition-all shadow-md"
              >
                Browse All Heritage Sites
              </Link>
              <Link
                href="/map"
                className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm transition-all border border-white/20"
              >
                View on Interactive Map
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
