'use client';

import { useState } from 'react';
import { Review } from '@/types';
import { Star, Send, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

interface ReviewSectionProps {
  placeId: number;
  initialReviews: Review[];
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          className="focus:outline-none transition-transform hover:scale-110 cursor-pointer"
          aria-label={`${s} star`}
        >
          <Star
            className={`w-7 sm:w-8 h-7 sm:h-8 transition-colors ${
              s <= (hovered || value) ? 'fill-amber-400 text-amber-400' : 'text-slate-200 hover:text-amber-400/50'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function ReviewSection({ placeId, initialReviews }: ReviewSectionProps) {
  const { user, openAuthModal } = useAuth();
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [guestName, setGuestName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [website, setWebsite] = useState(''); // Honeypot trap for bots
  const [challenge, setChallenge] = useState(() => ({
    num1: Math.floor(Math.random() * 6) + 3,
    num2: Math.floor(Math.random() * 5) + 2,
  }));
  const [userAnswer, setUserAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const refreshChallenge = () => {
    setChallenge({
      num1: Math.floor(Math.random() * 6) + 3,
      num2: Math.floor(Math.random() * 5) + 2,
    });
    setUserAnswer('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const authorName = user ? user.name : guestName.trim();
    if (!authorName) {
      toast.error('Please enter your name or sign in.');
      return;
    }

    if (!comment.trim() || rating === 0) {
      toast.error('Please provide a rating and your review comment.');
      return;
    }

    // Anti-spam check only required for unauthenticated guests
    if (!user) {
      if (parseInt(userAnswer.trim(), 10) !== challenge.num1 + challenge.num2) {
        toast.error('Incorrect human verification answer. Please try again.');
        refreshChallenge();
        return;
      }
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          place_id: placeId,
          author: authorName,
          user_image: user?.image || '',
          rating,
          comment: comment.trim(),
          website, // honeypot
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit review');

      const newReview: Review = {
        id: data.id || Date.now(),
        place_id: placeId,
        user_id: user?.id || null,
        user_image: user?.image || '',
        author: authorName,
        rating,
        comment: comment.trim(),
        created_at: new Date().toISOString(),
        status: 'approved',
      };

      setReviews((prev) => [newReview, ...prev]);
      toast.success('Thank you! Review posted successfully.');

      setComment('');
      setGuestName('');
      setRating(5);
      refreshChallenge();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to submit review. Please try again.';
      toast.error(msg);
      refreshChallenge();
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr?: string | Date) => {
    if (!dateStr) return 'Recently';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return String(dateStr);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* ━━━ Sign In Callout / Write Review Box ━━━ */}
      {!user && !showGuestForm ? (
        <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-[#06261c] to-slate-950 border border-slate-800 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#00aa6c]/15 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-300 text-xs font-bold border border-white/15">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>Traveler Reviews</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Have you explored this destination?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Sign in with Google or Email to share your tips, rate this spot, and earn your Verified Traveler badge!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => openAuthModal('signin')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-xs sm:text-sm bg-[#00aa6c] hover:bg-[#008f5a] text-white shadow-lg shadow-emerald-950/40 transition-all active:scale-95 cursor-pointer"
              >
                <span>Sign in to write review</span>
              </button>
              <button
                type="button"
                onClick={() => setShowGuestForm(true)}
                className="text-xs text-slate-400 hover:text-white underline py-1 text-center cursor-pointer"
              >
                or post as guest
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Leave a review form card */
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Write a Review
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm font-medium mt-0.5">
                Share authentic tips and advice to guide fellow Ceylon travelers.
              </p>
            </div>

            {!user && (
              <button
                type="button"
                onClick={() => setShowGuestForm(false)}
                className="text-xs text-slate-400 hover:text-slate-700 underline cursor-pointer"
              >
                Cancel guest mode
              </button>
            )}
          </div>

          {/* Logged in User Identity Card */}
          {user ? (
            <div className="flex items-center gap-3 p-3.5 bg-emerald-50/80 border border-emerald-200/80 rounded-2xl mb-5">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-[#00aa6c]/40 shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#00aa6c] text-white font-bold flex items-center justify-center text-sm shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-slate-900 truncate">{user.name}</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                    <ShieldCheck className="w-3 h-3 text-[#00aa6c]" />
                    Verified Traveler
                  </span>
                </div>
                <span className="text-xs text-slate-500 font-medium truncate block">{user.email}</span>
              </div>
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Honeypot field (hidden from genuine users, filled by bots) */}
            <div className="hidden" aria-hidden="true" style={{ display: 'none' }}>
              <label htmlFor="website-hp">Website</label>
              <input
                id="website-hp"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">
                Your Rating
              </label>
              <StarPicker value={rating} onChange={setRating} />
            </div>

            {/* Guest Name input (only for unauthenticated users) */}
            {!user && (
              <div>
                <label className="block text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">
                  Your Name
                </label>
                <input
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="e.g. Kasun Perera"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 text-sm focus:border-[#00aa6c] focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all outline-none"
                  required
                  maxLength={60}
                />
              </div>
            )}

            <div>
              <label className="block text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">
                Review & Tips
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What did you love? Any hidden viewpoints, safety tips, best time to visit or photography advice?"
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 text-sm focus:border-[#00aa6c] focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all resize-none outline-none"
                required
                maxLength={2500}
              />
            </div>

            {/* Anti-spam Verification challenge for unauthenticated guests */}
            {!user && (
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-600">Anti-spam check:</span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-white border border-slate-200 font-mono text-sm font-semibold text-emerald-700 shadow-2xs">
                    {challenge.num1} + {challenge.num2} = ?
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Answer"
                    required
                    className="w-24 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 placeholder-slate-400 text-sm focus:border-[#00aa6c] focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none font-medium"
                  />
                  <button
                    type="button"
                    onClick={refreshChallenge}
                    className="text-xs text-slate-400 hover:text-slate-600 underline cursor-pointer"
                    title="Get another question"
                  >
                    Change
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 bg-[#00aa6c] hover:bg-[#008f5a] disabled:opacity-50 text-white font-bold px-7 py-3 rounded-xl transition-all shadow-md shadow-emerald-950/20 active:scale-95 text-sm cursor-pointer"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>{submitting ? 'Posting...' : 'Submit Review'}</span>
            </button>
          </form>
        </div>
      )}

      {/* ━━━ Community Reviews List ━━━ */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xl font-bold text-slate-900">
            Traveler Reviews ({reviews.length})
          </h4>
        </div>

        {reviews.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center text-slate-500 text-sm">
            No reviews yet. Be the first adventurer to share your experience!
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-3 transition-all hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {rev.user_image ? (
                      <img
                        src={rev.user_image}
                        alt={rev.author}
                        className="w-10 h-10 rounded-full object-cover ring-1 ring-emerald-300 shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#00aa6c] font-black flex items-center justify-center text-sm border border-emerald-200 shrink-0">
                        {rev.author.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-900 font-bold text-sm">{rev.author}</span>
                        {rev.user_id && (
                          <span
                            title="Verified Traveler Account"
                            className="inline-flex items-center text-[#00aa6c]"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 fill-[#00aa6c]/15" />
                          </span>
                        )}
                      </div>
                      <div className="text-slate-500 text-xs font-medium">{formatDate(rev.created_at)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed sm:pl-1 sm:ml-[52px]">
                  {rev.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
