'use client';

import { useWishlist } from '@/context/WishlistContext';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';

interface WishlistButtonProps {
  placeId: number;
  placeName: string;
  variant?: 'pill' | 'icon' | 'outline';
  className?: string;
  label?: string;
}

export default function WishlistButton({
  placeId,
  placeName,
  variant = 'pill',
  className = '',
  label,
}: WishlistButtonProps) {
  const { isSaved, toggleWishlist } = useWishlist();
  const saved = isSaved(placeId);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const willSave = !saved;
    toggleWishlist(placeId, placeName);
    if (willSave && typeof window !== 'undefined') {
      const rect = e.currentTarget.getBoundingClientRect();
      window.dispatchEvent(
        new CustomEvent('fly-heart-to-nav', {
          detail: {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
          },
        })
      );
    }
  };

  if (variant === 'icon') {
    return (
      <motion.button
        type="button"
        whileTap={{ scale: 0.85 }}
        whileHover={{ scale: 1.1 }}
        onClick={handleClick}
        aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
        className={`p-2 rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer shadow-sm ${
          saved
            ? 'bg-rose-500 text-white shadow-rose-500/30'
            : 'bg-black/40 hover:bg-black/60 text-white/90 border border-white/20'
        } ${className}`}
      >
        <Heart className={`w-4 h-4 ${saved ? 'fill-white text-white' : 'text-white'}`} />
      </motion.button>
    );
  }

  if (variant === 'outline') {
    return (
      <motion.button
        type="button"
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full border text-xs sm:text-sm font-bold transition-all cursor-pointer ${
          saved
            ? 'border-rose-400 bg-rose-50 text-rose-600 shadow-2xs'
            : 'border-slate-300 hover:border-slate-900 text-slate-800 bg-white hover:bg-slate-50 shadow-2xs'
        } ${className}`}
      >
        <Heart className={`w-4 h-4 ${saved ? 'fill-rose-500 text-rose-500' : 'text-slate-800'}`} />
        <span>{saved ? 'Saved' : (label || 'Save')}</span>
      </motion.button>
    );
  }

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer border ${
        saved
          ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100'
          : 'bg-white border-slate-200 text-slate-800 hover:border-[#00aa6c] hover:text-[#00aa6c]'
      } ${className}`}
    >
      <Heart className={`w-4 h-4 transition-transform ${saved ? 'fill-rose-500 text-rose-500 scale-110' : ''}`} />
      <span>{saved ? 'Saved to Wishlist' : (label || 'Save Destination')}</span>
    </motion.button>
  );
}
