'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState, useMemo } from 'react';
import { Place, CategoryType } from '@/types';
import Link from 'next/link';
import { categoryIconConfig } from '@/lib/map-markers';
import styles from './MapPage.module.css';
import {
  Map, Search, SlidersHorizontal, Star, MapPin, X,
  Globe, Waves, Droplets, Mountain, PawPrint, Landmark,
  Castle, Gem, Loader2, Navigation, ChevronRight,
  Layers, RotateCcw
} from 'lucide-react';

const InteractiveMap = dynamic(() => import('@/components/InteractiveMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center text-slate-400">
      <Loader2 className="w-10 h-10 animate-spin text-slate-800 mb-3" />
      <span className="text-sm font-medium text-slate-600">Loading the island map...</span>
      <span className="text-xs text-slate-400 mt-1">Find places to explore at your own pace</span>
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
        const matchDesc = (p.short_description || '').toLowerCase().includes(q);
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
    <div className={`${styles.workspace} h-[calc(100dvh-64px)] sm:h-[calc(100dvh-70px)] flex flex-col overflow-hidden`}>
      
      {/* ━━━ TOP BAR / EXPEDITION HEADER ━━━ */}
      <div className="bg-[#fafbf7] border-b border-[#e0e5da] px-3 sm:px-6 py-2.5 sm:py-3 flex-shrink-0 z-30 shadow-xs">
        <div className="max-w-full flex items-center justify-between gap-4">
          
          {/* Title & Stats */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#edf3e9] text-[#36583e] border border-[#dce5d4] flex items-center justify-center flex-shrink-0 shadow-xs">
              <Map className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-semibold text-slate-900 tracking-tight">
                  Explore Sri Lanka
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1.5 bg-[#edf3e9] text-[#36583e] text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-[#dce5d4]">
                  <span className="w-2 h-2 rounded-full bg-[#edf3e9]0 animate-pulse" />
                  Island guide
                </span>
              </div>
              <p className="text-slate-500 text-xs truncate">
                Showing <strong className="text-[#36583e] font-medium">{filteredPlaces.length}</strong> of {places.length} destinations
              </p>
            </div>
          </div>

          {/* Quick Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isFiltered && (
              <button
                onClick={resetAllFilters}
                className="inline-flex items-center gap-1 text-xs font-medium text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset Filters</span>
              </button>
            )}

            {/* Mobile Tab Switcher */}
            <div className="lg:hidden flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setMobileTab('list')}
                aria-pressed={mobileTab === 'list'}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  mobileTab === 'list'
                    ? 'bg-white text-[#36583e] shadow-xs'
                    : 'text-slate-500'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>List ({filteredPlaces.length})</span>
              </button>
              <button
                aria-pressed={mobileTab === 'map'}
                onClick={() => {
                  setMobileTab('map');
                  setRecenterCount((c) => c + 1);
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  mobileTab === 'map'
                    ? 'bg-[#294e39] text-white shadow-xs'
                    : 'text-slate-500'
                }`}
              >
                <Map className="w-3.5 h-3.5" />
                <span>Map</span>
              </button>
            </div>

            <Link
              href="/destinations"
              className="hidden md:inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-[#36583e] px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <span>All destinations</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* ━━━ MAIN WORKSPACE (SPLIT LAYOUT) ━━━ */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* ━━━━ LEFT SIDEBAR: MINIMALIST DIRECTORY & PLACES LIST ━━━━ */}
        <aside
          className={`w-full lg:w-[360px] xl:w-[390px] bg-[#fafbf7] border-r border-slate-200/80 flex flex-col flex-shrink-0 z-20 h-full overflow-hidden transition-all duration-300 ${
            mobileTab === 'list' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {/* Minimalist Filters Header Area */}
          <div className="px-4 py-3.5 border-b border-slate-100 space-y-2.5 bg-white flex-shrink-0">
            
            {/* 1. Search Bar (Clean, soft borderless pill) */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setSelectedPlace(null); }}
                placeholder="Search places, towns, districts..."
                aria-label="Search destinations"
                className="w-full bg-slate-100/70 hover:bg-slate-100 focus:bg-white focus:ring-2 focus:ring-[#294e39]/20 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-900 placeholder:text-slate-400 transition-all border-0 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* 2. Compact Inline Filter Pills (Category, Province, Rating) */}
            <div className="flex items-center gap-1.5">
              {/* Category */}
              <select
                value={selectedCategory}
                aria-label="Category"
                onChange={(e) => { setSelectedCategory(e.target.value as CategoryType); setSelectedPlace(null); }}
                className="flex-1 min-w-0 bg-slate-100/70 hover:bg-slate-100 text-slate-700 text-[11px] font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer border-0 transition-colors truncate"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.label} value={cat.label}>
                    {cat.label === 'All' ? 'All Categories' : cat.label}
                  </option>
                ))}
              </select>

              {/* Province */}
              <select
                value={selectedProvince}
                aria-label="Province"
                onChange={(e) => { setSelectedProvince(e.target.value); setSelectedPlace(null); }}
                className="flex-1 min-w-0 bg-slate-100/70 hover:bg-slate-100 text-slate-700 text-[11px] font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer border-0 transition-colors truncate"
              >
                {PROVINCES.map((prov) => (
                  <option key={prov} value={prov}>
                    {prov === 'All Provinces' ? 'All Provinces' : prov.replace(' Province', '')}
                  </option>
                ))}
              </select>

              {/* Rating */}
              <select
                value={minRating}
                aria-label="Minimum rating"
                onChange={(e) => { setMinRating(parseFloat(e.target.value)); setSelectedPlace(null); }}
                className="bg-slate-100/70 hover:bg-slate-100 text-slate-700 text-[11px] font-semibold rounded-lg px-2 py-1.5 focus:outline-none cursor-pointer border-0 transition-colors shrink-0"
              >
                {RATING_FILTERS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Subheader: Result Count & Featured Tag */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100/80 bg-slate-50/50 flex-shrink-0">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              {searchQuery || selectedCategory !== 'All' || selectedProvince !== 'All Provinces'
                ? `Results (${filteredPlaces.length})`
                : `Destinations (${filteredPlaces.length})`}
            </span>
            
            {featuredInView.length > 0 && !isFiltered && (
              <span className="text-[10px] text-amber-700 bg-amber-50 font-medium px-2 py-0.5 rounded-full">
                ★ {featuredInView.length} Featured
              </span>
            )}
          </div>

          {/* 5. Minimalist Destination Items List (No heavy box borders!) */}
          <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
            {loading ? (
              <div className="py-16 text-center text-slate-500">
                <Loader2 className="w-5 h-5 animate-spin text-[#36583e] mx-auto mb-2" />
                <span className="text-xs font-semibold">Loading destinations...</span>
              </div>
            ) : filteredPlaces.length === 0 ? (
              <div className="py-12 text-center p-6">
                <Search className="w-7 h-7 text-slate-300 mx-auto mb-2" />
                <h4 className="text-xs font-medium text-slate-700 mb-1">No spots found</h4>
                <p className="text-[11px] text-slate-400 mb-2.5">
                  Try adjusting your filters or search term.
                </p>
                <button
                  onClick={resetAllFilters}
                  className="text-xs font-medium text-[#36583e] hover:underline cursor-pointer"
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
                    role="button"
                    tabIndex={0}
                    aria-label={`Show ${place.name} on map`}
                    aria-pressed={isSelected}
                    onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.currentTarget.click(); } }}
                    onClick={() => {
                      setSelectedPlace(place);
                      if (window.innerWidth < 1024) {
                        setMobileTab('map');
                      }
                    }}
                    className={`group relative cursor-pointer p-2.5 rounded-xl transition-all duration-150 flex items-center gap-3 ${
                      isSelected
                        ? 'bg-[#edf3e9] text-[#203b2c]'
                        : 'hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    {/* Active Accent Indicator */}
                    {isSelected && (
                      <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[#294e39]" />
                    )}

                    {/* Clean Thumbnail */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 relative">
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
                        <span className="absolute top-1 left-1 bg-amber-400 text-slate-950 text-[8.5px] font-medium px-1 rounded shadow-xs">
                          ★
                        </span>
                      )}
                    </div>

                    {/* Metadata & Typography */}
                    <div className="flex-1 min-w-0">
                      {/* Category & Province inline */}
                      <div className="flex items-center gap-1.5 text-[11px] mb-0.5 truncate">
                        <span className="font-semibold text-[#36583e] truncate">{place.category}</span>
                        <span className="text-slate-300">·</span>
                        <span className="text-slate-400 truncate">{place.province.replace(' Province', '')}</span>
                      </div>

                      <h4 className="font-medium text-slate-900 text-[13px] group-hover:text-[#36583e] transition-colors truncate leading-tight">
                        {place.name}
                      </h4>

                      <div className="flex items-center gap-1 text-slate-400 text-[11px] mt-0.5">
                        <MapPin size={10} className="text-slate-400 flex-shrink-0" />
                        <span className="truncate">{place.location}</span>
                      </div>

                      <div className="flex items-center justify-between mt-1 text-[11px]">
                        <div className="flex items-center gap-1">
                          <Star size={11} className="fill-amber-400 text-amber-400" />
                          <span className="font-medium text-slate-800 text-[11px]">{place.rating}</span>
                          <span className="text-[10px] text-slate-400">({place.review_count})</span>
                        </div>

                        <span className="text-[11px] font-medium text-slate-400 group-hover:text-[#36583e] flex items-center gap-0.5 transition-colors">
                          <span>Pin</span>
                          <Navigation size={9} />
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
        <div
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

          <details className={styles.legend}>
            <summary>Map key <Layers size={14} /></summary>
            <div className={styles.legendItems}>
              {CATEGORIES.filter(category => category.label !== 'All').map(category => {
                const Icon = category.icon;
                return <div key={category.label}><span style={{ background: categoryIconConfig[category.label]?.bg1 }}><Icon size={14} /></span>{category.label}</div>;
              })}
            </div>
          </details>

          {/* Mobile Selected Place Bottom Preview Card */}
          {selectedPlace && mobileTab === 'map' && (
            <div className="lg:hidden absolute bottom-14 inset-x-3 z-[1002] bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200 p-3 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
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
                  <span className="text-[10px] font-medium text-[#36583e] bg-[#edf3e9] px-1.5 py-0.2 rounded border border-[#dce5d4]">
                    {selectedPlace.category}
                  </span>
                  <span className="flex items-center gap-0.5 text-[11px] font-semibold text-slate-900">
                    <Star size={11} className="fill-amber-400 text-amber-400" />
                    {selectedPlace.rating}
                  </span>
                </div>
                <h4 className="font-semibold text-slate-900 text-xs sm:text-sm truncate">
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
                  className="bg-[#294e39] hover:bg-[#edf3e9]0 text-white text-xs font-medium px-3 py-1.5 rounded-lg active:scale-95 transition-all text-center shadow-xs"
                >
                  View
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
