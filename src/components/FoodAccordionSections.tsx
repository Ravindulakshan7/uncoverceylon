'use client';

import React, { useState } from 'react';
import {
  Utensils,
  ChevronDown,
  CheckCircle2,
  Compass,
  Coffee
} from 'lucide-react';

interface ElementItem {
  title: string;
  desc: string;
  tag: string;
}

interface IngredientItem {
  name: string;
  detail: string;
}

interface EatingTipItem {
  heading: string;
  advice: string;
}

interface FoodAccordionSectionsProps {
  elements: ElementItem[];
  ingredients: IngredientItem[];
  eatingTips: EatingTipItem[];
  pairing: string;
}

export default function FoodAccordionSections({
  elements,
  ingredients,
  eatingTips,
  pairing,
}: FoodAccordionSectionsProps) {
  // State for toggling sections: default can have first open or all closed
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    anatomy: true,
    ingredients: false,
    etiquette: false,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="space-y-4">
      {/* ━━━ 1. ANATOMY OF THE DISH ━━━ */}
      {elements && elements.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden transition-all duration-200">
          <button
            type="button"
            onClick={() => toggleSection('anatomy')}
            className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50/70 transition-colors cursor-pointer select-none"
            aria-expanded={openSections.anatomy}
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                <Utensils className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight truncate">
                    Anatomy of the Dish & Signature Varieties
                  </h3>
                  <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600">
                    {elements.length} varieties
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                  Key components, preparations and signature variations
                </p>
              </div>
            </div>

            <div
              className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 transition-transform duration-300 ml-3 ${
                openSections.anatomy ? 'rotate-180 bg-emerald-50 text-emerald-700' : ''
              }`}
            >
              <ChevronDown className="w-4 h-4" />
            </div>
          </button>

          {openSections.anatomy && (
            <div className="px-6 pb-6 pt-2 border-t border-slate-100 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {elements.map((elem, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-emerald-300 transition-colors space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-bold text-slate-900 text-sm truncate">
                        {elem.title}
                      </h4>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white text-emerald-700 border border-emerald-100 shrink-0">
                        {elem.tag}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {elem.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ━━━ 2. CORE INGREDIENTS & SPICES ━━━ */}
      {ingredients && ingredients.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden transition-all duration-200">
          <button
            type="button"
            onClick={() => toggleSection('ingredients')}
            className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50/70 transition-colors cursor-pointer select-none"
            aria-expanded={openSections.ingredients}
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight truncate">
                    Core Ingredients & Natural Spices
                  </h3>
                  <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600">
                    {ingredients.length} items
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                  Aromatic island spices, coconut extractions and fresh herbs
                </p>
              </div>
            </div>

            <div
              className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 transition-transform duration-300 ml-3 ${
                openSections.ingredients ? 'rotate-180 bg-amber-50 text-amber-700' : ''
              }`}
            >
              <ChevronDown className="w-4 h-4" />
            </div>
          </button>

          {openSections.ingredients && (
            <div className="px-6 pb-6 pt-2 border-t border-slate-100 animate-fade-in">
              <div className="divide-y divide-slate-100 pt-1">
                {ingredients.map((ing, i) => (
                  <div
                    key={i}
                    className="py-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4"
                  >
                    <span className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                      {ing.name}
                    </span>
                    <span className="text-xs text-slate-600 sm:max-w-md">
                      {ing.detail}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ━━━ 3. HOW TO EAT & ORDER LIKE A LOCAL ━━━ */}
      {eatingTips && eatingTips.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden transition-all duration-200">
          <button
            type="button"
            onClick={() => toggleSection('etiquette')}
            className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50/70 transition-colors cursor-pointer select-none"
            aria-expanded={openSections.etiquette}
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 border border-sky-100">
                <Compass className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight truncate">
                    How to Eat & Order Like a Local
                  </h3>
                  <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600">
                    Insider Guide
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                  Dining etiquette, ordering phrases, heat levels & drink pairings
                </p>
              </div>
            </div>

            <div
              className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 transition-transform duration-300 ml-3 ${
                openSections.etiquette ? 'rotate-180 bg-sky-50 text-sky-700' : ''
              }`}
            >
              <ChevronDown className="w-4 h-4" />
            </div>
          </button>

          {openSections.etiquette && (
            <div className="px-6 pb-6 pt-2 border-t border-slate-100 space-y-4 animate-fade-in">
              <div className="space-y-3 pt-2">
                {eatingTips.map((tip, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-sky-50/40 border border-sky-100/80 space-y-1"
                  >
                    <h4 className="font-black text-slate-900 text-xs sm:text-sm">
                      {tip.heading}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {tip.advice}
                    </p>
                  </div>
                ))}
              </div>

              {pairing && (
                <div className="pt-3 border-t border-slate-100 flex items-center gap-2.5 text-xs text-slate-700">
                  <Coffee className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="font-bold">Perfect Beverage Pairing:</span>
                  <span className="text-slate-600">{pairing}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
