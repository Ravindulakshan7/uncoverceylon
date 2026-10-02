'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

interface RegionSlideItem {
  id: number;
  title: string;
  region: string;
  image?: string;
  image_url?: string;
}

const DEFAULT_REGION_SLIDES: RegionSlideItem[] = [
  {
    id: 1,
    title: 'Sigiriya Rock Fortress',
    region: 'Central Province',
    image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&q=85',
  },
  {
    id: 2,
    title: 'Nine Arch Bridge, Ella',
    region: 'Uva Province',
    image_url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&q=85',
  },
  {
    id: 3,
    title: 'Mirissa Coastal Palms',
    region: 'Southern Province',
    image_url: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1200&q=85',
  },
  {
    id: 4,
    title: 'Nuwara Eliya Tea Highlands',
    region: 'Central Province',
    image_url: 'https://images.unsplash.com/photo-1546708973-b339540b5162?w=1200&q=85',
  },
  {
    id: 5,
    title: 'Yala Wilderness Safari',
    region: 'Southern Province',
    image_url: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=1200&q=85',
  },
  {
    id: 6,
    title: 'Diyaluma Waterfall Cascades',
    region: 'Uva Province',
    image_url: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?w=1200&q=85',
  },
];

export default function RegionImageSlider() {
  const [slides, setSlides] = useState<RegionSlideItem[]>(DEFAULT_REGION_SLIDES);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch('/api/region-slides')
      .then((res) => res.json())
      .then((data) => {
        if (data.slides && Array.isArray(data.slides) && data.slides.length > 0) {
          setSlides(data.slides);
        }
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 3800);

    return () => clearInterval(timer);
  }, [slides.length]);

  const goTo = (step: number) => {
    setCurrentIndex((prev) => (prev + step + slides.length) % slides.length);
  };

  const active = slides[currentIndex] || DEFAULT_REGION_SLIDES[0];
  const imageSrc = active.image_url || active.image || DEFAULT_REGION_SLIDES[0].image_url!;

  return (
    <div className="group relative h-full min-h-[340px] sm:min-h-[420px] lg:min-h-full w-full overflow-hidden bg-[#102720]">
      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <Image
            src={imageSrc}
            alt={active.title}
            fill
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="object-cover"
            priority={currentIndex === 0}
            unoptimized={imageSrc.startsWith('http')}
          />
        </motion.div>
      </AnimatePresence>

      {/* Atmospheric Vignette Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/20 pointer-events-none" />
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black/40 to-transparent pointer-events-none hidden lg:block" />

      {/* Floating Location Pill */}
      <div className="absolute bottom-5 left-5 right-5 sm:right-auto z-10 flex items-center justify-between sm:justify-start gap-3">
        <div className="inline-flex items-center gap-2 rounded-xl bg-black/60 backdrop-blur-md px-3.5 py-2 text-white border border-white/15 shadow-lg">
          <MapPin className="h-4 w-4 text-amber-400 shrink-0" />
          <div className="leading-tight">
            <p className="text-xs font-bold text-white tracking-wide">{active.title}</p>
            <p className="text-[10px] text-amber-400 font-medium">{active.region}</p>
          </div>
        </div>

        {/* Slide Counter for Mobile */}
        <span className="sm:hidden text-xs font-bold text-white/80 bg-black/50 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-white/10">
          {currentIndex + 1} / {slides.length}
        </span>
      </div>

      {/* Desktop Controls & Indicators */}
      <div className="absolute bottom-5 right-5 z-10 hidden sm:flex items-center gap-3">
        {/* Navigation Buttons */}
        <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md p-1 rounded-xl border border-white/15">
          <button
            onClick={() => goTo(-1)}
            aria-label="Previous slide"
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/15 rounded-lg transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-[11px] font-bold text-white/90 px-1 font-mono">
            {currentIndex + 1} / {slides.length}
          </span>
          <button
            onClick={() => goTo(1)}
            aria-label="Next slide"
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/15 rounded-lg transition-colors cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-2 rounded-xl border border-white/10">
          {slides.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                currentIndex === idx ? 'w-5 bg-amber-400' : 'w-1.5 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
