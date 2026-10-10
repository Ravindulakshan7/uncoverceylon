'use client';

import { Star, MessageSquareQuote, CheckCircle2 } from 'lucide-react';

const REVIEWS = [
  {
    name: 'Sarah Jenkins',
    country: 'United Kingdom',
    flag: '🇬🇧',
    role: 'Solo Backpacker',
    visited: 'Ella & South Coast',
    comment:
      'Uncover Ceylon helped us discover hidden waterfalls in Ella and secluded lagoons in Mirissa that weren’t listed on standard tourist maps. The route planner saved us days of research!',
    rating: 5,
    date: 'February 2026',
  },
  {
    name: 'Lukas Weber',
    country: 'Germany',
    flag: '🇩🇪',
    role: 'Couple Getaway',
    visited: 'Cultural Triangle & Highlands',
    comment:
      'The scenic blue train ride from Kandy to Ella and climbing Sigiriya at 6 AM sunrise was the highlight of our entire Asia trip. The local timing tips were 100% accurate.',
    rating: 5,
    date: 'January 2026',
  },
  {
    name: 'Kenji & Maya',
    country: 'Japan',
    flag: '🇯🇵',
    role: 'Adventure Travelers',
    visited: 'Yala Safari & Weligama',
    comment:
      'We followed the 5-day surf and safari route. Seeing wild leopards in Yala in the morning and catching sunset waves in Weligama was an absolute dream. Clean, modern platform!',
    rating: 5,
    date: 'March 2026',
  },
  {
    name: 'Elena Rostova',
    country: 'Australia',
    flag: '🇦🇺',
    role: 'Food & Culture Explorer',
    visited: 'Galle Fort & Colombo',
    comment:
      'The culinary recommendations are incredible! Best crispy egg hoppers in Galle and authentic street kottu in Colombo. Sri Lanka will always hold a very special place in our hearts.',
    rating: 5,
    date: 'December 2025',
  },
];

export default function TravelerReviewsSection() {
  return (
    <section className="py-12 sm:py-20 bg-[#f8fafc] border-t border-slate-200/80">
      <div className="w-[min(1240px,92%)] mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#00aa6c] text-xs font-bold mb-2">
            <Star className="w-3.5 h-3.5 fill-[#00aa6c]" />
            <span>Verified Traveler Stories</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-black text-[#0f1b2d] tracking-tight">
            Loved by Adventurers Worldwide
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1.5">
            Real feedback from globetrotters exploring the untamed beauty of Ceylon.
          </p>

          {/* Rating Summary Bar */}
          <div className="mt-4 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center text-amber-400 text-xs">
              {'★★★★★'}
            </div>
            <span className="text-xs font-black text-slate-800">4.9 / 5.0</span>
            <span className="text-[11px] text-slate-400">· Over 1,200+ Reviews</span>
          </div>
        </div>

        {/* 4 Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {REVIEWS.map((rev, idx) => (
            <div
              key={idx}
              className="rounded-3xl bg-white p-6 sm:p-7 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Top: Stars & Date */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-amber-400 text-xs">
                    {'★★★★★'}
                  </div>
                  <span className="text-[11px] font-medium text-slate-400">
                    {rev.date}
                  </span>
                </div>

                {/* Comment */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                  “{rev.comment}”
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-black text-slate-900">{rev.name}</span>
                    <span className="text-xs">{rev.flag}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {rev.country} · {rev.role}
                  </p>
                </div>

                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                  {rev.visited}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
