import Link from 'next/link';
import Image from 'next/image';
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

  return (
    <section id="interests" className={styles.interests}>
      <div className={styles.container}>
        <div className={styles.interestHeader}>
          <div>
            <p className={styles.eyebrow}>UNCOVER CEYLON BY INTEREST</p>
            <h2>
              One island.<br />
              <em>Your kind of journey.</em>
            </h2>
          </div>
          <p>
            Follow what draws you in. A place to wander, a new flavour, a story to discover or something you have never tried.
          </p>
        </div>

        {/* ━━━ Cards with numbers and arrows removed; title & info moved inside box with white font ━━━ */}
        <div className={styles.interestGrid}>
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="group block overflow-hidden rounded-[20px] transition-transform duration-300 hover:-translate-y-1.5 focus:outline-none"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] bg-[#dfe4d4] shadow-sm">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 700px) 50vw, 300px"
                  unoptimized
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.3,1)] group-hover:scale-105"
                />

                {/* Dark gradient for crisp text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />

                {/* Content placed inside the box with pure white font */}
                <div className="absolute bottom-0 inset-x-0 p-3.5 sm:p-5 z-10 text-white flex flex-col justify-end">
                  <div className="flex items-baseline justify-between gap-1.5 mb-1">
                    <h3 className="text-lg sm:text-[22px] font-extrabold tracking-tight text-white leading-tight">
                      {item.title}
                    </h3>
                    <span className="text-[10px] sm:text-xs font-bold text-white/85 bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full whitespace-nowrap">
                      {item.count}
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-white/85 font-medium line-clamp-2 leading-relaxed">
                    {item.sub}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
