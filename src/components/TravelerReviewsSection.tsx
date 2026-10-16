'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Star, MessageSquareQuote, X, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

interface ReviewItem {
  id?: string | number;
  name: string;
  country: string;
  flag: string;
  role: string;
  visited: string;
  comment: string;
  rating: number;
  date: string;
  user_image?: string;
}

const DEFAULT_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1791723306807',
    name: 'Gayan Rathnaweera',
    user_image: 'https://lh3.googleusercontent.com/a/ACg8ocK9HAdVGFW3M2PhqmBtF1c03f9Tk28sWiMYXzigvefoWY5I6Ys=s96-c',
    country: 'Sri Lanka',
    flag: '🇱🇰',
    role: 'Couple Getaway',
    visited: 'Highlands & South',
    comment:
      'Uncover Ceylon is hands down the cleanest and most accurate guide for Sri Lanka travel. Real GPS pins, accurate ticket prices, and beautiful photos!',
    rating: 5,
    date: 'October 2026',
  },
  {
    id: 'rev-1791723177753',
    name: 'Ravindu Lakshan',
    user_image: 'https://lh3.googleusercontent.com/a/ACg8ocKr58jOugBD6nM57Bz_KIqNVq7mapID5pJwcfPrQtR9E6j4WA=s96-c',
    country: 'Germany',
    flag: '🇩🇪',
    role: 'Adventure Explorer',
    visited: 'Central & Southern Coast',
    comment:
      'Super easy to find hidden waterfalls and offbeat beaches. The AI travel guide and curated maps made exploring the island unforgettable.',
    rating: 5,
    date: 'October 2026',
  },
  {
    id: 'rev-1',
    name: 'Sarah Jenkins',
    country: 'United Kingdom',
    flag: '🇬🇧',
    role: 'Solo Backpacker',
    visited: 'Ella & South Coast',
    comment:
      'Uncover Ceylon helped us discover hidden waterfalls in Ella and secluded lagoons in Mirissa that weren’t listed on standard tourist maps. Saved us days of research!',
    rating: 5,
    date: 'September 2026',
  },
  {
    id: 'rev-2',
    name: 'Lukas Weber',
    country: 'Germany',
    flag: '🇩🇪',
    role: 'Couple Getaway',
    visited: 'Cultural Triangle',
    comment:
      'The scenic blue train ride from Kandy to Ella and climbing Sigiriya at 6 AM sunrise was the highlight of our entire Asia trip. The local timing tips were 100% accurate.',
    rating: 5,
    date: 'August 2026',
  },
  {
    id: 'rev-3',
    name: 'Kenji & Maya',
    country: 'Japan',
    flag: '🇯🇵',
    role: 'Adventure Travelers',
    visited: 'Yala Safari & Weligama',
    comment:
      'We followed the 5-day surf and safari route. Seeing wild leopards in Yala in the morning and catching sunset waves in Weligama was an absolute dream.',
    rating: 5,
    date: 'July 2026',
  },
  {
    id: 'rev-4',
    name: 'Elena Rostova',
    country: 'Australia',
    flag: '🇦🇺',
    role: 'Food & Culture Explorer',
    visited: 'Galle Fort & Colombo',
    comment:
      'The culinary recommendations are incredible! Best crispy egg hoppers in Galle and authentic street kottu in Colombo. Truly authentic travel guide.',
    rating: 5,
    date: 'June 2026',
  },
];

