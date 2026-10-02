'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Mountain, Palmtree, Waves } from 'lucide-react';
import { Place } from '@/types';

interface JourneyCategoriesSectionProps {
  places: Place[];
}

const categories = [
  {
    name: 'Coast & Beaches',
    query: 'Beaches',
    image: '/images/journey/coast-beaches.jpg',
    icon: Waves,
  },
  {
    name: 'Highlands',
    query: 'Mountains',
    image: '/images/journey/highlands.jpg',
    icon: Mountain,
  },
  {
    name: 'Wild Sri Lanka',
    query: 'Wildlife',
    image: '/images/journey/wild-sri-lanka.jpg',
    icon: Palmtree,
  },
];

export default function JourneyCategoriesSection({ places }: JourneyCategoriesSectionProps) {
  const handleCategoryClick = (e: React.MouseEvent, categoryQuery: string) => {
    if (typeof window !== 'undefined' && window.location.pathname === '/') {
      e.preventDefault();
      window.history.pushState(null, '', `/?category=${encodeURIComponent(categoryQuery)}#explore`);
      window.dispatchEvent(
        new CustomEvent('uc:filter-category', {
          detail: { category: categoryQuery },
        })
      );
      const exploreEl = document.getElementById('explore');
      if (exploreEl) {
        exploreEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleBrowseAllClick = (e: React.MouseEvent) => {
    if (typeof window !== 'undefined' && window.location.pathname === '/') {
      e.preventDefault();
      window.history.pushState(null, '', '/#explore');
      window.dispatchEvent(
        new CustomEvent('uc:filter-category', {
          detail: { category: 'All' },
        })
      );
      const exploreEl = document.getElementById('explore');
      if (exploreEl) {
        exploreEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="py-12 sm:py-20 lg:py-24 overflow-hidden">
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8">
        
        {/* Section Header with smooth drop-down animation */}
        <div className="mb-8 sm:mb-14 text-center">
          <motion.p
            initial={{ opacity: 0, y: -16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-2 sm:mb-3 text-[11px] sm:text-xs font-bold uppercase tracking-[0.18em] text-sky-700"
          >
            Start your journey
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: -24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-2xl text-2xl sm:text-3xl lg:text-4xl font-semibold leading-tight text-slate-900 tracking-tight"
          >
            Find the Sri Lanka that stays with you.
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: -14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href="/#explore"
              onClick={handleBrowseAllClick}
              className="mt-3 sm:mt-4 inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-sky-600 hover:text-sky-700 transition-colors group cursor-pointer"
            >
              <span>Browse every place</span>
              <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </motion.div>
        </div>

        {/* 3 Categories Cards with staggered drop-down entrance */}
        <div className="grid w-full grid-cols-3 gap-2.5 sm:gap-6">
          {categories.map((category, idx) => {
            const Icon = category.icon;
            const count = places.filter((place) => place.category === category.query).length;

            return (
              <motion.div
                key={category.query}
                initial={{ opacity: 0, y: -36, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  duration: 0.75,
                  delay: 0.12 * (idx + 1),
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="w-full"
              >
                <Link
                  href={`/?category=${encodeURIComponent(category.query)}#explore`}
                  onClick={(e) => handleCategoryClick(e, category.query)}
                  className="group relative block aspect-[4/5] sm:aspect-[4/3] w-full overflow-hidden rounded-xl sm:rounded-2xl bg-slate-950 shadow-sm hover:shadow-xl hover:shadow-sky-950/20 border border-slate-200/50 transition-all duration-300 cursor-pointer"
                >
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 768px) 33vw, 33vw"
                    className="object-cover transition duration-700 ease-out group-hover:scale-108"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent transition-opacity group-hover:opacity-90" />
                  
                  <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end p-2.5 sm:p-6 text-white">
                    <Icon className="mb-1 sm:mb-4 h-3.5 w-3.5 sm:h-5 sm:w-5 text-amber-400 transition-transform duration-300 group-hover:scale-110" />
                    <h3 className="text-xs sm:text-xl font-semibold leading-tight truncate">
                      {category.name}
                    </h3>
                    <p className="mt-0.5 text-[10px] sm:text-sm text-white/75 font-medium">
                      {count} places
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
