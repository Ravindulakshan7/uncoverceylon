"use client";

import { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowDown, ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, MapPin, Star, Sun, Train, Compass } from 'lucide-react';
import type { TopDestination } from './TopDestinationsSection';
import TravelerReviewsSection from './TravelerReviewsSection';
import styles from './HomeDiscovery.module.css';

type Province = { name: string; count: number; image: string; placeName: string };
const routes = [
  { days: '3', title: 'A little time in the hills', subtitle: 'Slow mornings. Tea country. A window seat.', stops: ['Kandy', 'Nuwara Eliya', 'Ella'], description: 'Take the scenic way through the hill country, with time for tea estates, short walks and a train journey.', kind: 'Hill country' },
  { days: '5', title: 'Follow the southern coast', subtitle: 'Salt air, surf breaks and days without a rush.', stops: ['Galle', 'Weligama', 'Mirissa', 'Hiriketiya'], description: 'Wander the fort, find your favourite beach and spend a few days along the southern coast.', kind: 'Coastal escape' },
  { days: '7', title: 'Your first island journey', subtitle: 'A little culture. A little adventure. A little coast.', stops: ['Colombo', 'Sigiriya', 'Kandy', 'Ella', 'Galle'], description: 'Start with the Cultural Triangle, head into the hills, then finish by the sea. A starting point to make your own.', kind: 'Island highlights' },
  { days: '10', title: 'Room to explore a little more', subtitle: 'Ancient cities, open landscapes and the ocean.', stops: ['Negombo', 'Anuradhapura', 'Sigiriya', 'Ella', 'Yala', 'Mirissa'], description: 'Connect the ancient capitals with the hill country, a national park and the south coast. Leave room for travel between stops.', kind: 'The longer way round' },
];
const provinceNotes: Record<string, string> = {
  Southern: 'Fort streets & days by the sea', Central: 'Tea country & ancient landmarks', Uva: 'Railway journeys & mountain walks', Eastern: 'Surf breaks & open beaches', Western: 'City life & coastal stops', 'North Central': 'Ancient cities & sacred places', Northern: 'Jaffna & the northern islands', 'North Western': 'Lagoons & coastal landscapes', Sabaragamuwa: 'Rainforest trails & river valleys',
};
function Photo({ src, alt, sizes = '(max-width: 700px) 100vw, 50vw' }: { src: string; alt: string; sizes?: string }) {
  const [failed, setFailed] = useState(false);
  return src && !failed ? <Image src={src} alt={alt} fill sizes={sizes} unoptimized onError={() => setFailed(true)} className={styles.photo} /> : <div className={styles.photoFallback}><Compass size={28} /><span>{alt}</span></div>;
}
function Eyebrow({ children }: { children: React.ReactNode }) { return <p className={styles.eyebrow}>{children}</p>; }

type FlavorItem = {
  id: number;
  title: string;
  cuisine?: string;
  badge?: string;
  desc: string;
  img?: string;
  image?: string;
};

