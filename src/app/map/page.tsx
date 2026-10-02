'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState, useMemo } from 'react';
import { Place, CategoryType } from '@/types';
import Link from 'next/link';
import {
  Map, Search, SlidersHorizontal, Star, MapPin, X,
  Globe, Waves, Droplets, Mountain, PawPrint, Landmark,
  Castle, Gem, Loader2, Navigation, ChevronRight,
  Filter, Layers, RotateCcw
} from 'lucide-react';

const InteractiveMap = dynamic(() => import('@/components/InteractiveMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center text-slate-400">
      <Loader2 className="w-10 h-10 animate-spin text-slate-800 mb-3" />
      <span className="text-sm font-bold text-slate-600">Initializing Ceylon Explorer Map...</span>
      <span className="text-xs text-slate-400 mt-1">Plotting coordinates & terrain layers</span>
    </div>
  ),
});

const CATEGORIES: { label: CategoryType; icon: React.ElementType }[] = [
  { label: 'All', icon: Globe },
  { label: 'Beaches', icon: Waves },
  { label: 'Mountains', icon: Mountain },
  { label: 'Waterfalls', icon: Droplets },
  { label: 'Wildlife', icon: PawPrint },
  { label: 'Ancient Sites', icon: Landmark },
  { label: 'Historical', icon: Castle },
  { label: 'Religious Places', icon: Star },
  { label: 'Hidden Gems', icon: Gem },
];

const PROVINCES = [
  'All Provinces',
  'Central Province',
  'Southern Province',
  'Western Province',
  'Uva Province',
  'Sabaragamuwa Province',
  'North Central Province',
  'North Western Province',
  'Eastern Province',
  'Northern Province',
];

const RATING_FILTERS = [
  { label: 'All Ratings', value: 0 },
  { label: '4.8+ ★', value: 4.8 },
  { label: '4.5+ ★', value: 4.5 },
  { label: '4.0+ ★', value: 4.0 },
];

