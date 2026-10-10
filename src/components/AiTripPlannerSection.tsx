'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Compass, Send, CheckCircle2, ArrowRight, X, Clock, MapPin, Calendar } from 'lucide-react';

interface ItineraryResult {
  title: string;
  duration: string;
  highlights: string[];
  days: { day: string; title: string; desc: string; places: string[] }[];
}

const SAMPLE_ITINERARIES: Record<string, ItineraryResult> = {
  '3-day-tea': {
    title: 'Misty Tea Country & Iconic Railway',
    duration: '3 Days / 2 Nights',
    highlights: ['Blue Train Ella to Kandy', 'Nine Arch Bridge at sunrise', 'Nuwara Eliya Tea Tasting'],
    days: [
      {
        day: 'Day 1',
        title: 'Kandy to Nuwara Eliya',
        desc: 'Visit Temple of the Tooth in morning, drive through Ramboda Falls into Little England tea estates.',
        places: ['Kandy Lake', 'Ramboda Falls', 'Pedro Tea Estate'],
      },
      {
        day: 'Day 2',
        title: 'Highland Blue Train to Ella',
        desc: 'Board the scenic blue train across pine ridges to Ella. Sunset hike up Little Adam’s Peak.',
        places: ['Nanu Oya Station', 'Ella Gap', 'Little Adam’s Peak'],
      },
      {
        day: 'Day 3',
        title: 'Nine Arch Bridge & Waterfalls',
        desc: 'Watch the morning train cross Nine Arch Bridge, swim at Diyaluma or Ravana Falls before departure.',
        places: ['Nine Arch Bridge', 'Ravana Falls', 'Diyaluma Upper Pools'],
      },
    ],
  },
  '5-day-surf': {
    title: 'South Coast Surf, Whales & Historic Galle',
    duration: '5 Days / 4 Nights',
    highlights: ['Mirissa Blue Whale Watching', 'Weligama beginner surf lessons', 'Galle Fort Sunset Ramparts'],
    days: [
      {
        day: 'Day 1 & 2',
        title: 'Weligama & Mirissa Tropical Coast',
        desc: 'Catch morning surf breaks in Weligama Bay. Evening drinks at Coconut Tree Hill and Mirissa Beach.',
        places: ['Weligama Bay', 'Coconut Tree Hill', 'Secret Beach Mirissa'],
      },
      {
        day: 'Day 3',
        title: 'Sunrise Whale Watching & Hiriketiya',
        desc: 'Boat cruise into Indian Ocean blue whale migration corridor. Afternoon lounging at horseshoe bay Hiriketiya.',
        places: ['Mirissa Harbor', 'Hiriketiya Horseshoe Bay', 'Dondra Lighthouse'],
      },
      {
        day: 'Day 4 & 5',
        title: 'Colonial Galle Fort & Unawatuna',
        desc: 'Stroll cobblestone Dutch alleys, shop Ceylon gems & spices, watch cliff jumpers by the historic lighthouse.',
        places: ['Galle Dutch Fort', 'Jungle Beach Unawatuna', 'Lighthouse Ramparts'],
      },
    ],
  },
  '4-day-heritage': {
    title: 'Ancient Kingdoms & Sigiriya Citadel',
    duration: '4 Days / 3 Nights',
    highlights: ['Sigiriya Lion Rock Palace', 'Dambulla Cave Frescoes', 'Minneriya Wild Elephant Gathering'],
    days: [
      {
        day: 'Day 1',
        title: 'Golden Dambulla & Habarana',
        desc: 'Ascend to ancient cave temples of Dambulla with 150+ gilded Buddha statues. Stay in Habarana jungle resort.',
        places: ['Dambulla Cave Temple', 'Golden Buddha', 'Habarana Lake'],
      },
      {
        day: 'Day 2',
        title: 'Sigiriya Lion Rock & Pidurangala',
        desc: 'Climb King Kashyapa’s 5th-century sky fortress early morning. Sunset views from summit of Pidurangala.',
        places: ['Sigiriya Rock Fortress', 'Mirror Wall', 'Pidurangala Rock'],
      },
      {
        day: 'Day 3 & 4',
        title: 'Elephant Safari & Sacred Kandy',
        desc: '4x4 open safari in Minneriya or Kaudulla to witness hundreds of wild elephants. Journey south to sacred Kandy.',
        places: ['Minneriya National Park', 'Kandy Sacred Tooth Temple', 'Royal Botanical Gardens'],
      },
    ],
  },
  'default': {
    title: 'Personalized Ceylon Adventure Route',
    duration: '5 Days Curated Route',
    highlights: ['Coastal Surf & Sunshine', 'Misty Highland Tea Trails', 'Ancient Kingdoms & Heritage'],
    days: [
      {
        day: 'Days 1-2',
        title: 'Culture & Highlands',
        desc: 'Explore ancient UNESCO citadels followed by scenic railway journeys through lush tea plantations.',
        places: ['Sigiriya Rock', 'Kandy', 'Ella Nine Arch Bridge'],
      },
      {
        day: 'Days 3-4',
        title: 'Wildlife & Safari',
        desc: 'Encounter wild Asian elephants and elusive Sri Lankan leopards in their pristine natural habitats.',
        places: ['Yala National Park', 'Udawalawe', 'Little Adam’s Peak'],
      },
      {
        day: 'Day 5',
        title: 'Tropical Ocean & Coastline',
        desc: 'Unwind along golden palm-fringed coastlines and colonial Dutch fortresses overlooking the Indian Ocean.',
        places: ['Mirissa Beach', 'Galle Fort', 'Coconut Tree Hill'],
      },
    ],
  },
};

