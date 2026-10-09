'use client';

import React, { useState } from 'react';
import {
  Landmark,
  ChevronDown,
  ShieldCheck,
  Compass,
  Info,
  CheckCircle2,
  Camera,
  MapPin
} from 'lucide-react';

export interface HighlightItem {
  title: string;
  desc: string;
  tag: string;
}

export interface EtiquetteItem {
  rule: string;
  detail: string;
}

export interface PracticalTipItem {
  heading: string;
  advice: string;
}

export interface NearbyAttractionItem {
  name: string;
  distance: string;
  desc: string;
}

interface CultureAccordionSectionsProps {
  highlights: HighlightItem[];
  etiquette: EtiquetteItem[];
  practicalTips: PracticalTipItem[];
  nearbyAttractions?: NearbyAttractionItem[];
}

export default function CultureAccordionSections({
  highlights,
  etiquette,
  practicalTips,
  nearbyAttractions,
}: CultureAccordionSectionsProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    highlights: true,
    etiquette: false,
    practicalTips: false,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="space-y-4">
      {/* ━━━ 1. ARCHITECTURAL & SACRED HIGHLIGHTS ━━━ */}
      {highlights && highlights.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden transition-all duration-200">
          <button
            type="button"
            onClick={() => toggleSection('highlights')}
            className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50/70 transition-colors cursor-pointer select-none"
            aria-expanded={openSections.highlights}
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#00aa6c] flex items-center justify-center shrink-0 border border-emerald-100">
                <Landmark className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight truncate">
                    Architectural & Sacred Highlights
                  </h3>
                  <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600">
                    {highlights.length} key features
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                  Monuments, ancient engineering, and living heritage sanctums
                </p>
              </div>
            </div>

            <div
              className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 transition-transform duration-300 ml-3 ${
                openSections.highlights ? 'rotate-180 bg-emerald-50 text-[#00aa6c]' : ''
              }`}
            >
              <ChevronDown className="w-4 h-4" />
            </div>
          </button>

          {openSections.highlights && (
            <div className="px-6 pb-6 pt-2 border-t border-slate-100 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {highlights.map((item, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-emerald-300 transition-colors space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-black text-slate-900">
                        {item.title}
                      </h4>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-100/70 text-emerald-800 shrink-0">
                        {item.tag}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ━━━ 2. SACRED ETIQUETTE & VISITOR PROTOCOL ━━━ */}
      {etiquette && etiquette.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden transition-all duration-200">
          <button
            type="button"
            onClick={() => toggleSection('etiquette')}
            className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50/70 transition-colors cursor-pointer select-none"
            aria-expanded={openSections.etiquette}
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight truncate">
                    Visitor Etiquette & Sacred Protocol
                  </h3>
                  <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    Important Rules
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                  Modest dress code, temple respect, footwear & photography guidelines
                </p>
              </div>
            </div>

            <div
              className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 transition-transform duration-300 ml-3 ${
                openSections.etiquette ? 'rotate-180 bg-amber-50 text-amber-700' : ''
              }`}
            >
              <ChevronDown className="w-4 h-4" />
            </div>
          </button>

          {openSections.etiquette && (
            <div className="px-6 pb-6 pt-2 border-t border-slate-100 animate-fade-in">
              <div className="grid grid-cols-1 gap-3 pt-2">
                {etiquette.map((rule, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-amber-50/40 border border-amber-100/80 flex items-start gap-3.5"
                  >
                    <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-black text-slate-900">
                        {rule.rule}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed font-normal">
                        {rule.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ━━━ 3. PRACTICAL VISITOR TIPS & TIMINGS ━━━ */}
      {practicalTips && practicalTips.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden transition-all duration-200">
          <button
            type="button"
            onClick={() => toggleSection('practicalTips')}
            className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50/70 transition-colors cursor-pointer select-none"
            aria-expanded={openSections.practicalTips}
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                <Compass className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight truncate">
                    Insider Tips & Local Guidance
                  </h3>
                  <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600">
                    Pro Tips
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                  Best arrival times, beat the crowds, guides and photography vantage points
                </p>
              </div>
            </div>

            <div
              className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 transition-transform duration-300 ml-3 ${
                openSections.practicalTips ? 'rotate-180 bg-blue-50 text-blue-700' : ''
              }`}
            >
              <ChevronDown className="w-4 h-4" />
            </div>
          </button>

          {openSections.practicalTips && (
            <div className="px-6 pb-6 pt-2 border-t border-slate-100 animate-fade-in space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {practicalTips.map((tip, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5"
                  >
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-md bg-blue-100 text-blue-700 text-[10px] font-black inline-flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span>{tip.heading}</span>
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {tip.advice}
                    </p>
                  </div>
                ))}
              </div>

              {nearbyAttractions && nearbyAttractions.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                    Nearby Cultural Points of Interest
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {nearbyAttractions.map((att, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                      >
                        <div className="font-bold text-slate-900">{att.name}</div>
                        <div className="text-[11px] text-emerald-600 font-semibold">{att.distance}</div>
                        <div className="text-slate-500 text-[11px] mt-0.5 line-clamp-2">{att.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
