import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import styles from './HomeWelcome.module.css';

interface InterestsSectionProps {
  counts?: { destinations?: string; food?: string; culture?: string; experiences?: string };
}

export default function InterestsSection({ counts }: InterestsSectionProps) {
  const items = [
    {
      id: 'destinations',
      title: 'Destinations',
      sub: 'Trails, tea hills & wild escapes',
      count: counts?.destinations || '60+ places',
      image: 'https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?auto=format&fit=crop&w=900&q=80',
      href: '/destinations',
    },
    {
      id: 'food',
      title: 'Food',
      sub: 'Rice & curry, hoppers, street eats',
      count: counts?.food || '98 places',
      image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=900&q=80',
      href: '/food',
    },
    {
      id: 'culture',
      title: 'Culture',
      sub: 'Temples, citadels & ancient legends',
      count: counts?.culture || '76 places',
      image: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=900&q=80',
      href: '/culture',
    },
    {
      id: 'experiences',
      title: 'Experiences',
      sub: 'Surf breaks, lagoons & quiet bays',
      count: counts?.experiences || '124 places',
      image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=900&q=80',
      href: '/experiences',
    },
  ];

  return <section id="interests" className={styles.interests}>
    <div className={styles.container}>
      <div className={styles.interestHeader}><div><p className={styles.eyebrow}>UNCOVER CEYLON BY INTEREST</p><h2>One island.<br /><em>Your kind of journey.</em></h2></div><p>Follow what draws you in. A place to wander, a new flavour, a story to discover or something you have never tried.</p></div>
      <div className={styles.interestGrid}>{items.map((item, index) => <Link key={item.id} href={item.href} className={styles.interestCard}><div className={styles.interestImage}><Image src={item.image} alt={item.title} fill sizes="(max-width: 700px) 50vw, 300px" unoptimized className={styles.interestPhoto} /><span className={styles.imageNumber}>0{index + 1}</span><span className={styles.cardArrow}><ArrowUpRight size={19} /></span></div><div className={styles.interestMeta}><h3>{item.title}</h3><span>{item.count}</span></div><p>{item.sub}</p></Link>)}</div>
    </div>
  </section>;
}
