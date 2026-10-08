'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const INTERESTS = [
  {
    id: 'destinations',
    title: 'Destinations',
    sub: 'Trails, tea hills & wild escapes',
    count: '60+ places',
    image: 'https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?auto=format&fit=crop&w=900&q=80',
    href: '/destinations',
  },
  {
    id: 'food',
    title: 'Food',
    sub: 'Rice & curry, hoppers, street eats',
    count: '98 places',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=900&q=80',
    href: '/food',
  },
  {
    id: 'culture',
    title: 'Culture',
    sub: 'Temples, citadels & ancient legends',
    count: '76 places',
    image: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=900&q=80',
    href: '/culture',
  },
  {
    id: 'experiences',
    title: 'Experiences',
    sub: 'Surf breaks, lagoons & quiet bays',
    count: '124 places',
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=900&q=80',
    href: '/experiences',
  },
];

export default function InterestsSection() {
  const [isAutoHidden, setIsAutoHidden] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          timer = setTimeout(() => {
            setIsAutoHidden(true);
          }, 2200);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    const fallback = setTimeout(() => {
      setIsAutoHidden(true);
    }, 4500);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
      clearTimeout(fallback);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="interests"
      className="w-full max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 scroll-mt-20"
    >
      
      {/* ━━━ Centered Section Header with Larger Font & Elegant Subtitle ━━━ */}
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
        <h2 className="text-3xl sm:text-5xl lg:text-[48px] font-black text-[#0f1b2d] tracking-[-0.03em] leading-tight">
          Uncover Ceylon by Interest
        </h2>
        <p className="text-slate-500 text-xs sm:text-sm font-medium mt-2.5 sm:mt-3 leading-relaxed max-w-lg mx-auto">
          Whatever you&apos;re into — misty trails, spicy curries, ancient citadels or turquoise waves — we&apos;ve got it all.
        </p>
      </div>

      {/* ━━━ 4 Portrait Cards Grid (Aspect 4/5) ━━━ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {INTERESTS.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="group relative aspect-[5/4] sm:aspect-[4/5] w-full rounded-[24px] overflow-hidden isolate shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-[#0f1b2d] cursor-pointer"
          >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                unoptimized
              />
            </div>

            {/* Rich Multi-Stop Dark Gradient */}
            <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#0f1b2d]/15 via-[#0f1b2d]/10 via-50% to-[#0f1b2d]/90 group-hover:to-[#0f1b2d]/95 transition-colors pointer-events-none" />

            {/* Top Right Frosted Count Badge */}
            <div className="absolute top-4 right-4 z-10">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/25 text-white text-[11px] font-bold shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3ddc9a] shadow-[0_0_0_2px_rgba(61,220,154,0.3)]" />
                <span>{item.count}</span>
              </span>
            </div>

            {/* Bottom Content Area with Smooth Collapse & Settle Animation */}
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 z-10 flex flex-col justify-end text-white">
              
              {/* Title & Animated Underline */}
              <div
                className={`transition-all duration-700 ease-in-out ${
                  isAutoHidden ? 'translate-y-3.5 group-hover:translate-y-0' : 'translate-y-0'
                }`}
              >
                <div className="relative inline-block w-fit">
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
                    {item.title}
                  </h3>
                  {/* Animated Green Underline on Hover */}
                  <div className="h-[2.5px] w-0 group-hover:w-full bg-gradient-to-r from-[#0aa06e] to-[#3ddc9a] rounded-full transition-all duration-300 mt-1" />
                </div>
              </div>

              {/* Subtitle Sentence: Initially visible, smoothly collapses and fades after delay, re-expands on hover */}
              <div
                className={`overflow-hidden transition-all duration-700 ease-in-out ${
                  isAutoHidden
                    ? 'max-h-0 opacity-0 translate-y-2 group-hover:max-h-16 group-hover:opacity-100 group-hover:translate-y-0 group-hover:mt-1.5'
                    : 'max-h-16 opacity-100 translate-y-0 mt-1.5'
                }`}
              >
                <p className="text-white/80 text-xs sm:text-[13px] font-medium leading-snug">
                  {item.sub}
                </p>
              </div>

            </div>

          </Link>
        ))}
      </div>

    </section>
  );
}
