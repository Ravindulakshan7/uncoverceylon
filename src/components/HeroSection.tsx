'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, MapPin, Search, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface HeroSlide {
  id: number;
  image_url: string;
  location: string;
  province: string;
}

const fallbackSlides: HeroSlide[] = [
  { id: 1, image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&q=90', location: 'Sigiriya Rock Fortress', province: 'Central Province' },
  { id: 2, image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=90', location: 'Southern Coastline', province: 'Southern Province' },
  { id: 3, image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=90', location: 'Knuckles Mountain Range', province: 'Central Province' },
];

// Helper to ensure each landmark's main subject/object is clearly visible on mobile portrait screens
// while keeping PC/desktop positioning completely unchanged (md:object-center)
function getSlideObjectPosition(slide: HeroSlide): string {
  const loc = (slide.location || '').toLowerCase();
  const prov = (slide.province || '').toLowerCase();
  const url = (slide.image_url || '').toLowerCase();

  // 1. Dalada Maligawa (Temple of the Tooth) - Octagonal pavilion (Paththirippuwa) is illuminated on the right
  if (loc.includes('tooth') || loc.includes('maligawa') || url.includes('h42kvh')) {
    return 'object-[74%_center] md:object-center';
  }

  // 2. Southern Coast Stilt Fishermen - Fisherman sitting on wooden stilt is on the center-right
  if (loc.includes('coast') || loc.includes('koggala') || loc.includes('ahangama') || loc.includes('weligama') || loc.includes('fish') || url.includes('e4wb41')) {
    return 'object-[68%_center] md:object-center';
  }

  // 3. Colombo Lotus Tower - Tall vertical tower with glowing flower petals & spire
  if (loc.includes('lotus') || loc.includes('tower') || url.includes('2j91lg')) {
    return 'object-[center_28%] md:object-center';
  }

  // 4. Ruwanwelisaya - Majestic white dome & golden pinnacle spire are in center-right
  if (loc.includes('ruwanweli') || loc.includes('stupa') || loc.includes('dagoba') || url.includes('lxjshq')) {
    return 'object-[68%_center] md:object-center';
  }

  // Sigiriya Rock Fortress
  if (loc.includes('sigiriya')) {
    return 'object-[center_35%] md:object-center';
  }

  // Southern / Mirissa Coast
  if (loc.includes('mirissa') || prov.includes('southern')) {
    return 'object-[60%_center] md:object-center';
  }

  return 'object-center md:object-center';
}

export default function HeroSection() {
  const [slides, setSlides] = useState<HeroSlide[]>(fallbackSlides);
  const [current, setCurrent] = useState(0);
  const [query, setQuery] = useState('');
  const active = slides[current] ?? fallbackSlides[0];
  const { t } = useLanguage();

  useEffect(() => {
    fetch('/api/hero-slides')
      .then((response) => response.json())
      .then((data) => {
        if (data.slides?.length) setSlides(data.slides);
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrent((value) => (value + 1) % slides.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  const goTo = (direction: number) => {
    setCurrent((value) => (value + direction + slides.length) % slides.length);
  };

  return (
    <section className="relative isolate min-h-screen min-h-[100vh] sm:min-h-[100dvh] w-full max-w-full overflow-hidden bg-[#0a192f] text-white">
      {/* ━━━ SEAMLESS CINEMATIC IMAGE SLIDER (Fast GPU-accelerated rendering for iOS 15 & all devices) ━━━ */}
      <div className="absolute inset-0 -z-20 overflow-hidden bg-[#07111e]">
        <AnimatePresence initial={false}>
          <motion.div
            key={active.id}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="absolute inset-0 transform-gpu will-change-transform"
            style={{ WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden' }}
          >
            <Image
              src={active.image_url}
              alt={active.location}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 100vw"
              className={`object-cover ${getSlideObjectPosition(active)} transition-[object-position] duration-500`}
              unoptimized={true}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Atmospheric Overlays:
          - Mobile: top vignette for navbar/text readability + bright translucent center so landmark object is crystal-clear
          - Desktop (md:): exact original 90deg oceanic linear gradient strictly unchanged */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#07111e]/85 via-[#07111e]/30 to-[#0a192f]/95 md:bg-[linear-gradient(90deg,rgba(10,25,47,0.76)_0%,rgba(10,25,47,0.48)_50%,rgba(10,25,47,0.22)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0a192f] via-[#0a192f]/50 to-transparent pointer-events-none" />

      {/* ━━━ CENTER HERO CONTENT (Responsive, zero horizontal overflow on small screens) ━━━ */}
      <div className="mx-auto flex min-h-screen min-h-[100vh] sm:min-h-[100dvh] w-full max-w-4xl flex-col items-center justify-center px-4 pt-24 pb-28 text-center sm:px-8 sm:pt-24 sm:pb-32 overflow-hidden">
        <motion.p
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mb-3 sm:mb-6 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#f59e0b]"
        >
          {t('hero.badge')}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-3xl text-[26px] xs:text-[32px] sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.18] sm:leading-[1.05] tracking-tight break-words px-2"
        >
          <span>{t('hero.title1')} </span>
          <span className="text-[#fbbf24] font-bold">{t('hero.title2')}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
          className="mt-3 sm:mt-6 max-w-xl text-[13px] sm:text-base lg:text-lg leading-relaxed text-white/90 px-2"
        >
          {t('hero.subtitle')}
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          onSubmit={(event) => {
            event.preventDefault();
            window.location.href = query.trim()
              ? `/?search=${encodeURIComponent(query.trim())}#explore`
              : '#explore';
          }}
          className="mt-6 sm:mt-11 w-full max-w-xl px-1 sm:px-0 min-w-0"
        >
          <div className="group relative flex items-center border-b border-white/35 focus-within:!border-amber-400 hover:border-white/60 pb-2.5 sm:pb-3 transition-colors duration-300">
            <label className="sr-only" htmlFor="destination-search">Search destinations</label>
            <Search className="h-4.5 w-4.5 sm:h-6 sm:w-6 text-white/60 group-focus-within:text-amber-400 transition-colors shrink-0 mr-2.5 sm:mr-3.5" />
            <input
              id="destination-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('hero.searchPlaceholder')}
              className="w-full min-w-0 flex-1 bg-transparent text-white placeholder:text-white/50 text-sm sm:text-lg font-light tracking-wide focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1 text-white/50 hover:text-white transition-colors mr-1 sm:mr-2 cursor-pointer shrink-0"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
            )}
            <button
              type="submit"
              aria-label="Search destinations"
              className="inline-flex items-center gap-1 sm:gap-1.5 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm tracking-wide transition-all active:scale-95 shadow-md shadow-amber-400/20 cursor-pointer shrink-0"
            >
              <span>{t('hero.searchBtn')}</span>
              <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          </div>
        </motion.form>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 sm:mt-7 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm font-semibold"
        >
          <Link
            href="/#explore"
            className="inline-flex items-center gap-1.5 sm:gap-2 border-b-2 border-amber-400 pb-1 text-white hover:text-amber-300 transition-colors"
          >
            {t('hero.exploreBtn')} <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Link>
          <Link href="/map" className="text-white/80 hover:text-white transition-colors">
            {t('nav.map')}
          </Link>
        </motion.div>
      </div>

      {/* ━━━ BOTTOM NAVIGATION & LOCATION BAR (Safe flex layout, never clips or overflows) ━━━ */}
      <div className="absolute bottom-4 sm:bottom-8 inset-x-0 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between border-t border-white/20 pt-2.5 sm:pt-4 gap-3">
          
          {/* Location details with safe truncate */}
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            <MapPin className="h-4 sm:h-5 w-4 sm:w-5 shrink-0 text-amber-400" />
            <div className="min-w-0 flex-1 text-left">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -3 }}
                  transition={{ duration: 0.25 }}
                >
                  <p className="truncate text-xs sm:text-sm font-bold text-white tracking-wide">
                    {active.location}
                  </p>
                  <p className="truncate text-[10px] sm:text-xs text-amber-400/90 font-medium">
                    {active.province}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
            <span className="text-[11px] sm:text-sm font-mono font-medium text-white/70 tracking-wider">
              {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
            </span>
            <button
              onClick={() => goTo(-1)}
              aria-label="Previous image"
              className="p-1 text-white/80 hover:text-white active:scale-90 transition-all cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <button
              onClick={() => goTo(1)}
              aria-label="Next image"
              className="p-1 text-amber-400 hover:text-amber-300 active:scale-90 transition-all cursor-pointer"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
