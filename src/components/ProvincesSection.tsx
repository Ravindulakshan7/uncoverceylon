'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, ArrowRight } from 'lucide-react';

const PROVINCES = [
  {
    name: 'Southern Province',
    tagline: 'Golden Beaches & Blue Whales',
    count: '24+ places',
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=700&q=80',
    slug: 'Southern',
  },
  {
    name: 'Central Province',
    tagline: 'Misty Tea Hills & Sigiriya',
    count: '20+ places',
    image: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=700&q=80',
    slug: 'Central',
  },
  {
    name: 'Uva Province',
    tagline: 'Ella Blue Trains & Gorges',
    count: '14+ places',
    image: 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=700&q=80',
    slug: 'Uva',
  },
  {
    name: 'Eastern Province',
    tagline: 'Arugam Bay Surf & Nilaveli Coral',
    count: '16+ places',
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=700&q=80',
    slug: 'Eastern',
  },
  {
    name: 'Western Province',
    tagline: 'Colombo Buzz & Coastal Heritage',
    count: '15+ places',
    image: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=700&q=80',
    slug: 'Western',
  },
  {
    name: 'North Central Province',
    tagline: 'Ancient Sacred Kingdoms & Stupas',
    count: '12+ places',
    image: 'https://images.unsplash.com/photo-1578652520385-c05f6f26176a?auto=format&fit=crop&w=700&q=80',
    slug: 'North Central',
  },
  {
    name: 'Northern Province',
    tagline: 'Jaffna Fort & Untouched Lagoons',
    count: '10+ places',
    image: 'https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?auto=format&fit=crop&w=700&q=80',
    slug: 'Northern',
  },
  {
    name: 'North Western Province',
    tagline: 'Kalpitiya Kitesurf & Dolphins',
    count: '9+ places',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=700&q=80',
    slug: 'North Western',
  },
  {
    name: 'Sabaragamuwa Province',
    tagline: 'Sinharaja Rainforest & Gems',
    count: '11+ places',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=700&q=80',
    slug: 'Sabaragamuwa',
  },
];

export default function ProvincesSection() {
  return (
    <section className="py-12 sm:py-20 bg-[#f8fafc] border-t border-slate-200/80">
      <div className="w-[min(1240px,92%)] mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-[#00aa6c] text-xs font-bold mb-2">
              <MapPin className="w-3.5 h-3.5" />
              <span>9 Island Provinces</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-black text-[#0f1b2d] tracking-tight">
              Explore by Province
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">
              Every corner of Sri Lanka has a distinct climate, culture, and rhythm.
            </p>
          </div>

          <Link
            href="/destinations"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#00aa6c] hover:underline"
          >
            <span>View All Destinations</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 9 Provinces Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {PROVINCES.map((prov) => (
            <Link
              key={prov.name}
              href={`/destinations?province=${encodeURIComponent(prov.slug)}`}
              className="group relative h-44 sm:h-48 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block bg-[#0f1b2d]"
            >
              {/* Photo Background */}
              <Image
                src={prov.image}
                alt={prov.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out opacity-85"
                unoptimized
              />

              {/* Multi-Stop Dark Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f1b2d]/95 via-[#0f1b2d]/40 to-transparent pointer-events-none" />

              {/* Top Count Badge */}
              <div className="absolute top-3.5 right-3.5 z-10 pointer-events-none">
                <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-[10px] font-bold border border-white/20">
                  {prov.count}
                </span>
              </div>

              {/* Bottom Content */}
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 z-10 text-white">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                  {prov.name}
                </h3>
                <p className="text-white/80 text-xs font-medium mt-0.5 truncate">
                  {prov.tagline}
                </p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
