'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Heart, Sparkles, Search, ChevronDown, LogOut, ShieldCheck, User as UserIcon } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import CurrencySelector from '@/components/CurrencySelector';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'destinations' | 'map'>('home');
  const [scrolled, setScrolled] = useState(false);
  const [navSearchQuery, setNavSearchQuery] = useState('');
  const pathname = usePathname();
  const { savedCount, setIsDrawerOpen } = useWishlist();
  const { user, openAuthModal, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window === 'undefined') return;
      
      // Toggle sticky transform when scrolling past hero search bar
      setScrolled(window.scrollY > 220);

      // Active tab detection
      const currentPath = window.location.pathname;
      const currentHash = window.location.hash;

      if (currentPath.startsWith('/map')) {
        setActiveTab('map');
        return;
      }

      if (currentHash === '#destinations' || currentHash === '#explore') {
        setActiveTab('destinations');
        return;
      }

      if (currentPath === '/') {
        const destElement = document.getElementById('destinations') || document.getElementById('explore');
        if (destElement) {
          const rect = destElement.getBoundingClientRect();
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
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('popstate', handleScroll);
    window.addEventListener('hashchange', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('popstate', handleScroll);
      window.removeEventListener('hashchange', handleScroll);
    };
  }, [pathname]);

  if (pathname?.startsWith('/admin')) return null;

  const scrollToDestinations = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setActiveTab('destinations');
    setMobileOpen(false);
    window.location.href = '/destinations';
  };

  const handleNavSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      const el = document.getElementById('destinations') || document.getElementById('explore');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
      window.dispatchEvent(
        new CustomEvent('uc:filter-category', {
          detail: {
            category: 'All',
            search: navSearchQuery.trim(),
          },
        })
      );
    }
  };

  const handleSubCategoryClick = (category: string) => {
    if (typeof window !== 'undefined') {
      const el = document.getElementById('destinations') || document.getElementById('explore');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
      window.dispatchEvent(
        new CustomEvent('uc:filter-category', {
          detail: {
            category: category,
            search: '',
          },
        })
      );
    }
  };

  const openAiModal = () => {
    setMobileOpen(false);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('uc:open-ai-modal'));
    }
  };

  return (
    <header
      className={`sticky top-0 inset-x-0 z-[9999] bg-white text-[#002b11] transition-all duration-200 ${
        scrolled
          ? 'border-b border-slate-200/90 shadow-[0_2px_14px_rgba(0,0,0,0.05)]'
          : 'border-b-0'
      }`}
    >
      <nav className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* ━━━ TIER 1: MAIN NAV BAR ROW ━━━ */}
        <div className="flex items-center justify-between h-16 sm:h-[70px]">
          
          {/* 1. BRAND LOGO + TRIPADVISOR SCROLLED SEARCH PILL */}
          <div className="flex items-center gap-3 sm:gap-4 md:gap-6 min-w-0">
            <Link
              href="/"
              onClick={() => setActiveTab('home')}
              className="group flex items-center gap-2.5 transition-transform active:scale-95 py-1 shrink-0"
            >
              {/* TripAdvisor-style Binocular / Compass Icon */}
              <div className="flex items-center shrink-0">
                <svg
                  className="w-8 h-8 sm:w-9 sm:h-9 text-[#002b11] transition-transform group-hover:scale-105"
                  viewBox="0 0 36 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="11" cy="18" r="9" stroke="#002b11" strokeWidth="3" />
                  <circle cx="11" cy="18" r="4.5" fill="#00aa6c" />
                  <circle cx="11" cy="18" r="2" fill="#002b11" />
                  <circle cx="25" cy="18" r="9" stroke="#002b11" strokeWidth="3" />
                  <circle cx="25" cy="18" r="4.5" fill="#00aa6c" />
                  <circle cx="25" cy="18" r="2" fill="#002b11" />
                  <path d="M17 14C17.5 12.5 18.5 12.5 19 14" stroke="#002b11" strokeWidth="2.8" strokeLinecap="round" />
                  <path d="M7 10L10 12" stroke="#002b11" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M29 10L26 12" stroke="#002b11" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>

              {/* Logo Text: Solid #002b11, Bold Trip-Sans style */}
              <span className="text-[20px] sm:text-[23px] font-black tracking-[-0.04em] text-[#002b11] shrink-0">
                Uncoverceylon
              </span>
            </Link>

            {/* ━━━ TRIPADVISOR COMPACT SEARCH PILL (Appears on scroll right next to logo) ━━━ */}
            {scrolled && (
              <form
                onSubmit={handleNavSearchSubmit}
                className="hidden sm:flex items-center gap-2 bg-white border border-slate-300 hover:border-slate-400 focus-within:!border-[#00aa6c] focus-within:ring-2 focus-within:ring-emerald-500/20 rounded-full px-3.5 py-1.5 w-40 md:w-52 lg:w-64 transition-all shadow-xs animate-in fade-in slide-in-from-left-2 duration-200"
              >
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search"
                  value={navSearchQuery}
                  onChange={(e) => setNavSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-[13px] font-semibold text-[#002b11] placeholder:text-slate-400 outline-none min-w-0"
                />
              </form>
            )}

            {/* ━━━ 2. GLOWING "PLAN WITH AI" PILL (TripAdvisor signature) ━━━ */}
            <button
              type="button"
              onClick={openAiModal}
              className="hidden lg:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#f2faf5] hover:bg-[#e6f7ee] text-[#002b11] text-xs sm:text-[13px] font-bold border border-[#00aa6c]/50 shadow-[0_0_16px_rgba(0,170,108,0.25)] hover:shadow-[0_0_22px_rgba(0,170,108,0.4)] transition-all cursor-pointer active:scale-95 shrink-0"
            >
              <Sparkles className="w-4 h-4 text-[#00aa6c]" />
              <span>Plan with AI</span>
            </button>
          </div>

          {/* ━━━ 3. CENTER / RIGHT NAV LINKS ━━━ */}
          <div className="hidden md:flex items-center gap-1.5">
            <button
              onClick={scrollToDestinations}
              className={`px-3.5 py-2 text-[14px] font-semibold rounded-full transition-colors cursor-pointer ${
                activeTab === 'destinations'
                  ? 'text-[#002b11] font-bold bg-slate-100'
                  : 'text-slate-700 hover:text-[#002b11] hover:bg-slate-50'
              }`}
            >
              Destinations
            </button>
            <Link
              href="/map"
              onClick={() => setActiveTab('map')}
              className={`px-3.5 py-2 text-[14px] font-semibold rounded-full transition-colors ${
                activeTab === 'map'
                  ? 'text-[#002b11] font-bold bg-slate-100'
                  : 'text-slate-700 hover:text-[#002b11] hover:bg-slate-50'
              }`}
            >
              Map
            </Link>
            <Link
              href="/about"
              className="px-3.5 py-2 text-[14px] font-semibold text-slate-700 hover:text-[#002b11] hover:bg-slate-50 rounded-full transition-colors"
            >
              About
            </Link>
          </div>

          {/* ━━━ 4. RIGHT CONTROLS: [USD] [Wishlist] [Solid Black Sign in Pill] ━━━ */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Currency Selector */}
            <CurrencySelector scrolled={true} />

            {/* Saved Wishlist Heart */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="relative p-2 sm:p-2.5 rounded-full text-slate-700 hover:text-rose-600 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="View Saved Destinations"
              title="Saved places"
            >
              <Heart
                className={`w-5 h-5 transition-transform hover:scale-110 ${
                  savedCount > 0 ? 'fill-rose-500 text-rose-500' : ''
                }`}
              />
              {savedCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                  {savedCount > 9 ? '9+' : savedCount}
                </span>
              )}
            </button>

            {/* Customer Sign In / Account Dropdown */}
            {!user ? (
              <button
                type="button"
                onClick={() => openAuthModal('signin')}
                className="hidden sm:inline-flex items-center justify-center px-5 py-2 rounded-full font-bold text-xs sm:text-sm bg-[#002b11] hover:bg-[#001f0c] text-white shadow-xs transition-all active:scale-95 cursor-pointer shrink-0"
              >
                Sign in
              </button>
            ) : (
              <div ref={userMenuRef} className="relative hidden sm:block">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200/80 text-[#002b11] text-xs sm:text-[13px] font-bold border border-slate-200 transition-all cursor-pointer active:scale-95"
                >
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-[#00aa6c]/50"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#00aa6c] text-white flex items-center justify-center text-[11px] font-black">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {/* Dropdown Card */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    </div>

                    <div className="py-1">
                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false);
                          setIsDrawerOpen(true);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#00aa6c] flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <Heart className="w-3.5 h-3.5" />
                        <span>Saved Places ({savedCount})</span>
                      </button>

                      {user.role === 'admin' && (
                        <Link
                          href="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-700 flex items-center gap-2.5 transition-colors"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Admin Portal</span>
                        </Link>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Plan with AI Pill */}
            <button
              type="button"
              onClick={openAiModal}
              className="lg:hidden p-2 rounded-full text-emerald-800 bg-emerald-50 border border-emerald-200"
              aria-label="Plan with AI"
            >
              <Sparkles className="w-4 h-4 text-[#00aa6c]" />
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation menu"
              className="md:hidden p-2 rounded-xl text-slate-800 hover:bg-slate-100 cursor-pointer"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ━━━ TIER 2: TRIPADVISOR SUB-NAV ROW (Appears on scroll - exact match to user screenshot) ━━━ */}
        {scrolled && (
          <div className="border-t border-slate-100 py-2.5 overflow-x-auto no-scrollbar flex items-center gap-6 sm:gap-8 text-xs sm:text-[13px] font-bold text-slate-600 animate-in fade-in slide-in-from-top-1 duration-200">
            <button
              type="button"
              onClick={() => handleSubCategoryClick('Mountains')}
              className="hover:text-[#002b11] transition-colors cursor-pointer shrink-0"
            >
              Things to Do
            </button>
            <button
              type="button"
              onClick={() => handleSubCategoryClick('Beaches')}
              className="hover:text-[#002b11] transition-colors cursor-pointer shrink-0"
            >
              Hotels & Beaches
            </button>
            <button
              type="button"
              onClick={() => handleSubCategoryClick('Historical')}
              className="hover:text-[#002b11] transition-colors cursor-pointer shrink-0"
            >
              Restaurants & Food
            </button>
            <button
              type="button"
              onClick={() => handleSubCategoryClick('Mountains')}
              className="hover:text-[#002b11] transition-colors cursor-pointer shrink-0"
            >
              Highlands & Tea
            </button>
            <button
              type="button"
              onClick={() => handleSubCategoryClick('Ancient Sites')}
              className="hover:text-[#002b11] transition-colors cursor-pointer shrink-0"
            >
              Ancient Citadels
            </button>
            <button
              type="button"
              onClick={() => handleSubCategoryClick('Wildlife')}
              className="hover:text-[#002b11] transition-colors cursor-pointer shrink-0"
            >
              Safaris
            </button>
            <button
              type="button"
              onClick={() => handleSubCategoryClick('Hidden Gems')}
              className="hover:text-[#002b11] transition-colors cursor-pointer shrink-0"
            >
              Hidden Gems
            </button>
          </div>
        )}

        {/* ━━━ MOBILE DROPDOWN MENU ━━━ */}
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-100 py-3.5 space-y-1.5 bg-white animate-in slide-in-from-top-2 duration-200">
            <button
              onClick={openAiModal}
              className="w-full text-left px-3.5 py-3 rounded-2xl font-bold text-sm bg-emerald-50 text-emerald-950 border border-emerald-200/80 flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#00aa6c]" />
                <span>Plan with Ceylon AI</span>
              </span>
              <span className="text-[11px] bg-emerald-200/70 text-emerald-900 font-bold px-2 py-0.5 rounded-full">New</span>
            </button>

            <button
              onClick={scrollToDestinations}
              className="w-full text-left px-3.5 py-2.5 rounded-xl font-bold text-sm text-slate-800 hover:bg-slate-50 flex items-center justify-between"
            >
              <span>Destinations</span>
              <span className="text-xs text-[#00aa6c] font-semibold">Explore</span>
            </button>
            <Link
              href="/map"
              onClick={() => setMobileOpen(false)}
              className="w-full text-left px-3.5 py-2.5 rounded-xl font-bold text-sm text-slate-800 hover:bg-slate-50 flex items-center justify-between"
            >
              <span>Interactive Map</span>
              <span className="text-xs text-slate-400">9 Provinces</span>
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileOpen(false)}
              className="w-full text-left px-3.5 py-2.5 rounded-xl font-bold text-sm text-slate-800 hover:bg-slate-50 flex items-center justify-between"
            >
              <span>About Serandib Co.</span>
            </Link>
            <div className="pt-2 px-1">
              {!user ? (
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    openAuthModal('signin');
                  }}
                  className="w-full inline-flex items-center justify-center py-2.5 rounded-full bg-[#002b11] text-white font-bold text-xs shadow-xs cursor-pointer active:scale-95"
                >
                  Sign in / Create Account
                </button>
              ) : (
                <div className="space-y-2 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2.5">
                    {user.image ? (
                      <img src={user.image} alt={user.name} className="w-8 h-8 rounded-full object-cover ring-1 ring-[#00aa6c]" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#00aa6c] text-white flex items-center justify-center text-xs font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    {user.role === 'admin' && (
                      <Link
                        href="/admin"
                        onClick={() => setMobileOpen(false)}
                        className="flex-1 py-1.5 px-3 rounded-xl bg-slate-200/80 text-[11px] font-bold text-slate-800 text-center"
                      >
                        Admin Portal
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setMobileOpen(false);
                        logout();
                      }}
                      className="flex-1 py-1.5 px-3 rounded-xl bg-rose-50 text-rose-600 text-[11px] font-bold text-center cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
