'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, ArrowUp, MapPin, Mail, ExternalLink } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-slate-950 text-slate-300 pt-20 pb-12 border-t border-white/5 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 pb-16 border-b border-white/5">
          
          {/* Brand Column (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              {/* TripAdvisor-style Binocular / Compass Icon */}
              <div className="flex items-center shrink-0">
                <svg
                  className="w-7 h-7 text-white transition-transform group-hover:scale-105"
                  viewBox="0 0 36 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="11" cy="18" r="9" stroke="white" strokeWidth="3" />
                  <circle cx="11" cy="18" r="4.5" fill="#00aa6c" />
                  <circle cx="11" cy="18" r="2" fill="white" />
                  <circle cx="25" cy="18" r="9" stroke="white" strokeWidth="3" />
                  <circle cx="25" cy="18" r="4.5" fill="#00aa6c" />
                  <circle cx="25" cy="18" r="2" fill="white" />
                  <path d="M17 14C17.5 12.5 18.5 12.5 19 14" stroke="white" strokeWidth="2.8" strokeLinecap="round" />
                  <path d="M7 10L10 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M29 10L26 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <span className="font-black text-2xl tracking-[-0.03em] text-white block leading-none">
                  Uncoverceylon
                </span>
                <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-slate-500 mt-1 block">
                  Sri Lanka Travel Guide
                </span>
              </div>
            </Link>

            <p className="text-slate-400 text-[14px] leading-relaxed max-w-sm">
              Your premier, open-access travel guide to Sri Lanka. Discover secluded coastal bays, sacred mountain trails, misty tea highlands, and centuries-old cultural monuments.
            </p>

            <div className="flex items-center gap-3 pt-2">
              {/* Facebook SVG */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 hover:border-[#00aa6c]/50 hover:bg-[#00aa6c]/15 text-slate-400 hover:text-[#00aa6c] flex items-center justify-center transition-all duration-200"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                </svg>
              </a>

              {/* X / Twitter SVG */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 hover:border-[#00aa6c]/50 hover:bg-[#00aa6c]/15 text-slate-400 hover:text-[#00aa6c] flex items-center justify-center transition-all duration-200"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* Instagram SVG */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 hover:border-[#00aa6c]/50 hover:bg-[#00aa6c]/15 text-slate-400 hover:text-[#00aa6c] flex items-center justify-center transition-all duration-200"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* YouTube SVG */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 hover:border-[#00aa6c]/50 hover:bg-[#00aa6c]/15 text-slate-400 hover:text-[#00aa6c] flex items-center justify-center transition-all duration-200"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Explore Column */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-5 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#00aa6c]" />
              <span>Explore</span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/#destinations" className="text-sm text-slate-400 hover:text-[#00aa6c] transition-colors">
                  All Destinations
                </Link>
              </li>
              <li>
                <Link href="/?category=Beaches#destinations" className="text-sm text-slate-400 hover:text-[#00aa6c] transition-colors">
                  Beaches & Coastlines
                </Link>
              </li>
              <li>
                <Link href="/?category=Mountains#destinations" className="text-sm text-slate-400 hover:text-[#00aa6c] transition-colors">
                  Highland Peaks & Ella
                </Link>
              </li>
              <li>
                <Link href="/?category=Waterfalls#destinations" className="text-sm text-slate-400 hover:text-[#00aa6c] transition-colors">
                  Secret Cascades
                </Link>
              </li>
              <li>
                <Link href="/map" className="text-sm text-slate-400 hover:text-[#00aa6c] transition-colors flex items-center gap-1.5">
                  <span>Interactive Map</span>
                  <ExternalLink className="w-3 h-3 text-slate-600" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Discover Column */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-5 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#00aa6c]" />
              <span>Discover</span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/?category=Ancient+Sites#destinations" className="text-sm text-slate-400 hover:text-[#00aa6c] transition-colors">
                  Ancient Kingdoms
                </Link>
              </li>
              <li>
                <Link href="/?category=Wildlife#destinations" className="text-sm text-slate-400 hover:text-[#00aa6c] transition-colors">
                  Wildlife & Safaris
                </Link>
              </li>
              <li>
                <Link href="/?category=Hidden+Gems#destinations" className="text-sm text-slate-400 hover:text-[#00aa6c] transition-colors">
                  Hidden Gems
                </Link>
              </li>
              <li>
                <Link href="/?category=Historical#destinations" className="text-sm text-slate-400 hover:text-[#00aa6c] transition-colors">
                  Colonial Fortresses
                </Link>
              </li>
              <li>
                <Link href="/?category=Religious+Places#destinations" className="text-sm text-slate-400 hover:text-[#00aa6c] transition-colors">
                  Sacred Temples
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Column */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-5">
              Platform
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-sm text-slate-300 hover:text-[#00aa6c] font-medium transition-colors flex items-center gap-1.5">
                  <span>About Us</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#00aa6c]/20 text-emerald-300 border border-[#00aa6c]/30">Serandib Co.</span>
                </Link>
              </li>
              <li>
                <Link href="/map" className="text-sm text-slate-400 hover:text-[#00aa6c] transition-colors">
                  Satellite Map View
                </Link>
              </li>
              <li>
                <Link href="/#destinations" className="text-sm text-slate-400 hover:text-[#00aa6c] transition-colors">
                  Top Rated Highlights
                </Link>
              </li>
              <li>
                <span className="text-xs text-slate-500 block pt-2">
                  Official tourism guide data curated by local island explorers.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="flex items-center gap-1.5">
            © {new Date().getFullYear()} UncoverCeylon. Handcrafted with{' '}
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Sri Lanka travelers.
          </p>

          <div className="flex items-center gap-6">
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
            >
              <span>Back to top</span>
              <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:border-slate-700 transition-colors">
                <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
