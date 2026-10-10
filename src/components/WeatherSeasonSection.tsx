'use client';

import { Sun, CloudRain, Wind, Waves, Compass, CheckCircle2 } from 'lucide-react';

export default function WeatherSeasonSection() {
  const currentMonthName = new Date().toLocaleString('default', { month: 'long' });

  return (
    <section className="py-12 sm:py-20 bg-[#f8fafc] border-t border-slate-200/80">
      <div className="w-[min(1240px,92%)] mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mb-2">
            <Sun className="w-3.5 h-3.5 text-amber-600" />
            <span>Dual-Monsoon Climate Guide</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-black text-[#0f1b2d] tracking-tight">
            Sri Lanka is Always in Season
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1.5">
            Thanks to the island’s dual monsoon, when it rains on one coast, the opposite coast enjoys bright sunshine and calm turquoise seas.
          </p>
        </div>

        {/* 2 Big Coast Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          
          {/* Card 1: South & West Coast */}
          <div className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-[#00aa6c] text-xs font-bold border border-emerald-100">
                Peak: Nov – April
              </span>
              <span className="text-xs font-semibold text-slate-400">28°C – 32°C</span>
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                South & West Coasts
              </h3>
              <p className="text-xs font-semibold text-slate-500">
                Mirissa, Galle, Weligama, Bentota, Colombo
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Glass-flat water, premier blue whale watching, spectacular coastal sunsets, and buzzing beach cafes. Ideal for winter escapes.
            </p>

            <div className="pt-2 border-t border-slate-100 space-y-2 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00aa6c] shrink-0" />
                <span>Prime whale migration season in Mirissa</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00aa6c] shrink-0" />
                <span>Calm water for scuba diving & snorkeling</span>
              </div>
            </div>
          </div>

          {/* Card 2: East Coast */}
          <div className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold border border-sky-100">
                Peak: May – Sept
              </span>
              <span className="text-xs font-semibold text-slate-400">29°C – 34°C</span>
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                East Coast & North
              </h3>
              <p className="text-xs font-semibold text-slate-500">
                Arugam Bay, Trincomalee, Nilaveli, Pasikudah
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              World-class point break surfing, Pigeon Island coral reef snorkeling, and tranquil uncrowded powdery white sand beaches.
            </p>

            <div className="pt-2 border-t border-slate-100 space-y-2 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00aa6c] shrink-0" />
                <span>Global surf season at Arugam Bay Main Point</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00aa6c] shrink-0" />
                <span>Pristine visibility for coral reef dives</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Insight Bar */}
        <div className="mt-6 rounded-2xl bg-amber-50/80 border border-amber-200/60 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-950 font-medium">
          <div className="flex items-center gap-2.5">
            <span className="text-base">💡</span>
            <span>
              <strong>Visiting in {currentMonthName}?</strong> Ask our local team for the sunniest routes and current ocean conditions.
            </span>
          </div>
          <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full shrink-0">
            Updated Weekly
          </span>
        </div>

      </div>
    </section>
  );
}
