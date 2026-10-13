'use client';

import { useState, useRef, useEffect } from 'react';
import { useCurrency, CurrencyCode } from '@/context/CurrencyContext';
import { useLanguage, LanguageCode } from '@/context/LanguageContext';
import { ChevronDown, Check, Globe, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface CountryOption {
  code: string;
  name: string;
  flag: string;
  lang: LanguageCode;
  langLabel: string;
  currency: CurrencyCode;
  currencySymbol: string;
}

export const COUNTRIES: CountryOption[] = [
  { code: 'US', name: 'United States', flag: '🇺🇸', lang: 'en', langLabel: 'English', currency: 'USD', currencySymbol: '$' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', lang: 'en', langLabel: 'English', currency: 'GBP', currencySymbol: '£' },
  { code: 'DE', name: 'Germany (Deutschland)', flag: '🇩🇪', lang: 'de', langLabel: 'Deutsch', currency: 'EUR', currencySymbol: '€' },
  { code: 'FR', name: 'France', flag: '🇫🇷', lang: 'fr', langLabel: 'Français', currency: 'EUR', currencySymbol: '€' },
  { code: 'RU', name: 'Russia (Россия)', flag: '🇷🇺', lang: 'ru', langLabel: 'Русский', currency: 'USD', currencySymbol: '$' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', lang: 'en', langLabel: 'English', currency: 'AUD', currencySymbol: 'A$' },
  { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰', lang: 'en', langLabel: 'English', currency: 'USD', currencySymbol: '$' },
];

const STORAGE_COUNTRY_KEY = 'uc_selected_country';

interface CountrySelectorProps {
  scrolled?: boolean;
}

export default function CountrySelector({ scrolled = false }: CountrySelectorProps) {
  const { setCurrency } = useCurrency();
  const { setLang, lang } = useLanguage();
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('US');
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load saved country or sync from language
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_COUNTRY_KEY);
      if (saved && COUNTRIES.some((c) => c.code === saved)) {
        setSelectedCountryCode(saved);
      } else if (lang === 'de') {
        setSelectedCountryCode('DE');
      } else if (lang === 'fr') {
        setSelectedCountryCode('FR');
      } else if (lang === 'ru') {
        setSelectedCountryCode('RU');
      }
    } catch {
      // ignore
    }
  }, [lang]);

  // Close on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const currentCountry =
    COUNTRIES.find((c) => c.code === selectedCountryCode) || COUNTRIES[0];

  const handleSelectCountry = (country: CountryOption) => {
    setSelectedCountryCode(country.code);
    try {
      localStorage.setItem(STORAGE_COUNTRY_KEY, country.code);
    } catch {
      // ignore
    }

    // 1. Auto change Language according to selected country
    setLang(country.lang);

    // 2. Auto change Currency according to selected country
    setCurrency(country.currency);

    setIsOpen(false);
  };

  const filteredCountries = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.langLabel.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button with Country Flag & Name */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select Country and Language"
        title="Country, Language & Region"
        className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer shadow-xs bg-white text-slate-800 hover:bg-slate-50 border border-slate-200 hover:border-slate-300"
      >
        <span className="text-sm shrink-0 leading-none">{currentCountry.flag}</span>
        <span className="font-semibold text-slate-900 tracking-tight max-w-[90px] sm:max-w-[120px] truncate">
          {currentCountry.name.split(' ')[0]}
        </span>
        <ChevronDown
          className={`w-3 h-3 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          } text-slate-400`}
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
            className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 p-2 shadow-2xl z-[10002]"
          >
            <div className="px-2 pt-1 pb-2 border-b border-slate-100">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                <span>Select Country</span>
                <span className="text-[#00aa6c] font-medium lowercase">auto language</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                Language &amp; currency adapt automatically.
              </p>
            </div>

            <div className="max-h-60 overflow-y-auto py-1 space-y-0.5 scrollbar-thin">
              {filteredCountries.map((country) => {
                const isActive = country.code === currentCountry.code;
                return (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => handleSelectCountry(country)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left ${
                      isActive
                        ? 'bg-emerald-50 text-[#00aa6c] font-bold'
                        : 'text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-base shrink-0">{country.flag}</span>
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 truncate text-[13px]">
                          {country.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium">
                          {country.langLabel} · {country.currency} ({country.currencySymbol})
                        </div>
                      </div>
                    </div>
                    {isActive && <Check className="w-4 h-4 text-[#00aa6c] shrink-0" />}
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
