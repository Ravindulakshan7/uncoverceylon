"use client";

import { FoodDishItem } from '@/data/foodsData';
import { useWishlist } from '@/context/WishlistContext';
import GuideDetail from './GuideDetail';

export default function FoodDetailClient({ dish, relatedDishes }: { dish: FoodDishItem; relatedDishes: FoodDishItem[] }) {
  const { isFoodSaved, toggleFoodWishlist } = useWishlist();
  return <GuideDetail
    title={dish.title} category={dish.cuisine} image={dish.img} description={dish.desc} locations={dish.locations}
    collection={{ label: 'Food & flavors', href: '/food' }}
    facts={[{ label: 'Spice level', value: dish.spice }, { label: 'Meal', value: dish.meal }, { label: 'Serving', value: dish.serving }, { label: 'Typical price', value: dish.price }]}
    sections={[{ title: 'About this dish', text: dish.heritage }]}
    highlightsTitle="Variations" highlights={dish.varieties}
    practical={[{ title: 'Ingredients', text: dish.ingredients }, { title: 'How to eat & order', text: dish.howToEat }]}
    saved={isFoodSaved(dish.id)} onSave={() => toggleFoodWishlist(dish.id, dish.title)}
    related={relatedDishes.map(item => ({ title: item.title, image: item.img, href: `/food/${item.id}`, caption: item.cuisine }))}
  />;
}
