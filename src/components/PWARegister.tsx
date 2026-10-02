'use client';

import { useEffect, useState } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PWARegister() {
  const [isOffline, setIsOffline] = useState(false);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('[PWA] Service Worker registered successfully:', reg.scope);
        })
        .catch((err) => {
          console.warn('[PWA] Service Worker registration failed:', err);
        });
    }

    // 2. Track Online / Offline connectivity status
    if (typeof window !== 'undefined') {
      setIsOffline(!navigator.onLine);

      const handleOnline = () => {
        setIsOffline(false);
        setShowReconnected(true);
        setTimeout(() => setShowReconnected(false), 4000);
      };

      const handleOffline = () => {
        setIsOffline(true);
        setShowReconnected(false);
      };

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  return (
    <div className="fixed bottom-5 left-5 z-[9999] pointer-events-none">
      <AnimatePresence>
        {isOffline && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.9 }}
            className="pointer-events-auto flex items-center gap-2.5 bg-slate-900/95 backdrop-blur-md text-amber-300 border border-amber-500/40 px-3.5 py-2 rounded-2xl shadow-2xl text-xs font-bold"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Offline Mode Active &bull; Serving Cached Guide</span>
          </motion.div>
        )}

        {showReconnected && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.9 }}
            className="pointer-events-auto flex items-center gap-2 bg-emerald-950/90 backdrop-blur-md text-emerald-300 border border-emerald-500/40 px-3.5 py-2 rounded-2xl shadow-2xl text-xs font-bold"
          >
            <Wifi className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Connection Restored &bull; Live Updates Active</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
