'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, RotateCcw, Heart, MapPin, ArrowRight, ArrowUpRight, X, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export interface FoodDish {
  id: number;
  title: string;
  kicker: string;
  tagline: string;
  badge: string;
  desc: string;
  image: string;
  tags: string[];
  search: string;
  location: string;
  price: string;
  regions: string;
}

export const ALL_FOOD_DISHES: FoodDish[] = [
  {
    id: 1,
    title: 'Rice & Curry',
    kicker: '01 · Everyday favourite',
    tagline: '7-Curry Clay Pot Feast',
    badge: 'Local classic',
    desc: 'A colourful island staple with fragrant rice, seasonal vegetables, sambols and richly spiced curries.',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=85',
    tags: ['traditional', 'vegetarian'],
    search: 'rice curry rice and curry traditional lunch vegetables spices polos dhal village',
    location: 'Island-wide',
    price: 'Budget friendly',
    regions: 'Island-wide • Matale • Ella',
  },
  {
    id: 2,
    title: 'Kottu Roti',
    kicker: '02 · Sizzling favourite',
    tagline: 'The Sound of Sri Lankan Nights',
    badge: 'Street-food icon',
    desc: 'Chopped roti tossed on a hot griddle with vegetables, egg and your choice of flavourful curry.',
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=85',
    tags: ['street-food', 'traditional'],
    search: 'kottu roti street food chopped flatbread vegetables egg chicken colombo cheese night',
    location: 'Colombo & beyond',
    price: 'Easy to find',
    regions: 'Colombo • Galle Face • Kandy',
  },
  {
    id: 3,
    title: 'Jaffna Seafood Curry',
    kicker: '03 · From the coast',
    tagline: 'Fiery Crab & Ocean Grills',
    badge: 'Coastal flavour',
    desc: 'Bold northern flavours, aromatic spices and seafood dishes shaped by the island\'s coastal traditions.',
    image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=900&q=85',
    tags: ['seafood', 'traditional'],
    search: 'jaffna seafood crab curry northern sri lanka spicy coastal lagoon ocean prawn',
    location: 'Northern Province',
    price: 'Seafood',
    regions: 'Jaffna • Negombo • Mirissa',
  },
  {
    id: 4,
    title: 'Hoppers (Appa)',
    kicker: '04 · Morning ritual',
    tagline: 'Bowl-Shaped Coconut Pancakes',
    badge: 'Breakfast pick',
    desc: 'Bowl-shaped, lightly crisp pancakes with soft centres, often served with lunu miris or curry.',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=900&q=85',
    tags: ['vegetarian', 'traditional'],
    search: 'hoppers appa breakfast coconut milk fermented rice flour vegetarian egg lunu miris',
    location: 'Island-wide',
    price: 'Vegetarian option',
    regions: 'All Provinces',
  },
  {
    id: 5,
    title: 'Pol Roti & Lunu Miris',
    kicker: '05 · Comfort food',
    tagline: 'Rustic Hearth Flatbread',
    badge: 'Homestyle',
    desc: 'Coconut flatbread paired with a fiery onion-and-chilli sambol for a simple, memorable bite.',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=85',
    tags: ['traditional', 'vegetarian', 'street-food'],
    search: 'pol roti coconut flatbread sambol breakfast village rustic home chilli lunu miris',
    location: 'Village kitchens',
    price: 'Budget friendly',
    regions: 'Island-wide • Hill Country',
  },
  {
    id: 6,
    title: 'Traditional Sweets',
    kicker: '06 · Sweet memories',
    tagline: 'Festive Confections & Delicacies',
    badge: 'Sweet tradition',
    desc: 'Discover festive favourites such as kavum, kokis and aluwa, often shared during celebrations.',
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=900&q=85',
    tags: ['sweets', 'traditional'],
    search: 'kavum kokis aluwa sri lankan sweets avurudu sweet snacks festival new year celebration',
    location: 'Local bakeries',
    price: 'Sweet treats',
    regions: 'All Provinces',
  },
  {
    id: 7,
    title: 'Ambul Thiyal',
    kicker: '07 · Coastal heritage',
    tagline: 'Clay Pot Black Sour Fish',
    badge: 'Southern speciality',
    desc: 'A distinctive sour fish preparation associated with the south, traditionally seasoned with goraka and spices.',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=85',
    tags: ['seafood', 'traditional'],
    search: 'ambul thiyal sour fish curry galle matara southern province tuna goraka black',
    location: 'Southern Province',
    price: 'Seafood',
    regions: 'Southern Province • Galle • Matara',
  },
  {
    id: 8,
    title: 'Isso Wade',
    kicker: '08 · Street-side bite',
    tagline: 'Crispy Sunset Prawn Fritters',
    badge: 'Street-side bite',
    desc: 'A crunchy lentil fritter topped with prawns, best enjoyed fresh from a busy seaside snack stall.',
    image: 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=900&q=85',
    tags: ['street-food', 'seafood'],
    search: 'isso wade prawn fritter snack galle face green colombo seaside beach sunset',
    location: 'Colombo seaside',
    price: 'Street food',
    regions: 'Colombo • Galle Face Green • Negombo',
  },
  {
    id: 9,
    title: 'Highland Ceylon Tea',
    kicker: '09 · Misty Peaks',
    tagline: 'The World’s Finest Brew',
    badge: 'Highland Heritage',
    desc: 'Handpicked two leaves and a bud from misty mountains above 1,800m. Golden liquor with subtle floral notes.',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=900&q=85',
    tags: ['traditional', 'sweets'],
    search: 'tea ceylon tea nuwara eliya mist mountain brew estate highland golden leaf',
    location: 'Central Highlands',
    price: 'World famous',
    regions: 'Nuwara Eliya • Kandy • Ella',
  },
  {
    id: 10,
    title: 'Curd & Kithul Treacle',
    kicker: '10 · Natural nectar',
    tagline: 'Smoky Buffalo Curd & Palm Nectar',
    badge: 'Ancient Sweet',
    desc: 'Rich, thick water buffalo curd poured with smoky, amber-gold sweet nectar tapped from wild highland Kithul palm trees.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=85',
    tags: ['sweets', 'traditional', 'vegetarian'],
    search: 'curd kithul treacle buffalo curd sweet dessert ruhuna tissamaharama honey palm',
    location: 'Ruhuna & South',
    price: 'Artisan dessert',
    regions: 'Southern Province • Tissamaharama',
  },
];

