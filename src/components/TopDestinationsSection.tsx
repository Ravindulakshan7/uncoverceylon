'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

export interface TopDestination {
  id: number | string;
  name: string;
  tagline: string;
  rating: number;
  reviews: string;
  location: string;
  entry_fee?: string;
  image: string;
}

interface TopDestinationsSectionProps {
  destinations?: TopDestination[];
}

const DEFAULT_DESTINATIONS: TopDestination[] = [
  {
    id: 1,
    name: 'Sigiriya Rock Fortress',
    tagline: 'Ancient Citadel',
    rating: 4.9,
    reviews: '2.4k',
    location: 'Central Province, Matale',
    image: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 2,
    name: 'Nine Arch Bridge',
    tagline: 'Scenic Railway',
    rating: 4.8,
    reviews: '1.9k',
    location: 'Uva Province, Ella',
    image: 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 3,
    name: 'Coconut Tree Hill',
    tagline: 'Beach Paradise',
    rating: 4.9,
    reviews: '2.1k',
    location: 'Southern Province, Mirissa',
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 4,
    name: 'Galle Dutch Fort',
    tagline: 'Heritage City',
    rating: 4.7,
    reviews: '1.6k',
    location: 'Southern Coast, Galle',
    image: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 5,
    name: 'Misty Tea Hills',
    tagline: 'Highland Getaway',
    rating: 4.8,
    reviews: '1.3k',
    location: 'Central Province, Nuwara Eliya',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 6,
    name: 'Yala Safari Reserve',
    tagline: 'Wild Leopard Haven',
    rating: 4.9,
    reviews: '1.7k',
    location: 'Southern & Uva Provinces',
    image: 'https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 7,
    name: 'Arugam Bay Surf Point',
    tagline: 'Surf & Chill',
    rating: 4.9,
    reviews: '1.5k',
    location: 'Eastern Province, Pottuvil',
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 8,
    name: 'Pidurangala Rock',
    tagline: 'Sunrise Vista',
    rating: 4.8,
    reviews: '1.2k',
    location: 'Central Province, Sigiriya',
    image: 'https://images.unsplash.com/photo-1578652520385-c05f6f26176a?auto=format&fit=crop&w=900&q=80',
  },
];

export default function TopDestinationsSection({ destinations }: TopDestinationsSectionProps) {
  const items = destinations && destinations.length > 0 ? destinations : DEFAULT_DESTINATIONS;
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.75;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-8 sm:py-14 bg-white">
      {/* ━━━ WIDE CONTAINER (Expanded width for expansive luxury feel) ━━━ */}
      <div className="w-full max-w-[1560px] px-3 sm:px-6 lg:px-8 mx-auto">
        <div className="bg-[#f3f5f8] rounded-[28px] sm:rounded-[38px] p-6 sm:p-9 lg:p-12 border border-slate-200/80 shadow-xs">
          
          {/* Header Row: Title on Left, Subtitle on Right */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6 sm:mb-9">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-black text-[#0f1b2d] tracking-tight">
                Top Destinations
              </h2>
            </div>
            <p className="text-slate-500 text-xs sm:text-sm font-medium max-w-sm md:text-right leading-relaxed">
              From island escapes to cool mountain towns, discover where your next journey will take you.
            </p>
          </div>

          {/* Cards Carousel: 4 cards visible on desktop, swipeable on mobile */}
          <div
            ref={scrollRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-2 -mx-1 px-1"
          >
            {items.map((place) => (
              <Link
                key={place.id}
                href={`/places/${place.id}`}
                className="group relative flex-none w-[260px] sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] aspect-[4/5] rounded-[22px] sm:rounded-[26px] overflow-hidden snap-start shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 block bg-[#0f1b2d]"
              >
                {/* Background Image */}
                <Image
                  src={place.image}
                  alt={place.name}
                  fill
                  sizes="(max-width: 640px) 260px, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  unoptimized
                />

                {/* Dark Gradient Overlay for razor-sharp readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f1b2d]/95 via-[#0f1b2d]/35 via-50% to-transparent pointer-events-none" />

                {/* Bottom Card Content (Price Tag Removed) */}
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 z-10 text-white flex flex-col justify-end">
                  <h3 className="text-base sm:text-lg lg:text-xl font-black text-white tracking-tight leading-snug truncate group-hover:text-emerald-300 transition-colors">
                    {place.name}
                  </h3>

                  <div className="flex items-center gap-1.5 text-white/85 text-[11px] sm:text-xs font-semibold mt-1">
                    <span className="truncate">{place.tagline}</span>
                    <span>·</span>
                    <span className="flex items-center gap-0.5 text-amber-300 shrink-0">
                      ★ {place.rating}{' '}
                      <span className="text-white/65 font-normal">({place.reviews})</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-white/80 text-[11px] font-medium mt-1.5 truncate">
                    <span className="text-rose-400 text-xs shrink-0">📍</span>
                    <span className="truncate">{place.location}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Bottom Controls: "View more" on Left, "<" and ">" arrows on Right */}
          <div className="flex items-center justify-between mt-6 sm:mt-9 pt-2">
            <Link
              href="/destinations"
              className="inline-flex items-center gap-2 px-6 sm:px-7 py-2.5 sm:py-3 rounded-full bg-[#0f1b2d] hover:bg-[#00aa6c] text-white text-xs sm:text-[13px] font-bold shadow-sm transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <span>View more</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => scroll('left')}
                aria-label="Previous destinations"
                className="w-10 h-10 rounded-full border border-slate-300 bg-white hover:bg-slate-100 hover:border-slate-400 text-slate-700 flex items-center justify-center transition-all cursor-pointer active:scale-90 shadow-2xs"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scroll('right')}
                aria-label="Next destinations"
                className="w-10 h-10 rounded-full border border-slate-300 bg-white hover:bg-slate-100 hover:border-slate-400 text-slate-700 flex items-center justify-center transition-all cursor-pointer active:scale-90 shadow-2xs"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
