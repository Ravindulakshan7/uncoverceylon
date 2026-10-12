'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ShieldCheck, Loader2, Sparkles, AlertCircle, Camera, Upload, Trash2 } from 'lucide-react';
import { Place, Review } from '@/types';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

interface TripAdvisorReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  place: Place;
  onReviewSubmitted?: (newReview: Review) => void;
}

const RATING_LABELS: Record<number, string> = {
  1: 'Terrible',
  2: 'Poor',
  3: 'Average',
  4: 'Very Good',
  5: 'Excellent',
};

const COMPANION_OPTIONS = ['Business', 'Couples', 'Family', 'Friends', 'Solo'];

const REVIEW_PROMPT_CHIPS = [
  'Scenic Views',
  'Admission Fee',
  'Length of Visit',
  'Crowd Size',
  'Atmosphere',
  'Safety & Footwear',
];

export default function TripAdvisorReviewModal({
  isOpen,
  onClose,
  place,
  onReviewSubmitted,
}: TripAdvisorReviewModalProps) {
  const { user, openAuthModal } = useAuth();

  // Primary Rating
  const [rating, setRating] = useState<number>(5);
  const [hoveredRating, setHoveredRating] = useState<number>(0);

  // Sub-ratings
  const [subRatings, setSubRatings] = useState<{
    valueForMoney: number;
    scenery: number;
    accessibility: number;
  }>({
    valueForMoney: 5,
    scenery: 5,
    accessibility: 4,
  });

  // Trip details
  const [visitDate, setVisitDate] = useState('October 2026');
  const [companion, setCompanion] = useState<string>('Couples');

  // Review text & title
  const [reviewTitle, setReviewTitle] = useState('');
  const [comment, setComment] = useState('');
  const [website, setWebsite] = useState(''); // honeypot
  const [certified, setCertified] = useState(false);

  // Traveler photos
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChipClick = (chip: string) => {
    const chipText = `${chip}: `;
    if (!comment.includes(chipText)) {
      setComment((prev) => (prev ? `${prev} \n• ${chipText}` : `• ${chipText}`));
    }
  };

  const handlePhotosUpload = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (fileArray.length === 0) {
      toast.error('Please select valid image files (JPG, PNG, WEBP, etc.)');
      return;
    }

    if (uploadedPhotos.length + fileArray.length > 6) {
      toast.error('You can upload a maximum of 6 photos per review.');
      return;
    }

    setUploadingPhotos(true);
    let successCount = 0;

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      const previewUrl = URL.createObjectURL(file);
      setUploadedPhotos((prev) => [...prev, previewUrl]);

      const data = new FormData();
      data.append('file', file);

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: data,
        });
        const resData = await res.json();
        if (!res.ok) throw new Error(resData.error || 'Upload failed');

        setUploadedPhotos((prev) =>
          prev.map((img) => (img === previewUrl ? resData.url : img))
        );
        successCount++;
      } catch (err: unknown) {
        setUploadedPhotos((prev) => prev.filter((img) => img !== previewUrl));
        const msg = err instanceof Error ? err.message : 'Upload failed';
        toast.error(`Failed to upload ${file.name}: ${msg}`);
      }
    }

    setUploadingPhotos(false);
    if (successCount > 0) {
      toast.success(
        successCount === 1 ? 'Photo attached! 📸' : `${successCount} photos attached! 📸`
      );
    }
  };

  const removePhoto = (index: number) => {
    setUploadedPhotos((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (uploadingPhotos) {
      toast.error('Please wait for photos to finish uploading before submitting.');
      return;
    }

    const hasPendingBlobs = uploadedPhotos.some((img) => img.startsWith('blob:'));
    if (hasPendingBlobs) {
      toast.error('Some photos are still uploading. Please wait a moment.');
      return;
    }

    if (!user) {
      toast.error('Please sign in to submit a review.');
      openAuthModal('signin');
      return;
    }

    const authorName = user.name;

    if (rating === 0) {
      toast.error('Please select an overall rating score.');
      return;
    }

    if (!comment.trim() || comment.trim().length < 20) {
      toast.error('Please write at least 20 characters about your experience.');
      return;
    }

    if (!certified) {
      toast.error('Please check the certification box to verify your review.');
      return;
    }

    setSubmitting(true);
    try {
      let fullComment = reviewTitle.trim()
        ? `**${reviewTitle.trim()}**\n\n${comment.trim()}`
        : comment.trim();

      if (uploadedPhotos.length > 0) {
        fullComment = `${fullComment}\n\n<!--PHOTOS:${JSON.stringify(uploadedPhotos)}-->`;
      }

      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          place_id: place.id,
          author: authorName,
          user_image: user?.image || '',
          rating,
          comment: fullComment,
          images: uploadedPhotos,
          website, // honeypot
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit review');

      const createdReview: Review = {
        id: data.id || Date.now(),
        place_id: place.id,
        user_id: user?.id || null,
        user_image: user?.image || '',
        author: authorName,
        rating,
        comment: fullComment,
        images: uploadedPhotos,
        created_at: new Date().toISOString(),
        status: 'pending',
      };

      toast.success('Thank you! Your review has been submitted for moderation. It will appear once approved by an admin. ⏳');
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to submit review';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-slate-200 z-10"
        >
          {/* Top Bar with Close Button */}
          <div className="sticky top-0 bg-white/95 backdrop-blur-md z-20 flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00aa6c]" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Write a Traveler Review
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid md:grid-cols-12 gap-6 p-6 sm:p-8">
            {/* ━━━ LEFT COLUMN: DESTINATION PREVIEW CARD ━━━ */}
            <div className="md:col-span-4 space-y-4">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                Tell us, how was your visit?
              </h2>

              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-3">
                <div className="relative h-40 w-full rounded-xl overflow-hidden bg-slate-200">
                  <Image
                    src={place.image_url || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80'}
                    alt={place.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <span className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md text-white text-[11px] font-bold px-2 py-0.5 rounded">
                    {place.category}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                    {place.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {place.location}, {place.province}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-emerald-50/70 border border-emerald-200/60 rounded-2xl text-xs text-slate-700 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                  <ShieldCheck className="w-4 h-4 text-[#00aa6c]" />
                  <span>UncoverCeylon Community Guidelines</span>
                </div>
                <p className="leading-relaxed text-slate-600">
                  Your authentic review guides fellow explorers across Sri Lanka. Write about genuine memories, crowds, safety, or timing!
                </p>
              </div>
            </div>

            {/* ━━━ RIGHT COLUMN: TRIPADVISOR STYLE REVIEW FORM ━━━ */}
            <form onSubmit={handleSubmit} className="md:col-span-8 space-y-6">
              {/* Honeypot field for bot protection */}
              <div className="hidden" aria-hidden="true" style={{ display: 'none' }}>
                <input
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              {/* 1. Overall Rating with TripAdvisor Green Bubbles */}
              <div>
                <label className="block text-sm font-extrabold text-slate-900 mb-2">
                  How would you rate your experience? <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-2.5">
                  {[1, 2, 3, 4, 5].map((val) => {
                    const activeVal = hoveredRating || rating;
                    const isSelected = val <= activeVal;
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setRating(val)}
                        onMouseEnter={() => setHoveredRating(val)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer shadow-xs ${
                          isSelected
                            ? 'bg-[#00aa6c] border-[#00aa6c] text-white scale-105'
                            : 'bg-white border-slate-300 hover:border-[#00aa6c]'
                        }`}
                        aria-label={`${val} bubble`}
                      >
                        <span
                          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full transition-transform ${
                            isSelected ? 'bg-white scale-90' : 'bg-transparent'
                          }`}
                        />
                      </button>
                    );
                  })}
                  <span className="text-sm font-extrabold text-slate-800 ml-2">
                    {RATING_LABELS[hoveredRating || rating] || ''}
                  </span>
                </div>
              </div>

              {/* 2. Sub-Ratings (TripAdvisor Signature) */}
              <div className="p-4 bg-slate-50 border border-slate-200/70 rounded-2xl space-y-3">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                  Detailed Experience Ratings
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Value for money */}
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-slate-700 block">
                      Value for money
                    </span>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setSubRatings((prev) => ({ ...prev, valueForMoney: val }))}
                          className={`w-5 h-5 rounded-full border cursor-pointer ${
                            val <= subRatings.valueForMoney
                              ? 'bg-[#00aa6c] border-[#00aa6c]'
                              : 'bg-white border-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Scenery & Natural Beauty */}
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-slate-700 block">
                      Scenery & Views
                    </span>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setSubRatings((prev) => ({ ...prev, scenery: val }))}
                          className={`w-5 h-5 rounded-full border cursor-pointer ${
                            val <= subRatings.scenery
                              ? 'bg-[#00aa6c] border-[#00aa6c]'
                              : 'bg-white border-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Accessibility & Ease */}
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-slate-700 block">
                      Accessibility & Trails
                    </span>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setSubRatings((prev) => ({ ...prev, accessibility: val }))}
                          className={`w-5 h-5 rounded-full border cursor-pointer ${
                            val <= subRatings.accessibility
                              ? 'bg-[#00aa6c] border-[#00aa6c]'
                              : 'bg-white border-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. When did you go? & Who did you go with? */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-1.5">
                    When did you go?
                  </label>
                  <select
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 text-sm font-semibold focus:border-[#00aa6c] outline-none"
                  >
                    <option value="October 2026">October 2026</option>
                    <option value="September 2026">September 2026</option>
                    <option value="August 2026">August 2026</option>
                    <option value="July 2026">July 2026</option>
                    <option value="Earlier in 2026">Earlier in 2026</option>
                    <option value="In 2025">In 2025</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-1.5">
                    Who did you go with?
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {COMPANION_OPTIONS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCompanion(c)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                          companion === c
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white text-slate-700 border-slate-300 hover:border-slate-800'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 4. Write Your Review with Helper Chips */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-extrabold text-slate-900">
                    Write your review <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] font-bold text-slate-400">
                    {comment.length} / 20 min characters
                  </span>
                </div>

                {/* Prompt chips */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-400">Tips:</span>
                  {REVIEW_PROMPT_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => handleChipClick(chip)}
                      className="text-[11px] font-semibold text-slate-600 bg-slate-100 hover:bg-emerald-50 hover:text-[#00aa6c] border border-slate-200 px-2.5 py-0.5 rounded-md transition-colors cursor-pointer"
                    >
                      + {chip}
                    </button>
                  ))}
                </div>

                <textarea
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your authentic experience... What should visitors know before going? Best viewpoints, crowds, weather or footwear?"
                  className="w-full bg-slate-50 border border-slate-300 rounded-2xl p-4 text-slate-900 placeholder:text-slate-400 text-sm focus:border-[#00aa6c] focus:ring-2 focus:ring-emerald-500/20 focus:bg-white outline-none transition-all resize-y"
                  required
                />
              </div>

              {/* 5. Title your review */}
              <div>
                <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-1.5">
                  Title your review
                </label>
                <input
                  type="text"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="Give us the gist of your experience (e.g. Unmissable sunrise trek!)"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:border-[#00aa6c] focus:bg-white outline-none transition-all"
                  maxLength={100}
                />
              </div>

              {/* 5b. Add Traveler Photos (Screenshot 2: Real Traveler Photos) */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-[#00aa6c]" />
                    <span>Add photos of your visit (Optional)</span>
                  </label>
                  <span className="text-[11px] font-bold text-slate-400">
                    {uploadedPhotos.length} / 6 photos
                  </span>
                </div>

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                      handlePhotosUpload(e.dataTransfer.files);
                    }
                  }}
                  className="border-2 border-dashed border-slate-300 hover:border-[#00aa6c] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 hover:bg-emerald-50/40 transition-all relative cursor-pointer"
                >
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={uploadingPhotos}
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handlePhotosUpload(e.target.files);
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                  />
                  <div className="flex items-center gap-3 text-center sm:text-left">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-[#00aa6c] flex items-center justify-center shrink-0 shadow-xs">
                      {uploadingPhotos ? (
                        <Loader2 className="w-5 h-5 animate-spin text-[#00aa6c]" />
                      ) : (
                        <Upload className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-slate-900">
                        {uploadingPhotos ? 'Uploading photos from device...' : 'Drag & drop photos or click to browse'}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Upload real traveler pictures of views, trails, or tickets (JPG, PNG, WEBP)
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#00aa6c] bg-white border border-[#a3e6cd] px-3.5 py-1.5 rounded-full shrink-0 shadow-xs">
                    Choose photos
                  </span>
                </div>

                {uploadedPhotos.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1">
                    {uploadedPhotos.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group shadow-xs"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img}
                          alt={`Uploaded preview ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(idx)}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 hover:bg-rose-600 text-white flex items-center justify-center transition-colors cursor-pointer z-20"
                          title="Remove photo"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 6. Signed-in User Info or Sign In Prompt */}
              {user ? (
                <div className="flex items-center gap-3 p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl">
                  {user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover border border-emerald-300 shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#00aa6c] text-white font-black flex items-center justify-center shrink-0">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
                      Posting as verified traveler
                    </span>
                    <span className="text-sm font-extrabold text-[#000a12]">{user.name}</span>
                  </div>
                </div>
              ) : (
                <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl space-y-2.5">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-extrabold text-[#000a12]">
                        Sign in required to post a review
                      </h4>
                      <p className="text-xs text-[#545454] leading-relaxed mt-0.5">
                        Only registered and signed-in explorers can submit reviews and photos to protect community authenticity.
                      </p>
                    </div>
                  </div>
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        openAuthModal('signin');
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#00aa6c] hover:bg-[#008f5a] text-white font-bold text-xs shadow-xs cursor-pointer active:scale-95"
                    >
                      <span>Sign in to continue</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 7. Certification Checkbox (TripAdvisor requirement) */}
              <div className="flex items-start gap-3 pt-1">
                <input
                  id="certify-review"
                  type="checkbox"
                  checked={certified}
                  onChange={(e) => setCertified(e.target.checked)}
                  className="mt-1 w-4 h-4 text-[#00aa6c] rounded border-slate-300 focus:ring-[#00aa6c] cursor-pointer"
                  required
                />
                <label
                  htmlFor="certify-review"
                  className="text-xs text-slate-600 leading-relaxed cursor-pointer select-none"
                >
                  I certify that this review is based on my own experience and is my genuine opinion of this destination. I have no personal or commercial relationship with this establishment and understand UncoverCeylon enforces a strict zero-tolerance policy against fraudulent reviews.
                </label>
              </div>

              {/* 8. Submit Continue Button */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting || uploadingPhotos}
                  className="inline-flex items-center gap-2 bg-[#00aa6c] hover:bg-[#008f5a] disabled:opacity-50 text-white font-bold px-8 py-3 rounded-full text-xs sm:text-sm transition-all shadow-md shadow-emerald-950/20 active:scale-95 cursor-pointer"
                >
                  {submitting || uploadingPhotos ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{uploadingPhotos ? 'Uploading photos...' : 'Posting review...'}</span>
                    </>
                  ) : (
                    <span>Continue &amp; Post Review</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
