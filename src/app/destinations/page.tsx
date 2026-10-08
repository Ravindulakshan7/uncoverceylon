import { prisma } from '@/lib/db';
import { Place } from '@/types';
import PlacesGrid from '@/components/PlacesGrid';
import Link from 'next/link';
import { Compass, Sparkles, MapPin, ArrowRight } from 'lucide-react';

export const revalidate = 60;

export const metadata = {
  title: 'Destinations — Uncover Ceylon',
  description: 'Explore 60+ curated places, misty mountains, ancient citadels, pristine beaches, and hidden waterfalls across all 9 provinces of Sri Lanka.',
};

async function getPlaces(): Promise<Place[]> {
  try {
    const rawPlaces = await prisma.place.findMany({
      orderBy: [
        { featured: 'desc' },
        { rating: 'desc' },
      ],
    });
    return rawPlaces.map((p) => ({
      ...p,
      created_at: p.created_at.toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return [];
  }
}

export default async function DestinationsPage() {
  const places = await getPlaces();

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-20">
      
      {/* ━━━ Page Header & Hero Banner ━━━ */}
      <section className="bg-gradient-to-b from-[#f4f7f5] via-[#fafcfb] to-white pt-8 sm:pt-14 pb-8 sm:pb-12 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e7f6f0] text-[#078054] text-xs font-black uppercase tracking-wider mb-3.5 border border-emerald-200">
            <Compass className="w-3.5 h-3.5 text-[#0aa06e]" />
            <span>9 Provinces • 60+ Curated Spots</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#0f1b2d] tracking-tight leading-tight">
            Explore All Destinations
          </h1>

          <p className="text-slate-600 text-sm sm:text-base font-medium mt-3 leading-relaxed max-w-2xl mx-auto">
            From the UNESCO cloud forests of Horton Plains and ancient Sigiriya to the secret bays of the South Coast — discover the authentic wonders of Sri Lanka.
          </p>

        </div>
      </section>

      {/* ━━━ Interactive Places Grid with Categories, Search & Filters ━━━ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <PlacesGrid initialPlaces={places} />
      </div>

    </div>
  );
}
