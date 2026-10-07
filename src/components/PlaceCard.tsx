'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Star, Calendar } from 'lucide-react';
import { Place } from '@/types';
import WishlistButton from '@/components/WishlistButton';
import { useLanguage } from '@/context/LanguageContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useLocation } from '@/context/LocationContext';

interface PlaceCardProps {
  place: Place;
  index?: number;
  variant?: 'grid' | 'horizontal';
}

export default function PlaceCard({ place, index = 0, variant = 'grid' }: PlaceCardProps) {
  const horizontal = variant === 'horizontal';
  const { t } = useLanguage();
  const { convertFee } = useCurrency();
  const { formatDistanceTo } = useLocation();

  const distanceInfo = formatDistanceTo(place.lat, place.lng, place.distance_km);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.6,
        delay: Math.min((index % 6) * 0.08, 0.4),
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -5, transition: { duration: 0.25 } }}
      className="h-full"
    >
      <Link
        href={`/places/${place.id}`}
        className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white transition-all duration-300 hover:border-[#00aa6c]/50 hover:shadow-xl hover:shadow-emerald-950/5 active:scale-[0.99] ${
          horizontal ? 'sm:flex-row' : ''
        }`}
      >
        <div
          className={`relative overflow-hidden bg-slate-100 ${
            horizontal ? 'aspect-[4/3] sm:w-2/5' : 'aspect-[4/3]'
          }`}
        >
          {place.image_url ? (
            <Image
              src={place.image_url}
              alt={place.name}
              fill
              sizes={
                horizontal
                  ? '(max-width: 640px) 50vw, 40vw'
                  : '(max-width: 768px) 50vw, 33vw'
              }
              className="object-cover transition duration-700 ease-out group-hover:scale-108"
              unoptimized={true}
            />
          ) : null}

          {/* Category Tag */}
          <span className="absolute left-2.5 top-2.5 sm:left-3 sm:top-3 bg-white/95 backdrop-blur-xs px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-[11px] font-extrabold text-emerald-800 rounded-lg shadow-xs border border-emerald-100/80">
            {place.category}
          </span>

          {/* Wishlist Heart Button */}
          <div className="absolute right-2.5 top-2.5 sm:right-3 sm:top-3 z-10">
            <WishlistButton placeId={place.id} placeName={place.name} variant="icon" />
          </div>

          {/* Seasonality / Best Month Badge */}
          {place.best_time && (
            <span className="absolute left-2.5 bottom-2.5 sm:left-3 sm:bottom-3 bg-black/70 backdrop-blur-md text-white/95 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[9px] sm:text-[10px] font-semibold rounded-lg flex items-center gap-1 border border-white/15 shadow-xs">
              <span className="text-amber-300">☀️</span>
              <span className="truncate max-w-[130px] sm:max-w-[160px]">{place.best_time}</span>
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col justify-between p-3.5 sm:p-5">
          <div>
            <div className="flex items-center justify-between gap-1 text-[10px] sm:text-xs font-medium text-slate-500 mb-1.5">
              <div className="flex items-center gap-1 sm:gap-1.5 truncate">
                <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0 text-[#00aa6c]" />
                <span className="truncate font-semibold text-slate-600">{place.location}</span>
              </div>
              <span
                className={`text-[9.5px] sm:text-[11px] shrink-0 font-bold px-1.5 py-0.5 rounded ${
                  distanceInfo.isLive
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
                    : 'text-slate-400'
                }`}
              >
                {distanceInfo.text}
              </span>
            </div>
            <h3 className="text-sm sm:text-lg font-black leading-snug sm:leading-tight text-slate-900 group-hover:text-[#00aa6c] line-clamp-1 transition-colors">
              {place.name}
            </h3>
            <p className="hidden sm:block mt-1.5 line-clamp-2 text-xs sm:text-sm leading-relaxed text-slate-600 font-medium">
              {place.short_description}
            </p>
          </div>

          <div className="mt-3 sm:mt-4 flex items-center justify-between border-t border-slate-100 pt-2.5 sm:pt-3">
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* TripAdvisor Green Rating Bubble Dot + Score */}
              <div className="flex items-center gap-1">
                <div className="flex items-center gap-0.5">
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#00aa6c] inline-block" />
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#00aa6c] inline-block" />
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#00aa6c] inline-block" />
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#00aa6c] inline-block" />
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#00aa6c]/50 inline-block" />
                </div>
                <span className="text-xs sm:text-sm font-black text-slate-900 ml-1">
                  {place.rating.toFixed(1)}
                </span>
                {place.review_count ? (
                  <span className="text-[10px] sm:text-xs text-slate-400 font-medium hidden sm:inline">
                    ({place.review_count.toLocaleString()})
                  </span>
                ) : null}
              </div>

              {place.entry_fee && (
                <span className="text-[9.5px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {convertFee(place.entry_fee)}
                </span>
              )}
            </div>
            <span className="flex items-center gap-0.5 sm:gap-1 text-[11px] sm:text-sm font-bold text-[#00aa6c]">
              <span>{t('card.view')}</span>
              <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
