'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Compass, ArrowRight, CheckCircle2 } from 'lucide-react';

const ITINERARIES = [
  {
    id: 'classic-7',
    title: '7-Day Classic Ceylon Circuit',
    duration: '7 Days',
    idealFor: 'First-Time Travelers',
    route: ['Colombo', 'Sigiriya', 'Kandy', 'Ella', 'Galle Fort'],
    image: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=800&q=80',
    description: 'The definitive route connecting UNESCO citadels, sacred temples, scenic blue tea trains, and colonial coastal ramparts.',
  },
  {
    id: 'surf-5',
    title: '5-Day South Coast Surf & Whales',
    duration: '5 Days',
    idealFor: 'Ocean & Wave Seekers',
    route: ['Weligama', 'Mirissa', 'Hiriketiya', 'Galle Fort'],
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80',
    description: 'Catch beginner-to-pro surf breaks, embark on Indian Ocean blue whale safaris, and sip coconut sunsets on secret beaches.',
  },
  {
    id: 'highlands-3',
    title: '3-Day Misty Tea & Ella Train',
    duration: '3 Days',
    idealFor: 'Mountain & Nature Lovers',
    route: ['Kandy Lake', 'Nuwara Eliya', 'Nine Arch', 'Ella Gap'],
    image: 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=800&q=80',
    description: 'Cross breathtaking mountain trestles on the world-famous blue train, wander colonial tea estates, and hike sunrise peaks.',
  },
  {
    id: 'odyssey-10',
    title: '10-Day Complete Island Odyssey',
    duration: '10 Days',
    idealFor: 'The Grand Explorer',
    route: ['Negombo', 'Anuradhapura', 'Sigiriya', 'Ella', 'Yala', 'Mirissa'],
    image: 'https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?auto=format&fit=crop&w=800&q=80',
    description: 'The ultimate deep-dive across 6 provinces: ancient ruined capitals, highland cloud forests, wild leopard safaris, and azure coasts.',
  },
];

export default function CuratedItinerariesSection() {
  return (
    <section className="py-12 sm:py-20 bg-white border-t border-slate-200/80">
      <div className="w-[min(1240px,92%)] mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#00aa6c] text-xs font-bold mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Curated Island Routes</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-black text-[#0f1b2d] tracking-tight">
            Handpicked Itineraries for Every Traveler
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1.5">
            Save dozens of research hours. Follow routes tested and refined by local island experts.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {ITINERARIES.map((item) => (
            <div
              key={item.id}
              className="group rounded-3xl bg-[#f8fafc] border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row hover:-translate-y-1"
            >
              {/* Left/Top Image */}
              <div className="relative w-full sm:w-48 md:w-52 h-52 sm:h-auto shrink-0 overflow-hidden bg-[#0f1b2d]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 220px"
                  className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  unoptimized
                />
                <div className="absolute top-3 left-3 z-10">
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-extrabold border border-white/20">
                    {item.duration}
                  </span>
                </div>
              </div>

              {/* Right Content */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold text-[#00aa6c] uppercase tracking-wider block mb-1">
                    {item.idealFor}
                  </span>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Route Breadcrumb */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-slate-200/70 text-[11px] font-semibold text-slate-700">
                    {item.route.map((stop, sIdx) => (
                      <span key={sIdx} className="inline-flex items-center gap-1">
                        <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200/80 shadow-2xs">
                          {stop}
                        </span>
                        {sIdx < item.route.length - 1 && (
                          <span className="text-slate-400 font-bold">➔</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-2">
                  <Link
                    href="/map"
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#00aa6c] hover:text-[#008f5a] transition-colors"
                  >
                    <span>Explore Route on Map</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
