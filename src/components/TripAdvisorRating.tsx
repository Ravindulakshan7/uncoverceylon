'use client';

import React from 'react';
import { Info } from 'lucide-react';

interface TripAdvisorRatingProps {
  rating: number;
  reviewCount?: number;
  showBadge?: boolean;
  showRecommend?: boolean;
  recommendPercentage?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function TripAdvisorRatingDots({
  rating = 5,
  size = 'md',
}: {
  rating?: number;
  size?: 'sm' | 'md' | 'lg';
}) {
  const dotSize =
    size === 'sm'
      ? 'w-2.5 h-2.5 sm:w-3 sm:h-3'
      : size === 'lg'
      ? 'w-3.5 h-3.5 sm:w-4 sm:h-4'
      : 'w-3 h-3 sm:w-3.5 sm:h-3.5';

  return (
    <div className="inline-flex items-center gap-1 shrink-0" aria-label={`Rating ${rating.toFixed(1)} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const isFilled = i <= Math.round(rating);
        return (
          <span
            key={i}
            className={`${dotSize} rounded-full inline-block transition-colors ${
              isFilled
                ? 'bg-[#00aa6c] shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]'
                : 'bg-slate-200 border border-slate-300/80'
            }`}
          />
        );
      })}
    </div>
  );
}

export default function TripAdvisorRating({
  rating,
  reviewCount,
  showBadge = true,
  showRecommend = true,
  recommendPercentage = 98,
  size = 'md',
  className = '',
}: TripAdvisorRatingProps) {
  // If rating is high (>=4.5), recommend is 97-99%
  const computedRecommend = Math.min(
    99,
    Math.max(88, Math.round((rating / 5) * 100))
  );
  const finalRecommend = recommendPercentage || computedRecommend;

  return (
    <div className={`flex flex-wrap items-center gap-2.5 sm:gap-3 text-slate-700 ${className}`}>
      {showBadge && (
        <span className="bg-[#00aa6c] text-white font-black text-xs sm:text-sm px-2 py-0.5 rounded shadow-2xs tracking-tight">
          {rating.toFixed(1)}
        </span>
      )}

      <div className="flex items-center gap-2">
        <TripAdvisorRatingDots rating={rating} size={size} />
        {reviewCount !== undefined && (
          <span className="text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">
            ({reviewCount.toLocaleString()} {reviewCount === 1 ? 'review' : 'reviews'})
          </span>
        )}
      </div>

      {showRecommend && (
        <div className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-slate-800 bg-emerald-50/80 border border-emerald-200/60 px-2.5 py-0.5 rounded-full">
          <span>{finalRecommend}% Recommend</span>
          <Info className="w-3.5 h-3.5 text-slate-400" />
        </div>
      )}
    </div>
  );
}
