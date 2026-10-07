'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Search, Sparkles, Waves, Mountain,
  Landmark, Compass, Camera, PawPrint
} from 'lucide-react';

interface CategoryTab {
  id: string;
  label: string;
  icon: React.ElementType;
  placeholder: string;
  category: string;
}

const TABS: CategoryTab[] = [
  { id: 'all', label: 'Search All', icon: Compass, placeholder: 'Places to go, things to do, hotels, beaches...', category: 'All' },
  { id: 'things', label: 'Things to Do', icon: Camera, placeholder: 'Safaris, scenic hikes, surf lessons, tea trails...', category: 'Mountains' },
  { id: 'beaches', label: 'Beaches & Bays', icon: Waves, placeholder: 'Mirissa, Hiriketiya, surfing spots, coral reefs...', category: 'Beaches' },
  { id: 'highlands', label: 'Highlands & Tea', icon: Mountain, placeholder: 'Ella train, misty peaks, waterfalls, Nuwara Eliya...', category: 'Mountains' },
  { id: 'heritage', label: 'Ancient Heritage', icon: Landmark, placeholder: 'Sigiriya Rock, cave temples, ancient ruins...', category: 'Ancient Sites' },
  { id: 'safaris', label: 'Wild Safaris', icon: PawPrint, placeholder: 'Yala leopards, Udawalawe elephants, wildlife...', category: 'Wildlife' },
];

// ━━━ 4 TILES MATCHING TRIPADVISOR PIC 5 EXACTLY ("Outdoors", "Food", "Culture", "Water") ━━━
const INTEREST_TILES = [
  {
    id: 'outdoors',
    title: 'Outdoors',
    category: 'Mountains',
    searchVal: 'Hike, Safari, Mountain',
    image: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=800&q=85',
  },
  {
    id: 'food',
    title: 'Food',
    category: 'Historical',
    searchVal: 'Tea, Flavors, Cuisine',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=85',
  },
  {
    id: 'culture',
    title: 'Culture',
    category: 'Ancient Sites',
    searchVal: 'Sigiriya, Temple, Heritage',
    image: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?w=800&q=85',
  },
  {
    id: 'water',
    title: 'Water',
    category: 'Beaches',
    searchVal: 'Beach, Coast, Waterfall',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=85',
  },
];

