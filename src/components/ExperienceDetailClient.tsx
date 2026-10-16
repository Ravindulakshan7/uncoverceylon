"use client";

import { IslandExperienceItem } from '@/data/experiencesData';
import { useWishlist } from '@/context/WishlistContext';
import GuideDetail from './GuideDetail';

export default function ExperienceDetailClient({ item, relatedItems }: { item: IslandExperienceItem; relatedItems: IslandExperienceItem[] }) {
  const { isExpSaved, toggleExpWishlist } = useWishlist();
  return <GuideDetail
    title={item.title} category={item.categoryLabel} image={item.img} description={item.desc} locations={item.locations}
    collection={{ label: 'Experiences', href: '/experiences' }}
    facts={[{ label: 'Best season', value: item.season }, { label: 'Difficulty', value: item.difficulty }, { label: 'Best time', value: item.timing }, { label: 'Typical cost', value: item.entryInfo }]}
    sections={[{ title: 'What to expect', text: item.heritage }, { title: 'Local knowledge', text: item.ancientRoots }]}
    highlightsTitle="Places & highlights" highlights={item.varieties}
    practical={[{ title: 'What to bring', text: item.gearChecklist }, { title: 'Safety & local guidelines', text: item.localSafetyTips }]}
    saved={isExpSaved(item.id)} onSave={() => toggleExpWishlist(item.id, item.title)}
    related={relatedItems.map(rel => ({ title: rel.title, image: rel.img, href: `/experiences/${rel.id}`, caption: rel.locations }))}
  />;
}