const FILTER_CHIPS = [
  { id: 'all', label: '✦ All flavours', badgeClass: 'bg-[#eef3f0] text-[#3f5650] hover:bg-[#087f68] hover:text-white' },
  { id: 'street-food', label: 'Street food', badgeClass: 'bg-[#fff0d9] text-[#854d0e] hover:bg-[#fde68a]' },
  { id: 'seafood', label: 'Seafood', badgeClass: 'bg-[#e0f3ff] text-[#0369a1] hover:bg-[#bae6fd]' },
  { id: 'vegetarian', label: 'Vegetarian', badgeClass: 'bg-[#e4f5df] text-[#15803d] hover:bg-[#bbf7d0]' },
  { id: 'sweets', label: 'Sweets & snacks', badgeClass: 'bg-[#f8e7f1] text-[#9d174d] hover:bg-[#fbcfe8]' },
  { id: 'traditional', label: 'Traditional', badgeClass: 'bg-[#eef3f0] text-[#3f5650] hover:bg-[#d1fae5]' },
];

interface FoodExplorerProps {
  initialDishes?: FoodDish[];
}

export default function FoodExplorer({ initialDishes }: FoodExplorerProps) {
  const dishes = initialDishes && initialDishes.length > 0 ? initialDishes : ALL_FOOD_DISHES;
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [savedIds, setSavedIds] = useState<number[]>([]);

  // Filter dishes based on active category & search query
  const filteredDishes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return dishes.filter((dish) => {
      const matchesFilter = activeFilter === 'all' || dish.tags.includes(activeFilter);
      if (!matchesFilter) return false;
      if (!q) return true;

      const searchableText = `${dish.title} ${dish.desc} ${dish.search} ${dish.location} ${dish.badge} ${dish.price}`.toLowerCase();
      return searchableText.includes(q);
    });
  }, [dishes, activeFilter, searchQuery]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setActiveFilter('all');
  };

  const handleToggleSave = (e: React.MouseEvent, id: number, title: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (savedIds.includes(id)) {
      setSavedIds((prev) => prev.filter((item) => item !== id));
      toast('Removed from saved flavours', { icon: '🤍' });
    } else {
      setSavedIds((prev) => [...prev, id]);
      toast.success(`Saved "${title}" to your flavours! ❤️`);
    }
  };

  return (
    <div className="w-full">
      {/* ━━━ Intro Section (Matching uncoverceylon_food_test.html) ━━━ */}
      <section className="py-6 sm:py-10 border-b border-[#e8eeeb]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-widest text-[#087f68] mb-2.5">
              <span className="w-5 h-[2px] bg-[#087f68] rounded-full" />
              <span>A taste of the island</span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-[42px] font-black text-[#152b2a] tracking-tight leading-[1.12]">
              Flavours, stories & <br className="hidden sm:inline" />the soul of Sri Lanka.
            </h2>
            <p className="text-xs sm:text-[15px] text-[#687b78] mt-2.5 leading-relaxed font-medium">
              From sizzling street-food favourites to coastal seafood and generations-old recipes, discover the dishes that make every journey taste unforgettable.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-3.5 bg-white border border-[#e8eeeb] rounded-2xl p-3.5 px-5 shadow-xs self-start md:self-end">
            <div className="w-10 h-10 rounded-xl bg-[#e7f7f1] text-[#087f68] flex items-center justify-center font-black text-lg">
              ✦
            </div>
            <div>
              <strong className="block text-base sm:text-lg font-black text-[#152b2a] tracking-tight">9 provinces</strong>
              <span className="text-[11px] sm:text-xs text-[#687b78] font-medium">One island. Countless flavours.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ Search Panel & Filter Chips ━━━ */}
      <section id="food" className="pt-6 sm:pt-8" aria-label="Explore Sri Lankan food">
        
        {/* Search Input & Reset Button */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px] max-w-md h-12 bg-white border border-[#dfe8e3] rounded-2xl flex items-center px-3.5 gap-2.5 shadow-xs focus-within:border-[#087f68] focus-within:ring-2 focus-within:ring-[#087f68]/15 transition-all">
            <Search className="w-4 h-4 text-[#71827d] flex-shrink-0" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes, ingredients or places..."
              className="w-full bg-transparent border-none outline-none text-xs sm:text-sm text-[#152b2a] placeholder-[#71827d]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {(searchQuery || activeFilter !== 'all') && (
            <button
              onClick={handleResetFilters}
              type="button"
              className="h-12 px-4 rounded-2xl border border-[#dfe8e3] bg-white text-[#3f5650] text-xs font-bold hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset filters</span>
            </button>
          )}
        </div>

        {/* Chips Filter Row */}
        <div className="flex flex-wrap items-center gap-2 pt-4 pb-2" role="group" aria-label="Food filters">
          {FILTER_CHIPS.map((chip) => {
            const isActive = activeFilter === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => setActiveFilter(chip.id)}
                className={`px-3.5 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#087f68] text-white shadow-sm ring-2 ring-[#087f68]/30 scale-102'
                    : chip.badgeClass
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        {/* Section Heading & Live Counter */}
        <div className="flex items-end justify-between pt-5 pb-4 border-b border-[#edf1ef]">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-[#152b2a] tracking-tight">
              Must-try Sri Lankan flavours
            </h3>
            <p className="text-[11px] sm:text-xs text-[#687b78] mt-0.5 font-medium">
              Local favourites worth adding to your travel list.
            </p>
          </div>
          <span className="text-xs font-bold text-[#687b78] whitespace-nowrap bg-slate-100 px-2.5 py-1 rounded-full">
            {filteredDishes.length} {filteredDishes.length === 1 ? 'experience' : 'experiences'}
          </span>
        </div>

        {/* ━━━ Cards Grid (2-Column Mobile, 3/4-Column Desktop) ━━━ */}
        {filteredDishes.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5 pt-5 pb-10">
            {filteredDishes.map((dish) => {
              const isItemSaved = savedIds.includes(dish.id);
              return (
                <Link
                  key={dish.id}
                  href={`/food/${dish.id}`}
                  className="group block bg-white border border-[#e5ece8] rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer"
                >
                  {/* Photo with zoom on hover */}
                  <div className="relative aspect-[4/3] sm:h-48 w-full overflow-hidden bg-[#dce8e2]">
                    <Image
                      src={dish.image}
                      alt={dish.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
                      unoptimized
                    />

                    {/* Tag badge on top-left */}
                    <div className="absolute top-2 left-2 z-10">
                      <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-white/90 backdrop-blur-md text-[#23433b] border border-white/60 text-[9px] sm:text-[10px] font-black shadow-xs">
                        {dish.badge}
                      </span>
                    </div>

                    {/* Save Button on top-right */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleSave(e, dish.id, dish.title)}
                      className={`absolute top-2 right-2 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                        isItemSaved
                          ? 'bg-[#087f68] text-white shadow-md scale-105'
                          : 'bg-white/90 backdrop-blur-md text-[#28423b] hover:bg-white hover:scale-105 shadow-xs'
                      }`}
                      title={isItemSaved ? 'Saved to favourites' : 'Save to favourites'}
                      aria-label={`Save ${dish.title}`}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                          isItemSaved ? 'fill-white stroke-white' : 'stroke-current'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Card Body */}
                  <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[#c47b37] block truncate">
                        {dish.kicker}
                      </span>
                      <h4 className="text-xs sm:text-base font-black text-[#152b2a] tracking-tight mt-0.5 group-hover:text-[#087f68] transition-colors line-clamp-1">
                        {dish.title}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-[#71817c] leading-relaxed mt-1 mb-2 font-medium line-clamp-2">
                        {dish.desc}
                      </p>
                    </div>

                    {/* Card Meta Footer */}
                    <div className="pt-2 border-t border-[#edf1ef] flex items-center justify-between text-[10px] sm:text-[11px] text-[#71817c]">
                      <span className="flex items-center gap-1 font-semibold truncate text-[#50615e]">
                        <MapPin className="w-3 h-3 text-[#087f68] flex-shrink-0" />
                        <span className="truncate">{dish.location}</span>
                      </span>
                      <span className="text-[#087f68] font-black whitespace-nowrap ml-1">
                        {dish.price}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-14 px-4 my-6 bg-white border border-dashed border-[#d6e3dc] rounded-2xl">
            <strong className="block text-base font-black text-[#152b2a] mb-1">
              No flavours found yet
            </strong>
            <p className="text-xs text-[#687b78] max-w-sm mx-auto mb-4">
              Try another dish name, check your spelling, or select a different category chip above.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-full bg-[#087f68] text-white text-xs font-bold hover:bg-[#066a56] transition-colors cursor-pointer"
            >
              Reset all filters
            </button>
          </div>
        )}

        {/* ━━━ Bottom Emerald CTA Banner (Matching uncoverceylon_food_test.html) ━━━ */}
        <section className="my-6 sm:my-10 p-6 sm:p-9 rounded-3xl bg-gradient-to-r from-[#0c473e] to-[#087f68] text-white flex flex-col sm:flex-row justify-between sm:items-center gap-5 overflow-hidden relative shadow-lg">
          {/* Subtle background circular glow */}
          <div className="absolute right-0 top-0 w-72 h-72 rounded-full border border-white/10 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <div className="absolute right-8 top-0 w-96 h-96 rounded-full border border-white/5 -translate-y-1/2 translate-x-1/4 pointer-events-none" />

          <div className="relative z-10 max-w-xl">
            <h3 className="text-xl sm:text-2xl font-black tracking-tight mb-1 text-white">
              Let your next journey begin with a bite.
            </h3>
            <p className="text-xs sm:text-sm text-[#d0e9e2] font-medium">
              Explore Sri Lanka&apos;s destinations, food traditions and local favourites across every province.
            </p>
          </div>

          <Link
            href="/destinations"
            className="relative z-10 px-5 py-2.5 sm:py-3 rounded-full bg-white text-[#087f68] text-xs sm:text-sm font-extrabold hover:bg-slate-50 transition-colors whitespace-nowrap self-start sm:self-auto shadow-sm inline-flex items-center gap-1.5"
          >
            <span>Explore destinations</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </section>

      </section>
    </div>
  );
}
