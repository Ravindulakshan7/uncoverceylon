"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, ChevronDown, Heart, Share2 } from 'lucide-react';

export interface GuideListItem {
  id: number;
  title: string;
  image: string;
  category: string;
  location: string;
  tag: string;
}
interface GuideExplorerProps {
  title: string;
  description: string;
  basePath: string;
  items: GuideListItem[];
  categories: { filter: string; label: string }[];
  isSaved: (id: number) => boolean;
  onSave: (id: number, title: string) => void;
}

function GuideCard({ item, href, saved, onSave, onShare }: { item: GuideListItem; href: string; saved: boolean; onSave: () => void; onShare: () => void }) {
  const [imageFailed, setImageFailed] = useState(false);
  return <article className="group min-w-0 overflow-hidden rounded-xl border border-[#e4e7df] bg-white transition-colors hover:border-[#b8c4b4]">
    <Link href={href} className="block">
      <div className="relative aspect-[3/2] overflow-hidden bg-[#f1f3ee]">
        {imageFailed ? <span className="absolute inset-0 flex items-center justify-center text-sm text-[#777e73]">Photo unavailable</span> : <Image src={item.image} alt={item.title} fill unoptimized sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px" className="object-cover transition-opacity group-hover:opacity-95" onError={() => setImageFailed(true)} />}
      </div>
      <div className="px-5 pt-5 pb-4">
        <p className="mb-2 text-xs text-[#778371]">{item.category}</p>
        <h2 className="text-lg font-medium leading-6 tracking-tight text-[#202922] group-hover:underline">{item.title}</h2>
        <p className="mt-2 text-sm leading-6 text-[#777e73]">{item.location}</p>
      </div>
    </Link>
    <div className="mx-5 flex items-center justify-between gap-2 border-t border-[#eef0e9] py-3">
      <Link href={href} aria-label={`Explore ${item.title}`} className="inline-flex min-h-10 items-center gap-1 text-sm font-medium text-[#36543c] hover:underline">Explore<ArrowUpRight className="h-3.5 w-3.5" /></Link>
      <div className="flex gap-1">
        <button type="button" onClick={onSave} aria-pressed={saved} aria-label={`${saved ? 'Unsave' : 'Save'} ${item.title}`} className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${saved ? 'bg-[#edf3e9] text-[#294e39]' : 'text-[#737d6c] hover:bg-[#f3f5ef]'}`}><Heart className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} /></button>
        <button type="button" onClick={onShare} aria-label={`Share ${item.title}`} className="flex h-10 w-10 items-center justify-center rounded-lg text-[#737d6c] hover:bg-[#f3f5ef] transition-colors"><Share2 className="h-4 w-4" /></button>
      </div>
    </div>
  </article>;
}

export default function GuideExplorer({ title, description, basePath, items, categories, isSaved, onSave }: GuideExplorerProps) {
  const [filter, setFilter] = useState('all');
  const [shown, setShown] = useState(12);
  const [notice, setNotice] = useState('');
  const filtered = items.filter(item => filter === 'all' || item.tag === filter);
  const share = async (item: GuideListItem) => {
    try {
      const url = `${window.location.origin}${basePath}/${item.id}`;
      if (navigator.share) await navigator.share({ title: item.title, url });
      else { await navigator.clipboard.writeText(url); setNotice('Link copied'); }
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) setNotice('Could not share this page. Open the guide and copy its address.');
    }
  };
  return <div className="bg-white text-[#202922] pb-16 sm:pb-24">
    <div className="mx-auto max-w-[1160px] px-5 sm:px-8">
      <header className="pt-9 sm:pt-14 pb-8 sm:pb-10">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.16em] text-[#657866]">Explore Sri Lanka</p>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-[-0.045em] leading-tight">{title}</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[#697168]">{description}</p>
      </header>
      <div className="rounded-xl border border-[#e4e7df] p-3 sm:p-4">
        <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
          {[{ filter: 'all', label: 'All' }, ...categories].map(category => {
            const active = filter === category.filter;
            const count = category.filter === 'all' ? items.length : items.filter(item => item.tag === category.filter).length;
            return <button type="button" key={category.filter} aria-pressed={active} onClick={() => { setFilter(category.filter); setShown(12); setNotice(''); }} className={`inline-flex min-h-10 items-center gap-2 rounded-lg px-3 sm:px-4 text-sm transition-colors ${active ? 'bg-[#294e39] text-white' : 'bg-white text-[#697168] hover:bg-[#f3f5ef]'}`}><span>{category.label}</span><span className={`text-xs ${active ? 'text-white/70' : 'text-[#92998c]'}`}>{count}</span></button>;
          })}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 py-6 text-xs text-[#81887b]">
        <p aria-live="polite">{filtered.length} {filtered.length === 1 ? 'guide' : 'guides'}{filter !== 'all' ? ` · ${categories.find(category => category.filter === filter)?.label}` : ''}</p>
        <p role="status" className="text-[#36543c]">{notice}</p>
      </div>
      <div className="grid items-start grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-x-7 sm:gap-y-8">
        {filtered.slice(0, shown).map(item => <GuideCard key={item.id} item={item} href={`${basePath}/${item.id}`} saved={isSaved(item.id)} onSave={() => { const saved = isSaved(item.id); onSave(item.id, item.title); setNotice(saved ? 'Removed from saved' : 'Saved for later'); }} onShare={() => share(item)} />)}
      </div>
      {!filtered.length && <p className="py-16 text-center text-sm text-[#697168]">No guides in this category yet.</p>}
      {shown < filtered.length && <div className="pt-10 text-center"><button type="button" onClick={() => setShown(count => count + 12)} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#dce1d9] px-6 text-sm font-medium text-[#36543c] hover:bg-[#f3f5ef]">Show more<ChevronDown className="h-4 w-4" /></button></div>}
    </div>
  </div>;
}
