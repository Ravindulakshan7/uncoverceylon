'use client';

import React, { useState } from 'react';
import {
  Compass,
  Sun,
  CloudSun,
  Thermometer,
  Wind,
  Clock,
  Star,
  Info,
  ChevronDown,
  ChevronsUpDown,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { Place } from '@/types';

export interface SeasonMonth {
  name: string;
  status: 'peak' | 'good' | 'monsoon';
  label: string;
}

export interface ClimateAndSeasonality {
  climateType: string;
  tempRange: string;
  humidity: string;
  weatherNote: string;
  primeHours: string;
  recommendedDuration: string;
  monthStatuses: SeasonMonth[];
  currentStatus: SeasonMonth;
  currentMonthName: string;
}

interface DestinationDetailAccordionsProps {
  place: Place;
  thingsToDo: { title: string; desc: string; icon: string }[];
  seasonality: ClimateAndSeasonality;
}

export default function DestinationDetailAccordions({
  place,
  thingsToDo,
  seasonality,
}: DestinationDetailAccordionsProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    thingsToDo: true,
    seasonality: true,
    tips: true,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const allOpen = Object.values(openSections).every(Boolean);

  const toggleAll = () => {
    const nextState = !allOpen;
    setOpenSections({
      thingsToDo: nextState,
      seasonality: nextState,
      tips: nextState,
    });
  };

  return (
    <div className="space-y-6">
      {/* ━━━ CONTROLS HEADER BAR ━━━ */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00aa6c]" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            In-Depth Destination Dossier
          </span>
        </div>
        <button
          type="button"
          onClick={toggleAll}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00aa6c] hover:text-[#008f5a] bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/70 px-3 py-1.5 rounded-xl transition-all cursor-pointer active:scale-95"
        >
          <ChevronsUpDown className="w-3.5 h-3.5" />
          <span>{allOpen ? 'Collapse All' : 'Expand All'}</span>
        </button>
      </div>

      {/* ━━━ 1. THINGS TO DO & CURATED EXPERIENCES ━━━ */}
      {thingsToDo && thingsToDo.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden transition-all duration-200">
          <button
            type="button"
            onClick={() => toggleSection('thingsToDo')}
            className="w-full p-6 sm:p-7 flex items-center justify-between text-left hover:bg-slate-50/70 transition-colors cursor-pointer select-none"
            aria-expanded={openSections.thingsToDo}
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-[#00aa6c] border border-emerald-100 flex items-center justify-center shrink-0 shadow-xs">
                <Compass className="w-5 h-5 text-[#00aa6c]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                    Things To Do & Experiences
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-[#00aa6c] border border-emerald-200/60">
                    {thingsToDo.length} Curated
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                  Top activities recommended by local explorers in {place.location}
                </p>
              </div>
            </div>

            <div
              className={`w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 transition-transform duration-300 ml-3 ${
                openSections.thingsToDo ? 'rotate-180 bg-emerald-50 text-[#00aa6c]' : ''
              }`}
            >
              <ChevronDown className="w-4 h-4" />
            </div>
          </button>

          {openSections.thingsToDo && (
            <div className="p-6 sm:p-8 pt-2 sm:pt-2 border-t border-slate-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {thingsToDo.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/20 transition-all shadow-xs space-y-2 group"
                  >
                    <div className="text-2xl mb-1">{item.icon}</div>
                    <h4 className="font-extrabold text-slate-900 text-base group-hover:text-[#00aa6c] transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ━━━ 2. SEASONALITY & 12-MONTH CLIMATE MATRIX ━━━ */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden transition-all duration-200">
        <button
          type="button"
          onClick={() => toggleSection('seasonality')}
          className="w-full p-6 sm:p-7 flex items-center justify-between text-left hover:bg-slate-50/70 transition-colors cursor-pointer select-none"
          aria-expanded={openSections.seasonality}
        >
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-[#00aa6c] border border-emerald-100 flex items-center justify-center shrink-0 shadow-xs">
              <Sun className="w-5 h-5 text-[#00aa6c]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  Seasonality & Weather Guide
                </h3>
                {/* Live Current Month Status Badge */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 border border-slate-200">
                  <span className="relative flex h-2 w-2">
                    <span
                      className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                        seasonality.currentStatus.status === 'peak'
                          ? 'bg-emerald-400'
                          : seasonality.currentStatus.status === 'good'
                          ? 'bg-amber-400'
                          : 'bg-teal-400'
                      }`}
                    />
                    <span
                      className={`relative inline-flex rounded-full h-2 w-2 ${
                        seasonality.currentStatus.status === 'peak'
                          ? 'bg-emerald-500'
                          : seasonality.currentStatus.status === 'good'
                          ? 'bg-amber-500'
                          : 'bg-teal-500'
                      }`}
                    />
                  </span>
                  <span className="text-slate-800">
                    {seasonality.currentMonthName}: {seasonality.currentStatus.label}
                  </span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                Climate zone, monthly travel outlook, and best hours to visit
              </p>
            </div>
          </div>

          <div
            className={`w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 transition-transform duration-300 ml-3 ${
              openSections.seasonality ? 'rotate-180 bg-emerald-50 text-[#00aa6c]' : ''
            }`}
          >
            <ChevronDown className="w-4 h-4" />
          </div>
        </button>

        {openSections.seasonality && (
          <div className="p-6 sm:p-8 pt-2 sm:pt-2 border-t border-slate-100 space-y-7">
            {/* Climate Summary Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  <CloudSun className="w-3.5 h-3.5 text-[#00aa6c]" />
                  <span>Climate Zone</span>
                </div>
                <div className="text-sm sm:text-base font-extrabold text-slate-900 break-words leading-snug">
                  {seasonality.climateType}
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  <Thermometer className="w-3.5 h-3.5 text-amber-500" />
                  <span>Avg Temperature</span>
                </div>
                <div className="text-sm sm:text-base font-extrabold text-slate-900 break-words leading-snug">
                  {seasonality.tempRange}
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  <Wind className="w-3.5 h-3.5 text-[#00aa6c]" />
                  <span>Humidity & Air</span>
                </div>
                <div className="text-sm sm:text-base font-extrabold text-slate-900 break-words leading-snug">
                  {seasonality.humidity}
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>Prime Window</span>
                </div>
                <div className="text-sm sm:text-base font-extrabold text-slate-900 break-words leading-snug">
                  {place.best_time || 'Nov to Apr'}
                </div>
              </div>
            </div>

            {/* 12-Month Seasonality Calendar Matrix */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Month-by-Month Travel Conditions:</span>
                <span className="text-slate-500 font-normal hidden sm:inline">
                  Interactive 12-Month Ceylon Matrix
                </span>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-1.5">
                {seasonality.monthStatuses.map((m, idx) => {
                  const isCurrent = m.name === seasonality.currentMonthName;
                  const isPeak = m.status === 'peak';
                  const isGood = m.status === 'good';

                  return (
                    <div
                      key={idx}
                      className={`rounded-xl p-2.5 text-center flex flex-col items-center justify-between border transition-all ${
                        isCurrent ? 'ring-2 ring-[#00aa6c] shadow-sm' : ''
                      } ${
                        isPeak
                          ? 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
                          : isGood
                          ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                          : 'bg-teal-50/70 border-teal-200 text-teal-950'
                      }`}
                      title={`${m.name}: ${m.label}`}
                    >
                      <span className="text-[11px] font-bold">{m.name}</span>
                      <span className="text-base my-0.5">
                        {isPeak ? '☀️' : isGood ? '🌤️' : '🌧️'}
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-tight opacity-80">
                        {isPeak ? 'Peak' : isGood ? 'Good' : 'Wet'}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Calendar Legend */}
              <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00aa6c]" />
                  <span>
                    <strong>Peak Season:</strong> Clear skies, calm seas & dry hiking
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>
                    <strong>Good / Shoulder:</strong> Mild weather & fewer crowds
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                  <span>
                    <strong>Monsoon / Wet:</strong> Lush waterfalls, mist & quiet trails
                  </span>
                </div>
              </div>
            </div>

            {/* Timing & Pacing Advices */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#00aa6c] shrink-0 font-bold shadow-2xs">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Optimal Daily Hours
                  </span>
                  <span className="text-sm font-extrabold text-slate-900 break-words leading-snug">
                    {seasonality.primeHours}
                  </span>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Best lighting for photography and cooler walking temperature.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-amber-500 shrink-0 font-bold shadow-2xs">
                  <Star className="w-4 h-4 fill-amber-400" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Local Weather Advice
                  </span>
                  <span className="text-sm font-extrabold text-slate-900 break-words leading-snug">
                    {seasonality.weatherNote}
                  </span>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Recommended stay duration: {seasonality.recommendedDuration}.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ━━━ 3. VISITOR TIPS & PRACTICAL ADVISORY ━━━ */}
      {place.tips && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden transition-all duration-200">
          <button
            type="button"
            onClick={() => toggleSection('tips')}
            className="w-full p-6 sm:p-7 flex items-center justify-between text-left hover:bg-slate-50/70 transition-colors cursor-pointer select-none"
            aria-expanded={openSections.tips}
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/60 flex items-center justify-center shrink-0 shadow-xs">
                <Info className="w-5 h-5 text-amber-500" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                    Visitor Tips & Travel Advisory
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200/60">
                    Insider Tips
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                  Essential advice, footwear, hydration, and safety precautions
                </p>
              </div>
            </div>

            <div
              className={`w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 transition-transform duration-300 ml-3 ${
                openSections.tips ? 'rotate-180 bg-amber-50 text-amber-600' : ''
              }`}
            >
              <ChevronDown className="w-4 h-4" />
            </div>
          </button>

          {openSections.tips && (
            <div className="p-6 sm:p-8 pt-2 sm:pt-2 border-t border-slate-100 space-y-4">
              <div className="bg-amber-50/50 rounded-2xl p-5 sm:p-6 border border-amber-200/60">
                <p className="text-slate-800 leading-relaxed text-sm sm:text-base whitespace-pre-line font-medium break-words">
                  {place.tips}
                </p>
              </div>

              {/* Helpful quick checklist badges */}
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full">
                  💡 Carry drinking water
                </span>
                <span className="text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full">
                  👟 Sturdy walking shoes
                </span>
                <span className="text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full">
                  👒 Sun hat & sunscreen
                </span>
                <span className="text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full">
                  💵 Carry cash for admissions
                </span>
                <span className="text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full">
                  📷 Keep camera charged
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
