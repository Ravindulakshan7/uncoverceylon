'use client';

import Link from 'next/link';
import { WifiOff, RotateCcw, Home, Bookmark, MapPin } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';

export default function OfflinePage() {
  const { savedIds, setIsDrawerOpen } = useWishlist();

  const handleRetry = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center space-y-6">
        
        {/* Offline Icon Container */}
        <div className="w-20 h-20 rounded-3xl bg-sky-950/80 border border-sky-500/30 text-sky-400 mx-auto flex items-center justify-center shadow-xl shadow-sky-900/20">
          <WifiOff className="w-10 h-10 animate-pulse text-sky-400" />
        </div>

        {/* Heading & Context */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full">
            100% Offline Mode Active
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            No Internet Connection
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
            You may be exploring deep in the Knuckles Range, Ella mist forests, or Yala wild tracks with no cellular signal.
            Your cached destinations and saved places remain available!
          </p>
        </div>

        {/* Saved Count Prompt */}
        {savedIds.length > 0 && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center flex-shrink-0">
                <Bookmark className="w-5 h-5 fill-rose-500 text-rose-500" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Your Saved Wishlist</div>
                <div className="text-xs text-slate-400">
                  {savedIds.length} place{savedIds.length > 1 ? 's' : ''} stored locally on this device
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsDrawerOpen(true)}
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3.5 py-2 rounded-xl border border-white/15 transition-all cursor-pointer"
            >
              Open
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={handleRetry}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-500 text-white font-bold px-6 py-3.5 rounded-2xl text-sm shadow-lg shadow-sky-600/30 active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Check Connection</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold px-6 py-3.5 rounded-2xl text-sm transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Go to Cached Home</span>
          </Link>
        </div>

        {/* Serandib Co footer tag */}
        <div className="pt-6 border-t border-slate-900 text-xs text-slate-500 flex items-center justify-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-sky-500" />
          <span>UncoverCeylon Offline Companion by Serandib Co.</span>
        </div>
      </div>
    </div>
  );
}
