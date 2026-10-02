'use client';

import { useState } from 'react';
import { Place } from '@/types';
import { useCurrency } from '@/context/CurrencyContext';
import { useLocation } from '@/context/LocationContext';
import {
  MapPin, Tag, Ticket, Calendar, Clock, Navigation,
  ChevronDown, Check, Loader2
} from 'lucide-react';
import CurrencySelector from '@/components/CurrencySelector';

interface PlaceSidebarQuickFactsProps {
  place: Place;
}

export default function PlaceSidebarQuickFacts({ place }: PlaceSidebarQuickFactsProps) {
  const { convertFee, currencyInfo } = useCurrency();
  const { formatDistanceTo, userCoords, requestLocation, status: locationStatus } = useLocation();

  const distanceInfo = formatDistanceTo(place.lat, place.lng, place.distance_km);
  const convertedFee = convertFee(place.entry_fee);

  const isFree = !place.entry_fee || place.entry_fee.toLowerCase().includes('free');

  return (
    <div className="space-y-6">
      {/* ━━━ 1. ADMISSION & DYNAMIC CURRENCY BLOCK ━━━ */}
      <div className="pb-6 border-b border-slate-100">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Standard Admission
          </span>
          <div className="scale-90 origin-right">
            <CurrencySelector scrolled={true} />
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-slate-900 tracking-tight">
            {convertedFee}
          </span>
          {!isFree && (
            <span className="text-xs text-slate-500 font-semibold">per adult</span>
          )}
        </div>

        {!isFree && (
          <p className="text-[11px] text-slate-400 mt-1 font-medium">
            Approximate converted rate in {currencyInfo.name} ({currencyInfo.code})
          </p>
        )}
      </div>

      {/* ━━━ 2. KEY FACTS LIST (WITH DYNAMIC GPS DISTANCE) ━━━ */}
      <div className="space-y-4">
        {/* Location */}
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Location</div>
            <div className="text-sm font-bold text-slate-900 truncate">{place.location}</div>
          </div>
        </div>

        {/* Province */}
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center shrink-0">
            <Tag className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Province</div>
            <div className="text-sm font-bold text-slate-900 truncate">{place.province}</div>
          </div>
        </div>

        {/* Dynamic Distance (GPS vs Colombo) */}
        <div className="flex items-start gap-3.5">
          <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${
            distanceInfo.isLive
              ? 'bg-sky-500 text-white border-sky-600 shadow-xs'
              : 'bg-sky-50 text-sky-600 border-sky-100'
          }`}>
            <Navigation className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>{distanceInfo.isLive ? 'From Your Location' : 'From Colombo'}</span>
              {distanceInfo.isLive && (
                <span className="text-[10px] text-sky-600 font-bold bg-sky-50 border border-sky-200 px-1.5 py-0.2 rounded">
                  Live GPS
                </span>
              )}
            </div>
            <div className="text-sm font-bold text-slate-900 flex items-center justify-between gap-2 mt-0.5">
              <span>{distanceInfo.text}</span>
              {!distanceInfo.isLive && (
                <button
                  type="button"
                  onClick={() => requestLocation()}
                  disabled={locationStatus === 'requesting'}
                  className="text-[11px] font-bold text-sky-600 hover:text-sky-700 hover:underline cursor-pointer flex items-center gap-1"
                >
                  {locationStatus === 'requesting' ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>Detecting...</span>
                    </>
                  ) : (
                    <span>Use my GPS</span>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Entry Fee */}
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center shrink-0">
            <Ticket className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Entry Fee</div>
            <div className="text-sm font-bold text-slate-900 truncate">{convertedFee}</div>
          </div>
        </div>

        {/* Best Season */}
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Best Season</div>
            <div className="text-sm font-bold text-slate-900 truncate">{place.best_time || 'Year-round'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
