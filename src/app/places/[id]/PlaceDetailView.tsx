'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin, Clock, Tag, Ticket, Calendar,
  ChevronLeft, ArrowUpRight, ArrowRight,
  CheckCircle2, Compass, Sun, CloudSun,
  Thermometer, Wind, ShieldCheck, Navigation,
  Info, Edit3, Heart, Share2, Sparkles, Map,
  Check
} from 'lucide-react';
import { Place, Review } from '@/types';
import DestinationGallery from './DestinationGallery';
import PlaceMap from './PlaceMap';
import PlaceSidebarQuickFacts from './PlaceSidebarQuickFacts';
import ReviewSection from './ReviewSection';
import TripAdvisorRating, { TripAdvisorRatingDots } from '@/components/TripAdvisorRating';
import TripAdvisorReviewModal from '@/components/TripAdvisorReviewModal';
import WishlistButton from '@/components/WishlistButton';
import PlaceCard from '@/components/PlaceCard';
import toast from 'react-hot-toast';

interface PlaceDetailViewProps {
  place: Place;
  reviews: Review[];
  relatedPlaces: Place[];
  nearbyAttractions: Place[];
  galleryImages: string[];
  thingsToDo: { title: string; desc: string; icon: string }[];
  seasonality: {
    climateType: string;
    tempRange: string;
    humidity: string;
    weatherNote: string;
    primeHours: string;
    recommendedDuration: string;
    monthStatuses: { name: string; status: 'peak' | 'good' | 'monsoon'; label: string }[];
    currentStatus: { name: string; status: 'peak' | 'good' | 'monsoon'; label: string };
    currentMonthName: string;
  };
}

