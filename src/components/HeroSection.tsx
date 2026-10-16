'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowDown, ArrowUpRight, MapPin, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import styles from './HomeWelcome.module.css';

export interface HeroSlideData {
  id: number | string;
  image_url: string;
  location: string;
  province: string;
  sort_order?: number;
}

const SIGIRIYA_MAIN_SLIDE = {
  id: 'sigiriya-main',
  title: 'Sigiriya Rock Fortress',
  province: 'Central Province',
  image: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=2400&q=85',
};

const FALLBACK_SLIDES = [
  {
    id: 'nine-arch',
    title: 'Nine Arch Bridge, Ella',
    province: 'Uva Province',
    image: 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=2400&q=85',
  },
  {
    id: 'mirissa-hill',
    title: 'Coconut Tree Hill, Mirissa',
    province: 'Southern Coast',
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=2400&q=85',
  },
  {
    id: 'tea-country',
    title: 'Misty Tea Country, Nuwara Eliya',
    province: 'Central Highlands',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2400&q=85',
  },
  {
    id: 'galle-fort',
    title: 'Historic Galle Fort Lighthouse',
    province: 'Southern Coast',
    image: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=2400&q=85',
  },
];

interface HeroSectionProps {
  initialSlides?: HeroSlideData[];
}

export default function HeroSection({ initialSlides = [] }: HeroSectionProps) {
  const [dbSlides, setDbSlides] = useState<HeroSlideData[]>(initialSlides);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  // Fetch latest slides from admin-configured database endpoint
  useEffect(() => {
    fetch('/api/hero-slides')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.slides)) {
          setDbSlides(data.slides);
        }
      })
      .catch(() => {});
  }, []);

  // Compute carousel slides: Sigiriya Rock Fortress is ALWAYS #1 as required
  const slides = useMemo(() => {
    const additionalSlides =
      dbSlides.length > 0
        ? dbSlides
            .filter((s) => !s.location?.toLowerCase().includes('sigiriya'))
            .map((s) => ({
              id: s.id,
              title: s.location,
              province: s.province,
              image: s.image_url,
            }))
        : FALLBACK_SLIDES;

    return [SIGIRIYA_MAIN_SLIDE, ...additionalSlides];
  }, [dbSlides]);

  // Slide rotation timer
  useEffect(() => {
    if (slides.length <= 1 || paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = setInterval(() => {
      if (!document.hidden) setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length, paused]);

  const activeIndex = currentSlide % slides.length;
  const activeSlide = slides[activeIndex] || SIGIRIYA_MAIN_SLIDE;

  const scrollToInterests = () => {
    if (typeof window !== 'undefined') {
      const el = document.getElementById('interests') || document.getElementById('browse-mood');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section className={styles.heroWrap} aria-label="Welcome to Sri Lanka">
      <div className={styles.hero}>
        <div className={styles.slides} aria-hidden="true">
          {slides.map((place, index) => <div key={place.id} className={`${styles.slide} ${index === activeIndex ? styles.activeSlide : ''}`}><Image src={place.image} alt="" fill priority={index === 0} sizes="100vw" className={styles.heroPhoto} unoptimized /></div>)}
        </div>
        <div className={styles.shade} />
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>SRI LANKA TRAVEL GUIDE</p>
            <h1>Ayubowan</h1>
            <p className={styles.intro}>Discover Sri Lanka’s beaches, ancient cities and hill country — and plan a journey at your own pace.</p>
            <div className={styles.actions}><Link href="/destinations" className={styles.primary}>Explore Sri Lanka <ArrowUpRight size={18} /></Link><button type="button" onClick={scrollToInterests} className={styles.secondary}>Find your kind of journey <ArrowDown size={16} /></button></div>
          </div>
          <div className={styles.heroBottom}>
            <div className={styles.location}><MapPin size={16} strokeWidth={1.5} /><div><span>{activeSlide.title}</span><small>{activeSlide.province}</small></div></div>
            <div className={styles.slideControls}>
              <span className={styles.slideCount}>{String(activeIndex + 1).padStart(2, '0')}<span> / {String(slides.length).padStart(2, '0')}</span></span>
              <button type="button" aria-label="Previous hero photo" onClick={() => setCurrentSlide((activeIndex - 1 + slides.length) % slides.length)}><ChevronLeft size={18} /></button>
              <button type="button" aria-label="Next hero photo" onClick={() => setCurrentSlide((activeIndex + 1) % slides.length)}><ChevronRight size={18} /></button>
              <button type="button" aria-label={paused ? 'Play slideshow' : 'Pause slideshow'} onClick={() => setPaused(value => !value)}>{paused ? <Play size={13} /> : <Pause size={13} />}</button>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.welcomeLine}><span>GO SLOW. LOOK CLOSER. FEEL THE ISLAND.</span><span>SRI LANKA, AT YOUR OWN PACE <ArrowDown size={13} /></span></div>
    </section>
  );
}
