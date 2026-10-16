"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, ChevronDown, Heart, MapPin, Share2 } from 'lucide-react';

interface GuideDetailProps {
  title: string;
  category: string;
  image: string;
  description: string;
  locations: string;
  collection: { label: string; href: string };
  facts: { label: string; value: string }[];
  sections: { title: string; text?: string }[];
  highlightsTitle: string;
  highlights?: { name: string; tag: string; desc: string }[];
  practical: { title: string; text?: string }[];
  saved: boolean;
  onSave: () => void;
  related: { title: string; image: string; href: string; caption: string }[];
}

export default function GuideDetail({ title, category, image, description, locations, collection, facts, sections, highlightsTitle, highlights, practical, saved, onSave, related }: GuideDetailProps) {
  const [notice, setNotice] = useState('');
  const [failedImage, setFailedImage] = useState(false);

  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setNotice('Link copied');
      }
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) setNotice('Could not share this page. Please copy the address from your browser.');
    }
  };

  const save = (e: React.MouseEvent<HTMLButtonElement>) => {
    const willSave = !saved;
    onSave();
    setNotice(saved ? 'Removed from saved' : 'Saved for later');
    if (willSave && typeof window !== 'undefined') {
      const rect = e.currentTarget.getBoundingClientRect();
      window.dispatchEvent(
        new CustomEvent('fly-heart-to-nav', {
          detail: {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
          },
        })
      );
    }
  };

  return (
    <article className="min-h-screen bg-white text-[#202922]">
      <div className="mx-auto max-w-[1160px] px-5 sm:px-8 pb-16 sm:pb-24">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 py-6 sm:py-8 text-xs text-[#717870]">
          <Link href="/" className="hover:underline">Home</Link><span aria-hidden="true">/</span>
          <Link href={collection.href} className="hover:underline">{collection.label}</Link><span aria-hidden="true">/</span>
          <span aria-current="page" className="text-[#202922]">{title}</span>
        </nav>

        <header className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16 pb-10 sm:pb-12">
          <div className="space-y-5">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#657866]">{category}</p>
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-semibold leading-[1.08] tracking-[-0.045em]">{title}</h1>
            <p className="max-w-xl text-base leading-7 text-[#5f685f]">{description}</p>
            <p className="flex items-start gap-2 text-sm leading-6 text-[#697168]"><MapPin className="mt-1 h-4 w-4 shrink-0" />{locations}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button type="button" onClick={save} aria-pressed={saved} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#294e39] px-5 text-sm font-medium text-white hover:bg-[#1e3b2b] transition-colors"><Heart className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} />{saved ? 'Saved' : 'Save for later'}</button>
              <button type="button" onClick={share} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#dce1d9] px-4 text-sm font-medium hover:bg-[#f6f7f3] transition-colors"><Share2 className="h-4 w-4" />Share</button>
            </div>
            <p role="status" aria-live="polite" className="text-sm text-[#52694f] empty:hidden">{notice}</p>
          </div>
          <div className="relative aspect-[5/4] overflow-hidden rounded-xl bg-[#f1f3ee]">
            {!failedImage ? <Image src={image} alt={title} fill priority sizes="(max-width: 1024px) 100vw, 540px" unoptimized className="object-cover" onError={() => setFailedImage(true)} /> : <span className="absolute inset-0 flex items-center justify-center text-sm text-[#697168]">Photo unavailable</span>}
          </div>
        </header>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-7 rounded-xl border border-[#e4e7df] px-5 py-6 sm:grid-cols-4 sm:gap-8 sm:px-7">
          {facts.map(fact => <div key={fact.label} className="min-w-0"><dt className="mb-2 text-xs text-[#777e73]">{fact.label}</dt><dd className="text-sm font-medium leading-6 break-words">{fact.value}</dd></div>)}
        </dl>

        <div className="grid gap-12 pt-10 sm:pt-14 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-20 items-start">
          <div className="min-w-0 space-y-10 sm:space-y-12">
            {sections.filter(section => section.text).map(section => <section key={section.title}><h2 className="mb-4 text-xl sm:text-2xl font-semibold tracking-tight">{section.title}</h2><p className="whitespace-pre-line text-[15px] leading-7 text-[#5f685f]">{section.text}</p></section>)}
            {!!highlights?.length && <section><h2 className="mb-5 text-xl sm:text-2xl font-semibold tracking-tight">{highlightsTitle}</h2><div className="divide-y divide-[#e4e7df]">{highlights.map(item => <div key={item.name} className="py-5 first:pt-0"><div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1"><h3 className="text-base font-medium">{item.name}</h3><span className="text-xs text-[#7b8177]">{item.tag}</span></div><p className="text-sm leading-7 text-[#5f685f]">{item.desc}</p></div>)}</div></section>}
            <section aria-label="Practical information" className="border-t border-[#e4e7df]">
              {practical.filter(item => item.text).map((item, index) => <details key={item.title} open={index === 0} className="group border-b border-[#e4e7df] py-5"><summary className="flex list-none cursor-pointer items-center justify-between gap-5 text-base font-medium [&::-webkit-details-marker]:hidden">{item.title}<ChevronDown className="h-4 w-4 shrink-0 text-[#777e73] transition-transform group-open:rotate-180" /></summary><p className="pt-4 text-sm leading-7 whitespace-pre-line text-[#5f685f]">{item.text}</p></details>)}
            </section>
          </div>
          <aside className="lg:sticky lg:top-28 border-l-2 border-[#dce2d5] pl-5 py-1">
            <h2 className="mb-3 text-sm font-medium">Keep exploring</h2>
            <p className="mb-5 text-sm leading-6 text-[#737b6e]">Find more {collection.label.toLowerCase()} for your trip.</p>
            <Link href={collection.href} className="inline-flex items-center gap-2 text-sm font-medium text-[#294e39] hover:underline">Browse {collection.label.toLowerCase()}<ArrowUpRight className="h-4 w-4" /></Link>
            <Link href="/map" className="mt-4 flex items-center gap-2 text-sm text-[#697168] hover:underline">Explore the map<ArrowUpRight className="h-4 w-4" /></Link>
          </aside>
        </div>

        {!!related.length && <section className="mt-16 sm:mt-20 border-t border-[#e4e7df] pt-9"><div className="mb-6 flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl sm:text-2xl font-semibold tracking-tight">You might also like</h2><Link href={collection.href} className="text-sm text-[#52694f] hover:underline">View all</Link></div><div className="grid gap-7 sm:grid-cols-3">{related.map(item => <Link href={item.href} key={item.href} className="group"><div className="relative aspect-[3/2] rounded-lg overflow-hidden bg-[#f1f3ee]"><Image src={item.image} alt={item.title} fill sizes="(max-width: 640px) 100vw, 360px" unoptimized className="object-cover transition-opacity group-hover:opacity-90" /></div><h3 className="mt-4 text-base font-medium group-hover:underline">{item.title}</h3><p className="mt-1 text-sm leading-6 text-[#777e73]">{item.caption}</p></Link>)}</div></section>}
        <Link href={collection.href} className="mt-12 inline-flex items-center gap-2 text-sm text-[#697168] hover:underline"><ArrowLeft className="h-4 w-4" />Back to {collection.label.toLowerCase()}</Link>
      </div>
    </article>
  );
}