export default function PlaceDetailView({
  place,
  reviews: initialReviews,
  relatedPlaces,
  nearbyAttractions,
  galleryImages,
  thingsToDo,
  seasonality,
}: PlaceDetailViewProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'things' | 'weather' | 'reviews' | 'map'>('overview');

  const scrollToSection = (id: string, tab: typeof activeTab) => {
    setActiveTab(tab);
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const handleReviewSubmitted = (newReview: Review) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${place.name} | UncoverCeylon`,
        text: place.short_description || `Discover ${place.name} in ${place.location}, Sri Lanka.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const isFree = !place.entry_fee || place.entry_fee.toLowerCase().includes('free');

  return (
    <div className="min-h-screen bg-white text-slate-900 pt-16 sm:pt-20 pb-20 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* ━━━ 1. BREADCRUMBS & TOP NAVIGATION (COMPACT) ━━━ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-3">
        <nav className="flex items-center gap-1.5 sm:gap-2 text-xs font-semibold text-slate-500 overflow-x-auto whitespace-nowrap scrollbar-none py-1">
          <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
          <span className="text-slate-300">/</span>
          <Link href={`/?category=${encodeURIComponent(place.category)}#explore`} className="hover:text-slate-900 transition-colors">
            {place.category}
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-400">{place.province}</span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-900 font-bold">{place.name}</span>
        </nav>
      </div>

      {/* ━━━ 2. DESTINATION TITLE HEADER (SCREENSHOT 2 STYLE) ━━━ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2 flex-1 min-w-0">
            {/* Lowest price / Verified label */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded border border-emerald-300 bg-emerald-50 text-emerald-800">
                <Check className="w-3 h-3 text-[#00aa6c]" />
                Verified Travel Guide
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {place.category} in {place.province}
              </span>
            </div>

            {/* Destination Name */}
            <h1 className="text-2xl sm:text-4xl lg:text-[42px] font-black text-slate-900 tracking-tight leading-tight">
              {place.name}
            </h1>

            {/* TripAdvisor Rating Row (Screenshot 1 & 2) */}
            <div className="flex flex-wrap items-center gap-3 pt-0.5">
              <TripAdvisorRating
                rating={place.rating}
                reviewCount={reviews.length > 0 ? reviews.length : place.review_count}
                showBadge={true}
                showRecommend={true}
                size="md"
              />

              <span className="text-slate-300 hidden sm:inline">·</span>

              <div className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-[#00aa6c] shrink-0" />
                <span>{place.location}, Sri Lanka</span>
              </div>
            </div>
          </div>

          {/* Action Buttons: Save & Review side by side (Screenshot 2) */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 self-start">
            <WishlistButton
              placeId={place.id}
              placeName={place.name}
              variant="outline"
              label="Save"
            />

            <button
              type="button"
              onClick={() => setIsReviewModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full border border-slate-800 hover:bg-slate-900 hover:text-white text-slate-900 font-bold text-xs sm:text-sm transition-all cursor-pointer bg-white shadow-2xs active:scale-95"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Review</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full border border-slate-300 hover:border-slate-800 text-slate-700 hover:text-slate-900 font-bold text-xs sm:text-sm transition-all cursor-pointer bg-white shadow-2xs active:scale-95"
              title="Share destination"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* ━━━ 3. TRIPADVISOR COMPACT PHOTO COLLAGE GRID (SCREENSHOT 4 STYLE) ━━━ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <DestinationGallery
          images={galleryImages}
          title={place.name}
          category={place.category}
          location={place.location}
        />
      </div>

      {/* ━━━ 4. STICKY SUB-NAVIGATION TABS BAR (SCREENSHOT 5 STYLE) ━━━ */}
      <div className="sticky top-14 sm:top-16 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 mb-8 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto scrollbar-none py-3 text-xs sm:text-sm font-bold">
            <button
              onClick={() => scrollToSection('sec-overview', 'overview')}
              className={`pb-1 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'overview'
                  ? 'border-slate-900 text-slate-900 font-black'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Overview
            </button>

            <button
              onClick={() => scrollToSection('sec-things', 'things')}
              className={`pb-1 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'things'
                  ? 'border-slate-900 text-slate-900 font-black'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Things to do ({thingsToDo.length})
            </button>

            <button
              onClick={() => scrollToSection('sec-weather', 'weather')}
              className={`pb-1 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'weather'
                  ? 'border-slate-900 text-slate-900 font-black'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Weather &amp; Timing
            </button>

            <button
              onClick={() => scrollToSection('sec-reviews', 'reviews')}
              className={`pb-1 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'reviews'
                  ? 'border-slate-900 text-slate-900 font-black'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Reviews ({reviews.length > 0 ? reviews.length : place.review_count})
            </button>

            <button
              onClick={() => scrollToSection('sec-map', 'map')}
              className={`pb-1 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'map'
                  ? 'border-slate-900 text-slate-900 font-black'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Location &amp; Map
            </button>
          </div>
        </div>
      </div>

      {/* ━━━ 5. MAIN TWO-COLUMN CONTENT LAYOUT (TIGHT SPACING) ━━━ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* ━━━━ LEFT COLUMN (8 COLS): ABOUT, WHY TRAVELERS LOVE, THINGS TO DO, WEATHER, REVIEWS, MAP ━━━━ */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* ━━━ SECTION 1: ABOUT & DESTINATION OVERVIEW ━━━ */}
            <section id="sec-overview" className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                About {place.name}
              </h2>

              {/* Lead short description */}
              {place.short_description && (
                <p className="text-slate-900 font-semibold text-base sm:text-lg leading-relaxed">
                  {place.short_description}
                </p>
              )}

              {/* Full description with Read More */}
              <div className="text-slate-700 text-sm sm:text-base leading-relaxed space-y-3 whitespace-pre-line font-medium">
                <p className={!isDescExpanded ? 'line-clamp-4 sm:line-clamp-5' : ''}>
                  {place.description}
                </p>

                {place.description && place.description.length > 300 && (
                  <button
                    type="button"
                    onClick={() => setIsDescExpanded(!isDescExpanded)}
                    className="text-xs sm:text-sm font-bold text-slate-900 underline hover:text-[#00aa6c] cursor-pointer pt-1"
                  >
                    {isDescExpanded ? 'Read less' : 'Read more →'}
                  </button>
                )}
              </div>

              {/* ━━━ WHY TRAVELERS LOVE THIS (SCREENSHOT 5 SIGNATURE FEATURE) ━━━ */}
              <div className="mt-4 p-5 sm:p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                    <span>Why travelers love this</span>
                    <Info className="w-4 h-4 text-slate-400" />
                  </h3>
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
                    <TripAdvisorRatingDots rating={place.rating} size="sm" />
                    <span>({(reviews.length > 0 ? reviews.length : place.review_count).toLocaleString()} reviews)</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                      <TripAdvisorRatingDots rating={5} size="sm" />
                      <span>Prime Panoramas</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      Spectacular vantage points overlooking lush jungle canopies and rolling Ceylon mountain valleys.
                    </p>
                  </div>

                  <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                      <TripAdvisorRatingDots rating={5} size="sm" />
                      <span>Authentic &amp; Uncrowded</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      A peaceful escape with natural trails, tranquil viewpoints, and budget-friendly admission.
                    </p>
                  </div>
                </div>
              </div>

              {/* Key metadata list (Screenshot 5 metadata list with clean icons) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 rounded-xl border border-slate-200/80 bg-white">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Duration</span>
                  <span className="text-xs sm:text-sm font-extrabold text-slate-900">{seasonality.recommendedDuration}</span>
                </div>

                <div className="p-3 rounded-xl border border-slate-200/80 bg-white">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Best Window</span>
                  <span className="text-xs sm:text-sm font-extrabold text-slate-900">{place.best_time || 'Nov to Apr'}</span>
                </div>

                <div className="p-3 rounded-xl border border-slate-200/80 bg-white">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Admission</span>
                  <span className="text-xs sm:text-sm font-extrabold text-slate-900">{place.entry_fee || 'Free'}</span>
                </div>

                <div className="p-3 rounded-xl border border-slate-200/80 bg-white">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Live Guide</span>
                  <span className="text-xs sm:text-sm font-extrabold text-slate-900">Local or Self-guided</span>
                </div>
              </div>
            </section>

            {/* ━━━ SECTION 2: THINGS TO DO NEARBY (SCREENSHOT 5 STYLE) ━━━ */}
            <section id="sec-things" className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Things to do &amp; experiences
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    Curated activities recommended by local explorers in {place.location}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {thingsToDo.map((item, idx) => (
                  <article
                    key={idx}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-slate-400 transition-all shadow-2xs group"
                  >
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
                        {item.icon}
                      </div>

                      <div className="space-y-1 min-w-0">
                        <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-[#00aa6c] transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                          {item.desc}
                        </p>
                        <div className="flex items-center gap-1.5 pt-0.5">
                          <TripAdvisorRatingDots rating={5} size="sm" />
                          <span className="text-[11px] font-semibold text-slate-500">4.9 · Highly Recommended</span>
                        </div>
                      </div>
                    </div>

                    <a
                      href={`https://www.google.com/maps?q=${encodeURIComponent(`${place.name} ${item.title} Sri Lanka`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-full bg-slate-100 hover:bg-[#00aa6c] hover:text-white text-slate-800 text-xs font-bold transition-all shrink-0 cursor-pointer"
                    >
                      View on Map
                    </a>
                  </article>
                ))}
              </div>
            </section>

            {/* ━━━ SECTION 3: WEATHER & SEASONALITY ━━━ */}
            <section id="sec-weather" className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Seasonality &amp; Weather Guide
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    12-month travel matrix and prime visiting windows
                  </p>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 border border-slate-200">
                  <span className="w-2 h-2 rounded-full bg-[#00aa6c] animate-pulse" />
                  <span>{seasonality.currentMonthName}: {seasonality.currentStatus.label}</span>
                </div>
              </div>

              {/* 4 Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Climate</span>
                  <span className="text-xs sm:text-sm font-extrabold text-slate-900">{seasonality.climateType}</span>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Temperature</span>
                  <span className="text-xs sm:text-sm font-extrabold text-slate-900">{seasonality.tempRange}</span>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Humidity</span>
                  <span className="text-xs sm:text-sm font-extrabold text-slate-900">{seasonality.humidity}</span>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Prime Hours</span>
                  <span className="text-xs sm:text-sm font-extrabold text-slate-900">{seasonality.primeHours}</span>
                </div>
              </div>

              {/* 12-Month Calendar Bar */}
              <div className="space-y-2 pt-1">
                <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-1.5">
                  {seasonality.monthStatuses.map((m, idx) => {
                    const isCurrent = m.name === seasonality.currentMonthName;
                    const isPeak = m.status === 'peak';
                    const isGood = m.status === 'good';
                    return (
                      <div
                        key={idx}
                        className={`rounded-xl p-2 text-center border transition-all ${
                          isCurrent ? 'ring-2 ring-slate-900 shadow-xs' : ''
                        } ${
                          isPeak
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-950 font-bold'
                            : isGood
                            ? 'bg-amber-50 border-amber-200 text-amber-950 font-bold'
                            : 'bg-teal-50 border-teal-200 text-teal-950 font-bold'
                        }`}
                      >
                        <span className="text-[11px] block">{m.name}</span>
                        <span className="text-sm my-0.5 block">{isPeak ? '☀️' : isGood ? '🌤️' : '🌧️'}</span>
                        <span className="text-[9px] uppercase tracking-tighter opacity-80 block">
                          {isPeak ? 'Peak' : isGood ? 'Good' : 'Wet'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* ━━━ SECTION 4: TRAVELER REVIEWS (CONNECTED WITH TRIPADVISOR MODAL) ━━━ */}
            <section id="sec-reviews" className="pt-4 border-t border-slate-100">
              <ReviewSection
                place={place}
                initialReviews={reviews}
                onOpenReviewModal={() => setIsReviewModalOpen(true)}
              />
            </section>

            {/* ━━━ SECTION 5: INTERACTIVE LOCATION MAP ━━━ */}
            <section id="sec-map" className="pt-4 border-t border-slate-100">
              <PlaceMap place={place} />
            </section>
          </div>

          {/* ━━━━ RIGHT COLUMN (4 COLS): STICKY TRIPADVISOR SIDEBAR ━━━━ */}
          <aside className="lg:col-span-4 sticky top-24 space-y-4">
            {/* Admission & Primary Booking Card */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-5">
              <PlaceSidebarQuickFacts place={place} />

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <a
                  href={`https://www.google.com/maps?q=${place.lat},${place.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#00aa6c] hover:bg-[#008f5a] text-white font-extrabold py-3.5 px-6 rounded-full text-xs sm:text-sm transition-all shadow-md shadow-emerald-950/15 active:scale-95"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Open in Google Maps</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-800 text-slate-800 font-extrabold py-3 px-6 rounded-full text-xs sm:text-sm transition-all cursor-pointer active:scale-95 shadow-2xs"
                >
                  <Edit3 className="w-4 h-4 text-slate-700" />
                  <span>Write a Traveler Review</span>
                </button>

                <Link
                  href="/map"
                  className="w-full flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 font-extrabold py-2.5 px-6 rounded-full text-xs sm:text-sm transition-all active:scale-95"
                >
                  <Map className="w-4 h-4 text-[#00aa6c]" />
                  <span>View on Ceylon Live Map</span>
                </Link>
              </div>

              {/* Trust Guarantee */}
              <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500 font-semibold">
                <ShieldCheck className="w-4 h-4 text-[#00aa6c] shrink-0" />
                <span>Verified travel information updated by Sri Lanka travel network.</span>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ━━━ 6. NEARBY ATTRACTIONS SECTION (CLEAN 3-COLUMN CARDS) ━━━ */}
      {nearbyAttractions.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-10 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
            <div>
              <span className="text-xs font-extrabold text-[#00aa6c] uppercase tracking-wider block mb-1">
                Explore More in {place.province}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Nearby Attractions
              </h2>
            </div>

            <Link
              href={`/?province=${encodeURIComponent(place.province)}#explore`}
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#00aa6c] hover:underline"
            >
              <span>Explore all in {place.province}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {nearbyAttractions.map((nearby, idx) => (
              <PlaceCard key={nearby.id} place={nearby} index={idx} />
            ))}
          </div>
        </section>
      )}

      {/* ━━━ 7. TRIPADVISOR REVIEW MODAL (SCREENSHOT 3) ━━━ */}
      <TripAdvisorReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        place={place}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </div>
  );
}