export default function HomeDiscovery({
  destinations,
  provinces,
  flavors: propFlavors,
}: {
  destinations: TopDestination[];
  provinces: Province[];
  flavors?: FlavorItem[];
}) {
  const rail = useRef<HTMLDivElement>(null);
  const [routeIndex, setRouteIndex] = useState(2);
  const [coast, setCoast] = useState<'south' | 'east'>('south');
  const route = routes[routeIndex];
  const coastPhoto = destinations.find(place => /beach/i.test(place.tagline)) || destinations[0];
  const hillPhoto = provinces.find(province => province.name === 'Uva' && province.image) || provinces.find(province => province.name === 'Central');
  const flavors = propFlavors !== undefined ? propFlavors : [];
  return <div className={styles.discovery}>
    {!!destinations.length && <section id="top-destinations" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.sectionHead}><div><Eyebrow>TOP DESTINATIONS / SRI LANKA</Eyebrow><h2>Some places are<br /><em>just the beginning.</em></h2></div><div className={styles.headAside}><p>Find your way from familiar favourites to somewhere you never expected.</p><Link href="/destinations" className={styles.textLink}>All destinations <ArrowUpRight size={17} /></Link></div></div>
        <div ref={rail} className={styles.destinationRail}>
          {destinations.map((place) => <Link key={place.id} href={`/places/${place.id}`} className={styles.destinationCard}><div className={styles.destinationImage}><Photo src={place.image} alt={place.name} sizes="(max-width: 700px) 80vw, 350px" /></div><div className={styles.cardMeta}><span>{place.tagline}</span><span className={styles.rating}><Star size={12} />{place.rating.toFixed(1)}</span></div><h3>{place.name}</h3><p>{place.location}</p></Link>)}
        </div>
        <div className={styles.railFooter}><span>TOP DESTINATIONS / SRI LANKA</span><div className={styles.controls}><button aria-label="Previous destinations" onClick={() => rail.current?.scrollBy({ left: -370, behavior: 'smooth' })}><ChevronLeft size={18} /></button><button aria-label="Next destinations" onClick={() => rail.current?.scrollBy({ left: 370, behavior: 'smooth' })}><ChevronRight size={18} /></button></div></div>
      </div>
    </section>}

    <section id="map-banner" className={styles.routeBanner}><div className={`${styles.container} ${styles.routeBannerGrid}`}><div className={styles.routeIntro}><Eyebrow>SMALL ISLAND. MANY WAYS TO GO.</Eyebrow><h2>Let curiosity<br />lead the way.</h2><p>Pin a few favourites. See what is nearby. Build a journey around the things you love.</p><Link href="/map" className={styles.lightButton}>Explore the island map <ArrowUpRight size={18} /></Link><div className={styles.routeStats}><span><b>9</b> provinces to explore</span><span><b>One</b> island, your own pace</span></div></div><div className={styles.routePhoto}><Photo src={coastPhoto?.image || ''} alt={coastPhoto?.name || 'Sri Lanka'} /><div className={styles.routePhotoShade} /><div className={styles.mapCaption}><MapPin size={16} /><span>{coastPhoto?.name || 'Find your next stop'}</span></div><Link href="/map" className={styles.floatingNote}><span className={styles.noteIcon}><Compass size={22} /></span><span><small>A little less planning.</small><b>A little more exploring.</b></span><ArrowUpRight size={18} /></Link></div></div></section>

    <section className={styles.section} id="provinces"><div className={styles.container}><div className={styles.sectionHead}><div><Eyebrow>NINE PROVINCES. DIFFERENT PERSPECTIVES.</Eyebrow><h2>Get to know<br /><em>your kind of Sri Lanka.</em></h2></div><p className={styles.headAside}>From the northern peninsula to the southern shore, every region has a story of its own.</p></div><div className={styles.provinceLayout}><Link href={`/destinations?province=${encodeURIComponent('Central Province')}`} className={styles.provinceFeature}><Photo src={provinces.find(province => province.name === 'Central')?.image || coastPhoto?.image || ''} alt={provinces.find(province => province.name === 'Central')?.placeName || 'Central Province'} /><div className={styles.featureShade} /><div className={styles.provinceFeatureText}><Eyebrow>A DIFFERENT VIEW</Eyebrow><h3>Take the<br />scenic way.</h3><span>Discover Central Province <ArrowUpRight size={18} /></span></div></Link><div className={styles.provinceList}>{provinces.map((province, index) => <Link key={province.name} href={`/destinations?province=${encodeURIComponent(`${province.name} Province`)}`} className={styles.provinceRow}><span className={styles.provinceNumber}>{String(index + 1).padStart(2, '0')}</span><div><h3>{province.name}</h3><p>{provinceNotes[province.name]}</p></div><span className={styles.provinceCount}>{province.count ? `${province.count} places` : 'Explore'}</span><ArrowUpRight size={17} /></Link>)}</div></div></div></section>

    <section className={`${styles.section} ${styles.sandSection}`} id="itineraries"><div className={styles.container}><div className={styles.sectionHead}><div><Eyebrow>A STARTING POINT, NOT A SCHEDULE</Eyebrow><h2>Good journeys<br /><em>leave room to wander.</em></h2></div><p className={styles.headAside}>A few days or a little longer? Start with a route idea, then make it yours.</p></div><div className={styles.itineraryGrid}><div className={styles.itineraryPhoto}><Photo src={hillPhoto?.image || coastPhoto?.image || ''} alt={hillPhoto?.placeName || 'Explore the island'} /><span className={styles.photoLabel}>YOUR NEXT CHAPTER</span></div><div className={styles.itineraryContent}><div role="group" aria-label="Choose trip duration" className={styles.dayTabs}>{routes.map((item, index) => <button key={item.days} onClick={() => setRouteIndex(index)} aria-pressed={routeIndex === index} className={routeIndex === index ? styles.activeDay : ''}>{item.days} days</button>)}</div><div aria-live="polite" className={styles.routeContent}><Eyebrow>{route.kind}</Eyebrow><h3>{route.title}</h3><p>{route.description}</p><ol className={styles.stops}>{route.stops.map((stop, index) => <li key={stop}><span>{String(index + 1).padStart(2, '0')}</span>{stop}</li>)}</ol><Link href="/map" className={styles.darkButton}>Find these places on the map <ArrowUpRight size={17} /></Link></div></div></div></div></section>

    <section className={styles.section} id="seasons"><div className={`${styles.container} ${styles.seasonGrid}`}><div><Eyebrow>CHOOSE YOUR COAST</Eyebrow><h2>A good time<br /><em>to get away.</em></h2><p className={styles.bodyCopy}>The best coast for your trip changes with the seasons. Use this as a starting point and check the local forecast before you go.</p><Link href="/destinations?category=Beaches" className={styles.textLink}>Find your beach <ArrowUpRight size={17} /></Link></div><div className={styles.seasonPanel}><div role="group" aria-label="Choose a coast" className={styles.coastTabs}><button onClick={() => setCoast('south')} aria-pressed={coast === 'south'} className={coast === 'south' ? styles.activeCoast : ''}>South & west</button><button onClick={() => setCoast('east')} aria-pressed={coast === 'east'} className={coast === 'east' ? styles.activeCoast : ''}>East coast</button></div><div aria-live="polite" className={styles.seasonBody}><Sun size={34} strokeWidth={1} /><p className={styles.seasonMonths}>{coast === 'south' ? 'November — April' : 'May — September'}</p><h3>{coast === 'south' ? 'For days on the southern shore.' : 'For an east-coast escape.'}</h3><p>{coast === 'south' ? 'Explore Galle, Weligama and Mirissa during the generally drier part of the year along the south and west.' : 'Look towards Arugam Bay, Trincomalee and Nilaveli when planning a beach trip during these months.'}</p><div className={styles.seasonNote}>Seasonal guide · Weather and sea conditions vary.</div></div></div></div></section>

    {flavors.length > 0 && (
      <section className={`${styles.section} ${styles.foodSection}`} id="flavors"><div className={styles.container}><div className={styles.sectionHead}><div><Eyebrow>COME HUNGRY</Eyebrow><h2>A taste of<br /><em>life on the island.</em></h2></div><div className={styles.headAside}><p>Breakfast at a little local spot. Tea in the afternoon. Something worth stopping for.</p><Link href="/food" className={styles.textLink}>Explore food & flavours <ArrowUpRight size={17} /></Link></div></div><div className={styles.foodGrid}>{flavors.map((dish) => <Link href={`/food/${dish.id}`} key={dish.id} className={styles.foodCard}><div className={styles.foodImage}><Photo src={dish.img || dish.image || ''} alt={dish.title} sizes="(max-width: 700px) 90vw, 400px" /></div><div className={styles.foodMeta}><span>{dish.cuisine || dish.badge || 'Sri Lankan'}</span><ArrowUpRight size={18} /></div><h3>{dish.title}</h3><p>{dish.desc}</p></Link>)}</div></div></section>
    )}

    <div className={styles.reviews}><TravelerReviewsSection /></div>

    <section className={styles.section} id="travel-notes"><div className={styles.container}><div className={styles.sectionHead}><div><Eyebrow>BEFORE YOU SET OFF</Eyebrow><h2>A few things<br /><em>worth knowing.</em></h2></div><Link href="/experiences" className={styles.textLink}>Explore experiences <ArrowUpRight size={17} /></Link></div><div className={styles.notesGrid}>{[{ icon: Sun, title: 'Follow the seasons', text: 'Choose your coast around the time of year. Keep a little flexibility for rain, especially in the hills.' }, { icon: Train, title: 'Enjoy the journey', text: 'Leave time between stops. A train ride, a roadside tea break or a slower morning can be part of the trip.' }, { icon: Compass, title: 'Travel thoughtfully', text: 'Dress respectfully at sacred sites, give wildlife space and support local guides and small businesses.' }].map((note, index) => <div key={note.title} className={styles.travelNote}><div className={styles.noteTop}><note.icon size={24} strokeWidth={1.3} /><span>0{index + 1}</span></div><h3>{note.title}</h3><p>{note.text}</p></div>)}</div></div></section>
    <section className={styles.closing}><div className={styles.container}><Eyebrow>THE ISLAND IS WAITING</Eyebrow><div className={styles.closingRow}><h2>Where will you<br /><em>go first?</em></h2><Link href="/destinations" className={styles.lightButton}>Find your next destination <ArrowRight size={18} /></Link></div></div><ArrowDown className={styles.closingArrow} size={150} strokeWidth={0.5} /></section>
  </div>;
}
