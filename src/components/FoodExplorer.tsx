'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Share2, ChevronDown, Check } from 'lucide-react';

import { FOODS_DATA, FoodDishItem } from '@/data/foodsData';
import { useWishlist } from '@/context/WishlistContext';


const CHIP_CATEGORIES = [
  { filter: 'all', label: 'All', tintClass: '' },
  { filter: 'street', label: '🌶 Street Food', tintClass: 'tint-amber' },
  { filter: 'curry', label: '🍛 Rice & Curry', tintClass: 'tint-green' },
  { filter: 'seafood', label: '🐟 Seafood', tintClass: 'tint-blue' },
  { filter: 'sweets', label: '🍯 Sweets', tintClass: 'tint-rose' },
  { filter: 'drinks', label: '🥤 Drinks', tintClass: 'tint-purple' },
];

const PER_PAGE = 12;

export default function FoodExplorer() {
  const { isFoodSaved, toggleFoodWishlist } = useWishlist();
  const [activeFilter, setActiveFilter] = useState('all');
  const [shownCount, setShownCount] = useState(PER_PAGE);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [showToast, setShowToast] = useState(false);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: FOODS_DATA.length };
    FOODS_DATA.forEach((item) => {
      counts[item.tag] = (counts[item.tag] || 0) + 1;
    });
    return counts;
  }, []);

  // Filtered dishes
  const filteredList = useMemo(() => {
    return FOODS_DATA.filter(
      (item) => activeFilter === 'all' || item.tag === activeFilter
    );
  }, [activeFilter]);

  const displayedList = useMemo(() => {
    return filteredList.slice(0, shownCount);
  }, [filteredList, shownCount]);

  // Trigger floating toast message
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  // Toggle Save button
  const handleToggleSave = (e: React.MouseEvent, dish: FoodDishItem) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFoodWishlist(dish.id, dish.title);
  };

  // Share dish link
  const handleShare = async (e: React.MouseEvent, title: string, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    const url = typeof window !== 'undefined' ? `${window.location.origin}/food/${id}` : '';
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${title} — Uncover Ceylon`,
          text: `Check out authentic ${title} in Sri Lanka!`,
          url,
        });
        return;
      } catch {}
    }
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      triggerToast(`Copied link to "${title}"!`);
    }
  };

  return (
    <div className="font-['Plus_Jakarta_Sans',system-ui,-apple-system,sans-serif] text-[#111111] bg-white pb-14 sm:pb-20">
      <div className="w-full max-w-[1400px] mx-auto px-3.5 sm:px-6">
        
        {/* ============================================
             SECTION HEAD (From deepseek_html_20261015_381141.html)
             ============================================ */}
        <div className="pt-4 sm:pt-10 pb-3 sm:pb-5">
          <h1 className="text-2xl sm:text-4xl lg:text-[42px] font-extrabold tracking-[-0.035em] leading-[1.15] mb-1.5 sm:mb-2 text-[#111111]">
            Food &amp; Flavors
          </h1>
          <p className="text-[#767676] text-xs sm:text-base font-medium max-w-xl leading-relaxed">
            From sizzling street kottu to sweet coconut treacle — taste the island, one bite at a time.
          </p>
        </div>

        {/* ============================================
             FILTER CHIPS BAR (Scrollable Pinterest-style)
             ============================================ */}
        <div className="-mx-3.5 px-3.5 sm:mx-0 sm:px-0 flex items-center gap-1.5 sm:gap-2 pb-4 sm:pb-7 overflow-x-auto no-scrollbar scroll-smooth">
          {/* Circular Filters Icon */}
          <button
            type="button"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-[#e9e9e9] flex items-center justify-center text-[#111111] flex-shrink-0 bg-white hover:bg-[#f7f7f7] hover:border-[#cfcfcf] transition-all cursor-pointer"
            aria-label="Filters"
          >
            <svg
              className="w-3.5 h-3.5 sm:w-4 sm:h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
            >
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="7" y1="12" x2="17" y2="12" />
              <line x1="10" y1="18" x2="14" y2="18" />
            </svg>
          </button>

          {/* Category Chips with Counts */}
          {CHIP_CATEGORIES.map((cat) => {
            const isActive = activeFilter === cat.filter;
            const count = categoryCounts[cat.filter] || 0;

            let tintStyles = 'bg-white border-[#e9e9e9] text-[#111111] hover:bg-[#f7f7f7] hover:border-[#cfcfcf]';
            if (cat.tintClass === 'tint-amber') {
              tintStyles = 'bg-[#fef3c7] border-[#fde68a] text-[#92400e] hover:bg-[#fde68a]';
            } else if (cat.tintClass === 'tint-green') {
              tintStyles = 'bg-[#dcfce7] border-[#bbf7d0] text-[#166534] hover:bg-[#bbf7d0]';
            } else if (cat.tintClass === 'tint-blue') {
              tintStyles = 'bg-[#eef2ff] border-[#e0e7ff] text-[#3730a3] hover:bg-[#e0e7ff]';
            } else if (cat.tintClass === 'tint-rose') {
              tintStyles = 'bg-[#fee2e2] border-[#fecaca] text-[#991b1b] hover:bg-[#fecaca]';
            } else if (cat.tintClass === 'tint-purple') {
              tintStyles = 'bg-[#ede9fe] border-[#ddd6fe] text-[#5b21b6] hover:bg-[#ddd6fe]';
            }

            return (
              <button
                key={cat.filter}
                type="button"
                onClick={() => {
                  setActiveFilter(cat.filter);
                  setShownCount(PER_PAGE);
                }}
                className={`inline-flex items-center gap-1 sm:gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold border transition-all whitespace-nowrap flex-shrink-0 cursor-pointer active:scale-95 ${
                  isActive
                    ? '!bg-[#111111] !text-white !border-[#111111] shadow-xs'
                    : tintStyles
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[11px] sm:text-xs font-bold ${isActive ? 'opacity-75' : 'opacity-55'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ============================================
             MASONRY GRID (Pinterest-style: 2 columns on Mobile)
             ============================================ */}
        {displayedList.length > 0 ? (
          <div className="food-masonry">
            {displayedList.map((dish, i) => {
              const isSaved = isFoodSaved(dish.id);
              const [loc, type] = dish.sub ? dish.sub.split(' · ') : [dish.locations.split(' · ')[0], dish.cuisine];

              return (
                <article
                  key={dish.id}
                  className="card group cursor-pointer mb-2.5 sm:mb-4 break-inside-avoid block"
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  <Link href={`/food/${dish.id}`} className="block">
                    {/* Image Wrapper */}
                    <div className="card-img relative rounded-[14px] sm:rounded-[18px] overflow-hidden bg-[#eaeaea]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={dish.img}
                        alt={dish.title}
                        loading="lazy"
                        className="w-full h-auto block object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.3,1)]"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.onerror = null;
                          target.src = `https://picsum.photos/seed/${dish.seed}/500/700`;
                        }}
                      />

                      {/* Top subtle hover gradient */}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                      {/* Red Pinterest Save button on top right (Always visible on touch/mobile) */}
                      <button
                        type="button"
                        onClick={(e) => handleToggleSave(e, dish)}
                        className={`save-btn absolute top-2 right-2 sm:top-3 sm:right-3 z-10 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-extrabold tracking-wide transition-all duration-200 cursor-pointer ${
                          isSaved
                            ? '!bg-[#111111] text-white shadow-md !opacity-100 !translate-y-0'
                            : 'bg-[#ff3347] text-white shadow-[0_3px_10px_rgba(255,51,71,0.35)] hover:bg-[#e11d33] active:scale-95 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 translate-y-0 sm:-translate-y-1 sm:group-hover:translate-y-0'
                        }`}
                      >
                        {isSaved ? 'Saved' : 'Save'}
                      </button>

                      {/* Bottom hover action buttons (Desktop only) */}
                      <div className="card-actions hidden sm:flex absolute bottom-3 left-3 right-3 items-center justify-between z-10 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto">
                        <span
                          className="action-pill inline-flex items-center gap-1.5 bg-white text-[#111111] px-3 py-1.5 rounded-full text-xs font-bold shadow-[0_2px_8px_rgba(0,0,0,0.15)] hover:bg-[#111111] hover:text-white transition-colors"
                        >
                          <span>Visit site</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </span>

                        <button
                          type="button"
                          onClick={(e) => handleShare(e, dish.title, dish.id)}
                          className="icon-round w-8 h-8 rounded-full bg-white text-[#111111] flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.15)] hover:bg-[#111111] hover:text-white transition-colors cursor-pointer"
                          aria-label="Share"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Card Meta */}
                    <div className="card-meta pt-1.5 sm:pt-2.5 px-0.5">
                      <h3 className="card-title text-[13px] sm:text-[15px] font-bold text-[#111111] leading-tight sm:leading-snug mb-0.5 sm:mb-1 line-clamp-2">
                        {dish.title}
                      </h3>
                      <div className="card-sub text-[10px] sm:text-xs text-[#767676] font-medium flex items-center gap-1 sm:gap-1.5 flex-wrap">
                        <span>{loc}</span>
                        <span className="w-1 h-1 rounded-full bg-[#c8c8c8]" />
                        <span>{type}</span>
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20 px-4 text-[#767676]">
            <span className="text-4xl block mb-2">🍽️</span>
            <p className="font-bold text-base text-[#111111]">No dishes in this category yet.</p>
          </div>
        )}

        {/* ============================================
             LOAD MORE (Pinterest pagination)
             ============================================ */}
        {filteredList.length > shownCount && (
          <div className="text-center pt-8">
            <button
              type="button"
              onClick={() => setShownCount((prev) => prev + PER_PAGE)}
              className="load-btn inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-bold text-[#111111] bg-white border border-[#e9e9e9] hover:bg-[#111111] hover:text-white hover:border-[#111111] transition-all cursor-pointer shadow-xs"
            >
              <span>Load more flavors</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>

      {/* ============================================
           TOAST NOTIFICATION (From deepseek HTML)
           ============================================ */}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#111111] text-white px-5 py-3 rounded-full text-sm font-bold shadow-[0_12px_30px_rgba(0,0,0,0.25)] z-[200] transition-all duration-300 pointer-events-none flex items-center gap-2 ${
          showToast ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}
      >
        <Check className="w-4 h-4 text-[#4ade80] stroke-[3]" />
        <span>{toastMessage}</span>
      </div>

      {/* CSS Styles for Pinterest-style Masonry Columns */}
      <style jsx>{`
        .food-masonry {
          column-count: 5;
          column-gap: 1rem;
        }
        @media (max-width: 1300px) {
          .food-masonry {
            column-count: 4;
            column-gap: 0.9rem;
          }
        }
        @media (max-width: 1000px) {
          .food-masonry {
            column-count: 3;
            column-gap: 0.8rem;
          }
        }
        @media (max-width: 768px) {
          .food-masonry {
            column-count: 2;
            column-gap: 0.55rem;
          }
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