export default function MapPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');
  const [selectedProvince, setSelectedProvince] = useState('All Provinces');
  const [minRating, setMinRating] = useState(0);

  // Active selected place to center map & open popup
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  // Mobile tab state: 'map' or 'list'
  const [mobileTab, setMobileTab] = useState<'map' | 'list'>('map');

  // Recenter counter trigger
  const [recenterCount, setRecenterCount] = useState(0);

  useEffect(() => {
    fetch('/api/places')
      .then((r) => r.json())
      .then((data) => {
        setPlaces(data.places || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Filtered places calculation
  const filteredPlaces = useMemo(() => {
    return places.filter((p) => {
      // Category filter
      if (selectedCategory !== 'All' && p.category !== selectedCategory) {
        return false;
      }
      // Province filter
      if (selectedProvince !== 'All Provinces' && p.province !== selectedProvince) {
        return false;
      }
      // Rating filter
      if (minRating > 0 && p.rating < minRating) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchLoc = p.location.toLowerCase().includes(q);
        const matchDesc = p.short_description.toLowerCase().includes(q);
        const matchProv = p.province.toLowerCase().includes(q);
        if (!matchName && !matchLoc && !matchDesc && !matchProv) {
          return false;
        }
      }
      return true;
    });
  }, [places, selectedCategory, selectedProvince, minRating, searchQuery]);

  // Featured places subset
  const featuredInView = useMemo(() => {
    return filteredPlaces.filter((p) => p.featured === 1);
  }, [filteredPlaces]);

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedProvince('All Provinces');
    setMinRating(0);
    setSelectedPlace(null);
  };

  const isFiltered =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'All' ||
    selectedProvince !== 'All Provinces' ||
    minRating > 0;

  return (
    <div className="pt-16 sm:pt-20 h-screen flex flex-col bg-[#f8fafc] overflow-hidden">
      
      {/* ━━━ TOP BAR / EXPEDITION HEADER ━━━ */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex-shrink-0 z-30 shadow-xs">
        <div className="max-w-full flex items-center justify-between gap-4">
          
          {/* Title & Stats */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center flex-shrink-0 shadow-xs">
              <Map className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Ceylon Travel Explorer
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1.5 bg-sky-50 text-sky-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-sky-200">
                  <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                  Live GPS
                </span>
              </div>
              <p className="text-slate-500 text-xs truncate">
                Showing <strong className="text-sky-600 font-bold">{filteredPlaces.length}</strong> of {places.length} destinations
              </p>
            </div>
          </div>

          {/* Quick Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isFiltered && (
              <button
                onClick={resetAllFilters}
                className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset Filters</span>
              </button>
            )}

            {/* Mobile Tab Switcher */}
            <div className="lg:hidden flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setMobileTab('list')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  mobileTab === 'list'
                    ? 'bg-white text-sky-600 shadow-xs'
                    : 'text-slate-500'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>List ({filteredPlaces.length})</span>
              </button>
              <button
                onClick={() => {
                  setMobileTab('map');
                  setRecenterCount((c) => c + 1);
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  mobileTab === 'map'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-500'
                }`}
              >
                <Map className="w-3.5 h-3.5" />
                <span>Map</span>
              </button>
            </div>

            <Link
              href="/#explore"
              className="hidden md:inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-sky-600 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <span>Back to Directory</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* ━━━ MAIN WORKSPACE (SPLIT LAYOUT) ━━━ */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* ━━━━ LEFT SIDEBAR: FILTERS & PLACES LIST ━━━━ */}
        <aside
          className={`w-full lg:w-[420px] xl:w-[460px] bg-white border-r border-slate-200 flex flex-col flex-shrink-0 z-20 h-full overflow-hidden transition-all duration-300 ${
            mobileTab === 'list' ? 'block' : 'hidden lg:flex'
          }`}
        >
          {/* Scrollable Filters Header Area */}
          <div className="p-4 sm:p-5 border-b border-slate-200 space-y-4 overflow-y-auto max-h-[46%] bg-slate-50/80">
            
            {/* 1. Search Bar */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search spots, towns, districts..."
                className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-9 py-2.5 text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 p-1"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* 2. Category Dropdown */}
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as CategoryType)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-base sm:text-xs font-bold text-slate-800 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none shadow-xs cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.label} value={cat.label}>
                    {cat.label === 'All' ? 'All Categories' : cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Dual Row: Province & Rating Filter */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              {/* 3. Province Filter */}
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Province
                </label>
                <select
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-base sm:text-xs font-bold text-slate-800 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none shadow-xs"
                >
                  {PROVINCES.map((prov) => (
                    <option key={prov} value={prov}>
                      {prov}
                    </option>
                  ))}
                </select>
              </div>

              {/* 4. Rating Filter */}
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Min Rating
                </label>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(parseFloat(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-base sm:text-xs font-bold text-slate-800 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none shadow-xs"
                >
                  {RATING_FILTERS.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

          </div>

          {/* 5. Featured Places & Search Results List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="flex items-center justify-between px-1 mb-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {searchQuery || selectedCategory !== 'All' || selectedProvince !== 'All Provinces'
                  ? `Matching Results (${filteredPlaces.length})`
                  : `Destinations (${filteredPlaces.length})`}
              </span>
              
              {featuredInView.length > 0 && !isFiltered && (
                <span className="text-[10px] bg-amber-500/15 text-amber-800 font-bold px-2 py-0.5 rounded-full border border-amber-300">
                  ★ {featuredInView.length} Featured
                </span>
              )}
            </div>

            {loading ? (
              <div className="py-16 text-center text-slate-500">
                <Loader2 className="w-6 h-6 animate-spin text-sky-600 mx-auto mb-2" />
                <span className="text-xs font-semibold">Loading destinations...</span>
              </div>
            ) : filteredPlaces.length === 0 ? (
              <div className="py-16 text-center bg-slate-50 rounded-2xl border border-slate-200 p-6">
                <Search className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-900 mb-1">No spots found</h4>
                <p className="text-xs text-slate-500 mb-3">
                  Try adjusting your filters or category choice.
                </p>
                <button
                  onClick={resetAllFilters}
                  className="text-xs font-bold text-sky-600 hover:underline"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              filteredPlaces.map((place) => {
                const isSelected = selectedPlace?.id === place.id;
                return (
                  <div
                    key={place.id}
                    onClick={() => {
                      setSelectedPlace(place);
                      if (window.innerWidth < 1024) {
                        setMobileTab('map');
                      }
                    }}
                    className={`group cursor-pointer rounded-2xl p-3 border transition-all duration-200 flex items-center gap-3.5 ${
                      isSelected
                        ? 'bg-sky-50 border-sky-500 shadow-md ring-2 ring-sky-500/20'
                        : 'bg-white border-slate-200 hover:border-sky-300 hover:shadow-md'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={place.image_url || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&q=80'}
                        alt={place.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=300&q=80';
                        }}
                      />
                      {place.featured === 1 && (
                        <span className="absolute top-1 left-1 bg-amber-400 text-slate-950 text-[9px] font-extrabold px-1.5 py-0.2 rounded shadow-xs">
                          ★
                        </span>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                          {place.category}
                        </span>
                        <span className="text-[10px] text-slate-500 truncate">
                          {place.province}
                        </span>
                      </div>

                      <h4 className="font-extrabold text-slate-900 text-sm group-hover:text-sky-600 transition-colors truncate">
                        {place.name}
                      </h4>

                      <div className="flex items-center gap-1 text-slate-500 text-xs mt-0.5">
                        <MapPin size={11} className="text-sky-600 flex-shrink-0" />
                        <span className="truncate text-[11px]">{place.location}</span>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
                        <div className="flex items-center gap-1">
                          <Star size={12} className="fill-amber-400 text-amber-400" />
                          <span className="text-xs font-black text-slate-900">{place.rating}</span>
                          <span className="text-[10px] text-slate-500">({place.review_count})</span>
                        </div>

                        <span className="text-[11px] font-bold text-sky-600 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                          <span>Pin on map</span>
                          <Navigation size={10} />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* ━━━━ MAIN AREA: LARGE INTERACTIVE MAP ━━━━ */}
        <main
          className={`flex-1 h-full relative overflow-hidden bg-slate-100 ${
            mobileTab === 'map' ? 'block' : 'hidden lg:block'
          }`}
        >
          {loading ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-slate-800 mb-2" />
              <span className="text-xs font-semibold">Loading map coordinates...</span>
            </div>
          ) : (
            <InteractiveMap
              places={filteredPlaces}
              selectedPlace={selectedPlace}
              onSelectPlace={(place) => setSelectedPlace(place)}
              recenterTrigger={recenterCount}
              onResetView={() => {
                setSelectedPlace(null);
                setRecenterCount((c) => c + 1);
              }}
            />
          )}

          {/* Floating Map Legend / Guide on bottom right */}
          <div className="absolute bottom-9 sm:bottom-10 right-4 sm:right-6 z-[1001] hidden sm:flex items-center gap-2 bg-[#0a192f]/95 backdrop-blur-md border border-white/15 rounded-2xl p-2.5 shadow-xl text-xs font-semibold text-white">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 px-2">Legend</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-[11px]">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400" /> Beaches
              </span>
              <span className="flex items-center gap-1 text-[11px]">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" /> Mountains
              </span>
              <span className="flex items-center gap-1 text-[11px]">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Waterfalls
              </span>
              <span className="flex items-center gap-1 text-[11px]">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Wildlife
              </span>
              <span className="flex items-center gap-1 text-[11px]">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Historical
              </span>
            </div>
          </div>

          {/* Mobile Selected Place Bottom Preview Card */}
          {selectedPlace && mobileTab === 'map' && (
            <div className="lg:hidden absolute bottom-5 inset-x-3 z-[1002] bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200 p-3 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedPlace.image_url || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&q=80'}
                  alt={selectedPlace.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-1.5 py-0.2 rounded border border-sky-100">
                    {selectedPlace.category}
                  </span>
                  <span className="flex items-center gap-0.5 text-[11px] font-black text-slate-900">
                    <Star size={11} className="fill-amber-400 text-amber-400" />
                    {selectedPlace.rating}
                  </span>
                </div>
                <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm truncate">
                  {selectedPlace.name}
                </h4>
                <p className="text-[11px] text-slate-500 truncate">
                  {selectedPlace.location}
                </p>
              </div>

              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <button
                  onClick={() => setSelectedPlace(null)}
                  className="p-1 text-slate-400 hover:text-slate-800"
                  aria-label="Close preview"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <Link
                  href={`/places/${selectedPlace.id}`}
                  className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg active:scale-95 transition-all text-center shadow-xs"
                >
                  View
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
