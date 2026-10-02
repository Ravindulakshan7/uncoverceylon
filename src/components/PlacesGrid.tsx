'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Place, CategoryType } from '@/types';
import PlaceCard from './PlaceCard';
import CategoryFilter from './CategoryFilter';
import { useLocation, calculateDistanceKm } from '@/context/LocationContext';

interface PlacesGridProps {
  initialPlaces: Place[];
}

export default function PlacesGrid({ initialPlaces }: PlacesGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');
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

  // Sync category and search query from URL parameters and custom events
  useEffect(() => {
    const handleFilterCategory = (e: Event) => {
      const customEvent = e as CustomEvent<{ category?: string; search?: string }>;
      if (customEvent.detail) {
        if (customEvent.detail.category) {
          setSelectedCategory(customEvent.detail.category as CategoryType);
        }
        if (customEvent.detail.search !== undefined) {
          setSearchQuery(customEvent.detail.search);
        } else {
          setSearchQuery('');
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
      if (search) {
        setSearchQuery(search);
      } else if (prov) {
        setSearchQuery(prov);
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

    if (selectedCategory !== 'All') {
      results = results.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.short_description.toLowerCase().includes(q) ||
          p.province.toLowerCase().includes(q)
      );
    }

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
        results.sort((a, b) => b.review_count - a.review_count);
        break;
    }

    return results;
  }, [initialPlaces, selectedCategory, searchQuery, sortBy, userCoords]);

  return (
    <section id="explore" className="w-full border-t border-slate-200/90 bg-[#f8fafc] py-10 sm:py-16 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-2 sm:mb-3 text-2xl font-semibold text-slate-900 sm:text-4xl"
          >
            Explore All{' '}
            <span className="text-sky-600">
              Places
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mx-auto max-w-md text-xs sm:text-base text-slate-600"
          >
            {categoryCounts.All} destinations waiting to be discovered across the Pearl of the Indian Ocean
          </motion.p>
        </div>

        {/* Search + Sort bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 mb-5 sm:mb-8 max-w-2xl mx-auto w-full"
        >
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search places, provinces, categories..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 sm:py-3 pl-10 pr-10 text-base sm:text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500/15 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 p-1"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

        {/* Sort */}
        <div className="relative flex items-center">
          <SlidersHorizontal className="absolute left-3.5 top-1/2 -translate-y-1/2 z-10 h-4 w-4 shrink-0 text-slate-400 pointer-events-none" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="w-full sm:w-auto appearance-none rounded-xl border border-slate-200 bg-white py-2.5 sm:py-3 pl-10 pr-9 text-base sm:text-sm font-medium text-slate-900 transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500/15 focus:outline-none cursor-pointer"
          >
            <option value="rating">Top Rated</option>
            <option value="reviews">Most Reviewed</option>
            <option value="distance">{userCoords ? 'Nearest to Me (Live GPS)' : 'Nearest First'}</option>
          </select>
        </div>
      </motion.div>

      {/* Live Distance Location Bar */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {userCoords ? (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
            <span>Live GPS Active &bull; Showing distances from your current location</span>
          </span>
        ) : (
          <button
            type="button"
            onClick={async () => {
              const coords = await requestLocation();
              if (coords) setSortBy('distance');
            }}
            disabled={locationStatus === 'requesting'}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-700 border border-slate-200 hover:border-sky-300 transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <span>📍 Find Places Near Me (Use Live GPS)</span>
          </button>
        )}
      </div>

      {/* Category filter */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="mb-6 sm:mb-10 flex justify-center w-full"
      >
        <CategoryFilter
          selected={selectedCategory}
          onChange={setSelectedCategory}
          counts={categoryCounts}
        />
      </motion.div>

      {/* Places Grid */}
      <AnimatePresence mode="wait">
        {filteredPlaces.length > 0 ? (
          <motion.div
            key={`${selectedCategory}-${searchQuery}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6 lg:gap-8 w-full"
          >
            {filteredPlaces.map((place, i) => (
              <PlaceCard key={place.id} place={place} index={i} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mx-auto flex w-full max-w-2xl flex-col items-center justify-center border border-slate-200 bg-white rounded-2xl py-20 text-center shadow-sm"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sky-50">
              <Search className="h-5 w-5 text-sky-600" />
            </div>
            <h3 className="mb-1 text-lg font-bold text-slate-900">No places found</h3>
            <p className="mx-auto mb-4 max-w-xs text-sm text-slate-500">
              Try adjusting your search or filter criteria.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="text-sm font-semibold text-sky-600 hover:text-sky-700"
            >
              Clear all filters
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </section>
  );
}
