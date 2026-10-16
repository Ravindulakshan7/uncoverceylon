"use client";

import { CultureHeritageItem } from '@/data/cultureData';
import { useWishlist } from '@/context/WishlistContext';
import GuideDetail from './GuideDetail';

export default function CultureDetailClient({ item, relatedItems }: { item: CultureHeritageItem; relatedItems: CultureHeritageItem[] }) {
  const { isCultureSaved, toggleCultureWishlist } = useWishlist();
  return <GuideDetail
    title={item.title} category={item.categoryLabel} image={item.img} description={item.desc} locations={item.locations}
    collection={{ label: 'Culture', href: '/culture' }}
    facts={[{ label: 'Best time to visit', value: item.timing }, { label: 'Period', value: item.epoch }, { label: 'Entry', value: item.entryInfo }, { label: 'Dress code', value: item.dressCode }]}
    sections={[{ title: 'History & background', text: item.heritage }, { title: 'Origins', text: item.ancientRoots }]}
    highlightsTitle="What to see" highlights={item.varieties}
    practical={[{ title: 'Architecture & details', text: item.architecturalElements }, { title: 'Before you visit', text: item.etiquetteTips }, { title: 'Conservation', text: item.preservation }]}
    saved={isCultureSaved(item.id)} onSave={() => toggleCultureWishlist(item.id, item.title)}
    related={relatedItems.map(rel => ({ title: rel.title, image: rel.img, href: `/culture/${rel.id}`, caption: rel.locations }))}
  />;
}