export default function TravelerReviewsSection() {
  const [failedAvatars, setFailedAvatars] = useState<Record<string, boolean>>({});
  const { user, openAuthModal } = useAuth();
  const [reviews, setReviews] = useState<ReviewItem[]>(DEFAULT_REVIEWS);
  const [modalOpen, setModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [role, setRole] = useState('Solo Traveler');
  const [country, setCountry] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -350 : 350;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    fetch('/api/site-reviews')
      .then((res) => res.json())
      .then((data) => {
        if (data.reviews && Array.isArray(data.reviews)) {
          setReviews(data.reviews);
        }
      })
      .catch(() => {});
  }, []);

  const handleOpenReviewModal = () => {
    if (!user) {
      toast.error('Please sign in or create an account to write a review.');
      openAuthModal('signin');
      return;
    }
    setModalOpen(true);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || comment.trim().length < 5) {
      toast.error('Please enter a valid review comment.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/site-reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          role,
          country: country.trim() || 'Global Traveler',
          comment: comment.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.review) {
        toast.success('Thank you! Your review has been submitted for moderation. It will appear once approved by an admin. ⏳');
        setModalOpen(false);
        setComment('');
      } else {
        toast.error(data.error || 'Failed to submit review');
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-12 sm:py-20 bg-[#f8fafc] border-t border-slate-200/80">
      <div className="w-[min(1240px,92%)] mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#00aa6c] text-xs font-bold mb-2">
            <Star className="w-3.5 h-3.5 fill-[#00aa6c]" />
            <span>FROM THE COMMUNITY</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-black text-[#0f1b2d] tracking-tight">
            Stories from the island.
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1.5">
            Experiences shared by people who have been here.
          </p>

          {/* Rating Summary Bar & "Share your story" Button */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-2xs">
              <div className="flex items-center text-amber-400 text-xs">
                {'★★★★★'}
              </div>
              <span className="text-xs font-black text-slate-800">{reviews.length ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1) : '—'} / 5</span>
              <span className="text-[11px] text-slate-400">· {reviews.length} stories</span>
            </div>

            <button
              type="button"
              onClick={handleOpenReviewModal}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#00aa6c] hover:bg-[#008f5a] text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all active:scale-95 cursor-pointer"
            >
              <MessageSquareQuote className="w-4 h-4" />
              <span>Share your story</span>
            </button>
          </div>
        </div>

        {/* Reviews Grid - 2 Rows flowing horizontally ("harahta peli 2k") */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="grid grid-rows-2 grid-flow-col auto-cols-[86vw] sm:auto-cols-[380px] lg:auto-cols-[410px] gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-2 px-0.5"
          >
            {reviews.slice(0, 10).map((rev, idx) => (
              <div
                key={rev.id || idx}
                className="snap-start rounded-2xl sm:rounded-3xl bg-white p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-2.5 h-full"
              >
                <div className="space-y-2">
                  {/* Top: Stars & Date */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-amber-400 text-xs tracking-tight">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={i < rev.rating ? 'text-amber-400' : 'text-slate-200'}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400">
                      {rev.date}
                    </span>
                  </div>

                  {/* Comment */}
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed line-clamp-3 font-normal">
                    “{rev.comment}”
                  </p>
                </div>

                {/* Author Info */}
                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {rev.user_image && !failedAvatars[rev.user_image] ? (
                      <Image
                        width={32}
                        height={32}
                        unoptimized
                        onError={() => setFailedAvatars(prev => ({ ...prev, [rev.user_image!]: true }))}
                        src={rev.user_image}
                        alt={rev.name}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-1 ring-emerald-500/40 shrink-0"
                      />
                    ) : (
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-100 text-[#00aa6c] flex items-center justify-center text-xs font-bold shrink-0">
                        {rev.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-xs sm:text-sm font-black text-slate-900 truncate">{rev.name}</span>
                        <span className="text-xs shrink-0">{rev.flag || '🇱🇰'}</span>
                      </div>
                      <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate">
                        {rev.country} · {rev.role}
                      </p>
                    </div>
                  </div>

                  <span className="text-[9px] sm:text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-emerald-100 shrink-0">
                    {rev.visited}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Swipe indicator hint for mobile & Arrow controls */}
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 px-1">
            <span className="text-[11px] font-semibold flex items-center gap-1 text-slate-500">
              <span>More stories, this way →</span>
            </span>
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => scroll('left')}
                className="w-7 h-7 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                title="Scroll Left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scroll('right')}
                className="w-7 h-7 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                title="Scroll Right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* ━━━ REVIEW SUBMISSION MODAL (For Signed-In Users) ━━━ */}
      {modalOpen && (
        <div className="fixed inset-0 z-[999999] bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-[28px] p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-[#00aa6c] text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Community Review
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Review Uncover Ceylon
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Share your journey experience with travelers exploring Sri Lanka.
              </p>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              {/* Star Rating Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Your Overall Rating
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="text-2xl sm:text-3xl transition-transform hover:scale-110 active:scale-90 cursor-pointer"
                    >
                      <span
                        className={
                          (hoverRating || rating) >= star
                            ? 'text-amber-400'
                            : 'text-slate-200'
                        }
                      >
                        ★
                      </span>
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-600 ml-2">
                    {rating} of 5 Stars
                  </span>
                </div>
              </div>

              {/* Travel Style */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Traveler Style
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-800 bg-slate-50 focus:bg-white focus:border-[#00aa6c] outline-none"
                >
                  <option value="Solo Backpacker">Solo Backpacker</option>
                  <option value="Couple Getaway">Couple Getaway</option>
                  <option value="Family Vacation">Family Vacation</option>
                  <option value="Adventure Traveler">Adventure Traveler</option>
                  <option value="Food & Culture Explorer">Food & Culture Explorer</option>
                </select>
              </div>

              {/* Country */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Country
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="E.g., Sri Lanka, United Kingdom, Australia..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-800 bg-slate-50 focus:bg-white focus:border-[#00aa6c] outline-none"
                />
              </div>

              {/* Review Comment */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Feedback / Experience
                </label>
                <textarea
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="How did Uncover Ceylon help your travels? Share your favorite places and tips..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-normal text-slate-800 bg-slate-50 focus:bg-white focus:border-[#00aa6c] outline-none resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#00aa6c] hover:bg-[#008f5a] text-white text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? 'Publishing...' : 'Publish Review'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </section>
  );
}
