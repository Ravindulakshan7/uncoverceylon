import Image from 'next/image';

/** The supplied U / palm / surfer artwork, shared by every branded surface. */
export default function BrandMark({ className = 'h-10 w-10', surface = false, priority = false }: { className?: string; surface?: boolean; priority?: boolean }) {
  return <span className={`relative inline-flex shrink-0 items-center justify-center ${surface ? 'rounded-xl bg-[#F5F3EC] p-1.5' : ''} ${className}`}>
    <Image src="/brand/uncover-ceylon.png" alt="Uncover Ceylon logo" width={512} height={512} priority={priority} className="block h-full w-full object-contain" />
  </span>;
}
