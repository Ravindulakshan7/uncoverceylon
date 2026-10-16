'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronDown, Check } from 'lucide-react';
import { CULTURE_DATA, CultureHeritageItem } from '@/data/cultureData';
import { useWishlist } from '@/context/WishlistContext';

const CHIP_CATEGORIES = [
  { filter: 'all', label: 'All', tintClass: '' },
  { filter: 'unesco', label: '🏛️ UNESCO Wonders', tintClass: 'tint-amber' },
  { filter: 'temples', label: '🛕 Sacred Temples', tintClass: 'tint-green' },
  { filter: 'citadels', label: '🏰 Ancient Citadels', tintClass: 'tint-blue' },
  { filter: 'rituals', label: '🔥 Sacred Rituals', tintClass: 'tint-rose' },
  { filter: 'crafts', label: '🎭 Folk Crafts', tintClass: 'tint-purple' },
  { filter: 'pilgrimage', label: '⛰️ Pilgrimage', tintClass: 'tint-amber' },
];

const PER_PAGE = 12;

export default function CultureExplorer() {
  const { isCultureSaved, toggleCultureWishlist } = useWishlist();
  const [activeFilter, setActiveFilter] = useState('all');
  const [shownCount, setShownCount] = useState(PER_PAGE);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [showToast, setShowToast] = useState(false);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: CULTURE_DATA.length };
    CULTURE_DATA.forEach((item) => {
      counts[item.tag] = (counts[item.tag] || 0) + 1;
    });
    return counts;
  }, []);

  // Filtered list
  const filteredList = useMemo(() => {
    return CULTURE_DATA.filter(
      (item) => activeFilter === 'all' || item.tag === activeFilter
    );
  }, [activeFilter]);

  const displayedList = useMemo(() => {
    return filteredList.slice(0, shownCount);
  }, [filteredList, shownCount]);

  // Floating toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  // Toggle Save button
  const handleToggleSave = (e: React.MouseEvent<HTMLButtonElement>, item: CultureHeritageItem) => {
    e.preventDefault();
    e.stopPropagation();
    const willSave = !isCultureSaved(item.id);
    toggleCultureWishlist(item.id, item.title);
    if (willSave && typeof window !== 'undefined') {
      const rect = e.currentTarget.getBoundingClientRect();
      window.dispatchEvent(
        new CustomEvent('fly-heart-to-nav', {
          detail: {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
          },
        })
      );
    }
  };

  return (
    <div className="text-[#111111] bg-white pb-14 sm:pb-20">
      <div className="w-full max-w-[1400px] mx-auto px-3.5 sm:px-6">
        
        {/* ============================================
             SECTION HEADER (Clean Editorial)
             ============================================ */}
        <div className="pt-4 sm:pt-10 pb-3 sm:pb-5">
          <h1 className="text-2xl sm:text-4xl lg:text-[42px] font-extrabold tracking-[-0.035em] leading-[1.15] mb-1.5 sm:mb-2 text-[#111111]">
            Culture &amp; Heritage
          </h1>
          <p className="text-[#767676] text-xs sm:text-base font-medium max-w-2xl leading-relaxed">
            Ancient sacred kingdoms, rock-cut Buddhas, colonial fortresses, and living folklore spanning 2,500 years across Ceylon.
          </p>
        </div>

        {/* ============================================
             FILTER CHIPS BAR (Pinterest-style scrollable)
             ============================================ */}
        <div className="-mx-3.5 px-3.5 sm:mx-0 sm:px-0 flex items-center gap-1.5 sm:gap-2 pb-4 sm:pb-7 overflow-x-auto no-scrollbar scroll-smooth">
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
                aria-pressed={isActive}
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
          <div className="culture-masonry columns-2 sm:columns-3 md:columns-3 lg:columns-4 xl:columns-5 gap-2 sm:gap-3.5 lg:gap-4">
            {displayedList.map((item, i) => {
              const isSaved = isCultureSaved(item.id);
              const [loc] = item.sub.split(' · ');

              return (
                <article
                  key={item.id}
                  className="culture-card card group cursor-pointer break-inside-avoid inline-block w-full mb-2 sm:mb-3.5"
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  <Link href={`/culture/${item.id}`} className="block">
                    {/* Image Wrapper */}
                    <div className="card-img relative rounded-xl sm:rounded-2xl overflow-hidden bg-[#eaeaea] shadow-xs">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.img}
                        alt={item.title}
                        loading="lazy"
                        className="w-full h-auto block object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.3,1)]"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.onerror = null;
                          target.src = `https://picsum.photos/seed/${item.seed}/500/700`;
                        }}
                      />

                      {/* Top subtle hover gradient */}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                      {/* Red Pinterest Save button on top right (Always visible on touch/mobile) */}
                      <button
                        type="button"
                        onClick={(e) => handleToggleSave(e, item)}
                        className={`save-btn absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-10 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-black tracking-wide transition-all duration-200 cursor-pointer active:scale-95 ${
                          isSaved
                            ? '!bg-[#111111] text-white shadow-md !opacity-100 !translate-y-0'
                            : 'bg-[#ff3347] text-white shadow-[0_3px_10px_rgba(255,51,71,0.35)] hover:bg-[#e11d33] opacity-95 sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100 translate-y-0 sm:-translate-y-1 sm:group-hover:translate-y-0 focus-visible:translate-y-0'
                        }`}
                      >
                        {isSaved ? 'Saved' : 'Save'}
                      </button>
                    </div>

                    {/* Card Meta */}
                    <div className="card-meta pt-1.5 sm:pt-2 px-0.5">
                      <h3 className="card-title text-xs sm:text-[14px] font-extrabold text-[#111111] leading-tight sm:leading-snug mb-0.5 line-clamp-2">
                        {item.title}
                      </h3>
                      <div className="card-sub text-[10px] sm:text-xs text-[#767676] font-medium flex items-center gap-1 sm:gap-1.5 flex-wrap">
                        <span>{loc}</span>
                        <span className="w-1 h-1 rounded-full bg-[#c8c8c8]" />
                        <span className="font-semibold text-blue-700">{item.categoryLabel}</span>
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
            <span className="text-4xl block mb-2">🏛️</span>
            <p className="font-bold text-base text-[#111111]">No cultural sites in this category yet.</p>
          </div>
        )}

        {/* ============================================
             LOAD MORE (Pinterest pagination)
             ============================================ */}
        {filteredList.length > shownCount && (
          <div className="text-center pt-6 sm:pt-8">
            <button
              type="button"
              onClick={() => setShownCount((prev) => prev + PER_PAGE)}
              className="load-btn inline-flex items-center gap-2 px-6 py-2.5 sm:px-7 sm:py-3 rounded-full text-xs sm:text-sm font-bold text-[#111111] bg-white border border-[#e9e9e9] hover:bg-[#111111] hover:text-white hover:border-[#111111] transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <span>Load more heritage</span>
              <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        )}

      </div>

      {/* ============================================
           TOAST NOTIFICATION
           ============================================ */}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#111111] text-white px-5 py-3 rounded-full text-xs sm:text-sm font-bold shadow-[0_12px_30px_rgba(0,0,0,0.25)] z-[200] transition-all duration-300 pointer-events-none flex items-center gap-2 ${
          showToast ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}
      >
        <Check className="w-4 h-4 text-[#4ade80] stroke-[3]" />
        <span>{toastMessage}</span>
      </div>
    </div>
  );
}
