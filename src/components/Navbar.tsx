'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Heart, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlist } from '@/context/WishlistContext';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'destinations' | 'map' | 'about'>('home');
  const pathname = usePathname();
  const { savedCount, setIsDrawerOpen } = useWishlist();
  const { t } = useLanguage();

  const navLinks = [
    { href: '/', label: t('nav.home'), id: 'home' },
    { href: '/#explore', label: t('nav.destinations'), id: 'destinations' },
    { href: '/map', label: t('nav.map'), id: 'map' },
    { href: '/about', label: t('nav.about'), id: 'about' },
  ];

  useEffect(() => {
    const updateActiveTab = () => {
      if (typeof window === 'undefined') return;
      const currentPath = window.location.pathname;
      const currentHash = window.location.hash;

      if (currentPath.startsWith('/about')) {
        setActiveTab('about');
        return;
      }

      if (currentPath.startsWith('/map')) {
        setActiveTab('map');
        return;
      }

      if (currentHash === '#explore') {
        setActiveTab('destinations');
        return;
      }

      if (currentPath === '/') {
        const exploreElement = document.getElementById('explore');
        if (exploreElement) {
          const rect = exploreElement.getBoundingClientRect();
          if (rect.top <= 250 && rect.bottom >= 150) {
            setActiveTab('destinations');
            return;
          }
        }
        if (window.scrollY < 300) {
          setActiveTab('home');
          return;
        }
      }

      if (currentPath === '/') {
        setActiveTab('home');
      }
    };

    updateActiveTab();

    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      updateActiveTab();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('popstate', updateActiveTab);
    window.addEventListener('hashchange', updateActiveTab);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('popstate', updateActiveTab);
      window.removeEventListener('hashchange', updateActiveTab);
    };
  }, [pathname]);

  if (pathname?.startsWith('/admin')) return null;

  const isActive = (id: string) => activeTab === id;

  const handleNavClick = (id: string) => {
    setActiveTab(id as typeof activeTab);
    if (id === 'destinations' && typeof window !== 'undefined' && window.location.pathname === '/') {
      window.dispatchEvent(new CustomEvent('uc:filter-category', { detail: { category: 'All' } }));
      const exploreEl = document.getElementById('explore');
      if (exploreEl) {
        exploreEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-[9999] transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 text-slate-900 border-b border-slate-200/80 shadow-[0_4px_24px_rgba(15,23,42,0.06)] backdrop-blur-xl'
          : 'bg-gradient-to-b from-[#07111e]/90 via-[#07111e]/50 to-transparent text-white border-b border-white/15 backdrop-blur-[4px]'
      }`}
    >
      <nav className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* ━━━ BRAND LOGO (MINIMALIST TYPOGRAPHIC, NO COMPASS) ━━━ */}
          <Link
            href="/"
            onClick={() => setActiveTab('home')}
            className="group flex items-center gap-2.5 transition-transform active:scale-95 py-1"
          >
            <div className="flex flex-col leading-none">
              <span className={`text-[19px] sm:text-[21px] font-bold tracking-tight ${scrolled ? 'text-slate-900' : 'text-white'}`}>
                Uncover
                <span className={`font-extrabold ml-0.5 ${scrolled ? 'text-sky-600' : 'text-sky-400'}`}>
                  Ceylon
                </span>
              </span>
              <span className={`text-[8.5px] sm:text-[9px] tracking-[0.24em] uppercase font-semibold mt-1 ${scrolled ? 'text-slate-400' : 'text-white/60'}`}>
                Island Travel Guide
              </span>
            </div>
          </Link>

          {/* ━━━ DESKTOP NAVIGATION (SLEEK MINIMALIST LINE AESTHETIC) ━━━ */}
          <div className="hidden md:flex items-center gap-1 sm:gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.id);
              return (
                <Link
                  key={link.id}
                  href={link.href}
                  onClick={() => handleNavClick(link.id)}
                  className={`relative px-4 py-2 text-[14px] font-medium transition-all duration-200 rounded-lg ${
                    active
                      ? scrolled
                        ? 'text-sky-600 font-semibold'
                        : 'text-amber-300 font-semibold'
                      : scrolled
                      ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      : 'text-white/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className={`absolute inset-x-3 -bottom-1 h-[2px] rounded-full ${
                        scrolled ? 'bg-sky-600' : 'bg-amber-400'
                      }`}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* ━━━ RIGHT ACTION ITEMS ━━━ */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Multi-Language Selector */}
            <LanguageSelector scrolled={scrolled} />

            {/* Saved Wishlist Heart */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className={`relative p-2.5 rounded-full transition-all duration-200 cursor-pointer ${
                scrolled
                  ? 'text-slate-700 hover:bg-slate-100 hover:text-rose-600'
                  : 'text-white/90 hover:bg-white/10 hover:text-rose-400'
              }`}
              aria-label="View Saved Destinations"
              title={t('nav.savedPlaces')}
            >
              <Heart
                className={`w-5 h-5 transition-transform hover:scale-110 ${
                  savedCount > 0 ? 'fill-rose-500 text-rose-500' : ''
                }`}
              />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center shadow-md animate-in fade-in zoom-in duration-200">
                  {savedCount > 9 ? '9+' : savedCount}
                </span>
              )}
            </button>

            {/* Premium Minimal Explore Button */}
            <Link
              href="/#explore"
              onClick={() => handleNavClick('destinations')}
              className={`hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold rounded-full transition-all duration-200 active:scale-[0.97] cursor-pointer ${
                scrolled
                  ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-sm shadow-sky-600/25'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/25 backdrop-blur-sm'
              }`}
            >
              <span>{t('nav.explore')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Mobile Menu Burger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
              className={`md:hidden p-2 rounded-xl transition-all duration-200 cursor-pointer ${
                scrolled
                  ? 'text-slate-800 hover:bg-slate-100'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* ━━━ MOBILE DROPDOWN MENU ━━━ */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className={`md:hidden overflow-hidden border-t transition-colors duration-300 ${
                scrolled
                  ? 'border-slate-200 bg-white text-slate-900 shadow-xl'
                  : 'border-white/15 bg-[#07111e]/98 text-white shadow-2xl backdrop-blur-2xl'
              }`}
            >
              <div className="py-4 space-y-1.5">
                {navLinks.map((link) => {
                  const active = isActive(link.id);
                  return (
                    <Link
                      key={link.id}
                      href={link.href}
                      onClick={() => {
                        handleNavClick(link.id);
                        setMobileOpen(false);
                      }}
                      className={`flex items-center min-h-[44px] px-4 py-2.5 rounded-xl text-[15px] transition-all active:scale-[0.98] ${
                        active
                          ? scrolled
                            ? 'text-sky-600 bg-sky-50 font-bold border-l-3 border-sky-600'
                            : 'text-amber-400 bg-white/10 font-bold border-l-3 border-amber-400'
                          : scrolled
                          ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
                          : 'text-white/85 hover:text-white hover:bg-white/10 font-medium'
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}

                {/* Mobile Saved Places Button */}
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    setIsDrawerOpen(true);
                  }}
                  className={`w-full flex items-center justify-between min-h-[44px] px-4 py-2.5 rounded-xl text-[15px] font-medium transition-all active:scale-[0.98] cursor-pointer ${
                    scrolled
                      ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                      : 'text-white/85 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Heart className={`w-4.5 h-4.5 ${savedCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
                    <span>{t('nav.savedPlaces')}</span>
                  </span>
                  {savedCount > 0 && (
                    <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {savedCount}
                    </span>
                  )}
                </button>

                <Link
                  href="/#explore"
                  onClick={() => {
                    handleNavClick('destinations');
                    setMobileOpen(false);
                  }}
                  className="mt-3 flex items-center justify-center gap-2 min-h-[44px] py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-[14px] font-bold active:scale-[0.98] transition-all shadow-md shadow-sky-600/30 cursor-pointer"
                >
                  <span>{t('hero.exploreBtn')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
