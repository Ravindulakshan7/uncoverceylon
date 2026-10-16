'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlist } from '@/context/WishlistContext';
import { useLanguage } from '@/context/LanguageContext';
import { Place } from '@/types';
import { FOODS_DATA } from '@/data/foodsData';
import { CULTURE_DATA } from '@/data/cultureData';
import { EXPERIENCES_DATA } from '@/data/experiencesData';
import { X, Heart, Trash2, ArrowRight, MapPin, Printer, Utensils, Landmark, Compass } from 'lucide-react';
import OfflineGuideModal from '@/components/OfflineGuideModal';

export default function WishlistDrawer() {
  const {
    savedIds,
    savedFoodIds,
    savedCultureIds,
    savedExpIds,
    isDrawerOpen,
    setIsDrawerOpen,
    toggleWishlist,
    toggleFoodWishlist,
    toggleCultureWishlist,
    toggleExpWishlist,
    clearWishlist,
    clearFoodWishlist,
    clearCultureWishlist,
    clearExpWishlist,
    activeWishlistTab,
    setActiveWishlistTab,
  } = useWishlist();

  const { t } = useLanguage();
  const [allPlaces, setAllPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOfflineModalOpen, setIsOfflineModalOpen] = useState(false);

  // Fetch places when drawer opens to populate wishlist items
  useEffect(() => {
    if (isDrawerOpen && allPlaces.length === 0) {
      setLoading(true);
      fetch('/api/places')
        .then((res) => res.json())
        .then((data) => {
          if (data.places) setAllPlaces(data.places);
        })
        .catch(() => undefined)
        .finally(() => setLoading(false));
    }
  }, [isDrawerOpen, allPlaces.length]);

  const savedPlaces = allPlaces.filter((p) => savedIds.includes(p.id));
  const savedFoods = FOODS_DATA.filter((f) => savedFoodIds.includes(f.id));
  const savedCulture = CULTURE_DATA.filter((c) => savedCultureIds.includes(c.id));
  const savedExp = EXPERIENCES_DATA.filter((e) => savedExpIds.includes(e.id));

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  const handleClearActiveTab = () => {
    if (activeWishlistTab === 'places') clearWishlist();
    else if (activeWishlistTab === 'foods') clearFoodWishlist();
    else if (activeWishlistTab === 'culture') clearCultureWishlist();
    else if (activeWishlistTab === 'experiences') clearExpWishlist();
  };

  const getActiveCount = () => {
    if (activeWishlistTab === 'places') return savedPlaces.length;
    if (activeWishlistTab === 'foods') return savedFoods.length;
    if (activeWishlistTab === 'culture') return savedCulture.length;
    return savedExp.length;
  };

  const totalSavedAll = savedIds.length + savedFoodIds.length + savedCultureIds.length + savedExpIds.length;

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed inset-y-0 right-0 z-[10001] w-full max-w-md bg-[#f8fafc] shadow-2xl flex flex-col border-l border-slate-200"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 bg-white border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-500">
                    <Heart className="w-5 h-5 fill-rose-500" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                      {t('wishlist.title')}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {totalSavedAll} items saved across Ceylon
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {getActiveCount() > 0 && (
                    <button
                      onClick={handleClearActiveTab}
                      title={t('wishlist.clearAll')}
                      className="p-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    >
                      {t('wishlist.clearAll')}
                    </button>
                  )}
                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Tabs: Places, Flavors, Culture, Experiences */}
              <div className="grid grid-cols-4 gap-1 mt-4 p-1 bg-slate-100 rounded-xl text-center">
                <button
                  type="button"
                  onClick={() => setActiveWishlistTab('places')}
                  className={`py-1.5 px-1 rounded-lg text-[11px] font-bold transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                    activeWishlistTab === 'places'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 text-[#00aa6c]" />
                  <span>Places ({savedIds.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveWishlistTab('foods')}
                  className={`py-1.5 px-1 rounded-lg text-[11px] font-bold transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                    activeWishlistTab === 'foods'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Utensils className="w-3.5 h-3.5 text-amber-600" />
                  <span>Flavors ({savedFoodIds.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveWishlistTab('culture')}
                  className={`py-1.5 px-1 rounded-lg text-[11px] font-bold transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                    activeWishlistTab === 'culture'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Landmark className="w-3.5 h-3.5 text-blue-600" />
                  <span>Culture ({savedCultureIds.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveWishlistTab('experiences')}
                  className={`py-1.5 px-1 rounded-lg text-[11px] font-bold transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                    activeWishlistTab === 'experiences'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Exp ({savedExpIds.length})</span>
                </button>
              </div>
            </div>

            {/* List Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
              {activeWishlistTab === 'places' && (
                /* ━━━ PLACES TAB ━━━ */
                loading ? (
                  <div className="py-20 text-center text-sm text-slate-500">
                    Loading your saved places...
                  </div>
                ) : savedPlaces.length === 0 ? (
                  <div className="py-16 text-center flex flex-col items-center justify-center px-4 space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-slate-500">
                      <Heart className="w-7 h-7 text-[#00aa6c]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{t('wishlist.emptyTitle')}</h4>
                      <p className="text-xs text-slate-500 max-w-xs mt-1">
                        {t('wishlist.emptyDesc')}
                      </p>
                    </div>
                    <Link
                      href="/#destinations"
                      onClick={() => setIsDrawerOpen(false)}
                      className="inline-flex items-center gap-1.5 bg-[#00aa6c] hover:bg-[#008f5a] text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-xs"
                    >
                      <span>{t('wishlist.browseBtn')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ) : (
                  savedPlaces.map((place) => (
                    <div
                      key={place.id}
                      className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs hover:border-[#00aa6c]/50 transition-all flex gap-3 group relative"
                    >
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                        {place.image_url ? (
                          <Image
                            src={place.image_url}
                            alt={place.name}
                            fill
                            sizes="80px"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            unoptimized={true}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                            No Photo
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                        <div>
                          <div className="flex items-center gap-1.5 text-[11px] text-[#00aa6c] font-semibold mb-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00aa6c]" />
                            <span>{place.category}</span>
                          </div>
                          <h4 className="font-bold text-slate-900 text-sm truncate">
                            {place.name}
                          </h4>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 flex-shrink-0 text-slate-400" />
                            <span className="truncate">{place.location}</span>
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <Link
                            href={`/places/${place.id}`}
                            onClick={() => setIsDrawerOpen(false)}
                            className="text-xs font-bold text-[#00aa6c] hover:text-[#008f5a] flex items-center gap-1 group/btn"
                          >
                            <span>{t('wishlist.viewDetails')}</span>
                            <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                          </Link>
                          <button
                            onClick={() => toggleWishlist(place.id, place.name)}
                            title="Remove from saved"
                            className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )
              )}

              {activeWishlistTab === 'foods' && (
                /* ━━━ FOODS TAB ━━━ */
                savedFoods.length === 0 ? (
                  <div className="py-16 text-center flex flex-col items-center justify-center px-4 space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-slate-500">
                      <Utensils className="w-7 h-7 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">No Flavors Saved Yet</h4>
                      <p className="text-xs text-slate-500 max-w-xs mt-1">
                        Explore authentic Sri Lankan dishes and click &quot;Save&quot; to keep your favorite recipes handy!
                      </p>
                    </div>
                    <Link
                      href="/food"
                      onClick={() => setIsDrawerOpen(false)}
                      className="inline-flex items-center gap-1.5 bg-[#00aa6c] hover:bg-[#008f5a] text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-xs"
                    >
                      <span>Explore Street &amp; Curries</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ) : (
                  savedFoods.map((dish) => (
                    <div
                      key={dish.id}
                      className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs hover:border-amber-500/50 transition-all flex gap-3 group relative"
                    >
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={dish.img}
                          alt={dish.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                        <div>
                          <div className="flex items-center gap-1.5 text-[11px] text-amber-700 font-bold mb-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            <span>{dish.cuisine} · {dish.meal}</span>
                          </div>
                          <h4 className="font-bold text-slate-900 text-sm truncate">
                            {dish.title}
                          </h4>
                          <p className="text-xs text-slate-500 truncate mt-0.5">
                            {dish.sub || dish.locations}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <Link
                            href={`/food/${dish.id}`}
                            onClick={() => setIsDrawerOpen(false)}
                            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
                          >
                            <span>View Recipe</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                          <button
                            onClick={() => toggleFoodWishlist(dish.id, dish.title)}
                            title="Remove from saved flavors"
                            className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )
              )}

              {activeWishlistTab === 'culture' && (
                /* ━━━ CULTURE TAB ━━━ */
                savedCulture.length === 0 ? (
                  <div className="py-16 text-center flex flex-col items-center justify-center px-4 space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-slate-500">
                      <Landmark className="w-7 h-7 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">No Heritage Saved Yet</h4>
                      <p className="text-xs text-slate-500 max-w-xs mt-1">
                        Explore ancient kingdoms, rock citadels, and sacred temples and click &quot;Save&quot; to build your heritage trail!
                      </p>
                    </div>
                    <Link
                      href="/culture"
                      onClick={() => setIsDrawerOpen(false)}
                      className="inline-flex items-center gap-1.5 bg-[#00aa6c] hover:bg-[#008f5a] text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-xs"
                    >
                      <span>Browse Culture &amp; Heritage</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ) : (
                  savedCulture.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs hover:border-blue-500/50 transition-all flex gap-3 group relative"
                    >
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.img}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                        <div>
                          <div className="flex items-center gap-1.5 text-[11px] text-blue-700 font-bold mb-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            <span>{item.categoryLabel}</span>
                          </div>
                          <h4 className="font-bold text-slate-900 text-sm truncate">
                            {item.title}
                          </h4>
                          <p className="text-xs text-slate-500 truncate mt-0.5">
                            {item.sub}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <Link
                            href={`/culture/${item.id}`}
                            onClick={() => setIsDrawerOpen(false)}
                            className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1"
                          >
                            <span>View Heritage</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                          <button
                            onClick={() => toggleCultureWishlist(item.id, item.title)}
                            title="Remove from saved heritage"
                            className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )
              )}

              {activeWishlistTab === 'experiences' && (
                /* ━━━ EXPERIENCES TAB ━━━ */
                savedExp.length === 0 ? (
                  <div className="py-16 text-center flex flex-col items-center justify-center px-4 space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-slate-500">
                      <Compass className="w-7 h-7 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">No Experiences Saved Yet</h4>
                      <p className="text-xs text-slate-500 max-w-xs mt-1">
                        Save peeling surf breaks, scenic mountain rail trips, and wild leopard safaris for your dream Ceylon adventure!
                      </p>
                    </div>
                    <Link
                      href="/experiences"
                      onClick={() => setIsDrawerOpen(false)}
                      className="inline-flex items-center gap-1.5 bg-[#00aa6c] hover:bg-[#008f5a] text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-xs"
                    >
                      <span>Explore Island Adventures</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ) : (
                  savedExp.map((exp) => (
                    <div
                      key={exp.id}
                      className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs hover:border-emerald-500/50 transition-all flex gap-3 group relative"
                    >
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={exp.img}
                          alt={exp.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                        <div>
                          <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-bold mb-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00aa6c]" />
                            <span>{exp.categoryLabel} · {exp.badge}</span>
                          </div>
                          <h4 className="font-bold text-slate-900 text-sm truncate">
                            {exp.title}
                          </h4>
                          <p className="text-xs text-slate-500 truncate mt-0.5">
                            {exp.sub}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <Link
                            href={`/experiences/${exp.id}`}
                            onClick={() => setIsDrawerOpen(false)}
                            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                          >
                            <span>View Adventure</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                          <button
                            onClick={() => toggleExpWishlist(exp.id, exp.title)}
                            title="Remove from saved experiences"
                            className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )
              )}
            </div>

            {/* Footers for each tab */}
            {activeWishlistTab === 'places' && savedPlaces.length > 0 && (
              <div className="p-4 bg-white border-t border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                  <span>{t('wishlist.total')}:</span>
                  <span className="font-bold text-slate-900">{savedPlaces.length} places</span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOfflineModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 bg-[#00aa6c] hover:bg-[#008f5a] text-white font-bold py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-emerald-950/20 cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-amber-300" />
                  <span>{t('wishlist.exportPdf')}</span>
                </button>

                <Link
                  href="/map"
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 font-bold py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-xs"
                >
                  <MapPin className="w-4 h-4 text-[#00aa6c]" />
                  <span>{t('wishlist.viewOnMap')}</span>
                </Link>
              </div>
            )}

            {activeWishlistTab === 'foods' && savedFoods.length > 0 && (
              <div className="p-4 bg-white border-t border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                  <span>Total Saved Flavors:</span>
                  <span className="font-bold text-slate-900">{savedFoods.length} dishes</span>
                </div>
                <Link
                  href="/food"
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-[#00aa6c] hover:bg-[#008f5a] text-white font-bold py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-emerald-950/20"
                >
                  <Utensils className="w-4 h-4 text-amber-300" />
                  <span>Explore More Flavors</span>
                </Link>
              </div>
            )}

            {activeWishlistTab === 'culture' && savedCulture.length > 0 && (
              <div className="p-4 bg-white border-t border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                  <span>Total Saved Heritage:</span>
                  <span className="font-bold text-slate-900">{savedCulture.length} sites</span>
                </div>
                <Link
                  href="/culture"
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-[#00aa6c] hover:bg-[#008f5a] text-white font-bold py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-emerald-950/20"
                >
                  <Landmark className="w-4 h-4 text-white" />
                  <span>Explore All Heritage</span>
                </Link>
              </div>
            )}

            {activeWishlistTab === 'experiences' && savedExp.length > 0 && (
              <div className="p-4 bg-white border-t border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                  <span>Total Saved Adventures:</span>
                  <span className="font-bold text-slate-900">{savedExp.length} experiences</span>
                </div>
                <Link
                  href="/experiences"
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-[#00aa6c] hover:bg-[#008f5a] text-white font-bold py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-emerald-950/20"
                >
                  <Compass className="w-4 h-4 text-white" />
                  <span>Explore All Adventures</span>
                </Link>
              </div>
            )}
          </motion.div>

          {/* Offline Guide & Itinerary Modal */}
          <OfflineGuideModal
            isOpen={isOfflineModalOpen}
            onClose={() => setIsOfflineModalOpen(false)}
            places={savedPlaces}
            title="My Sri Lanka Saved Itinerary"
          />
        </>
      )}
    </AnimatePresence>
  );
}
