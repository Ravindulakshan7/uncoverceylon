'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Utensils, ArrowRight } from 'lucide-react';

const FLAVORS = [
  {
    title: 'Street Kottu Roti',
    category: 'Night Market Favorite',
    tag: 'Must Try',
    desc: 'Chopped flatbread tossed rhythmically on hot cast iron with farm veggies, eggs, and rich roasted curry gravy.',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=700&q=80',
  },
  {
    title: 'Crispy Egg Hoppers',
    category: 'Breakfast Classic',
    tag: 'Iconic',
    desc: 'Bowl-shaped crispy fermented rice batter pancakes with soft coconut centers and a fresh steamed runny egg.',
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=700&q=80',
  },
  {
    title: 'Jaffna Crab Curry',
    category: 'Northern Coastal Spice',
    tag: 'Spicy',
    desc: 'Blue ocean lagoon crabs simmered in rich coconut milk, drumstick leaves, and roasted Sri Lankan spices.',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80',
  },
  {
    title: 'High-Grown Ceylon Tea',
    category: 'Highland Heritage',
    tag: 'World Famous',
    desc: 'Handpicked two-leaves-and-a-bud black and silver tips grown above 6,000 feet in Nuwara Eliya mist.',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=700&q=80',
  },
];

export default function CeylonFlavorsSection() {
  return (
    <section className="py-12 sm:py-20 bg-white border-t border-slate-200/80">
      <div className="w-[min(1240px,92%)] mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold mb-2">
              <Utensils className="w-3.5 h-3.5 text-amber-600" />
              <span>Culinary Heritage</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-black text-[#0f1b2d] tracking-tight">
              Taste the Soul of Ceylon
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">
              Centuries of spice trade and island agriculture cooked into every unforgettable bite.
            </p>
          </div>

          <Link
            href="/food"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#00aa6c] hover:underline"
          >
            <span>Explore All Traditional Dishes</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {FLAVORS.map((dish) => (
            <Link
              key={dish.title}
              href="/food"
              className="group rounded-3xl bg-[#f8fafc] border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0f1b2d]">
                <Image
                  src={dish.image}
                  alt={dish.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  unoptimized
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-extrabold border border-white/20">
                    {dish.tag}
                  </span>
                </div>
              </div>

              <div className="p-4 sm:p-5 space-y-1.5">
                <span className="text-[10px] font-bold text-[#00aa6c] uppercase tracking-wider block">
                  {dish.category}
                </span>
                <h3 className="text-base font-black text-slate-900 tracking-tight leading-snug group-hover:text-[#00aa6c] transition-colors">
                  {dish.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {dish.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