export default function AiTripPlannerSection() {
  const [query, setQuery] = useState('');
  const [activePlan, setActivePlan] = useState<ItineraryResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = (customPrompt?: string) => {
    const text = customPrompt || query;
    setIsGenerating(true);

    setTimeout(() => {
      setIsGenerating(false);
      const lower = text.toLowerCase();
      if (lower.includes('tea') || lower.includes('ella') || lower.includes('train') || lower.includes('highland')) {
        setActivePlan(SAMPLE_ITINERARIES['3-day-tea']);
      } else if (lower.includes('surf') || lower.includes('beach') || lower.includes('galle') || lower.includes('mirissa')) {
        setActivePlan(SAMPLE_ITINERARIES['5-day-surf']);
      } else if (lower.includes('sigiriya') || lower.includes('culture') || lower.includes('heritage') || lower.includes('elephant')) {
        setActivePlan(SAMPLE_ITINERARIES['4-day-heritage']);
      } else {
        setActivePlan(SAMPLE_ITINERARIES['default']);
      }
    }, 700);
  };

  return (
    <section className="py-8 sm:py-14 bg-white border-t border-slate-100">
      <div className="w-[min(1240px,92%)] mx-auto">
        <div className="rounded-[28px] sm:rounded-[36px] bg-gradient-to-br from-[#0f1b2d] via-[#11243b] to-[#0a3328] p-6 sm:p-10 lg:p-12 text-white relative overflow-hidden shadow-xl shadow-slate-900/10">
          
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#10b981]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#38bdf8]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-4">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-emerald-300 text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#10b981] animate-pulse" />
              <span>Smart Travel Assistant</span>
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
              Plan your personalized Sri Lanka trip in seconds
            </h2>

            {/* Subtitle */}
            <p className="text-slate-300 text-xs sm:text-sm font-normal max-w-xl mx-auto leading-relaxed">
              Tell our AI where you want to go or tap a sample trip. Receive a tailor-made day-by-day itinerary instantly.
            </p>

            {/* Search Input Box */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleGenerate();
              }}
              className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center gap-2.5 bg-white/10 backdrop-blur-xl border border-white/20 p-2 sm:p-2.5 rounded-2xl sm:rounded-full shadow-lg"
            >
              <div className="flex items-center gap-2 px-3 w-full sm:flex-1">
                <Compass className="w-5 h-5 text-emerald-400 shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="E.g., 5-day Ella tea trains & Mirissa surf trip..."
                  className="w-full bg-transparent text-white placeholder:text-white/50 text-xs sm:text-sm font-medium outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl sm:rounded-full bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer shrink-0 disabled:opacity-75"
              >
                {isGenerating ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Crafting...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Itinerary</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Suggestion Pills */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
              <span className="text-white/60 text-[11px] font-semibold mr-1">Popular prompts:</span>
              {[
                { label: '🌿 3-Day Misty Tea & Ella Train', key: '3-day-tea' },
                { label: '🏄 5-Day South Coast Surf & Whales', key: '5-day-surf' },
                { label: '🏛️ 4-Day Cultural Triangle & Sigiriya', key: '4-day-heritage' },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => {
                    setQuery(item.label.slice(2));
                    handleGenerate(item.label);
                  }}
                  className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/90 hover:text-white text-[11px] sm:text-xs font-medium border border-white/15 transition-all cursor-pointer active:scale-95"
                >
                  {item.label}
                </button>
              ))}
            </div>

          </div>

        </div>
      </div>

      {/* ━━━ ITINERARY RESULT MODAL / PREVIEW ━━━ */}
      {activePlan && (
        <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[88vh] overflow-y-auto border border-slate-200">
            
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActivePlan(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="pr-8 mb-6">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Curated Route</span>
                <span>·</span>
                <Clock className="w-3.5 h-3.5 ml-1" />
                <span>{activePlan.duration}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {activePlan.title}
              </h3>
            </div>

            {/* Key Highlights */}
            <div className="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-100">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Trip Highlights
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activePlan.highlights.map((hl, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00aa6c] shrink-0" />
                    <span>{hl}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Day by Day Plan */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Day-by-Day Schedule
              </h4>
              {activePlan.days.map((item, idx) => (
                <div key={idx} className="border-l-2 border-emerald-500 pl-4 py-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-[#00aa6c] bg-emerald-50 px-2 py-0.5 rounded-md">
                      {item.day}
                    </span>
                    <span className="text-sm font-bold text-slate-900">{item.title}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.places.map((place, pIdx) => (
                      <span
                        key={pIdx}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md"
                      >
                        <MapPin className="w-3 h-3 text-emerald-500" />
                        {place}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between gap-3 mt-8 pt-5 border-t border-slate-100 flex-wrap">
              <Link
                href="/map"
                onClick={() => setActivePlan(null)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#00aa6c] hover:bg-[#008f5a] text-white text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <span>View on Interactive Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                type="button"
                onClick={() => setActivePlan(null)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}
