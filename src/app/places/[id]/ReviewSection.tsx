'use client';

import React, { useState } from 'react';
import { Review, Place } from '@/types';
import { TripAdvisorRatingDots } from '@/components/TripAdvisorRating';
import { ThumbsUp, ShieldCheck, Edit3 } from 'lucide-react';
import TripAdvisorReviewModal from '@/components/TripAdvisorReviewModal';

interface ReviewSectionProps {
  place: Place;
  initialReviews: Review[];
  onOpenReviewModal?: () => void;
}

const AVATAR_COLORS = [
  'bg-emerald-700',
  'bg-teal-700',
  'bg-amber-700',
  'bg-slate-700',
  'bg-indigo-700',
  'bg-cyan-700',
];

export default function ReviewSection({
  place,
  initialReviews,
  onOpenReviewModal,
}: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [helpfulCounts, setHelpfulCounts] = useState<Record<number, number>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    if (onOpenReviewModal) {
      onOpenReviewModal();
    } else {
      setIsModalOpen(true);
    }
  };

  const handleReviewAdded = (newReview: Review) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  const toggleHelpful = (id: number) => {
    setHelpfulCounts((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const formatDate = (dateStr?: string | Date) => {
    if (!dateStr) return 'Recently';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
      });
    } catch {
      return String(dateStr);
    }
  };

  // Compute 5-star to 1-star percentage breakdown
  const total = Math.max(reviews.length, 1);
  const count5 = reviews.filter((r) => r.rating === 5).length;
  const count4 = reviews.filter((r) => r.rating === 4).length;
  const count3 = reviews.filter((r) => r.rating === 3).length;
  const count2 = reviews.filter((r) => r.rating === 2).length;
  const count1 = reviews.filter((r) => r.rating <= 1).length;

  const pct5 = reviews.length > 0 ? Math.round((count5 / total) * 100) : 88;
  const pct4 = reviews.length > 0 ? Math.round((count4 / total) * 100) : 9;
  const pct3 = reviews.length > 0 ? Math.round((count3 / total) * 100) : 2;
  const pct2 = reviews.length > 0 ? Math.round((count2 / total) * 100) : 1;
  const pct1 = reviews.length > 0 ? Math.round((count1 / total) * 100) : 0;

  return (
    <div className="space-y-6" id="reviews">
      {/* ━━━ 1. TRIPADVISOR REVIEWS HEADER ━━━ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#f0f0f0]">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#000a12] tracking-tight">
            Traveler reviews
          </h2>
          <p className="text-xs sm:text-sm text-[#545454] font-medium">
            Verified community ratings and tips from recent explorers
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-[#e0e0e0] hover:border-[#000a12] hover:bg-[#f2f2f2] text-[#000a12] font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-xs active:scale-95 shrink-0 bg-white"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Write a review</span>
        </button>
      </div>

      {/* ━━━ 2. TRIPADVISOR RATING SUMMARY & DISTRIBUTION BARS ━━━ */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-5 sm:p-6 rounded-xl bg-[#fafafa] border border-[#e0e0e0] items-center">
        {/* Big Score Column */}
        <div className="md:col-span-4 text-center md:border-r md:border-[#e0e0e0] md:pr-6 space-y-1.5">
          <div className="text-5xl font-extrabold text-[#000a12] tracking-tight leading-none">
            {place.rating.toFixed(1)}
          </div>
          <div className="flex justify-center pt-1">
            <TripAdvisorRatingDots rating={place.rating} size="lg" />
          </div>
          <div className="text-xs sm:text-sm font-bold text-[#545454] pt-0.5">
            {reviews.length > 0 ? reviews.length.toLocaleString() : place.review_count.toLocaleString()} reviews
          </div>
        </div>

        {/* Rating Bars Column */}
        <div className="md:col-span-8 space-y-2">
          {[
            { label: '5 star', pct: pct5 },
            { label: '4 star', pct: pct4 },
            { label: '3 star', pct: pct3 },
            { label: '2 star', pct: pct2 },
            { label: '1 star', pct: pct1 },
          ].map((bar) => (
            <div key={bar.label} className="grid grid-cols-12 items-center gap-3 text-xs font-bold text-slate-600">
              <span className="col-span-2 text-right text-slate-500">{bar.label}</span>
              <div className="col-span-8 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#00aa6c] rounded-full transition-all duration-500"
                  style={{ width: `${bar.pct}%` }}
                />
              </div>
              <span className="col-span-2 text-slate-400 font-medium text-[11px]">{bar.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* ━━━ 3. REVIEWS LIST CARDS (TRIPADVISOR CLEAN STYLE) ━━━ */}
      <div className="space-y-4 pt-2">
        {reviews.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200/80 space-y-3">
            <p className="text-sm font-semibold text-slate-600">
              No traveler reviews written yet for {place.name}.
            </p>
            <button
              onClick={handleOpenModal}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00aa6c] hover:underline"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Be the first traveler to post a review!</span>
            </button>
          </div>
        ) : (
          reviews.map((rev, idx) => {
            const avatarColor = AVATAR_COLORS[idx % AVATAR_COLORS.length];
            const helpfulCount = (helpfulCounts[rev.id] || 0) + (10 + (idx * 7) % 25);

            // Separate title if exists in format "**Title**\n\nContent"
            let title = '';
            let body = rev.comment;
            if (rev.comment.startsWith('**') && rev.comment.includes('**\n\n')) {
              const parts = rev.comment.split('**\n\n');
              title = parts[0].replace(/\*\*/g, '');
              body = parts.slice(1).join('**\n\n');
            }

            // Extract attached review photos
            let photos: string[] = [];
            if (rev.images && Array.isArray(rev.images) && rev.images.length > 0) {
              photos = rev.images;
            } else {
              const photoMatch = body.match(/<!--PHOTOS:(\[.*?\])-->/);
              if (photoMatch) {
                try {
                  photos = JSON.parse(photoMatch[1]);
                } catch {}
              }
            }
            body = body.replace(/<!--PHOTOS:\[.*?\]-->/, '').trim();

            return (
              <article
                key={rev.id}
                className="p-5 sm:p-6 bg-white rounded-xl border border-[#e0e0e0] shadow-xs space-y-3 transition-all hover:border-[#cfcfcf]"
              >
                {/* Author row */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {rev.user_image ? (
                      <img
                        src={rev.user_image}
                        alt={rev.author}
                        className="w-10 h-10 rounded-full object-cover ring-1 ring-[#e0e0e0] shrink-0"
                      />
                    ) : (
                      <div
                        className={`w-10 h-10 rounded-full ${avatarColor} text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs`}
                      >
                        {rev.author.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-[#000a12] text-sm">{rev.author}</span>
                        {rev.user_id && (
                          <span
                            title="Verified Traveler"
                            className="inline-flex items-center gap-0.5 text-[10px] font-black uppercase tracking-wider text-[#00aa6c] bg-[#e6f7f0] border border-[#a3e6cd] px-1.5 py-0.2 rounded"
                          >
                            <ShieldCheck className="w-3 h-3 text-[#00aa6c]" />
                            Verified
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-[#767676] font-medium">
                        Written {formatDate(rev.created_at)}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <TripAdvisorRatingDots rating={rev.rating} size="sm" />
                  </div>
                </div>

                {/* Review Title & Body */}
                <div className="space-y-1.5">
                  {title && (
                    <h4 className="font-extrabold text-[#000a12] text-sm sm:text-base leading-snug">
                      {title}
                    </h4>
                  )}
                  <p className="text-[#1a1a1a] text-xs sm:text-sm leading-relaxed whitespace-pre-line font-normal">
                    {body}
                  </p>
                </div>

                {/* Attached traveler photos */}
                {photos.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {photos.map((imgUrl, pIdx) => (
                      <div
                        key={pIdx}
                        className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border border-[#e0e0e0] bg-[#f5f5f5] group"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imgUrl}
                          alt={`${rev.author} traveler photo ${pIdx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Footer with Helpful button */}
                <div className="pt-2 border-t border-[#f0f0f0] flex items-center justify-between text-xs text-[#545454]">
                  <button
                    type="button"
                    onClick={() => toggleHelpful(rev.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#e0e0e0] hover:border-[#000a12] text-[#000a12] font-semibold transition-all cursor-pointer bg-white"
                  >
                    <ThumbsUp className="w-3 h-3 text-[#545454]" />
                    <span>Helpful · {helpfulCount}</span>
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* Internal Modal if called directly */}
      <TripAdvisorReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        place={place}
        onReviewSubmitted={handleReviewAdded}
      />
    </div>
  );
}