const TRENDING_SEARCHES = [
  { label: 'Sigiriya Rock', category: 'Ancient Sites' },
  { label: 'Nine Arch Bridge', category: 'Hidden Gems' },
  { label: 'Mirissa Beach', category: 'Beaches' },
  { label: 'Yala Safari', category: 'Wildlife' },
  { label: 'Ella Rock', category: 'Mountains' },
];

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState<CategoryTab>(TABS[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const query = customQuery !== undefined ? customQuery : searchQuery.trim();

    if (typeof window !== 'undefined') {
      const destEl = document.getElementById('destinations') || document.getElementById('explore');
      if (destEl) {
        destEl.scrollIntoView({ behavior: 'smooth' });
      }

      window.dispatchEvent(
        new CustomEvent('uc:filter-category', {
          detail: {
            category: activeTab.category === 'All' ? 'All' : activeTab.category,
            search: query,
          },
        })
      );
    }
  };

  const handleInterestClick = (category: string, searchVal = '') => {
    if (typeof window !== 'undefined') {
      const destEl = document.getElementById('destinations') || document.getElementById('explore');
      if (destEl) {
        destEl.scrollIntoView({ behavior: 'smooth' });
      }

      window.dispatchEvent(
        new CustomEvent('uc:filter-category', {
          detail: {
            category: category,
            search: searchVal,
          },
        })
      );
    }
  };

  const openAiModal = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('uc:open-ai-modal'));
    }
  };

  return (
    <section className="relative w-full bg-white text-slate-900 pt-6 sm:pt-10 pb-12 sm:pb-16 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ━━━ 1. TRIPADVISOR SIGNATURE "Where to?" HEADLINE ━━━ */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-5xl sm:text-6xl md:text-7xl font-black text-[#002b11] tracking-[-0.04em] leading-[1.05]"
          >
            Where to?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="text-slate-500 text-sm sm:text-base font-medium mt-2 max-w-xl mx-auto"
          >
            Explore sun-drenched coasts, misty tea mountains, ancient citadels and wild safaris across Sri Lanka.
          </motion.p>
        </div>

        {/* ━━━ 2. CATEGORY TABS (TripAdvisor clean line navigation) ━━━ */}
        <div className="flex items-center justify-start sm:justify-center gap-1 sm:gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
          {TABS.map((tab) => {
            const isActive = activeTab.id === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab);
                  if (tab.category !== 'All') {
                    handleInterestClick(tab.category);
                  }
                }}
                className={`relative flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs sm:text-[14px] font-bold rounded-full transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? 'text-[#002b11] bg-slate-100'
                    : 'text-slate-600 hover:text-[#002b11] hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#00aa6c]' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="active-trip-pill"
                    className="absolute -bottom-1 inset-x-4 h-[2.5px] bg-[#00aa6c] rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* ━━━ 3. TRIPADVISOR ICONIC LARGE PILL SEARCH BAR ━━━ */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.12 }}
          className="max-w-4xl mx-auto"
        >
          <form
            onSubmit={handleSearchSubmit}
            className="w-full bg-white border border-slate-300 hover:border-slate-400 focus-within:!border-[#00aa6c] focus-within:ring-4 focus-within:ring-emerald-500/10 rounded-full p-2 pl-5 sm:pl-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)] flex items-center gap-3 transition-all duration-200"
          >
            {/* Search Icon */}
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            
            {/* Input field */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={activeTab.placeholder}
              className="flex-1 w-full bg-transparent border-0 outline-none text-[#002b11] placeholder:text-slate-400 text-sm sm:text-base font-semibold min-w-0"
            />
            
            {/* Ask AI Pill Button */}
            <button
              type="button"
              onClick={openAiModal}
              className="hidden sm:inline-flex items-center gap-1.5 bg-slate-50 hover:bg-emerald-50 border border-slate-300 hover:border-emerald-300 text-slate-800 hover:text-emerald-950 text-xs sm:text-[13px] font-bold px-4 py-2 rounded-full transition-all cursor-pointer shrink-0 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#00aa6c]" />
              <span>Ask AI</span>
            </button>

            {/* Search Primary Green Button (TripAdvisor green) */}
            <button
              type="submit"
              className="inline-flex items-center justify-center bg-[#00aa6c] hover:bg-[#008f5a] text-white text-xs sm:text-sm font-extrabold px-6 sm:px-7 py-2.5 rounded-full shadow-md shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer shrink-0"
            >
              Search
            </button>
          </form>

          {/* ━━━ Trending Quick Suggestions Row ━━━ */}
          <div className="flex items-center justify-center gap-2 flex-wrap mt-3.5 text-xs text-slate-500 font-medium">
            <span className="font-bold text-slate-400">Trending in Ceylon:</span>
            {TRENDING_SEARCHES.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setSearchQuery(item.label);
                  handleInterestClick(item.category, item.label);
                }}
                className="hover:text-[#002b11] hover:underline cursor-pointer"
              >
                {item.label}
                {idx < TRENDING_SEARCHES.length - 1 && <span className="ml-2 text-slate-300">•</span>}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ━━━ 4. CATEGORY TILES (MATCHING PIC 5 EXACTLY: "Outdoors", "Food", "Culture", "Water") ━━━ */}
        <div className="mt-12 sm:mt-16">
          <div className="mb-5 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-[#002b11] tracking-tight">
              Find things to do by interest
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-medium mt-0.5">
              Whatever you&apos;re into, we&apos;ve got it
            </p>
          </div>

          {/* 4 Cards with exact clean edges from Pic 5 (rounded-2xl / 16px) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4.5">
            {INTEREST_TILES.map((tile, idx) => (
              <motion.button
                key={tile.id}
                type="button"
                onClick={() => handleInterestClick(tile.category, tile.searchVal)}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.06 * idx }}
                className="group relative aspect-square sm:aspect-[4/4.2] w-full rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 text-left cursor-pointer bg-slate-950"
              >
                {/* Authentic Photo */}
                <Image
                  src={tile.image}
                  alt={tile.title}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
                  unoptimized
                />

                {/* Smooth Dark Gradient Overlay for razor-sharp typography */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none group-hover:from-black/90 transition-all" />

                {/* Minimalist Bold Title at Bottom-Left (Exact match to Pic 5) */}
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 z-10 flex flex-col justify-end">
                  <h3 className="text-xl sm:text-2xl md:text-[26px] font-black text-white tracking-tight leading-none drop-shadow-md">
                    {tile.title}
                  </h3>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
