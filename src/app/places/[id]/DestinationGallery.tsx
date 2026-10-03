'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Maximize2, X, ImageOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DestinationGalleryProps {
  images: string[];
  title: string;
  category: string;
  location: string;
}

export default function DestinationGallery({
  images,
  title,
  category,
  location,
}: DestinationGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [failedIndices, setFailedIndices] = useState<Set<number>>(new Set());

  const handleImageError = (index: number) => {
    setFailedIndices((prev) => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  };

  // Ensure we have at least 1 image
  const displayImages = images.length > 0
    ? images
    : ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1600&q=85'];

  const nextImage = () => {
    setActiveIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = () => {
    setActiveIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  return (
    <div className="space-y-3">
      {/* ━━━ MAIN FEATURED IMAGE SLIDER ━━━ */}
      <div className="relative h-[48vh] sm:h-[60vh] lg:h-[68vh] w-full rounded-3xl overflow-hidden bg-slate-900 shadow-2xl group">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="absolute inset-0 cursor-pointer"
            onClick={() => setIsLightboxOpen(true)}
          >
            {failedIndices.has(activeIndex) ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-400 p-6 text-center">
                <ImageOff className="w-12 h-12 text-slate-600 mb-2" />
                <p className="text-sm font-bold text-slate-300">Photo Unavailable</p>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  This image could not be loaded. If this is a share or webpage link, please upload the image file directly from your device in Admin.
                </p>
              </div>
            ) : (
              <Image
                src={displayImages[activeIndex]}
                alt={`${title} - Photo ${activeIndex + 1}`}
                fill
                className="object-cover"
                priority
                quality={90}
                unoptimized={true}
                onError={() => handleImageError(activeIndex)}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Ambient gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30 pointer-events-none" />

        {/* Floating Info Overlay on Top of Hero */}
        <div className="absolute top-5 left-5 right-5 flex items-center justify-between pointer-events-none z-10">
          <span className="bg-white/90 text-slate-900 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold shadow-md pointer-events-auto">
            {category}
          </span>

          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={() => setIsLightboxOpen(true)}
              className="inline-flex items-center gap-1.5 bg-black/50 hover:bg-black/70 text-white backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold border border-white/20 transition-all shadow-md active:scale-95"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Full View</span>
            </button>
            <span className="bg-black/50 text-white backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold border border-white/20">
              {activeIndex + 1} / {displayImages.length}
            </span>
          </div>
        </div>

        {/* Left & Right Arrow Navigation (Visible on hover or mobile) */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/80 hover:bg-white text-slate-800 backdrop-blur-md flex items-center justify-center transition-all shadow-lg active:scale-90 opacity-90 sm:opacity-0 group-hover:opacity-100 z-10"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              aria-label="Next image"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/80 hover:bg-white text-slate-800 backdrop-blur-md flex items-center justify-center transition-all shadow-lg active:scale-90 opacity-90 sm:opacity-0 group-hover:opacity-100 z-10"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* ━━━ THUMBNAIL PREVIEW STRIP (Airbnb style) ━━━ */}
      {displayImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative w-24 sm:w-32 h-16 sm:h-20 rounded-2xl overflow-hidden flex-shrink-0 transition-all duration-200 border-2 ${
                activeIndex === idx
                  ? 'border-sky-500 scale-102 shadow-md ring-2 ring-sky-300'
                  : 'border-transparent opacity-70 hover:opacity-100'
              } ${failedIndices.has(idx) ? 'bg-slate-800' : ''}`}
            >
              {failedIndices.has(idx) ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-slate-400 p-1 text-center">
                  <ImageOff className="w-4 h-4 text-slate-500 mb-0.5" />
                  <span className="text-[9px] text-slate-400 font-medium">Broken Link</span>
                </div>
              ) : (
                <Image
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                  unoptimized={true}
                  onError={() => handleImageError(idx)}
                />
              )}
            </button>
          ))}
        </div>
      )}

      {/* ━━━ FULLSCREEN LIGHTBOX MODAL ━━━ */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-8"
          >
            {/* Header bar */}
            <div className="flex items-center justify-between text-white z-10">
              <div>
                <h3 className="font-extrabold text-lg sm:text-xl">{title}</h3>
                <p className="text-white/60 text-xs sm:text-sm">{location}</p>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-white/70 text-sm font-semibold">
                  {activeIndex + 1} of {displayImages.length}
                </span>
                <button
                  onClick={() => setIsLightboxOpen(false)}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Central Lightbox Image */}
            <div className="relative flex-1 my-4 flex items-center justify-center">
              <div className="relative w-full h-full max-h-[82vh]">
                {failedIndices.has(activeIndex) ? (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                    <ImageOff className="w-16 h-16 text-slate-600 mb-3" />
                    <p className="text-base font-bold text-slate-300">Photo Unavailable</p>
                    <p className="text-xs text-slate-500 max-w-sm mt-1">This photo link could not be loaded.</p>
                  </div>
                ) : (
                  <Image
                    src={displayImages[activeIndex]}
                    alt={`${title} Fullscreen`}
                    fill
                    className="object-contain"
                    quality={95}
                    unoptimized={true}
                    onError={() => handleImageError(activeIndex)}
                  />
                )}
              </div>

              {displayImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 sm:left-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-md transition-all active:scale-95"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 sm:right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-md transition-all active:scale-95"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Bottom thumbnail selector in lightbox */}
            <div className="flex justify-center gap-2 overflow-x-auto py-2">
              {displayImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                    activeIndex === idx
                      ? 'border-sky-400 ring-2 ring-sky-400/50 scale-105'
                      : 'border-white/20 opacity-50 hover:opacity-100'
                  }`}
                >
                  {failedIndices.has(idx) ? (
                    <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-500">
                      <ImageOff className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <Image
                      src={img}
                      alt={`Preview ${idx + 1}`}
                      fill
                      className="object-cover"
                      unoptimized={true}
                      onError={() => handleImageError(idx)}
                    />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
