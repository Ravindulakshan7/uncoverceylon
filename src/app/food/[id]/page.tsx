import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { FOODS_DATA, FoodDishItem } from '@/data/foodsData';
import { prisma } from '@/lib/db';
import FoodDetailClient from '@/components/FoodDetailClient';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * Resolve dish by integer id, slug, or matching title
 */
async function resolveDish(idParam: string): Promise<FoodDishItem | null> {
  const numId = parseInt(idParam, 10);
  const normalizedSlug = idParam.toLowerCase().trim();

  // 1. Check database first so admin edits & new dishes are live immediately
  try {
    const dbFood = await prisma.foodItem.findFirst({
      where: !isNaN(numId)
        ? { OR: [{ id: numId }, { slug: normalizedSlug }] }
        : { OR: [{ slug: normalizedSlug }, { title: { equals: idParam, mode: 'insensitive' } }] },
    });

    if (dbFood) {
      let parsedVarieties: FoodDishItem['varieties'] = [];
      if (dbFood.varieties) {
        try {
          const parsed = typeof dbFood.varieties === 'string' ? JSON.parse(dbFood.varieties) : dbFood.varieties;
          if (Array.isArray(parsed) && parsed.length > 0) {
            parsedVarieties = parsed;
          }
        } catch {
          parsedVarieties = [];
        }
      }

      if (!parsedVarieties || parsedVarieties.length === 0) {
        parsedVarieties = [{ name: dbFood.title, tag: dbFood.badge || 'Classic', desc: dbFood.desc }];
      }

      return {
        id: dbFood.id,
        slug: dbFood.slug || dbFood.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title: dbFood.title,
        tagline: dbFood.tagline || 'Authentic Sri Lankan Taste',
        sub: dbFood.locations || dbFood.regions || 'Sri Lanka',
        tag: dbFood.tag || 'curry',
        cuisine: dbFood.cuisine || dbFood.badge || 'Sri Lankan',
        meal: dbFood.meal || 'Lunch / Dinner',
        price: dbFood.price || 'LKR 400 – LKR 1,200',
        spice: dbFood.spice || 'Medium to Fiery',
        serving: dbFood.serving || 'Traditional Service',
        locations: dbFood.locations || dbFood.regions || 'Island-wide',
        img: dbFood.image || 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=1000&q=85',
        seed: `food-${dbFood.id}`,
        desc: dbFood.desc,
        heritage: dbFood.heritage || dbFood.desc,
        varieties: parsedVarieties,
        ingredients: dbFood.ingredients || 'Fresh local herbs, Ceylon curry powders, coconut extracts, and natural spices.',
        howToEat: dbFood.howToEat || 'Enjoy fresh and warm with traditional accompaniments. Pair with fresh King Coconut water or Ceylon tea.',
      };
    }
  } catch (err) {
    console.error('Error fetching food from database:', err);
  }

  // 2. Fallback to curated static FOODS_DATA
  if (!isNaN(numId)) {
    const foundById = FOODS_DATA.find((f) => f.id === numId);
    if (foundById) return foundById;
  }

  const foundBySlug = FOODS_DATA.find((f) => f.slug.toLowerCase() === normalizedSlug);
  if (foundBySlug) return foundBySlug;

  const foundByTitle = FOODS_DATA.find(
    (f) => f.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === normalizedSlug
  );
  if (foundByTitle) return foundByTitle;

  return null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const dish = await resolveDish(id);

  if (!dish) {
    return {
      title: 'Dish Not Found — Uncover Ceylon',
    };
  }

  const title = `${dish.title} — Authentic Sri Lankan Cuisine & Culinary Guide`;
  const description = `${dish.tagline}. ${dish.desc} Discover where to taste authentic ${dish.title} in Sri Lanka with local dining tips, heritage, and varieties.`;

  return {
    title,
    description,
    keywords: [
      dish.title,
      'Sri Lanka food',
      'Authentic Ceylon cuisine',
      dish.cuisine,
      dish.meal,
      ...dish.locations.split('·').map((s) => s.trim()),
      'Sri Lanka culinary travel guide',
    ],
    alternates: {
      canonical: `https://uncoverceylon.com/food/${dish.id}`,
    },
    openGraph: {
      title,
      description,
      url: `https://uncoverceylon.com/food/${dish.id}`,
      siteName: 'Uncover Ceylon',
      images: [
        {
          url: dish.img,
          width: 1200,
          height: 630,
          alt: dish.title,
        },
      ],
      locale: 'en_US',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [dish.img],
    },
  };
}

export default async function FoodDetailPage({ params }: PageProps) {
  const { id } = await params;
  const dish = await resolveDish(id);

  if (!dish) {
    notFound();
  }

  // Pick 3 related dishes
  const relatedDishes = FOODS_DATA.filter((f) => f.id !== dish.id).slice(0, 3);

  // Structured Data (JSON-LD)
  const jsonLdRecipe = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: dish.title,
    headline: dish.tagline,
    description: dish.desc,
    image: [dish.img],
    recipeCuisine: 'Sri Lankan',
    keywords: `${dish.title}, Sri Lankan food, Ceylon gastronomy`,
    recipeCategory: dish.meal || 'Main Course',
    author: {
      '@type': 'Organization',
      name: 'Uncover Ceylon',
      url: 'https://uncoverceylon.com',
    },
  };

  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://uncoverceylon.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Food & Flavors',
        item: 'https://uncoverceylon.com/food',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: dish.title,
        item: `https://uncoverceylon.com/food/${dish.id}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdRecipe) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <FoodDetailClient dish={dish} relatedDishes={relatedDishes} />
    </>
  );
}
