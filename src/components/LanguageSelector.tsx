'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage, LANGUAGES, LanguageCode } from '@/context/LanguageContext';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LanguageSelectorProps {
  scrolled?: boolean;
}

export default function LanguageSelector({ scrolled = false }: LanguageSelectorProps) {
  const { lang, setLang, currentLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Change language"
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
          scrolled
            ? 'text-slate-800 hover:bg-slate-50 border border-slate-200'
            : 'text-white hover:bg-white/10 border border-white/20'
        }`}
      >
        <span className="text-sm">{currentLanguage.flag}</span>
        <span className="uppercase tracking-wider">{currentLanguage.code}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          } ${scrolled ? 'text-slate-500' : 'text-white/70'}`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-48 rounded-2xl bg-white border border-slate-200 p-1.5 shadow-2xl z-[10002]"
          >
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
              Select Language
            </div>
            <div className="py-1 space-y-0.5">
              {LANGUAGES.map((item) => {
                const isActive = item.code === lang;
                return (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => {
                      setLang(item.code);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-emerald-50 text-[#00aa6c] font-bold'
                        : 'text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="text-base">{item.flag}</span>
                      <span>{item.nativeLabel}</span>
                    </span>
                    {isActive && <Check className="w-3.5 h-3.5 text-[#00aa6c]" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
