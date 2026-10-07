'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { Search, SlidersHorizontal, X, Compass, MapPin, Sparkles, RotateCcw, Map } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Place, CategoryType } from '@/types';
import PlaceCard from './PlaceCard';
import CategoryFilter from './CategoryFilter';
import { useLocation, calculateDistanceKm } from '@/context/LocationContext';
import Link from 'next/link';

interface PlacesGridProps {
  initialPlaces: Place[];
}

const PROVINCES = [
  'All Provinces',
  'Central Province',
  'Southern Province',
  'Uva Province',
  'Sabaragamuwa Province',
  'North Central Province',
  'Western Province',
  'Eastern Province',
  'Northern Province',
  'North Western Province',
];

export default function PlacesGrid({ initialPlaces }: PlacesGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');
  const [selectedProvince, setSelectedProvince] = useState('All Provinces');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'distance' | 'reviews'>('rating');
  const { userCoords, status: locationStatus, requestLocation } = useLocation();

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: initialPlaces.length };
    initialPlaces.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [initialPlaces]);

  // Sync category and search query from URL parameters and custom events (e.g. from Hero)
  useEffect(() => {
    const handleFilterCategory = (e: Event) => {
      const customEvent = e as CustomEvent<{ category?: string; search?: string; province?: string }>;
      if (customEvent.detail) {
        if (customEvent.detail.category) {
          setSelectedCategory(customEvent.detail.category as CategoryType);
        }
        if (customEvent.detail.province) {
          setSelectedProvince(customEvent.detail.province);
        }
        if (customEvent.detail.search !== undefined) {
          setSearchQuery(customEvent.detail.search);
        }
      }
    };

    const parseUrlParams = () => {
      if (typeof window === 'undefined') return;
      const params = new URLSearchParams(window.location.search);
      const cat = params.get('category');
      const search = params.get('search');
      const prov = params.get('province');

      if (cat) {
        setSelectedCategory(cat as CategoryType);
      }
      if (prov) {
        setSelectedProvince(prov);
      }
      if (search) {
        setSearchQuery(search);
      }
    };

    parseUrlParams();
    window.addEventListener('popstate', parseUrlParams);
    window.addEventListener('hashchange', parseUrlParams);
    window.addEventListener('uc:filter-category', handleFilterCategory);
    return () => {
      window.removeEventListener('popstate', parseUrlParams);
      window.removeEventListener('hashchange', parseUrlParams);
      window.removeEventListener('uc:filter-category', handleFilterCategory);
    };
  }, []);

  const filteredPlaces = useMemo(() => {
    let results = [...initialPlaces];

    // Category filter
    if (selectedCategory !== 'All') {
      results = results.filter((p) => p.category === selectedCategory);
    }

    // Province filter
    if (selectedProvince !== 'All Provinces') {
      results = results.filter((p) => p.province.toLowerCase().includes(selectedProvince.toLowerCase()));
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.short_description.toLowerCase().includes(q) ||
          p.province.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Sorting
    switch (sortBy) {
      case 'rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'distance':
        if (userCoords) {
          results.sort((a, b) => {
            const distA = calculateDistanceKm(userCoords.lat, userCoords.lng, a.lat, a.lng);
            const distB = calculateDistanceKm(userCoords.lat, userCoords.lng, b.lat, b.lng);
            return distA - distB;
          });
        } else {
          results.sort((a, b) => a.distance_km - b.distance_km);
        }
        break;
      case 'reviews':
        results.sort((a, b) => (b.review_count || 0) - (a.review_count || 0));
        break;
    }

    return results;
  }, [initialPlaces, selectedCategory, selectedProvince, searchQuery, sortBy, userCoords]);

  const hasActiveFilters = selectedCategory !== 'All' || selectedProvince !== 'All Provinces' || searchQuery.trim() !== '';

  const clearAllFilters = () => {
    setSelectedCategory('All');
    setSelectedProvince('All Provinces');
    setSearchQuery('');
  };

  return (
    <section id="destinations" className="w-full bg-[#f8fafc] py-12 sm:py-20 scroll-mt-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* ━━━ SECTION HEADER ━━━ */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#00aa6c] text-[11px] font-black uppercase tracking-wider border border-emerald-200">
              <Compass className="w-3.5 h-3.5" />
              Verified Destinations
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#002b11] tracking-tight mt-2.5">
              Popular destinations across Sri Lanka
            </h2>
            <p className="text-slate-500 text-xs sm:text-base font-medium mt-1 max-w-2xl">
              Browse top-rated beaches, tea trails, ancient citadels, and wildlife reserves across all 9 provinces.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/map"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#00aa6c] hover:text-[#008f5a] hover:underline"
            >
              <Map className="w-4 h-4" />
              <span>View interactive map</span>
            </Link>
          </div>
        </div>

        {/* ━━━ CATEGORY FILTER PILLS ━━━ */}
        <div className="mb-6">
          <CategoryFilter
            selected={selectedCategory}
            onChange={setSelectedCategory}
            counts={categoryCounts}
          />
        </div>

        {/* ━━━ SEARCH & CONTROLS TOOLBAR ━━━ */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-4 mb-6 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            
            {/* Search Input (Takes 6 cols) */}
            <div className="sm:col-span-6 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, town, or landmark..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white py-2.5 pl-10 pr-10 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:bg-white focus:border-[#00aa6c] focus:ring-2 focus:ring-emerald-500/15 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 p-1 cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Province Dropdown (Takes 3 cols) */}
            <div className="sm:col-span-3 relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white py-2.5 pl-9 pr-8 text-xs sm:text-sm font-semibold text-slate-800 transition-all focus:bg-white focus:border-[#00aa6c] focus:ring-2 focus:ring-emerald-500/15 focus:outline-none cursor-pointer"
              >
                {PROVINCES.map((prov) => (
                  <option key={prov} value={prov}>
                    {prov}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown (Takes 3 cols) */}
            <div className="sm:col-span-3 relative">
              <SlidersHorizontal className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white py-2.5 pl-9 pr-8 text-xs sm:text-sm font-semibold text-slate-800 transition-all focus:bg-white focus:border-[#00aa6c] focus:ring-2 focus:ring-emerald-500/15 focus:outline-none cursor-pointer"
              >
                <option value="rating">Top Rated</option>
                <option value="reviews">Most Reviewed</option>
                <option value="distance">{userCoords ? 'Nearest (Live GPS)' : 'Nearest First'}</option>
              </select>
            </div>

          </div>

          {/* ━━━ ACTIVE FILTERS ROW & LIVE GPS STATUS ━━━ */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 mt-3 border-t border-slate-100 text-xs font-semibold text-slate-600">
            
            {/* Left: Active Filter Chips */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                Showing {filteredPlaces.length} of {initialPlaces.length}
              </span>

              {selectedCategory !== 'All' && (
                <button
                  onClick={() => setSelectedCategory('All')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-[#00aa6c] border border-emerald-200 text-xs font-bold hover:bg-emerald-100 cursor-pointer"
                >
                  <span>Category: {selectedCategory}</span>
                  <X className="w-3 h-3" />
                </button>
              )}

              {selectedProvince !== 'All Provinces' && (
                <button
                  onClick={() => setSelectedProvince('All Provinces')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-[#00aa6c] border border-emerald-200 text-xs font-bold hover:bg-emerald-100 cursor-pointer"
                >
                  <span>{selectedProvince}</span>
                  <X className="w-3 h-3" />
                </button>
              )}

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-[#00aa6c] border border-emerald-200 text-xs font-bold hover:bg-emerald-100 cursor-pointer"
                >
                  <span>&ldquo;{searchQuery}&rdquo;</span>
                  <X className="w-3 h-3" />
                </button>
              )}

              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-700 underline text-xs font-medium cursor-pointer ml-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset all</span>
                </button>
              )}
            </div>

            {/* Right: GPS Location Action */}
            <div>
              {userCoords ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-[#00aa6c] animate-pulse" />
                  <span>Live GPS Active</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={async () => {
                    const coords = await requestLocation();
                    if (coords) setSortBy('distance');
                  }}
                  disabled={locationStatus === 'requesting'}
                  className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-slate-600 hover:text-[#00aa6c] cursor-pointer"
                >
                  <span>📍 Enable Live GPS Distances</span>
                </button>
              )}
            </div>

          </div>
        </div>

        {/* ━━━ PLACES GRID CARDS ━━━ */}
        <AnimatePresence mode="wait">
          {filteredPlaces.length > 0 ? (
            <motion.div
              key={`${selectedCategory}-${selectedProvince}-${searchQuery}-${sortBy}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 w-full"
            >
              {filteredPlaces.map((place, i) => (
                <PlaceCard key={place.id} place={place} index={i} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto flex w-full max-w-xl flex-col items-center justify-center border border-slate-200 bg-white rounded-3xl p-10 sm:p-14 text-center shadow-xs"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-[#00aa6c]">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="mb-1 text-lg sm:text-xl font-black text-slate-900">No destinations found</h3>
              <p className="mx-auto mb-6 max-w-sm text-xs sm:text-sm text-slate-500 font-medium">
                We couldn&apos;t find any places matching your current filters. Try relaxing your search terms or province selection.
              </p>
              <button
                onClick={clearAllFilters}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm bg-[#00aa6c] hover:bg-[#008f5a] text-white shadow-md shadow-emerald-950/20 active:scale-95 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset all filters</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
