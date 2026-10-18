'use client';

import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FlyingHeartItem {
  id: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
}

export default function FlyingHeartOverlay() {
  const [hearts, setHearts] = useState<FlyingHeartItem[]>([]);

  useEffect(() => {
    const handleFly = (e: CustomEvent<{ x: number; y: number }>) => {
      const { x, y } = e.detail;

      // Locate the wishlist heart icon in the navbar
      const targetBtn =
        document.getElementById('navbar-wishlist-heart') ||
        document.getElementById('navbar-wishlist-btn');

      const targetRect = targetBtn
        ? targetBtn.getBoundingClientRect()
        : { left: window.innerWidth - 65, top: 22, width: 28, height: 28 };

      const targetX = targetRect.left + (targetRect.width || 28) / 2;
      const targetY = targetRect.top + (targetRect.height || 28) / 2;

      const heartId = Date.now() + Math.random();

      setHearts((prev) => [
        ...prev,
        {
          id: heartId,
          startX: x,
          startY: y,
          targetX,
          targetY,
        },
      ]);

      // Pop the navbar button when heart lands smoothly
      setTimeout(() => {
        const navEl =
          document.getElementById('navbar-wishlist-heart') ||
          document.getElementById('navbar-wishlist-btn');
        if (navEl) {
          navEl.classList.remove('nav-heart-pop');
          void navEl.offsetWidth; // force DOM reflow
          navEl.classList.add('nav-heart-pop');
        }
      }, 760);

      // Clean up heart after flight completes
      setTimeout(() => {
        setHearts((prev) => prev.filter((h) => h.id !== heartId));
      }, 950);
    };

    window.addEventListener('fly-heart-to-nav' as any, handleFly as any);
    return () => window.removeEventListener('fly-heart-to-nav' as any, handleFly as any);
  }, []);

  if (hearts.length === 0) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[999999] overflow-hidden"
      aria-hidden="true"
    >
      <AnimatePresence>
        {hearts.map((h) => {
          // Natural curved flight trajectory:
          // Smooth arch upward and accelerate into the navbar heart
          const midX = (h.startX + h.targetX) / 2 - 25;
          const midY = Math.min(h.startY, h.targetY) - 50;

          return (
            <motion.div
              key={h.id}
              initial={{
                x: h.startX - 16,
                y: h.startY - 16,
                scale: 0.45,
                opacity: 0.85,
              }}
              animate={{
                x: [h.startX - 16, midX, h.targetX - 16],
                y: [h.startY - 16, midY, h.targetY - 16],
                scale: [0.45, 1.35, 0.4],
                opacity: [0.85, 1, 0],
              }}
              transition={{
                duration: 0.78,
                ease: [0.16, 1, 0.3, 1], // Ultra-smooth cubic bezier easeOutExpo
                times: [0, 0.38, 1],
              }}
              className="fixed top-0 left-0 will-change-transform pointer-events-none"
            >
              <div className="relative flex items-center justify-center">
                <Heart className="w-8 h-8 fill-[#ff3347] text-[#ff3347] drop-shadow-[0_4px_16px_rgba(255,51,71,0.85)]" />
                <div className="absolute inset-0 rounded-full bg-rose-400/40 blur-xs scale-125" />
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
