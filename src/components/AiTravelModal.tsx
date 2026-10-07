'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, ArrowRight, Compass, MapPin } from 'lucide-react';

const AI_PROMPTS = [
  {
    title: '3-Day South Coast Surf & Whale Safari',
    desc: 'Mirissa, Weligama, Hiriketiya, Galle Fort',
    category: 'Beaches',
    tag: 'Coastal',
  },
  {
    title: 'Kandy to Ella Scenic Train & Tea Highlands',
    desc: 'Nine Arch Bridge, Little Adam’s Peak, Tea Estates',
    category: 'Mountains',
    tag: 'Highlands',
  },
  {
    title: 'Cultural Triangle & Ancient Citadels',
    desc: 'Sigiriya Rock Fortress, Dambulla Cave, Pidurangala',
    category: 'Ancient Sites',
    tag: 'Heritage',
  },
  {
    title: 'Yala & Udawalawe Wild Leopard Expedition',
    desc: 'Big game tracking, elephant herds & safari glamping',
    category: 'Wildlife',
    tag: 'Safari',
  },
  {
    title: 'Secret Waterfalls of Knuckles & Central Hills',
    desc: 'Diyaluma, Ravana Falls, misty river cascades',
    category: 'Waterfalls',
    tag: 'Adventure',
  },
];

export default function AiTravelModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('uc:open-ai-modal', handleOpen);
    return () => window.removeEventListener('uc:open-ai-modal', handleOpen);
  }, []);

  const handleSelectPrompt = (prompt: typeof AI_PROMPTS[0]) => {
    setIsOpen(false);
    if (typeof window !== 'undefined') {
      const destEl = document.getElementById('destinations') || document.getElementById('explore');
      if (destEl) {
        destEl.scrollIntoView({ behavior: 'smooth' });
      }
      window.dispatchEvent(
        new CustomEvent('uc:filter-category', {
          detail: {
            category: prompt.category,
            search: prompt.title,
          },
        })
      );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10000] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 16 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-slate-100 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header ambient gradient accent */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-500" />

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close AI Travel Assistant"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Title & Badge */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-[#00aa6c] flex items-center justify-center shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-xl text-slate-900 tracking-tight">
                    Plan with Ceylon AI
                  </h3>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Smart Itinerary
                  </span>
                </div>
                <p className="text-slate-500 text-xs font-medium">
                  Select a curated route or search custom island adventures
                </p>
              </div>
            </div>

            {/* AI Prompts list */}
            <div className="mt-5 space-y-2.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Trending Island Itinerary Prompts:
              </p>
              {AI_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPrompt(prompt)}
                  className="w-full text-left p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50/70 hover:border-emerald-300 text-slate-800 transition-all border border-slate-200/80 flex items-center justify-between group cursor-pointer shadow-xs active:scale-[0.99]"
                >
                  <div className="min-w-0 pr-3">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-white text-slate-700 border border-slate-200 shrink-0">
                        {prompt.tag}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 group-hover:text-[#00aa6c] transition-colors truncate">
                        {prompt.title}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-500 truncate">
                      {prompt.desc}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white group-hover:bg-[#00aa6c] group-hover:text-white text-slate-400 flex items-center justify-center transition-all border border-slate-200 group-hover:border-[#00aa6c] shrink-0">
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-medium text-slate-500">
                <Compass className="w-3.5 h-3.5 text-emerald-600" />
                Powered by Serandib Co. Travel Engine
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="font-bold text-[#00aa6c] hover:underline cursor-pointer"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
