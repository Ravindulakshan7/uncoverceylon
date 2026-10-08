'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Compass, Sparkles } from 'lucide-react';

export default function HeroSection() {
  const scrollToInterests = () => {
    if (typeof window !== 'undefined') {
      const el = document.getElementById('interests') || document.getElementById('browse-mood');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="w-full px-3 sm:px-6 lg:px-8 pt-2 sm:pt-3 pb-8 sm:pb-12 max-w-[1340px] mx-auto">
      <section className="relative w-full h-[calc(100vh-105px)] min-h-[520px] max-h-[780px] rounded-[24px] sm:rounded-[32px] overflow-hidden isolate shadow-2xl shadow-slate-900/15 group bg-[#0f1b2d]">
        
        {/* ━━━ Background Image with Cinematic Ken Burns Zoom ━━━ */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2000&q=85"
            alt="Lush green highlands and misty tea trails of Sri Lanka"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_42%] scale-105 group-hover:scale-110 transition-transform duration-[20000ms] ease-out"
            unoptimized
          />
        </div>

        {/* ━━━ Soft Multi-Stop Dark Gradient for Razor-Sharp Text Contrast ━━━ */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#0f1b2d]/35 via-[#0f1b2d]/20 via-60% to-[#0f1b2d]/75 pointer-events-none" />

        {/* ━━━ Hero Centered Content ━━━ */}
        <div className="relative z-[2] h-full flex flex-col items-center justify-center text-center px-4 sm:px-6 py-8">
          
          {/* Top Subtle Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs sm:text-[13px] font-bold tracking-wide uppercase mb-4 sm:mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
            <span>Sri Lanka Travel Guide</span>
          </div>

          {/* HUGE WANDER.LK Title */}
          <h1 className="text-[clamp(3.8rem,14vw,11rem)] font-extrabold tracking-[-0.055em] leading-[0.86] text-white inline-flex items-start justify-center gap-[0.06em] drop-shadow-[0_8px_36px_rgba(0,0,0,0.45)] mb-4 sm:mb-6 select-none">
            <span>WANDER</span>
            <span className="text-[0.24em] font-extrabold tracking-[0.03em] mt-[0.52em] text-white/95 bg-white/20 backdrop-blur-md px-2.5 sm:px-3 py-0.5 rounded-xl border border-white/30 shadow-md">
              LK
            </span>
          </h1>

          {/* Refined Subtitle */}
          <p className="text-[clamp(0.92rem,1.25vw,1.1rem)] text-white/90 max-w-xl mx-auto leading-relaxed mb-7 sm:mb-9 font-medium drop-shadow-[0_2px_14px_rgba(0,0,0,0.5)]">
            Discover breathtaking destinations across Sri Lanka with curated tours,
            local insights, and hassle-free planning all in one platform.
          </p>

          {/* Hero Action Buttons */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
            
            {/* Primary Button: "Find Your Vibe" */}
            <button
              type="button"
              onClick={scrollToInterests}
              className="inline-flex items-center gap-2 font-bold text-xs sm:text-sm px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-white text-[#0f1b2d] hover:bg-[#00aa6c] hover:text-white transition-all duration-300 shadow-xl shadow-black/20 hover:shadow-emerald-600/30 hover:-translate-y-0.5 cursor-pointer active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-[#00aa6c] group-hover:text-white" />
              <span>Find Your Vibe</span>
            </button>

            {/* Outline Button: "Explore Destinations" */}
            <Link
              href="/destinations"
              className="inline-flex items-center gap-2 font-bold text-xs sm:text-sm px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/40 hover:border-white backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 cursor-pointer active:scale-95"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Destinations</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

          </div>

        </div>

      </section>
    </div>
  );
}
