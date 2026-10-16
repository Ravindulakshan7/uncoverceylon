'use client';

import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

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

      // Locate the wishlist button in the navbar
      const targetBtn =
        document.getElementById('navbar-wishlist-btn') ||
        document.getElementById('navbar-wishlist-heart');

      const targetRect = targetBtn
        ? targetBtn.getBoundingClientRect()
        : { left: window.innerWidth - 65, top: 22, width: 32, height: 32 };

      const targetX = targetRect.left + (targetRect.width || 32) / 2;
      const targetY = targetRect.top + (targetRect.height || 32) / 2;

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

      // When heart arrives at navbar (~600ms), pop the navbar heart button
      setTimeout(() => {
        if (targetBtn) {
          targetBtn.classList.remove('nav-heart-pop');
          void targetBtn.offsetWidth; // force DOM reflow
          targetBtn.classList.add('nav-heart-pop');
        }
      }, 580);

      // Remove after animation finishes
      setTimeout(() => {
        setHearts((prev) => prev.filter((h) => h.id !== heartId));
      }, 850);
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
      {hearts.map((h) => (
        <div
          key={h.id}
          className="flying-heart-particle"
          style={{
            '--sx': `${h.startX}px`,
            '--sy': `${h.startY}px`,
            '--tx': `${h.targetX}px`,
            '--ty': `${h.targetY}px`,
          } as React.CSSProperties}
        >
          <div className="relative -translate-x-1/2 -translate-y-1/2">
            <Heart className="w-6 h-6 sm:w-7 sm:h-7 fill-[#ff3347] text-[#ff3347] drop-shadow-[0_4px_14px_rgba(255,51,71,0.7)]" />
            <span className="absolute inset-0 rounded-full bg-rose-400/50 animate-ping" />
          </div>
        </div>
      ))}
    </div>
  );
}
