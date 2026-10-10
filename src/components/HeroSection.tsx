'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Compass, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

const HERO_PLACES = [
  {
    id: 1,
    title: 'Sigiriya Rock Fortress',
    province: 'Central Province',
    tag: 'Ancient Citadel',
    image: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=2400&q=85',
  },
  {
    id: 2,
    title: 'Nine Arch Bridge, Ella',
    province: 'Uva Province',
    tag: 'Scenic Railway',
    image: 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=2400&q=85',
  },
  {
    id: 3,
    title: 'Coconut Tree Hill, Mirissa',
    province: 'Southern Coast',
    tag: 'Tropical Shores',
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=2400&q=85',
  },
  {
    id: 4,
    title: 'Misty Tea Country, Nuwara Eliya',
    province: 'Central Highlands',
    tag: 'Emerald Valleys',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2400&q=85',
  },
  {
    id: 5,
    title: 'Historic Galle Fort Lighthouse',
    province: 'Southern Coast',
    tag: 'Maritime Citadel',
    image: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=2400&q=85',
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_PLACES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_PLACES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_PLACES.length) % HERO_PLACES.length);
  };

  const scrollToInterests = () => {
    if (typeof window !== 'undefined') {
      const el = document.getElementById('interests') || document.getElementById('browse-mood');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="w-full px-2 sm:px-4 md:px-6 pt-1 sm:pt-2 pb-6 sm:pb-10 max-w-none">
      <section className="relative w-full h-[calc(100vh-84px)] min-h-[580px] max-h-[860px] rounded-[28px] sm:rounded-[36px] md:rounded-[44px] overflow-hidden isolate shadow-2xl shadow-slate-950/25 group bg-[#0f1b2d]">
        
        {/* ━━━ Multi-Photo Destination Carousel with Smooth Crossfade & Ken Burns ━━━ */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {HERO_PLACES.map((place, idx) => (
            <div
              key={place.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <Image
                src={place.image}
                alt={place.title}
                fill
                priority={idx === 0}
                sizes="100vw"
                className={`object-cover object-[center_42%] transition-transform duration-[8000ms] ease-out ${
                  idx === currentSlide ? 'scale-108' : 'scale-100'
                }`}
                unoptimized
              />
            </div>
          ))}
        </div>

        {/* ━━━ Soft Multi-Stop Dark Gradient for Razor-Sharp Text Contrast ━━━ */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#0f1b2d]/45 via-[#0f1b2d]/20 via-60% to-[#0f1b2d]/80 pointer-events-none" />

        {/* ━━━ Hero Centered Content ━━━ */}
        <div className="relative z-[2] h-full flex flex-col items-center justify-center text-center px-4 sm:px-6 py-8">
          
          {/* Top Subtle Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs sm:text-[13px] font-bold tracking-wide uppercase mb-4 sm:mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
            <span>Sri Lanka Travel Guide</span>
          </div>

          {/* HUGE WANDER.LK Title */}
          <h1 className="text-[clamp(3.8rem,14vw,11rem)] font-extrabold tracking-[-0.055em] leading-[0.86] text-white inline-flex items-start justify-center gap-[0.06em] drop-shadow-[0_8px_36px_rgba(0,0,0,0.5)] mb-4 sm:mb-6 select-none">
            <span>WANDER</span>
            <span className="text-[0.24em] font-extrabold tracking-[0.03em] mt-[0.52em] text-white/95 bg-white/20 backdrop-blur-md px-2.5 sm:px-3 py-0.5 rounded-xl border border-white/30 shadow-md">
              LK
            </span>
          </h1>

          {/* Refined Subtitle */}
          <p className="text-[clamp(0.92rem,1.25vw,1.1rem)] text-white/90 max-w-xl mx-auto leading-relaxed mb-7 sm:mb-9 font-medium drop-shadow-[0_2px_14px_rgba(0,0,0,0.55)]">
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
              <Compass className="w-4 h-4 text-[#00aa6c] group-hover:text-white" />
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

        {/* ━━━ Bottom Left: Current Sri Lankan Place Pill ━━━ */}
        <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-10 z-10 hidden sm:flex items-center gap-2.5 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white shadow-lg pointer-events-none">
          <MapPin className="w-3.5 h-3.5 text-[#3ddc9a] shrink-0" />
          <span className="text-xs font-bold tracking-wide">
            {HERO_PLACES[currentSlide].title}
          </span>
          <span className="text-[11px] text-white/70 font-medium">
            · {HERO_PLACES[currentSlide].province}
          </span>
        </div>

        {/* ━━━ Bottom Right: Interactive Slide Dots & Arrows ━━━ */}
        <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-10 z-10 flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous slide"
            className="w-8 h-8 rounded-full bg-black/30 hover:bg-black/60 text-white/80 hover:text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all cursor-pointer active:scale-90"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5 px-2">
            {HERO_PLACES.map((place, idx) => (
              <button
                key={place.id}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  idx === currentSlide
                    ? 'w-6 h-2 bg-white'
                    : 'w-2 h-2 bg-white/40 hover:bg-white/75'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next slide"
            className="w-8 h-8 rounded-full bg-black/30 hover:bg-black/60 text-white/80 hover:text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all cursor-pointer active:scale-90"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </section>
    </div>
  );
}
