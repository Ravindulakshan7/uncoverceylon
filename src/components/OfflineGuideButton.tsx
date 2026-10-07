'use client';

import { useState } from 'react';
import { Place } from '@/types';
import { Download, Printer } from 'lucide-react';
import OfflineGuideModal from '@/components/OfflineGuideModal';
import { useLanguage } from '@/context/LanguageContext';

interface OfflineGuideButtonProps {
  place: Place;
  variant?: 'pill' | 'sidebar' | 'icon';
  className?: string;
}

export default function OfflineGuideButton({
  place,
  variant = 'pill',
  className = '',
}: OfflineGuideButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  if (variant === 'sidebar') {
    return (
      <>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`w-full flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold py-3.5 px-6 rounded-2xl text-sm transition-all active:scale-95 cursor-pointer shadow-xs ${className}`}
        >
          <Download className="w-4 h-4 text-[#00aa6c]" />
          <span>{t('detail.downloadOffline')}</span>
        </button>

        <OfflineGuideModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          place={place}
        />
      </>
    );
  }

  if (variant === 'icon') {
    return (
      <>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label={t('detail.downloadOffline')}
          title={t('detail.downloadOffline')}
          className={`p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[#00aa6c] active:scale-95 transition-all cursor-pointer ${className}`}
        >
          <Download className="w-4 h-4" />
        </button>

        <OfflineGuideModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          place={place}
        />
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`inline-flex items-center gap-1.5 bg-white border border-slate-200 hover:border-[#00aa6c] text-slate-800 font-bold px-3.5 py-2 rounded-xl text-xs sm:text-sm shadow-xs transition-all active:scale-95 cursor-pointer ${className}`}
      >
        <Download className="w-3.5 h-3.5 text-[#00aa6c]" />
        <span className="hidden sm:inline">{t('detail.downloadOffline')}</span>
        <span className="sm:hidden">Offline Guide</span>
      </button>

      <OfflineGuideModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        place={place}
      />
    </>
  );
}
