'use client';

import { useState } from 'react';
import { Review } from '@/types';
import { Star, Send, Loader2 } from 'lucide-react';
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
          className="focus:outline-none transition-transform hover:scale-110"
        >
          <Star
            className={`w-8 h-8 transition-colors ${
              s <= (hovered || value) ? 'fill-amber-400 text-amber-400' : 'text-slate-200 hover:text-amber-400/50'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function ReviewSection({ placeId, initialReviews }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
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
    if (!author.trim() || !comment.trim() || rating === 0) {
      toast.error('Please fill in your name, rating, and feedback.');
      return;
    }

    if (parseInt(userAnswer.trim(), 10) !== challenge.num1 + challenge.num2) {
      toast.error('Incorrect human verification answer. Please try again.');
      refreshChallenge();
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          place_id: placeId,
          author: author.trim(),
          rating,
          comment: comment.trim(),
          website, // honeypot
          challenge_answer: userAnswer.trim(),
          expected_challenge: challenge.num1 + challenge.num2,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit review');

      if (data.status === 'pending') {
        toast.success(data.message || 'Thank you! Your review is pending quick admin moderation.', {
          duration: 5000,
        });
      } else {
        const newReview: Review = {
          id: data.id || Date.now(),
          place_id: placeId,
          author: author.trim(),
          rating,
          comment: comment.trim(),
          created_at: new Date().toISOString(),
          status: 'approved',
        };
        setReviews((prev) => [newReview, ...prev]);
        toast.success('Thank you! Review posted successfully.');
      }

      setAuthor('');
      setRating(5);
      setComment('');
      setWebsite('');
      refreshChallenge();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to submit review. Please try again.';
      toast.error(msg);
      refreshChallenge();
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-8">
      {/* Leave a review form card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80">
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          Write a Review
        </h3>
        <p className="text-slate-500 text-sm mb-6">
          Share your authentic travel experience to help others plan their journey across Sri Lanka.
        </p>

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
            <label className="block text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
              Rating
            </label>
            <StarPicker value={rating} onChange={setRating} />
          </div>

          <div>
            <label className="block text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
              Your Name
            </label>
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g. Kasun Perera"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 text-base sm:text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:bg-white transition-all outline-none"
              required
              maxLength={60}
            />
          </div>

          <div>
            <label className="block text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
              Review & Tips
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you love? Any hidden viewpoints, safety tips, entry tickets, or best visiting hours?"
              rows={3}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 text-base sm:text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:bg-white transition-all resize-none outline-none"
              required
              maxLength={2500}
            />
          </div>

          {/* Anti-spam Verification challenge */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-600">Anti-spam check:</span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-white border border-slate-200 font-mono text-sm font-semibold text-sky-700 shadow-2xs">
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
                className="w-24 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 placeholder-slate-400 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all outline-none font-medium"
              />
              <button
                type="button"
                onClick={refreshChallenge}
                className="text-xs text-slate-400 hover:text-slate-600 underline"
                title="Get another question"
              >
                Change
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md shadow-sky-600/25 active:scale-95 text-sm"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>{submitting ? 'Posting...' : 'Submit Review'}</span>
          </button>
        </form>
      </div>

      {/* Community Reviews List */}
      <div className="space-y-4">
        <h4 className="text-xl font-bold text-slate-900">
          Traveler Reviews ({reviews.length})
        </h4>

        {reviews.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center text-slate-500 text-sm">
            No reviews yet. Be the first adventurer to share your experience!
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm space-y-3 transition-all hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-sky-50 text-sky-600 font-bold flex items-center justify-center text-sm border border-sky-100">
                      {rev.author.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-slate-900 font-semibold text-sm">{rev.author}</div>
                      <div className="text-slate-500 text-xs">{formatDate(rev.created_at)}</div>
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
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed sm:pl-1 sm:ml-[52px]">
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
