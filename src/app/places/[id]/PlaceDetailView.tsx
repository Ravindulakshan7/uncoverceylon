'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin, Tag, Ticket, Calendar, Clock,
  ChevronRight, ArrowRight, Compass,
  Star, Camera, Sparkles, Navigation,
  Edit3, Share2, Map, Check, ChevronDown, ChevronUp
} from 'lucide-react';
import { Place, Review } from '@/types';
import { useCurrency } from '@/context/CurrencyContext';
import { useLocation } from '@/context/LocationContext';
import { useAuth } from '@/context/AuthContext';
import DestinationGallery from './DestinationGallery';
import ReviewSection from './ReviewSection';
import { TripAdvisorRatingDots } from '@/components/TripAdvisorRating';
import TripAdvisorReviewModal from '@/components/TripAdvisorReviewModal';
import WishlistButton from '@/components/WishlistButton';
import CurrencySelector from '@/components/CurrencySelector';
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

// Clean Real Traveler Photos (NO fake stock images)
type TabId = 'overview' | 'reviews' | 'photos' | 'qa' | 'nearby';

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
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [photoStripIndex, setPhotoStripIndex] = useState<number | null>(null);

  const { getDetailedFee } = useCurrency();
  const { formatDistanceTo, requestLocation, status: locationStatus } = useLocation();
  const { user, openAuthModal } = useAuth();

  const handleOpenReviewModal = () => {
    if (!user) {
      toast('Please sign in to write a review and upload photos! ✈️', { icon: '🔐' });
      openAuthModal('signin');
      return;
    }
    setIsReviewModalOpen(true);
  };

  const feeData = getDetailedFee(place.entry_fee);
  const distanceInfo = formatDistanceTo(place.lat, place.lng, place.distance_km);

  // Extract real traveler photos from reviews & place gallery (NO fake photos)
  const reviewPhotos: string[] = reviews.flatMap((r) => {
    if (r.images && Array.isArray(r.images) && r.images.length > 0) {
      return r.images;
    }
    const match = r.comment ? r.comment.match(/<!--PHOTOS:(\[.*?\])-->/) : null;
    if (match) {
      try {
        const parsed = JSON.parse(match[1]);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
    }
    return [];
  });

  const allRealPhotos: string[] = [];
  reviewPhotos.forEach((img) => {
    if (img && !allRealPhotos.includes(img)) allRealPhotos.push(img);
  });
  (galleryImages || []).forEach((img) => {
    if (img && !allRealPhotos.includes(img)) allRealPhotos.push(img);
  });
  if (place.image_url && !allRealPhotos.includes(place.image_url)) {
    allRealPhotos.push(place.image_url);
  }

  const travelerPhotos = allRealPhotos.filter(Boolean);
  const photoStripList = travelerPhotos.slice(0, 5);

  // Parse description paragraphs
  const descriptionParagraphs = place.description
    ? place.description.split(/\n+/).map((p) => p.trim()).filter(Boolean)
    : [];
  const isLongDescription = (place.description?.length || 0) > 280 || descriptionParagraphs.length > 1;

  // Scroll spy for sticky tabs
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + 140;
      const sectionIds: TabId[] = ['overview', 'reviews', 'photos', 'qa', 'nearby'];
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollY) {
          setActiveTab(sectionIds[i]);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: TabId) => {
    setActiveTab(id);
    const el = document.getElementById(id);
    if (el) {
      const top = el.offsetTop - 110;
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

  // Q&A list matching deepseek HTML format
  const qaItems = [
    {
      q: 'How long does the visit or hike take?',
      a: `Most travelers spend around ${seasonality.recommendedDuration || '1 to 2.5 hours'} at ${place.name}, allowing plenty of time to explore scenic vantage points and take photos.`,
    },
    {
      q: 'What is the entry fee for foreigners and locals?',
      a: feeData.isFree
        ? 'Admission is completely free for both local and foreign travelers. No tickets required.'
        : `Standard admission is ${place.entry_fee || 'approx. 1,000 LKR'}. Cash is recommended for local ticket counters.`,
    },
    {
      q: 'Is it suitable for children or elderly visitors?',
      a: 'The lower trails and main viewing areas are accessible. For uneven or steeper terrain, comfortable walking shoes and hydration are strongly recommended.',
    },
    {
      q: 'Best time of day to visit?',
      a: place.best_time
        ? `${place.best_time}. Early mornings and late afternoons offer the best light and cooler temperatures.`
        : 'Early morning (6:00–8:30 AM) for sunrise, or late afternoon (4:00–6:00 PM) for golden sunset views.',
    },
  ];

  // Real places to show under "Things to do nearby" (Screenshot 4)
  const experiencePlaces = nearbyAttractions.length > 0 ? nearbyAttractions.slice(0, 4) : [];

  return (
    <div className="min-h-screen bg-white text-[#000a12] pt-3 sm:pt-4 pb-20 font-['Plus_Jakarta_Sans',system-ui,-apple-system,sans-serif]">
      
      {/* ━━━ 1. BREADCRUMBS ━━━ */}
      <div className="w-[94%] max-w-[1180px] mx-auto mb-3">
        <nav className="flex items-center gap-1.5 text-xs font-semibold text-[#545454] overflow-x-auto whitespace-nowrap scrollbar-none py-1">
          <Link href="/" className="hover:text-[#000a12] transition-colors">Home</Link>
          <span className="text-[#b0b0b0]">/</span>
          <Link href={`/?province=${encodeURIComponent(place.province)}#explore`} className="hover:text-[#000a12] transition-colors">
            {place.province}
          </Link>
          <span className="text-[#b0b0b0]">/</span>
          <span className="text-[#545454]">{place.location}</span>
          <span className="text-[#b0b0b0]">/</span>
          <span className="text-[#000a12] font-bold">{place.name}</span>
        </nav>
      </div>

      {/* ━━━ 2. PAGE HEADER (TITLE & TRIPADVISOR METRICS) ━━━ */}
      <div className="w-[94%] max-w-[1180px] mx-auto mb-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2 flex-1 min-w-0">
            <h1 className="text-2xl sm:text-4xl lg:text-[42px] font-extrabold text-[#000a12] tracking-tight leading-tight">
              {place.name}
            </h1>

            {/* TripAdvisor Rating Row */}
            <div className="flex flex-wrap items-center gap-2.5 text-sm text-[#545454]">
              <TripAdvisorRatingDots rating={place.rating} size="md" />
              <b className="text-[#000a12] font-bold">{place.rating.toFixed(1)}</b>
              <span className="text-[#c0c0c0]">·</span>
              <span>{(reviews.length > 0 ? reviews.length : place.review_count).toLocaleString()} reviews</span>
              <span className="text-[#c0c0c0]">·</span>
              <span className="font-semibold text-[#00aa6c]">Top attraction in {place.province}</span>
            </div>
          </div>

          {/* Action Buttons: Save, Review, Share */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 self-start">
            <WishlistButton
              placeId={place.id}
              placeName={place.name}
              variant="outline"
              label="Save"
            />

            <button
              type="button"
              onClick={handleOpenReviewModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#e0e0e0] hover:border-[#000a12] hover:bg-[#f2f2f2] text-[#000a12] font-bold text-xs sm:text-sm transition-all cursor-pointer bg-white"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Review</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#e0e0e0] hover:border-[#000a12] hover:bg-[#f2f2f2] text-[#000a12] font-bold text-xs sm:text-sm transition-all cursor-pointer bg-white"
              title="Share destination"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* ━━━ 3. PHOTO GALLERY COLLAGE (White Lines, Compact Gaps) ━━━ */}
      <div className="w-[94%] max-w-[1180px] mx-auto mb-6">
        <DestinationGallery
          images={travelerPhotos.length > 0 ? travelerPhotos : (galleryImages.length > 0 ? galleryImages : [place.image_url])}
          title={place.name}
          category={place.category}
          location={place.location}
          externalLightboxIndex={photoStripIndex}
          onCloseExternalLightbox={() => setPhotoStripIndex(null)}
        />
      </div>

      {/* ━━━ 4. STICKY TABS (Stays pinned under header on scroll) ━━━ */}
      <nav className="sticky top-16 sm:top-[70px] z-40 bg-white border-b border-[#e0e0e0] mb-8 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
        <div className="w-[94%] max-w-[1180px] mx-auto">
          <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto scrollbar-none py-3 text-xs sm:text-sm font-bold">
            {[
              { id: 'overview' as TabId, label: 'Overview' },
              { id: 'reviews' as TabId, label: `Reviews (${reviews.length > 0 ? reviews.length : place.review_count})` },
              { id: 'photos' as TabId, label: 'Photos' },
              { id: 'qa' as TabId, label: 'Q&A' },
              { id: 'nearby' as TabId, label: 'Nearby' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => scrollToSection(tab.id)}
                className={`pb-1 border-b-[2.5px] transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-[#000a12] text-[#000a12] font-black'
                    : 'border-transparent text-[#545454] hover:text-[#000a12]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* ━━━ 5. MAIN TWO-COLUMN LAYOUT (Sticky Sidebar stays fixed on scroll) ━━━ */}
      <div className="w-[94%] max-w-[1180px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10 items-start">
          
          {/* ━━━━ MAIN CONTENT (LEFT COLUMN) ━━━━ */}
          <main className="space-y-10 min-w-0">

            {/* ━━━ #OVERVIEW ━━━ */}
            <section id="overview" className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#000a12] tracking-tight">
                About {place.name}
              </h2>

              {place.short_description && (
                <p className="text-[17px] font-medium text-[#000a12] leading-[1.65]">
                  {place.short_description}
                </p>
              )}

              {/* Collapsible / Expandable Description with smooth fade */}
              <div className="space-y-2">
                <div className="relative">
                  <div
                    className={`text-[15px] text-[#545454] leading-[1.7] space-y-3 font-normal transition-all duration-300 ${
                      isLongDescription && !isDescExpanded ? 'max-h-[115px] overflow-hidden' : 'max-h-none'
                    }`}
                  >
                    {descriptionParagraphs.length > 0 ? (
                      descriptionParagraphs.map((para, idx) => (
                        <p key={idx}>{para}</p>
                      ))
                    ) : (
                      <p>{place.description}</p>
                    )}
                  </div>

                  {isLongDescription && !isDescExpanded && (
                    <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
                  )}
                </div>

                {isLongDescription && (
                  <button
                    type="button"
                    onClick={() => setIsDescExpanded(!isDescExpanded)}
                    className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#000a12] hover:text-[#00aa6c] cursor-pointer pt-1"
                  >
                    {isDescExpanded ? (
                      <>
                        <span>Read less</span>
                        <ChevronUp className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        <span>Read more</span>
                        <ChevronDown className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Why travelers love it (deepseek HTML signature box) */}
              <div className="bg-[#fafafa] border border-[#f0f0f0] rounded-xl p-5 sm:p-6 my-6 space-y-3.5">
                <h3 className="text-base sm:text-lg font-extrabold text-[#000a12] tracking-tight">
                  Why travelers love it
                </h3>
                <div className="grid gap-3 pt-1">
                  <div className="flex gap-3.5 items-start">
                    <span className="w-9 h-9 rounded-full bg-white border border-[#e0e0e0] flex items-center justify-center text-[#00aa6c] shrink-0">
                      <Star className="w-4 h-4 fill-current" />
                    </span>
                    <span className="text-sm text-[#1a1a1a] leading-relaxed">
                      <b className="text-[#000a12] font-bold">Prime panoramic views &amp; vistas.</b> Watch breathtaking sunrises and rolling Ceylon highlands from unparalleled vantage points.
                    </span>
                  </div>

                  <div className="flex gap-3.5 items-start">
                    <span className="w-9 h-9 rounded-full bg-white border border-[#e0e0e0] flex items-center justify-center text-[#00aa6c] shrink-0">
                      <Compass className="w-4 h-4" />
                    </span>
                    <span className="text-sm text-[#1a1a1a] leading-relaxed">
                      <b className="text-[#000a12] font-bold">Authentic &amp; peaceful atmosphere.</b> Enjoy an unhurried, natural setting away from overwhelming tourist crowds.
                    </span>
                  </div>

                  <div className="flex gap-3.5 items-start">
                    <span className="w-9 h-9 rounded-full bg-white border border-[#e0e0e0] flex items-center justify-center text-[#00aa6c] shrink-0">
                      <Camera className="w-4 h-4" />
                    </span>
                    <span className="text-sm text-[#1a1a1a] leading-relaxed">
                      <b className="text-[#000a12] font-bold">Unbeatable photo opportunities.</b> Iconic landscape views and vibrant cultural memories make this a must-visit destination.
                    </span>
                  </div>
                </div>
              </div>

              {/* Highlights Bullet List with green dots */}
              <div className="pt-2">
                <h3 className="text-base sm:text-lg font-extrabold text-[#000a12] mb-3">
                  Highlights
                </h3>
                <ul className="space-y-2.5">
                  {[
                    `Explore the scenic vantage points overlooking ${place.location} and surrounding valleys`,
                    `Ideal for sunrise and sunset excursions — approximately ${seasonality.recommendedDuration || '1–2 hours'} recommended`,
                    `Standard admission: ${place.entry_fee || 'Free admission'} — budget-friendly for all travelers`,
                    `Located in ${place.province}, approximately ${place.distance_km} km from Colombo`,
                    `Rich local heritage, pristine flora, and authentic Sri Lankan hospitality`,
                  ].map((hl, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-[#1a1a1a] leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00aa6c] mt-2 shrink-0" />
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* ━━━ #REVIEWS (TRIPADVISOR RATING SYSTEM & PROGRESS BARS) ━━━ */}
            <section id="reviews" className="pt-6 border-t border-[#f0f0f0]">
              <ReviewSection
                place={place}
                initialReviews={reviews}
                onOpenReviewModal={handleOpenReviewModal}
              />
            </section>

            {/* ━━━ #PHOTOS (REAL TRAVELER PHOTOS - NO FAKE STOCK PHOTOS) ━━━ */}
            <section id="photos" className="space-y-4 pt-6 border-t border-[#f0f0f0]">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#000a12] tracking-tight">
                    Traveler photos
                  </h2>
                  <p className="text-xs sm:text-sm text-[#545454]">
                    Real photos shared by recent explorers &amp; visitors
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenReviewModal}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#e0e0e0] hover:border-[#000a12] hover:bg-[#f2f2f2] text-[#000a12] font-bold text-xs transition-all cursor-pointer bg-white shrink-0"
                >
                  <Camera className="w-3.5 h-3.5 text-[#00aa6c]" />
                  <span>Add a photo with review</span>
                </button>
              </div>

              {photoStripList.length > 0 ? (
                <>
                  <div className={`grid gap-2.5 ${
                    photoStripList.length === 1 ? 'grid-cols-1 sm:grid-cols-2 max-w-md' :
                    photoStripList.length === 2 ? 'grid-cols-2 max-w-lg' :
                    photoStripList.length === 3 ? 'grid-cols-2 sm:grid-cols-3' :
                    photoStripList.length === 4 ? 'grid-cols-2 sm:grid-cols-4' :
                    'grid-cols-2 sm:grid-cols-3 md:grid-cols-5'
                  }`}>
                    {photoStripList.map((img, idx) => (
                      <div
                        key={idx}
                        onClick={() => setPhotoStripIndex(idx)}
                        className="group relative aspect-square rounded-lg overflow-hidden bg-[#e8e8e8] border border-[#e0e0e0] cursor-pointer shadow-2xs"
                      >
                        <Image
                          src={img}
                          alt={`${place.name} traveler photo ${idx + 1}`}
                          fill
                          className="object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => setPhotoStripIndex(0)}
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-[#00aa6c] hover:text-[#008a58] hover:underline cursor-pointer"
                    >
                      <span>See all {travelerPhotos.length} {travelerPhotos.length === 1 ? 'photo' : 'photos'} →</span>
                    </button>
                    <span className="text-xs text-[#767676] font-medium hidden sm:inline">
                      Verified community uploads
                    </span>
                  </div>
                </>
              ) : (
                <div className="bg-[#fafafa] border border-dashed border-[#e0e0e0] rounded-2xl p-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-white border border-[#e0e0e0] flex items-center justify-center text-[#00aa6c] mx-auto shadow-xs">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-extrabold text-[#000a12]">No traveler photos yet</h3>
                    <p className="text-xs sm:text-sm text-[#545454] max-w-sm mx-auto">
                      Be the first explorer to upload your real photos of {place.name} when sharing your review!
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsReviewModalOpen(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#00aa6c] hover:bg-[#008a58] text-white font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Upload photos with your review</span>
                  </button>
                </div>
              )}
            </section>

            {/* ━━━ #QA (QUESTIONS & ANSWERS) ━━━ */}
            <section id="qa" className="space-y-4 pt-6 border-t border-[#f0f0f0]">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#000a12] tracking-tight">
                Questions &amp; answers
              </h2>
              <div className="space-y-3">
                {qaItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 sm:p-5 rounded-xl border border-[#e0e0e0] bg-white hover:border-[#cfcfcf] transition-colors space-y-2"
                  >
                    <div className="flex items-start gap-2.5 text-sm sm:text-[15px] font-bold text-[#000a12]">
                      <span className="text-[#00aa6c] font-black text-base shrink-0">Q</span>
                      <span>{item.q}</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs sm:text-sm text-[#545454] leading-relaxed pl-5">
                      <span className="text-[#000a12] font-black text-sm shrink-0">A</span>
                      <span>{item.a}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </main>

          {/* ━━━━ STICKY SIDEBAR (RIGHT COLUMN: NEVER DISAPPEARS ON SCROLL & NEVER CUT OFF) ━━━━ */}
          <aside className="sticky top-[105px] sm:top-[115px] z-20 space-y-3.5 max-h-[calc(100vh-125px)] overflow-y-auto scrollbar-none pr-0.5 pb-2">

            {/* Admission & Quick Actions Card */}
            <div className="border border-[#e0e0e0] rounded-2xl p-4 sm:p-5 bg-white space-y-3.5 shadow-xs">
              <div className="pb-3 border-b border-[#f0f0f0]">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-[#545454]">
                    Standard admission
                  </h4>
                  <div className="scale-90 origin-right">
                    <CurrencySelector scrolled={true} />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#000a12] tracking-tight">
                  {feeData.primary}
                </div>
                <div className="text-xs text-[#545454] mt-0.5 font-medium">
                  {feeData.secondary}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <a
                  href={`https://www.google.com/maps?q=${place.lat},${place.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#00aa6c] hover:bg-[#008a58] text-white font-bold py-2.5 px-4 rounded-full text-xs sm:text-sm transition-all shadow-[0_8px_20px_-8px_rgba(0,170,108,0.45)] hover:-translate-y-0.5 cursor-pointer"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Open in Google Maps</span>
                </a>

                <WishlistButton
                  placeId={place.id}
                  placeName={place.name}
                  variant="outline"
                  label="Save destination"
                />

                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 bg-white hover:bg-[#f0f0f0] border border-[#e0e0e0] hover:border-[#000a12] text-[#000a12] font-bold py-2.5 px-4 rounded-full text-xs sm:text-sm transition-all cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Write a traveler review</span>
                </button>

                <Link
                  href="/map"
                  className="w-full flex items-center justify-center gap-2 bg-white hover:bg-[#f0f0f0] border border-[#e0e0e0] hover:border-[#000a12] text-[#000a12] font-bold py-2.5 px-4 rounded-full text-xs sm:text-sm transition-all"
                >
                  <Map className="w-4 h-4 text-[#00aa6c]" />
                  <span>View on Ceylon Live Map</span>
                </Link>
              </div>
            </div>

            {/* Quick Facts Info Card */}
            <div className="border border-[#e0e0e0] rounded-2xl p-4 sm:p-5 bg-white space-y-3 shadow-xs">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#f0f0f0] text-[#000a12] flex items-center justify-center shrink-0">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#545454]">Location</div>
                    <div className="text-xs sm:text-sm font-bold text-[#000a12] leading-snug">{place.location}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#f0f0f0] text-[#000a12] flex items-center justify-center shrink-0">
                    <Tag className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#545454]">Province</div>
                    <div className="text-xs sm:text-sm font-bold text-[#000a12] leading-snug">{place.province}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#f0f0f0] text-[#000a12] flex items-center justify-center shrink-0">
                    <Navigation className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#545454] flex items-center justify-between">
                      <span suppressHydrationWarning={true}>{distanceInfo.isLive ? 'From Your Location' : 'From Colombo'}</span>
                      {distanceInfo.isLive && (
                        <span className="text-[10px] text-[#00aa6c] font-bold bg-[#e6f7f0] px-1.5 py-0.2 rounded">
                          Live GPS
                        </span>
                      )}
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-[#000a12] flex items-center justify-between gap-2 mt-0.5">
                      <span suppressHydrationWarning={true}>{distanceInfo.text}</span>
                      {!distanceInfo.isLive && (
                        <button
                          type="button"
                          onClick={() => requestLocation()}
                          disabled={locationStatus === 'requesting'}
                          className="text-[10px] font-bold text-[#00aa6c] hover:underline cursor-pointer"
                        >
                          {locationStatus === 'requesting' ? 'Detecting...' : 'Use my GPS'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#f0f0f0] text-[#000a12] flex items-center justify-center shrink-0">
                    <Ticket className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#545454]">Entry Fee</div>
                    <div className="text-xs sm:text-sm font-bold text-[#000a12] leading-snug">
                      {feeData.primary}
                      <small className="block text-[11px] text-[#545454] font-medium mt-0.5">{feeData.secondary}</small>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#f0f0f0] text-[#000a12] flex items-center justify-center shrink-0">
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#545454]">Best Season</div>
                    <div className="text-xs sm:text-sm font-bold text-[#000a12] leading-snug">
                      {place.best_time || 'Year-round'}
                      <small className="block text-[11px] text-[#545454] font-medium mt-0.5">Early morning or late afternoon</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </aside>
        </div>

        {/* ━━━ #NEARBY ATTRACTIONS (3-COLUMN TRIPADVISOR CARDS) ━━━ */}
        {nearbyAttractions.length > 0 && (
          <section id="nearby" className="pt-12 border-t border-[#f0f0f0] mt-16">
            <div className="flex items-baseline justify-between mb-6 flex-wrap gap-3">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#000a12] tracking-tight">
                Nearby attractions
              </h2>
              <Link
                href={`/?province=${encodeURIComponent(place.province)}#explore`}
                className="text-sm font-bold text-[#00aa6c] hover:underline flex items-center gap-1"
              >
                <span>Explore all in {place.province} →</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {nearbyAttractions.slice(0, 3).map((nearby) => {
                const nearbyFee = getDetailedFee(nearby.entry_fee);
                return (
                  <Link
                    key={nearby.id}
                    href={`/places/${nearby.id}`}
                    className="border border-[#e0e0e0] rounded-xl overflow-hidden bg-white hover:shadow-[0_14px_34px_rgba(0,0,0,0.1)] hover:-translate-y-1 hover:border-transparent transition-all duration-300 flex flex-col group cursor-pointer"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                      <Image
                        src={nearby.image_url}
                        alt={nearby.name}
                        fill
                        className="object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
                        unoptimized
                      />
                    </div>
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-2">
                      <div>
                        <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#545454] mb-1">
                          {nearby.category}
                        </div>
                        <h3 className="text-base font-extrabold text-[#000a12] group-hover:text-[#00aa6c] transition-colors leading-snug">
                          {nearby.name}
                        </h3>
                      </div>
                      <div className="pt-2 border-t border-[#f0f0f0] flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-[#000a12]">
                          <TripAdvisorRatingDots rating={nearby.rating} size="sm" />
                          <span>{nearby.rating.toFixed(1)}</span>
                          <span className="text-[#767676] font-normal">({nearby.review_count})</span>
                        </div>
                        <div className="font-extrabold text-[#000a12]">
                          {nearbyFee.primary}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

      </div>

      {/* ━━━ 7. TRIPADVISOR REVIEW MODAL ━━━ */}
      <TripAdvisorReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        place={place}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </div>
  );
}
