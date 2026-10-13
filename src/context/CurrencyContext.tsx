'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'AUD' | 'LKR';

export interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  name: string;
  flag: string;
}

// Foreign currencies available for travelers (LKR removed from foreign selector)
export const FOREIGN_CURRENCY_CODES: CurrencyCode[] = ['USD', 'EUR', 'GBP', 'AUD'];

export const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧' },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', flag: '🇦🇺' },
  LKR: { code: 'LKR', symbol: 'Rs.', name: 'Sri Lankan Rupee', flag: '🇱🇰' },
};

// Default fallback exchange rates normalized to 1 USD
const DEFAULT_RATES: Record<CurrencyCode, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.78,
  AUD: 1.54,
  LKR: 305.0,
};

export interface DetailedFee {
  primary: string;
  secondary: string;
  isFree: boolean;
  amountUSD: number;
  amountInCurrency: number;
  amountLKR: number;
}

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  currencyInfo: CurrencyInfo;
  convertFee: (feeStr: string | null | undefined) => string;
  getDetailedFee: (feeStr: string | null | undefined) => DetailedFee;
  rates: Record<CurrencyCode, number>;
  isLiveRates: boolean;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'USD',
  setCurrency: () => {},
  currencyInfo: CURRENCIES.USD,
  convertFee: (str) => str || 'Free',
  getDetailedFee: () => ({
    primary: 'Free',
    secondary: 'Free admission for all travelers',
    isFree: true,
    amountUSD: 0,
    amountInCurrency: 0,
    amountLKR: 0,
  }),
  rates: DEFAULT_RATES,
  isLiveRates: false,
});

