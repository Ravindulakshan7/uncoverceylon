'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, ImageOff, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DestinationGalleryProps {
  images: string[];
  title: string;
  category: string;
  location: string;
  externalLightboxIndex?: number | null;
  onCloseExternalLightbox?: () => void;
}

export default function DestinationGallery({
  images,
  title,
  category,
  location,
  externalLightboxIndex,
  onCloseExternalLightbox,
}: DestinationGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [failedIndices, setFailedIndices] = useState<Set<number>>(new Set());

  React.useEffect(() => {
    if (externalLightboxIndex !== undefined && externalLightboxIndex !== null) {
      setActiveIndex(externalLightboxIndex);
      setIsLightboxOpen(true);
    }
  }, [externalLightboxIndex]);

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    onCloseExternalLightbox?.();
  };

  const handleImageError = (index: number) => {
    setFailedIndices((prev) => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  };

  // Extract clean unique real photos
  const rawUnique = Array.from(new Set((images || []).filter((img) => typeof img === 'string' && img.trim().length > 0)));
  const displayImages = rawUnique.length > 0 ? rawUnique : ['/hero-bg.jpg'];
  const photoCount = rawUnique.length > 0 ? rawUnique.length : 1;

  const openLightbox = (index: number) => {
    setActiveIndex(index);
    setIsLightboxOpen(true);
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  const renderPhotoBadge = () => (
    <button
      type="button"
      onClick={() => openLightbox(0)}
      className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-10 inline-flex items-center gap-1.5 sm:gap-2 bg-white/95 hover:bg-slate-900 hover:text-white text-slate-900 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-extrabold shadow-lg transition-all active:scale-95 cursor-pointer backdrop-blur-md"
    >
      <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00aa6c]" />
      <span>{photoCount} {photoCount === 1 ? 'Photo' : 'Photos'}</span>
    </button>
  );

  const renderCategoryBadge = () => (
    <span className="absolute top-3 left-3 bg-white/95 text-slate-900 text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md z-10">
      {category}
    </span>
  );

  return (
    <div className="relative">
      {/* ━━━ DYNAMIC TRIPADVISOR PHOTO GRID BASED ON REAL PHOTO COUNT ━━━ */}
      {displayImages.length === 1 ? (
        // 1 PHOTO: Full Hero Banner
        <div
          onClick={() => openLightbox(0)}
          className="relative h-[340px] sm:h-[420px] lg:h-[460px] rounded-xl sm:rounded-2xl overflow-hidden bg-slate-100 border border-[#e0e0e0] shadow-xs cursor-pointer group"
        >
          {failedIndices.has(0) ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-4 text-center">
              <ImageOff className="w-10 h-10 text-slate-400 mb-1" />
              <p className="text-xs font-bold">Photo Unavailable</p>
            </div>
          ) : (
            <Image
              src={displayImages[0]}
              alt={`${title} - Main photo`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              priority
              quality={90}
              unoptimized
              onError={() => handleImageError(0)}
            />
          )}
          {renderCategoryBadge()}
          <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors pointer-events-none" />
          {renderPhotoBadge()}
        </div>
      ) : displayImages.length === 2 ? (
        // 2 PHOTOS: Split 50 / 50 Side by Side
        <div className="grid grid-cols-2 gap-1 sm:gap-1.5 h-[340px] sm:h-[420px] lg:h-[460px] rounded-xl sm:rounded-2xl overflow-hidden bg-white border border-[#e0e0e0] shadow-xs relative">
          {displayImages.slice(0, 2).map((img, idx) => (
            <div
              key={idx}
              onClick={() => openLightbox(idx)}
              className="relative h-full w-full overflow-hidden bg-slate-100 cursor-pointer group"
            >
              {failedIndices.has(idx) ? (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <ImageOff className="w-8 h-8" />
                </div>
              ) : (
                <Image
                  src={img}
                  alt={`${title} - Photo ${idx + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  priority={idx === 0}
                  quality={90}
                  unoptimized
                  onError={() => handleImageError(idx)}
                />
              )}
              {idx === 0 && renderCategoryBadge()}
              <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors pointer-events-none" />
            </div>
          ))}
          {renderPhotoBadge()}
        </div>
      ) : displayImages.length === 3 ? (
        // 3 PHOTOS: 1 Main (Left) + 2 Stacked (Right)
        <div className="grid grid-cols-1 sm:grid-cols-3 sm:grid-rows-2 gap-1 sm:gap-1.5 h-[340px] sm:h-[420px] lg:h-[460px] rounded-xl sm:rounded-2xl overflow-hidden bg-white border border-[#e0e0e0] shadow-xs relative">
          <div
            onClick={() => openLightbox(0)}
            className="sm:col-span-2 sm:row-span-2 relative h-full w-full overflow-hidden bg-slate-100 cursor-pointer group"
          >
            {failedIndices.has(0) ? (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <ImageOff className="w-10 h-10" />
              </div>
            ) : (
              <Image
                src={displayImages[0]}
                alt={`${title} - Main photo`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                priority
                quality={90}
                unoptimized
                onError={() => handleImageError(0)}
              />
            )}
            {renderCategoryBadge()}
            <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors pointer-events-none" />
          </div>

          {[1, 2].map((idx) => (
            <div
              key={idx}
              onClick={() => openLightbox(idx)}
              className="hidden sm:block relative h-full w-full overflow-hidden bg-slate-100 cursor-pointer group"
            >
              {failedIndices.has(idx) ? (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <ImageOff className="w-6 h-6" />
                </div>
              ) : (
                <Image
                  src={displayImages[idx]}
                  alt={`${title} - Photo ${idx + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  quality={85}
                  unoptimized
                  onError={() => handleImageError(idx)}
                />
              )}
              <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors pointer-events-none" />
            </div>
          ))}
          {renderPhotoBadge()}
        </div>
      ) : displayImages.length === 4 ? (
        // 4 PHOTOS: 1 Main (Left) + 3 Supporting (Right)
        <div className="grid grid-cols-2 sm:grid-cols-4 sm:grid-rows-2 gap-1 sm:gap-1.5 h-[340px] sm:h-[420px] lg:h-[460px] rounded-xl sm:rounded-2xl overflow-hidden bg-white border border-[#e0e0e0] shadow-xs relative">
          <div
            onClick={() => openLightbox(0)}
            className="col-span-2 row-span-2 relative h-full w-full overflow-hidden bg-slate-100 cursor-pointer group"
          >
            {failedIndices.has(0) ? (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <ImageOff className="w-10 h-10" />
              </div>
            ) : (
              <Image
                src={displayImages[0]}
                alt={`${title} - Main photo`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                priority
                quality={90}
                unoptimized
                onError={() => handleImageError(0)}
              />
            )}
            {renderCategoryBadge()}
            <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors pointer-events-none" />
          </div>

          <div
            onClick={() => openLightbox(1)}
            className="hidden sm:block relative h-full w-full overflow-hidden bg-slate-100 cursor-pointer group"
          >
            <Image
              src={displayImages[1]}
              alt={`${title} - Photo 2`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              quality={85}
              unoptimized
              onError={() => handleImageError(1)}
            />
            <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors pointer-events-none" />
          </div>

          <div
            onClick={() => openLightbox(2)}
            className="hidden sm:block relative h-full w-full overflow-hidden bg-slate-100 cursor-pointer group"
          >
            <Image
              src={displayImages[2]}
              alt={`${title} - Photo 3`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              quality={85}
              unoptimized
              onError={() => handleImageError(2)}
            />
            <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors pointer-events-none" />
          </div>

          <div
            onClick={() => openLightbox(3)}
            className="hidden sm:block sm:col-span-2 relative h-full w-full overflow-hidden bg-slate-100 cursor-pointer group"
          >
            <Image
              src={displayImages[3]}
              alt={`${title} - Photo 4`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              quality={85}
              unoptimized
              onError={() => handleImageError(3)}
            />
            <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors pointer-events-none" />
          </div>
          {renderPhotoBadge()}
        </div>
      ) : (
        // 5+ PHOTOS: Full Signature Collage (1 Hero Left, 4 Grid Right)
        <div className="grid grid-cols-2 md:grid-cols-4 md:grid-rows-2 gap-1 sm:gap-1.5 h-[340px] sm:h-[420px] lg:h-[460px] rounded-xl sm:rounded-2xl overflow-hidden bg-white border border-[#e0e0e0] shadow-xs relative">
          <div
            onClick={() => openLightbox(0)}
            className="col-span-2 row-span-2 relative h-full w-full overflow-hidden bg-slate-100 cursor-pointer group"
          >
            {failedIndices.has(0) ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-4 text-center">
                <ImageOff className="w-10 h-10 text-slate-400 mb-1" />
                <p className="text-xs font-bold">Photo Unavailable</p>
              </div>
            ) : (
              <Image
                src={displayImages[0]}
                alt={`${title} - Main photo`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                priority
                quality={90}
                unoptimized
                onError={() => handleImageError(0)}
              />
            )}
            {renderCategoryBadge()}
            <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors pointer-events-none" />
          </div>

          {[1, 2, 3, 4].map((idx) => (
            <div
              key={idx}
              onClick={() => openLightbox(idx)}
              className="hidden sm:block relative h-full w-full overflow-hidden bg-slate-100 cursor-pointer group"
            >
              {failedIndices.has(idx) ? (
                <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                  <ImageOff className="w-6 h-6" />
                </div>
              ) : (
                <Image
                  src={displayImages[idx]}
                  alt={`${title} - View ${idx + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  quality={85}
                  unoptimized
                  onError={() => handleImageError(idx)}
                />
              )}
              <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors pointer-events-none" />
            </div>
          ))}
          {renderPhotoBadge()}
        </div>
      )}

      {/* ━━━ FULLSCREEN LIGHTBOX MODAL ━━━ */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6"
            onClick={closeLightbox}
          >
            {/* Header bar */}
            <div
              className="flex items-center justify-between text-white z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <h3 className="font-extrabold text-base sm:text-lg">{title}</h3>
                <p className="text-white/60 text-xs sm:text-sm">{location}</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs sm:text-sm font-bold text-white/80 bg-white/10 px-3 py-1 rounded-full">
                  {activeIndex + 1} / {displayImages.length}
                </span>
                <button
                  onClick={closeLightbox}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Central Large Photo */}
            <div
              className="relative flex-1 w-full max-w-5xl mx-auto my-3 flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full max-h-[70vh]">
                <Image
                  src={displayImages[activeIndex]}
                  alt={`${title} - Photo ${activeIndex + 1}`}
                  fill
                  className="object-contain"
                  quality={95}
                  unoptimized
                />
              </div>

              {/* Prev / Next buttons */}
              {displayImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    aria-label="Previous"
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    aria-label="Next"
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Navigation Strip */}
            {displayImages.length > 1 && (
              <div
                className="flex gap-2 justify-center overflow-x-auto py-1 scrollbar-none z-10"
                onClick={(e) => e.stopPropagation()}
              >
                {displayImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`relative w-16 sm:w-20 h-12 sm:h-14 rounded-xl overflow-hidden shrink-0 transition-all border-2 cursor-pointer ${
                      activeIndex === idx
                        ? 'border-[#00aa6c] scale-105 ring-2 ring-emerald-300'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
