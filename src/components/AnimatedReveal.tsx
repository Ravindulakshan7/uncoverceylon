'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface AnimatedDropProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  distance?: number;
}

// Gentle drop-down animation from above (y: -distance -> y: 0)
export function AnimatedDrop({
  children,
  delay = 0,
  duration = 0.7,
  className = '',
  distance = 24,
}: AnimatedDropProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Smooth glide-up animation (y: distance -> y: 0)
export function AnimatedFadeUp({
  children,
  delay = 0,
  duration = 0.7,
  className = '',
  distance = 24,
}: AnimatedDropProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Staggered card animation with subtle drop-in & scale
export function AnimatedCard({
  children,
  index = 0,
  className = '',
}: {
  children: ReactNode;
  index?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.65,
        delay: Math.min(index * 0.12, 0.6),
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
