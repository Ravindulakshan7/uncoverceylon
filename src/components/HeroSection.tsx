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
    <section className="relative isolate min-h-screen min-h-[100dvh] w-full overflow-hidden bg-[#0a192f] text-white">
      {/* ━━━ SEAMLESS CINEMATIC IMAGE SLIDER (matching RegionImageSlider) ━━━ */}
      <div className="absolute inset-0 -z-20 overflow-hidden bg-[#07111e]">
        <AnimatePresence initial={false}>
          <motion.div
            key={active.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <Image
              src={active.image_url}
              alt={active.location}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
              unoptimized={active.image_url.startsWith('http')}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Atmospheric Overlays (Oceanic Midnight Blue gradient with high-definition photo contrast) */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(10,25,47,0.76)_0%,rgba(10,25,47,0.48)_50%,rgba(10,25,47,0.22)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#0a192f]/95 via-[#0a192f]/45 to-transparent pointer-events-none" />

      {/* ━━━ CENTER HERO CONTENT (with smooth luxury drop-in animation) ━━━ */}
      <div className="mx-auto flex min-h-screen min-h-[100dvh] max-w-4xl flex-col items-center justify-center px-4 pt-28 pb-32 text-center sm:px-8 sm:pt-24 sm:pb-32">
        <motion.p
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mb-4 sm:mb-6 text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#f59e0b]"
        >
          {t('hero.badge')}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: -28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl text-[32px] xs:text-4xl font-semibold leading-[1.15] sm:leading-[1.05] sm:text-6xl lg:text-7xl tracking-tight"
        >
          <span>{t('hero.title1')} </span>
          <span className="text-[#fbbf24] font-bold">{t('hero.title2')}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 sm:mt-6 max-w-xl text-[15px] sm:text-lg leading-relaxed text-white/90"
        >
          {t('hero.subtitle')}
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          onSubmit={(event) => {
            event.preventDefault();
            window.location.href = query.trim()
              ? `/?search=${encodeURIComponent(query.trim())}#explore`
              : '#explore';
          }}
          className="mt-8 sm:mt-12 w-full max-w-2xl px-2 sm:px-0"
        >
          <div className="group relative flex items-center border-b border-white/35 focus-within:!border-amber-400 hover:border-white/60 pb-3 transition-colors duration-300">
            <label className="sr-only" htmlFor="destination-search">Search destinations</label>
            <Search className="h-5 w-5 sm:h-6 sm:w-6 text-white/60 group-focus-within:text-amber-400 transition-colors shrink-0 mr-3.5" />
            <input
              id="destination-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('hero.searchPlaceholder')}
              className="min-w-0 flex-1 bg-transparent text-white placeholder:text-white/50 text-base sm:text-xl font-light tracking-wide focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1 text-white/50 hover:text-white transition-colors mr-2 cursor-pointer"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <button
              type="submit"
              aria-label="Search destinations"
              className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm tracking-wide transition-all active:scale-95 shadow-md shadow-amber-400/20 cursor-pointer shrink-0"
            >
              <span>{t('hero.searchBtn')}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </motion.form>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 sm:mt-7 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm font-semibold"
        >
          <Link
            href="/#explore"
            className="inline-flex items-center gap-2 border-b-2 border-amber-400 pb-1 text-white hover:text-amber-300 transition-colors"
          >
            {t('hero.exploreBtn')} <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/map" className="text-white/80 hover:text-white transition-colors">
            {t('nav.map')}
          </Link>
        </motion.div>
      </div>

      {/* ━━━ BOTTOM NAVIGATION & LOCATION BAR (matching RegionImageSlider) ━━━ */}
      <div className="absolute bottom-5 sm:bottom-8 inset-x-0 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between border-t border-white/25 pt-3 sm:pt-4">
          
          {/* Location details */}
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <MapPin className="h-4 sm:h-5 w-4 sm:w-5 shrink-0 text-amber-400" />
            <div className="min-w-0 text-left">
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
                  <p className="truncate text-[11px] sm:text-xs text-amber-400/90 font-medium">
                    {active.province}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation Controls (Clean & Minimalist matching 2nd picture) */}
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-xs sm:text-sm font-mono font-medium text-white/70 tracking-wider">
              {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
            </span>
            <button
              onClick={() => goTo(-1)}
              aria-label="Previous image"
              className="p-1 text-white/80 hover:text-white active:scale-90 transition-all cursor-pointer"
            >
              <ChevronLeft className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
            </button>
            <button
              onClick={() => goTo(1)}
              aria-label="Next image"
              className="p-1 text-amber-400 hover:text-amber-300 active:scale-90 transition-all cursor-pointer"
            >
              <ChevronRight className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