const STORAGE_KEY = 'uc_preferred_currency';

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>('USD');
  const [rates, setRates] = useState<Record<CurrencyCode, number>>(DEFAULT_RATES);
  const [isLiveRates, setIsLiveRates] = useState(false);

  // 1. Load saved currency on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as CurrencyCode;
      if (saved && CURRENCIES[saved]) {
        // If saved was LKR, default back to USD for foreign traveler view
        if (saved === 'LKR') {
          setCurrencyState('USD');
        } else {
          setCurrencyState(saved);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // 2. Fetch live currency exchange rates from open exchange API
  useEffect(() => {
    let isMounted = true;

    async function fetchLiveRates() {
      try {
        const res = await fetch('https://open.er-api.com/v6/latest/USD');
        if (!res.ok) return;
        const data = await res.json();
        if (data && data.rates && isMounted) {
          const lkr = Number(data.rates.LKR) || DEFAULT_RATES.LKR;
          const eur = Number(data.rates.EUR) || DEFAULT_RATES.EUR;
          const gbp = Number(data.rates.GBP) || DEFAULT_RATES.GBP;
          const aud = Number(data.rates.AUD) || DEFAULT_RATES.AUD;

          setRates({
            USD: 1.0,
            LKR: lkr,
            EUR: eur,
            GBP: gbp,
            AUD: aud,
          });
          setIsLiveRates(true);
        }
      } catch (err) {
        // Fallback to DEFAULT_RATES
      }
    }

    fetchLiveRates();
    return () => {
      isMounted = false;
    };
  }, []);

  const setCurrency = (c: CurrencyCode) => {
    setCurrencyState(c);
    try {
      localStorage.setItem(STORAGE_KEY, c);
    } catch {
      // ignore
    }
  };

  /**
   * Intelligently parses admission fees (e.g. 'USD 30 (Foreign Adults)', 'LKR 500', 'Free')
   * and translates into the user's selected active currency with clean formatting.
   */
  const convertFee = (feeStr: string | null | undefined): string => {
    if (!feeStr || typeof feeStr !== 'string') return 'Free';
    const trimmed = feeStr.trim();
    if (trimmed.toLowerCase().includes('free')) return 'Free';

    // 1. Detect USD-based fee: "USD 30 ...", "$30 ..."
    const usdMatch = trimmed.match(/(?:USD|\$)\s*(\d+(?:\.\d+)?)(.*)/i);
    if (usdMatch) {
      const amountUSD = parseFloat(usdMatch[1]);
      const suffix = (usdMatch[2] || '').trim();

      const rate = rates[currency] || 1.0;
      const converted = amountUSD * rate;
      let formatted = '';

      if (currency === 'USD') {
        formatted = `$${amountUSD % 1 === 0 ? amountUSD : amountUSD.toFixed(2)}`;
      } else if (currency === 'EUR') {
        formatted = `€${Math.round(converted)}`;
      } else if (currency === 'GBP') {
        formatted = `£${Math.round(converted)}`;
      } else if (currency === 'AUD') {
        formatted = `A$${Math.round(converted)}`;
      } else if (currency === 'LKR') {
        formatted = `Rs. ${Math.round(converted).toLocaleString('en-US')}`;
      }

      return suffix ? `${formatted} ${suffix}` : formatted;
    }

    // 2. Detect LKR-based fee: "LKR 1200 ...", "Rs. 500 ..."
    const lkrMatch = trimmed.match(/(?:LKR|Rs\.?)\s*(\d+(?:,\d+)?)(.*)/i);
    if (lkrMatch) {
      const amountLKR = parseFloat(lkrMatch[1].replace(/,/g, ''));
      const suffix = (lkrMatch[2] || '').trim();

      const lkrPerUsd = rates.LKR || DEFAULT_RATES.LKR;
      const amountUSD = amountLKR / lkrPerUsd;
      const rate = rates[currency] || 1.0;
      const converted = amountUSD * rate;
      let formatted = '';

      if (currency === 'USD') {
        formatted = `$${converted < 5 ? converted.toFixed(2) : Math.round(converted)}`;
      } else if (currency === 'EUR') {
        formatted = `€${converted < 5 ? converted.toFixed(2) : Math.round(converted)}`;
      } else if (currency === 'GBP') {
        formatted = `£${converted < 5 ? converted.toFixed(2) : Math.round(converted)}`;
      } else if (currency === 'AUD') {
        formatted = `A$${converted < 5 ? converted.toFixed(2) : Math.round(converted)}`;
      } else if (currency === 'LKR') {
        formatted = `Rs. ${Math.round(amountLKR).toLocaleString('en-US')}`;
      }

      return suffix ? `${formatted} ${suffix}` : formatted;
    }

    return trimmed;
  };

  /**
   * Computes clean detailed fee with primary foreign currency display
   * and secondary local LKR fee for foreigners visiting Sri Lanka.
   */
  const getDetailedFee = (feeStr: string | null | undefined): DetailedFee => {
    if (!feeStr || typeof feeStr !== 'string') {
      return {
        primary: 'Free',
        secondary: 'Free admission for all travelers',
        isFree: true,
        amountUSD: 0,
        amountInCurrency: 0,
        amountLKR: 0,
      };
    }

    const trimmed = feeStr.trim();
    if (trimmed.toLowerCase().includes('free')) {
      return {
        primary: 'Free',
        secondary: 'Free admission for all travelers',
        isFree: true,
        amountUSD: 0,
        amountInCurrency: 0,
        amountLKR: 0,
      };
    }

    let amountUSD = 0;
    const usdMatch = trimmed.match(/(?:USD|\$)\s*(\d+(?:\.\d+)?)/i);
    if (usdMatch) {
      amountUSD = parseFloat(usdMatch[1]);
    } else {
      const lkrMatch = trimmed.match(/(?:LKR|Rs\.?)\s*(\d+(?:,\d+)?)/i);
      if (lkrMatch) {
        const lkr = parseFloat(lkrMatch[1].replace(/,/g, ''));
        const lkrPerUsd = rates.LKR || DEFAULT_RATES.LKR;
        amountUSD = lkr / lkrPerUsd;
      } else {
        const anyNum = trimmed.match(/(\d+(?:\.\d+)?)/);
        if (anyNum) {
          amountUSD = parseFloat(anyNum[1]);
        }
      }
    }

    if (amountUSD <= 0) {
      return {
        primary: trimmed,
        secondary: 'Standard admission rate',
        isFree: false,
        amountUSD: 0,
        amountInCurrency: 0,
        amountLKR: 0,
      };
    }

    const currentRate = rates[currency] || 1.0;
    const amountInCurrency = amountUSD * currentRate;
    const lkrPerUsd = rates.LKR || DEFAULT_RATES.LKR;
    const amountLKR = amountUSD * lkrPerUsd;

    let primary = '';
    if (currency === 'USD') {
      primary = `$${amountUSD < 10 && amountUSD % 1 !== 0 ? amountUSD.toFixed(2) : Math.round(amountUSD)}`;
    } else if (currency === 'EUR') {
      primary = `€${amountInCurrency < 10 && amountInCurrency % 1 !== 0 ? amountInCurrency.toFixed(2) : Math.round(amountInCurrency)}`;
    } else if (currency === 'GBP') {
      primary = `£${amountInCurrency < 10 && amountInCurrency % 1 !== 0 ? amountInCurrency.toFixed(2) : Math.round(amountInCurrency)}`;
    } else if (currency === 'AUD') {
      primary = `A$${amountInCurrency < 10 && amountInCurrency % 1 !== 0 ? amountInCurrency.toFixed(2) : Math.round(amountInCurrency)}`;
    } else if (currency === 'LKR') {
      primary = `Rs. ${Math.round(amountLKR).toLocaleString('en-US')}`;
    }

    // Always show Sri Lankan Rupees (LKR) in the secondary subtitle for foreigners
    const lkrFormatted = `Rs. ${Math.round(amountLKR).toLocaleString('en-US')} LKR`;
    const secondary = `for Foreigners · approx. ${lkrFormatted}`;

    return {
      primary,
      secondary,
      isFree: false,
      amountUSD,
      amountInCurrency,
      amountLKR,
    };
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        currencyInfo: CURRENCIES[currency] || CURRENCIES.USD,
        convertFee,
        getDetailedFee,
        rates,
        isLiveRates,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
