'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Compass, X, Clock, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';

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

interface AiTripModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AiTripModal({ isOpen, onClose }: AiTripModalProps) {
  const [query, setQuery] = useState('');
  const [activePlan, setActivePlan] = useState<ItineraryResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

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
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[999999] bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-[28px] p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto border border-slate-200">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close AI Trip Planner"
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="pr-8 mb-5">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full mb-2 border border-emerald-100">
            <Sparkles className="w-3.5 h-3.5 text-[#00aa6c] animate-pulse" />
            <span>Ceylon AI Trip Planner</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Where do you want to explore in Sri Lanka?
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Type any travel idea or choose a prompt to get a complete custom day-by-day itinerary instantly.
          </p>
        </div>

        {/* Search Input Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleGenerate();
          }}
          className="flex items-center gap-2 bg-slate-50 border border-slate-200 focus-within:border-[#00aa6c] focus-within:ring-2 focus-within:ring-emerald-500/20 p-2 rounded-2xl shadow-xs transition-all"
        >
          <Compass className="w-5 h-5 text-emerald-600 shrink-0 ml-2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="E.g., 5-day Ella tea trains & Mirissa surf trip..."
            className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-semibold outline-none"
          />
          <button
            type="submit"
            disabled={isGenerating}
            className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl bg-[#00aa6c] hover:bg-[#008f5a] text-white font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer shrink-0 disabled:opacity-75"
          >
            {isGenerating ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Crafting...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Plan</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-3 pt-1">
          <span className="text-slate-400 text-[11px] font-semibold">Try:</span>
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
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-[11px] font-semibold transition-all cursor-pointer active:scale-95"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* ━━━ ITINERARY RESULT VIEW ━━━ */}
        {activePlan && (
          <div className="mt-6 pt-5 border-t border-slate-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-emerald-50/70 rounded-2xl p-4 mb-5 border border-emerald-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800">
                  Generated Route
                </span>
                <h4 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                  {activePlan.title}
                </h4>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold shrink-0">
                {activePlan.duration}
              </span>
            </div>

            {/* Highlights */}
            <div className="space-y-1.5 mb-5">
              <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Trip Highlights
              </h5>
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
            <div className="space-y-3.5 mb-6">
              <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Day-by-Day Schedule
              </h5>
              {activePlan.days.map((item, idx) => (
                <div key={idx} className="border-l-2 border-emerald-500 pl-3.5 py-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black text-[#00aa6c] bg-emerald-50 px-2 py-0.5 rounded-md">
                      {item.day}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-900">{item.title}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {item.places.map((place, pIdx) => (
                      <span
                        key={pIdx}
                        className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md"
                      >
                        <MapPin className="w-2.5 h-2.5 text-emerald-500" />
                        {place}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <Link
                href="/map"
                onClick={onClose}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#00aa6c] hover:bg-[#008f5a] text-white text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <span>View Route on Interactive Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
