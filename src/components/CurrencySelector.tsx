'use client';

import { useState, useRef, useEffect } from 'react';
import { useCurrency, CURRENCIES, CurrencyCode } from '@/context/CurrencyContext';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CurrencySelectorProps {
  scrolled?: boolean;
}

export default function CurrencySelector({ scrolled = false }: CurrencySelectorProps) {
  const { currency, setCurrency, currencyInfo } = useCurrency();
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
        aria-label="Change currency"
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
          scrolled
            ? 'text-slate-800 hover:bg-slate-50 border border-slate-200'
            : 'text-white hover:bg-white/10 border border-white/20'
        }`}
      >
        <span className="text-sm">{currencyInfo.flag}</span>
        <span className="font-mono font-bold tracking-tight">{currencyInfo.code}</span>
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
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 flex items-center justify-between">
              <span>Currency</span>
              <span className="text-sky-600 font-mono text-[9px] lowercase">approx. live</span>
            </div>
            <div className="py-1 space-y-0.5">
              {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => {
                const item = CURRENCIES[code];
                const isActive = item.code === currency;
                return (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => {
                      setCurrency(item.code);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-sky-50 text-sky-600 font-bold'
                        : 'text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="text-base">{item.flag}</span>
                      <span className="font-medium text-slate-900">{item.code}</span>
                      <span className="text-[11px] text-slate-500">({item.symbol})</span>
                    </span>
                    {isActive && <Check className="w-3.5 h-3.5 text-sky-600" />}
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
