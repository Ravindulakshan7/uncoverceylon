import { prisma } from '@/lib/db';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Landmark, Sparkles, MapPin, Star, Castle, Compass } from 'lucide-react';
import PlaceCard from '@/components/PlaceCard';
import { Place } from '@/types';

export const revalidate = 60;

export const metadata = {
  title: 'Culture & Heritage — Uncover Ceylon',
  description: 'Explore 2,500 years of living history across Sri Lanka: ancient rock fortresses, sacred Buddhist relics, colonial ramparts, and sacred pageants.',
};

const HERITAGE_PILLARS = [
  {
    title: 'The Cultural Triangle',
    tagline: 'Ancient Sacred Kingdoms',
    desc: 'The golden triangle connecting Anuradhapura, Polonnaruwa, and Sigiriya. Colossal white stupas, rock-cut Buddhas, and sophisticated hydraulic engineering built over two millennia ago.',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80',
    badge: 'UNESCO Wonder',
    period: '5th Century BC – 13th Century AD',
  },
  {
    title: 'Temple of the Sacred Tooth',
    tagline: 'Spiritual Heart of Ceylon',
    desc: 'Located by the misty lake of Kandy, Sri Dalada Maligawa houses the sacred relic of Lord Buddha. Daily drumming ceremonies and the grand illuminated Esala Perahera procession with regal tusker elephants.',
    image: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=800&q=80',
    badge: 'Living Tradition',
    period: 'Central Province • Kandy',
  },
  {
    title: 'Galle Fort Ramparts',
    tagline: 'Colonial Maritime Fortress',
    desc: 'Built by the Portuguese in 1588 and reinforced by the Dutch East India Company. Cobblestone alleyways lined with colonial villas, chic cafes, antique jewelers, and sunset ramparts meeting the ocean.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
    badge: 'Colonial Living',
    period: '16th – 18th Century • Southern Coast',
  },
  {
    title: 'Dambulla Cave Temples',
    tagline: 'Cave Sanctuary of Gold',
    desc: 'Five sacred cave sanctuaries hollowed into a massive granite rock face, housing 153 gilded Buddha statues and 2,100 square meters of ancient ceiling murals that have survived over 2,000 years.',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    badge: 'Cave Murals',
    period: '1st Century BC • Matale',
  },
  {
    title: 'Traditional Mask Carving',
    tagline: 'Ancient Folklore & Healing',
    desc: 'In the coastal village of Ambalangoda, master craftsmen carve intricate wooden Raksha and Kolam masks from light Kaduru wood, painted with natural pigments for ancient healing devil dances.',
    image: 'https://images.unsplash.com/photo-1586611292717-1d4a1e5d3c9c?auto=format&fit=crop&w=800&q=80',
    badge: 'Folk Art',
    period: 'Southern Coast • Ambalangoda',
  },
  {
    title: 'Sacred Adam’s Peak (Sri Pada)',
    tagline: 'The Pilgrimage Above Clouds',
    desc: 'A 2,243m sacred pyramid peak revered by Buddhists, Hindus, Muslims, and Christians alike. Thousands climb 5,500 lantern-lit steps in midnight darkness to witness the sacred triangular sunrise shadow.',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    badge: 'Sacred Pilgrimage',
    period: 'Sabaragamuwa Province',
  },
];

async function getCulturalDestinations(): Promise<Place[]> {
  try {
    const raw = await prisma.place.findMany({
      where: {
        category: {
          in: ['Ancient Sites', 'Historical', 'Religious Places'],
        },
      },
      orderBy: { rating: 'desc' },
      take: 6,
    });
    return raw.map((p) => ({
      ...p,
      created_at: p.created_at.toISOString(),
    }));
  } catch {
    return [];
  }
}

export default async function CulturePage() {
  const culturalPlaces = await getCulturalDestinations();

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-20">
      
      {/* ━━━ Hero Banner ━━━ */}
      <section className="relative bg-[#0f1b2d] text-white py-16 sm:py-24 overflow-hidden isolate">
        <div className="absolute inset-0 z-0 opacity-35">
          <Image
            src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=2000&q=85"
            alt="Sigiriya ancient fortress"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#0f1b2d] via-[#0f1b2d]/80 to-transparent" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-400/20 backdrop-blur-md text-emerald-300 text-xs font-black uppercase tracking-wider mb-4 border border-emerald-400/30">
            <Landmark className="w-3.5 h-3.5" />
            <span>2,500 Years of Living Heritage</span>
          </div>

          <h1 className="text-3xl sm:text-6xl font-black tracking-tight leading-tight text-white">
            Ancient Citadels, Temples & Sacred Legends
          </h1>

          <p className="text-white/80 text-sm sm:text-lg font-medium mt-4 max-w-2xl mx-auto leading-relaxed">
            Sri Lanka holds eight UNESCO World Heritage Sites across its compact island. Step into royal cloud citadels, whispering cave monasteries, and vibrant cultural traditions alive today.
          </p>
        </div>
      </section>

      {/* ━━━ 6 Pillars of Sri Lankan Culture ━━━ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="mb-10 sm:mb-14 text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Treasures of the Island
          </h2>
          <p className="text-slate-500 text-xs sm:text-base font-medium mt-1.5">
            Ancient kingdoms carved from stone, living sacred rituals, and colonial heritage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {HERITAGE_PILLARS.map((item, idx) => (
            <div
              key={idx}
              className="group rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Image */}
              <div className="relative h-56 w-full overflow-hidden bg-slate-900">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  unoptimized
                />
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#0f1b2d] text-xs font-black shadow-md">
                    {item.badge}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#0aa06e] block">
                    {item.tagline}
                  </span>
                  <h3 className="text-xl font-black text-slate-900 mt-1">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2 font-normal">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{item.period}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ━━━ Verified Cultural Sites from Supabase ━━━ */}
      {culturalPlaces.length > 0 && (
        <section className="bg-slate-50 py-14 sm:py-20 border-t border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
              <div>
                <span className="text-[#00aa6c] text-xs font-black uppercase tracking-wider">
                  Verified Heritage Spots
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight mt-1">
                  Cultural Destinations to Visit
                </h2>
              </div>
              <Link
                href="/destinations?category=Ancient+Sites"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#00aa6c] hover:underline"
              >
                <span>Explore all ancient sites</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {culturalPlaces.map((place, index) => (
                <PlaceCard key={place.id} place={place} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
