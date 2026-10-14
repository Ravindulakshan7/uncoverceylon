'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DestinationsHeroProps {
  totalPlaces?: number;
}

export default function DestinationsHero({ totalPlaces = 60 }: DestinationsHeroProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hasAutoCollapsed, setHasAutoCollapsed] = useState(false);

  // Auto-collapse on mobile after 3.5 seconds OR on scroll down
  useEffect(() => {
    // Only auto-collapse on small mobile screens (< 640px)
    if (typeof window === 'undefined' || window.innerWidth >= 640) return;

    // 1. Auto-collapse timer after 3.5 seconds
    const timer = setTimeout(() => {
      setIsCollapsed(true);
      setHasAutoCollapsed(true);
    }, 3500);

    // 2. Collapse immediately when user starts scrolling down
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsCollapsed(true);
        setHasAutoCollapsed(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section className="bg-gradient-to-b from-[#f4f7f5] via-[#fafcfb] to-white border-b border-slate-100/90 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
        <AnimatePresence initial={false} mode="wait">
          {!isCollapsed ? (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="pt-6 sm:pt-12 pb-5 sm:pb-8 relative overflow-hidden"
            >
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#0f1b2d] tracking-tight leading-tight">
                Explore All Destinations
              </h1>

              <p className="text-slate-600 text-xs sm:text-base font-medium mt-2 sm:mt-3 leading-relaxed max-w-2xl mx-auto">
                Discover verified attractions, misty mountains, ancient citadels, and secret bays across Sri Lanka.
              </p>

              {/* Mobile collapse quick toggle button */}
              <div className="sm:hidden mt-3">
                <button
                  type="button"
                  onClick={() => setIsCollapsed(true)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-slate-700 bg-slate-100/80 px-2.5 py-1 rounded-full cursor-pointer"
                >
                  <span>Hide header</span>
                  <ChevronUp className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="py-2.5 flex items-center justify-between gap-3 sm:hidden"
            >
              <div className="flex items-center gap-2 text-left">
                <span className="text-sm font-black text-slate-900 tracking-tight">
                  Explore Destinations
                </span>
                <span className="text-[11px] font-bold text-[#00aa6c] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                  {totalPlaces} Places
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsCollapsed(false)}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#00aa6c] hover:text-[#008a58] p-1 cursor-pointer"
              >
                <span>Show info</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
