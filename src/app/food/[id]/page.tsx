import { prisma } from '@/lib/db';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Utensils,
  Flame,
  Clock,
  MapPin,
  ArrowLeft,
  ChevronRight,
  Coffee,
  CheckCircle2,
  DollarSign,
  Heart,
  Share2,
  Compass,
  ArrowRight
} from 'lucide-react';
import { Metadata } from 'next';
import FoodAccordionSections from '@/components/FoodAccordionSections';
import { Place } from '@/types';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ id: string }>;
}

const FALLBACK_FOODS = [
  {
    id: 1,
    title: 'Village Rice & Curry',
    tagline: '7-Curry Clay Pot Feast',
    desc: 'Slow-cooked in clay pots over cinnamon wood. Fragrant red rice served with jackfruit polos curry, tempered dhal, coconut pol sambol, and crispy papadum.',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=80',
    badge: 'Must Try',
    regions: 'Island-wide • Matale • Ella',
  },
  {
    id: 2,
    title: 'Midnight Kottu Roti',
    tagline: 'The Sound of Sri Lankan Nights',
    desc: 'The rhythmic clatter of metal blades slicing godamba roti, fresh vegetables, eggs, and rich spicy chicken or cheese curry on a sizzling hot plate.',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=1200&q=80',
    badge: 'Street Icon',
    regions: 'Colombo • Galle Face • Kandy',
  },
  {
    id: 3,
    title: 'Jaffna & Coastal Seafood',
    tagline: 'Fiery Crab & Ocean Grills',
    desc: 'World-renowned Jaffna crab curry infused with roasted curry powder, moringa leaves, and coconut milk, alongside fresh catch grilled right on the beach.',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1200&q=80',
    badge: 'Seafood',
    regions: 'Jaffna • Negombo • Mirissa',
  },
  {
    id: 4,
    title: 'Crispy Hoppers (Appa)',
    tagline: 'Bowl-Shaped Coconut Pancakes',
    desc: 'Crisp lacy golden edges with a soft, pillowy coconut center. Enjoyed plain, with a runny steamed egg, and fiery lunu miris onion relish.',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=80',
    badge: 'Breakfast & Dinner',
    regions: 'All Provinces',
  },
  {
    id: 5,
    title: 'Highland Ceylon Tea',
    tagline: 'The World’s Finest Brew',
    desc: 'Handpicked two leaves and a bud from misty mountains above 1,800m. Golden liquor with subtle floral notes, served with traditional English cake.',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    badge: 'Highland Heritage',
    regions: 'Nuwara Eliya • Kandy • Ella',
  },
  {
    id: 6,
    title: 'Curd & Kithul Treacle',
    tagline: 'Ancient Natural Sweetness',
    desc: 'Rich, thick water buffalo curd poured with smoky, amber-gold sweet nectar tapped from wild highland Kithul palm trees. A centuries-old dessert.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
    badge: 'Ancient Sweet',
    regions: 'Ruhuna • Tissamaharama • Wellawaya',
  },
];

// Rich culinary dossier dictionary
const CULINARY_DOSSIERS: Record<string, {
  sinhalaName: string;
  spiceLevel: string;
  spiceRating: number;
  mealTime: string;
  servingStyle: string;
  culturalStory: string;
  historicalRoots: string;
  ingredients: { name: string; detail: string }[];
  elements: { title: string; desc: string; tag: string }[];
  eatingTips: { heading: string; advice: string }[];
  pairing: string;
  priceExpectation: string;
}> = {
  'village rice & curry': {
    sinhalaName: 'ගමේ බත් සහ වෑංජන (Game Bath & Malu)',
    spiceLevel: 'Balanced to Fiery (Customizable)',
    spiceRating: 3,
    mealTime: 'Lunch (12:00 PM – 2:30 PM)',
    servingStyle: 'Earthen Terracotta Clay Pots on Banana Leaf',
    culturalStory:
      'In traditional Sri Lankan village culture, cooking rice and curry is a slow, sacred craft. The hearth is fueled by aged cinnamon and rubber firewood, transferring a subtle smoky wood aroma into earthen terracotta clay pots called "Mati Walan". This natural porous clay gently circulates heat, tenderizing jackfruit and spices while preserving delicate antioxidants. A typical midday spread features nutritious unpolished red raw rice (Rathu Kakulu) accompanied by 5 to 7 contrasting curries representing bitter, sweet, salty, sour, pungent, and astringent Ayurvedic tastes.',
    historicalRoots:
      'Dating back over two millennia to the hydraulic agrarian kingdoms of Anuradhapura and Polonnaruwa, heirloom rice varieties were cultivated alongside fragrant wild jungle herbs and spices native strictly to the island.',
    ingredients: [
      { name: 'Red Raw Rice (Rathu Kakulu)', detail: 'Nutrient-rich, fiber-packed heirloom paddy rice slow-steamed to perfection.' },
      { name: 'Tender Jackfruit (Polos)', detail: 'Baby green jackfruit slow-cooked for 6 hours until it develops a meaty, savory texture.' },
      { name: 'Coconut Milk (Kiri Hodi)', detail: 'Freshly squeezed first & second extract from ripe coconut meat for creamy curries.' },
      { name: 'Ceylon Cinnamon & Karapincha', detail: 'True Ceylon sweet cinnamon bark and aromatic curry leaves freshly plucked from the garden.' },
      { name: 'Parippu (Red Lentils)', detail: 'Creamy dhal tempered with sliced shallots, mustard seeds, turmeric, and garlic.' },
      { name: 'Pol Sambol', detail: 'Fiery freshly grated coconut ground on a granite grinding stone (Miris Gala) with red chili, lime, and salt.' },
    ],
    elements: [
      { title: 'Polos Ambula', desc: 'The crown jewel of vegetarian curries: tender young jackfruit slow-simmered with roasted spices and dried Goraka.', tag: 'Signature' },
      { title: 'Creamy Parippu (Dhal)', desc: 'Smooth, tempered red split lentils cooked in golden turmeric and thick coconut milk.', tag: 'Comfort' },
      { title: 'Fresh Pol Sambol', desc: 'Hand-scraped coconut pounded with shallots, dried red chilies, crushed black pepper, and fresh lime.', tag: 'Fiery' },
      { title: 'Wambatu Moju', desc: 'Deep-fried caramelized baby eggplant relish glazed with coconut vinegar, mustard seed paste, and wild honey.', tag: 'Sweet & Sour' },
      { title: 'Gotu Kola Mallum', desc: 'Finely shredded Asiatic pennywort herb lightly warmed with freshly grated coconut and crushed sea salt.', tag: 'Herbaceous' },
      { title: 'Crispy Papadam', desc: 'Sun-dried wafer-thin lentil rounds flash-fried in hot coconut oil until bubbly and golden crisp.', tag: 'Crunch' },
    ],
    eatingTips: [
      { heading: 'Eat with Your Right Hand', advice: 'Locals universally eat rice and curry with their fingertips. Gently blend small portions of rice with curry gravies to experience the balanced temperature and multi-layered textures.' },
      { heading: 'Start from Mild to Spicy', advice: 'Begin by tasting the milder coconut dhal and vegetable curries before blending in the fiery pol sambol and spicy village chicken or fish gravy.' },
      { heading: 'Ask for "Extra Hodi"', advice: 'When dining at local village food stalls ("Kamatha" or "Kade"), ask friendly servers for extra aromatic curry gravy ("Hodi") poured over your rice.' },
    ],
    pairing: 'Fresh golden King Coconut water (Thambili) straight from the nut, followed by a cup of hot Ceylon ginger tea.',
    priceExpectation: 'LKR 450 – LKR 1,200 ($1.50 – $4.00) in authentic wayside rice and curry boutiques.',
  },
  'midnight kottu roti': {
    sinhalaName: 'කොත්තු රොටි (Kottu Rotti)',
    spiceLevel: 'Fiery & Sizzling Heat',
    spiceRating: 4,
    mealTime: 'Dinner & Late Night (7:00 PM – 3:00 AM)',
    servingStyle: 'Sizzling Hot Flat Plate with Fresh Lime & Gravy',
    culturalStory:
      'Kottu Roti is the undisputed anthem of Sri Lankan nocturnal life. The distinct, rhythmic metal-on-steel clatter of twin blunt cleavers echoing through tropical night air signals a street cook chopping unleavened Godamba roti with cabbage, leeks, onions, scrambled eggs, and fragrant roast meat on a scorching iron griddle. Beyond its mouthwatering flavor, kottu is performance art—every street chef plays their own distinct musical beat that keeps crowds gathered on warm city sidewalks.',
    historicalRoots:
      'Born as a clever, delicious street food invention in Eastern and Western coastal trading cities to transform leftover flaky roti and savory meat curries into a hearty midnight feast for night-shift workers and travelers.',
    ingredients: [
      { name: 'Godamba Roti', detail: 'Thin, elastic layered flatbread shredded into tender bite-sized ribbons on the hot griddle.' },
      { name: 'Roast Curry Gravy (Hodi)', detail: 'Deep red, highly concentrated aromatic curry sauce infused with cardamom and chili oil.' },
      { name: 'Farm Eggs & Vegetables', detail: 'Shredded white cabbage, fresh leeks, carrots, purple shallots, and farm eggs scrambled directly in.' },
      { name: 'Meat or Dutch Gouda / Cheese', detail: 'Spiced chicken, tender beef, fresh calamari, or generous blocks of melting cheese.' },
      { name: 'Green Chillies & Lime', detail: 'Finely sliced bird’s eye green chilies tossed in for fresh heat, finished with lime wedges.' },
    ],
    elements: [
      { title: 'Chicken or Mutton Kottu', desc: 'The all-time classic: tender bone-in spiced meat tossed with piping-hot roti ribbons and rich dark roast gravy.', tag: 'Classic' },
      { title: 'Creamy Cheese Kottu', desc: 'A modern Colombo late-night phenomenon drenched in melted cheese and cream to mellow the fiery chili burn.', tag: 'Crowd Favorite' },
      { title: 'String Hopper Kottu (Idiyappam)', desc: 'Delicate steamed rice noodle patties sliced and wok-fried on the griddle for a lighter, fluffier texture.', tag: 'Delicate' },
      { title: 'Dolphin Kottu', desc: 'Larger, square-cut Godamba roti pieces bathed in extra spicy chicken gravy and sautéed onion capsicum strips.', tag: 'Savory' },
    ],
    eatingTips: [
      { heading: 'Specify Your Heat Preference', advice: 'Ask the cook for "Normal Spicy", "Mild", or if you are daring, "Local Extra Spicy".' },
      { heading: 'Always Ask for Separate Gravy', advice: 'Street vendors will happily provide an extra bowl of hot "Kottu Hodi" so you can moisten every bite to your liking.' },
      { heading: 'Follow the Iced Milo Ritual', advice: 'Cool down your palate like a true Sri Lankan by pairing late-night kottu with an ice-cold chocolate Milo drink.' },
    ],
    pairing: 'Ice-cold bottled chocolate Milo, ginger beer (EGB), or fresh lime soda.',
    priceExpectation: 'LKR 750 – LKR 1,800 ($2.50 – $6.00) depending on choice of chicken, seafood, or double cheese.',
  },
  'jaffna & coastal seafood': {
    sinhalaName: 'යාපනයේ කකුළු කරිය (Jaffna Kakulu Curry)',
    spiceLevel: 'Volcanic, Peppery & Aromatic',
    spiceRating: 5,
    mealTime: 'Lunch & Sunset Ocean Dinner',
    servingStyle: 'Large Terracotta Bowl with Crackers & Roast Paan',
    culturalStory:
      'The northern peninsula of Jaffna has developed one of South Asia’s most distinctive, fiery culinary legacies. Jaffna Crab Curry is revered by food connoisseurs worldwide. Big sweet mud crabs harvested from pristine shallow coastal lagoons are simmered in thick coconut milk, roasted dark curry powder, dried red chilies, and fresh Murunga (moringa) leaves. The sweet, tender claw meat absorbs the complex northern spices, creating a rich mahogany gravy that begs to be mopped up with crusty woodfired bread.',
    historicalRoots:
      'Grounded in northern Tamil traditions dating back centuries, relying on wild coastal ingredients, dark roasted curry powders, sour tamarind pulp, and fragrant palmyrah jaggery.',
    ingredients: [
      { name: 'Lagoon Mud Crab', detail: 'Sweet, meaty wild blue or green lagoon crabs freshly caught by coastal fishermen.' },
      { name: 'Jaffna Roasted Curry Powder', detail: 'Coriander, cumin, fennel, and black peppercorns dry-roasted until deeply mahogany and aromatic.' },
      { name: 'Murunga (Moringa) Leaves', detail: 'Fresh moringa tree leaves added to balance seafood heat and provide earthy mineral notes.' },
      { name: 'Thick Coconut Milk', detail: 'Creamy freshly pressed coconut milk that mellows the sharp northern chili heat.' },
      { name: 'Goraka & Tamarind Pulp', detail: 'Tart natural fruit pastes that infuse sharp tanginess and tenderize the crab meat.' },
    ],
    elements: [
      { title: 'Jaffna Crab Curry', desc: 'World-famous lagoon crab bathed in dark roasted Northern spices, black pepper, and moringa leaves.', tag: 'Legendary' },
      { title: 'Negombo Devilled Prawns', desc: 'Jumbo tiger prawns flash-fried in a fiery, sweet-and-sour wok sauce with crunchy bell peppers and leeks.', tag: 'Sweet & Spicy' },
      { title: 'Mirissa Grilled Seer Fish', desc: 'Fresh deep-sea Spanish mackerel steak grilled over hot beach coals with garlic lime butter.', tag: 'Ocean Fresh' },
      { title: 'Spicy Calamari (Dello) Roast', desc: 'Tender ocean squid rings dry-roasted with caramelised shallots, curry leaves, and crushed chilies.', tag: 'Appetizer' },
    ],
    eatingTips: [
      { heading: 'Roll Up Your Sleeves', advice: 'Crab eating is hands-on and wonderfully messy. Use metal claw crackers and your fingers to extract succulent claw meat.' },
      { heading: 'The Roast Paan Pairing', advice: 'Never eat Jaffna crab curry without traditional woodfired "Roast Paan" (crusty triangular bakery bread) to mop up the rich, dark gravy.' },
      { heading: 'Watch the Spice Level', advice: 'Northern curries feature unbridled black pepper and toasted bird’s eye chili. Sip water or fresh lime soda slowly.' },
    ],
    pairing: 'Steaming triangular woodfired Roast Paan, hot coconut sambol, and fresh King Coconut water.',
    priceExpectation: 'LKR 1,800 – LKR 4,800 ($6.00 – $16.00) based on crab size and fresh daily ocean catch.',
  },
  'crispy hoppers (appa)': {
    sinhalaName: 'ආප්ප (Appa / Aappam)',
    spiceLevel: 'Mild Pancakes with Spicy Condiments',
    spiceRating: 2,
    mealTime: 'Breakfast (7:00 AM) & Twilight Dinner (6:30 PM – 9:30 PM)',
    servingStyle: 'Wok-Shaped Crisp Shell on Rattan Plate',
    culturalStory:
      'Hoppers are an architectural culinary marvel. A light batter of fermented rice flour, rich coconut milk, and a splash of coconut water is ladled into a piping-hot, wok-shaped miniature pan called an "Appa Thachchiya". The cook expertly tilts and swivels the pan with both wrists in a fluid circle: the outer rim crisps into paper-thin, golden lacy frills, while the center pools into a soft, pillowy, cloud-like sponge.',
    historicalRoots:
      'An ancient southern staple mentioned in historic chronicles, fermented overnight using wild coconut sap (toddy) to create a naturally bubbly, subtly sour sourdough delicacy.',
    ingredients: [
      { name: 'Fermented Rice Flour Batter', detail: 'White rice flour fermented with coconut water or yeast for airy lightness.' },
      { name: 'Thick Coconut Milk', detail: 'Fresh coconut cream ladled into the center to form a creamy, velvety core.' },
      { name: 'Farm Fresh Egg', detail: 'Whole farm egg cracked directly into the center and steamed until the yolk is softly runny.' },
      { name: 'Lunu Miris', detail: 'Fiery crushed paste of red chili flakes, red onions, Maldive fish flakes, and fresh lime.' },
      { name: 'Seeni Sambol', detail: 'Sweet, caramelized slow-cooked onion relish spiced with cinnamon, cardamom, and tamarind.' },
    ],
    elements: [
      { title: 'Egg Hopper (Biththara Appa)', desc: 'Whole sunny-side egg steamed right inside the pillowy coconut bowl center, sprinkled with black pepper.', tag: 'Must Try' },
      { title: 'Plain Hopper (Kiri Appa)', desc: 'Ultra-crisp golden lace edges surrounding a fluffy, steamed coconut milk sponge center.', tag: 'Classic' },
      { title: 'Sweet Milk Hopper (Pani Appa)', desc: 'Coconut milk center enriched with warm golden Kithul palm treacle for an indulgent sweet breakfast.', tag: 'Sweet' },
      { title: 'String Hoppers (Idiyappam)', desc: 'Delicate steamed nests of pressed rice flour vermicelli served alongside coconut gravy.', tag: 'Companion' },
    ],
    eatingTips: [
      { heading: 'How to Eat an Egg Hopper', advice: 'Break off the crispy golden lace edges and dip them into the runny egg yolk and spicy lunu miris.' },
      { heading: 'Balance Sweet & Fiery', advice: 'Pair spicy Lunu Miris with sweet caramelized Seeni Sambol to enjoy the full spectrum of Sri Lankan flavors.' },
      { heading: 'Eat Fresh from the Pan', advice: 'Hoppers must be enjoyed piping hot within 2 minutes of coming off the pan while the lace edges remain crisp.' },
    ],
    pairing: 'Hot sweetened Ceylon milk tea and fresh papaya slices.',
    priceExpectation: 'LKR 80 – LKR 220 ($0.25 – $0.75) per hopper.',
  },
  'highland ceylon tea': {
    sinhalaName: 'උඩරට තේ (Highland Ceylon The)',
    spiceLevel: 'Delicate, Floral & Citrus Nuances',
    spiceRating: 1,
    mealTime: 'Morning Refreshment & Afternoon High Tea (3:30 PM – 5:30 PM)',
    servingStyle: 'Porcelain Teapot & Delicate China Cups',
    culturalStory:
      'Perched high in the mist-veiled central highlands above 1,800 meters, cool mountain breezes, sharp morning sunshine, and mineral-rich soils combine to create the finest orthodox tea on the planet. Experienced estate pickers still hand-pluck only "two leaves and a bud" from manicured emerald bushes. The leaves are gently withered, rolled in historic British brass rollers, oxidized, and fired into glossy black tea leaves that brew a sparkling golden amber cup with natural citrus and floral undertones.',
    historicalRoots:
      'In 1867, Scottish planter James Taylor planted the first commercial camellia sinensis tea plants on the Loolecondera estate in Kandy, forever transforming Ceylon into the tea capital of the world.',
    ingredients: [
      { name: 'Two Leaves & A Bud', detail: 'Tender uppermost tea shoots handpicked from high-altitude bushes in Nuwara Eliya and Dimbula.' },
      { name: 'Natural Mountain Spring Water', detail: 'Pure high-altitude spring water boiled fresh to unlock optimal floral liquor extraction.' },
      { name: 'Optional Highland Dairy Milk', detail: 'Rich pasture milk from high mountain dairy farms around Ambewela and Nuwara Eliya.' },
      { name: 'Optional Wild Kithul Jaggery', detail: 'Sweet crystallized blocks of palm nectar bitten between sips of strong unsweetened black tea.' },
    ],
    elements: [
      { title: 'Orange Pekoe (OP)', desc: 'Whole, wiry tea leaves producing a light golden liquor with exquisite delicate floral perfume.', tag: 'High Altitude' },
      { title: 'Broken Orange Pekoe (BOP)', desc: 'Finely cut tea leaves brewing a rich, deep amber cup with invigorating robust strength.', tag: 'Breakfast Classic' },
      { title: 'Silver Tips (White Tea)', desc: 'Rare, handpicked velvety tea buds dried purely under mountain sunlight; zero oxidation.', tag: 'Artisanal Luxury' },
      { title: 'Ginger Infused Spiced Tea', desc: 'Strong highland black tea boiled with crushed fresh ginger root and aromatic cardamoms.', tag: 'Warming' },
    ],
    eatingTips: [
      { heading: 'Steep for Precisely 3–4 Minutes', advice: 'Do not over-steep high-grown Ceylon tea; let the aromatic orthodox leaves unfurl in boiling water for 3 to 4 minutes.' },
      { heading: 'The Jaggery Technique', advice: 'Drink black BOP tea without sugar in the cup; instead, place a small piece of natural Kithul jaggery on your tongue and sip the hot tea through it.' },
      { heading: 'Experience Colonial High Tea', advice: 'Book an afternoon tea sitting at The Grand Hotel in Nuwara Eliya featuring warm butter scones and strawberry jam.' },
    ],
    pairing: 'Freshly baked warm scones with clotted cream, British fruitcake, or savory short eats.',
    priceExpectation: 'LKR 300 – LKR 1,500 ($1.00 – $5.00) in heritage colonial tea lounges and estate bungalows.',
  },
  'curd & kithul treacle': {
    sinhalaName: 'මී කිරි සහ කිතුල් පැණි (Mee Kiri & Kithul Pani)',
    spiceLevel: 'Silky Creamy Tart & Smoky Sweet',
    spiceRating: 1,
    mealTime: 'Post-Meal Dessert & Refreshment',
    servingStyle: 'Shallow Earthen Terracotta Pot (Kiri Hattiya)',
    culturalStory:
      'The quintessential dessert of the dry southern plains of Ruhuna. Fresh milk from free-roaming water buffaloes (which boasts double the butterfat of cows’ milk) is strained, gently boiled, and poured into unglazed terracotta clay dishes called "Kiri Hatti". The porous clay absorbs excess moisture, allowing natural lactic bacteria to set the milk into a thick, luxuriously velvety, tart curd with no artificial gelatins or sugars. To serve, generous amber ribbons of smoky Kithul palm treacle—tapped high in the forest canopies from wild Fishtail Palms—are poured over the top.',
    historicalRoots:
      'Centuries of southern pastoral tradition in Tissamaharama, Hambantota, and Wellawaya have passed down this timeless dessert, cited in ancient royal banquets.',
    ingredients: [
      { name: 'Water Buffalo Milk (Mee Kiri)', detail: 'Pure, rich whole milk with 8-10% natural butterfat, creating an ultra-thick natural curd.' },
      { name: 'Pure Kithul Treacle (Kithul Pani)', detail: 'Smoky, viscous amber syrup slow-boiled from the tapped sap of highland Caryota urens palms.' },
      { name: 'Porous Terracotta Clay Pot', detail: 'Breathable unglazed earthen dish that maintains ideal fermentation humidity.' },
    ],
    elements: [
      { title: 'Traditional Clay Pot Mee Kiri', desc: 'Thick, creamy water buffalo curd set firmly inside earthen dishes, served cold or at room temperature.', tag: 'Heritage' },
      { title: 'Wild Forest Kithul Treacle', desc: '100% natural, unadulterated treacle with a distinct smoky, woody, caramel bouquet.', tag: 'Wild Nectar' },
      { title: 'Shredded Kithul Jaggery Garnish', desc: 'Solid crystalline chunks of palm sugar shaved atop the curd for delightful crunchy texture.', tag: 'Texture' },
    ],
    eatingTips: [
      { heading: 'Pour Treacle Generously', advice: 'The natural curd is pleasantly tart and acidic; pour abundant amber kithul treacle so every spoonful balances sweet and tart.' },
      { heading: 'How to Identify Real Treacle', advice: 'Authentic kithul treacle is deep amber-brown, smoothly viscous, and never crystallizes into white sugar grains.' },
      { heading: 'Roadside Stalls in the South', advice: 'When driving through Tissamaharama or Wellawaya, look for roadside stands with pyramids of clay pots stacked under thatched eaves.' },
    ],
    pairing: 'Fresh sweet tropical fruits like golden Cavendish bananas, papaya, or warm spiced tea.',
    priceExpectation: 'LKR 350 – LKR 850 ($1.20 – $2.80) for a full clay pot serving for two.',
  },
};

async function getFoodItem(idStr: string) {
  const numId = parseInt(idStr, 10);
  if (!isNaN(numId)) {
    try {
      const dbItem = await prisma.foodItem.findUnique({
        where: { id: numId },
      });
      if (dbItem) return dbItem;
    } catch (e) {
      console.error('Error fetching food item from DB:', e);
    }
    const fallback = FALLBACK_FOODS.find((f) => f.id === numId);
    if (fallback) return fallback;
  }

  // Fallback by slug/title search
  const found = FALLBACK_FOODS.find(
    (f) =>
      f.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === idStr.toLowerCase()
  );
  if (found) return found;

  return null;
}

async function getOtherFoods(currentId: number) {
  try {
    const list = await prisma.foodItem.findMany({
      where: { id: { not: currentId } },
      take: 3,
      orderBy: { sort_order: 'asc' },
    });
    if (list.length > 0) return list;
  } catch {}
  return FALLBACK_FOODS.filter((f) => f.id !== currentId).slice(0, 3);
}

async function getMatchingDestinations(regionsStr: string): Promise<Place[]> {
  try {
    const tokens = (regionsStr || '')
      .split(/[•,–-]/)
      .map((t) => t.trim())
      .filter((t) => t.length > 2 && t.toLowerCase() !== 'all provinces' && t.toLowerCase() !== 'island-wide');

    const orClauses = tokens.map((tok) => ({
      OR: [
        { location: { contains: tok, mode: 'insensitive' as const } },
        { province: { contains: tok, mode: 'insensitive' as const } },
        { name: { contains: tok, mode: 'insensitive' as const } },
      ],
    }));

    let raw: any[] = [];
    if (orClauses.length > 0) {
      raw = await prisma.place.findMany({
        where: { OR: orClauses.flat() },
        orderBy: { rating: 'desc' },
        take: 3,
      });
    }

    if (raw.length === 0) {
      raw = await prisma.place.findMany({
        where: { featured: 1 },
        orderBy: { rating: 'desc' },
        take: 3,
      });
    }

    return raw.map((p) => ({
      ...p,
      created_at: p.created_at instanceof Date ? p.created_at.toISOString() : String(p.created_at || new Date().toISOString()),
    })) as Place[];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const food = await getFoodItem(id);
  if (!food) {
    return { title: 'Food Item Not Found — Uncover Ceylon' };
  }

  const title = `${food.title} — Authentic Sri Lankan Recipe, Flavors & Food Guide`;
  const description = `${food.tagline}. ${food.desc} Discover where to taste authentic ${food.title} in Sri Lanka with local dining tips and history.`;

  return {
    title,
    description,
    keywords: [
      food.title,
      'Sri Lanka food',
      'Authentic Ceylon dishes',
      food.badge,
      ...food.regions.split('•').map((s) => s.trim()),
      'Sri Lanka culinary travel guide',
    ],
    alternates: {
      canonical: `https://uncoverceylon.com/food/${food.id}`,
    },
    openGraph: {
      title,
      description,
      url: `https://uncoverceylon.com/food/${food.id}`,
      siteName: 'Uncover Ceylon',
      images: [
        {
          url: food.image,
          width: 1200,
          height: 630,
          alt: food.title,
        },
      ],
      locale: 'en_US',
      type: 'article',
    },
  };
}

export default async function FoodDetailPage({ params }: PageProps) {
  const { id } = await params;
  const food = await getFoodItem(id);

  if (!food) {
    notFound();
  }

  const dossierKey = food.title.toLowerCase();
  const dossier =
    CULINARY_DOSSIERS[dossierKey] || {
      sinhalaName: food.title,
      spiceLevel: 'Rich & Flavorful',
      spiceRating: 3,
      mealTime: 'Lunch & Dinner',
      servingStyle: 'Authentic Local Service',
      culturalStory: food.desc,
      historicalRoots: 'A cherished culinary heritage passed down through generations across the island.',
      ingredients: [
        { name: 'Pure Coconut Milk', detail: 'Fresh coconut milk pressed daily for rich creamy curries.' },
        { name: 'Island Spices', detail: 'True Ceylon cinnamon, crushed black pepper, and toasted curry powder.' },
        { name: 'Fresh Aromatics', detail: 'Curry leaves (karapincha), pandan (rampe), and fresh shallots.' },
      ],
      elements: [
        { title: food.title, desc: food.desc, tag: food.badge || 'Iconic' },
      ],
      eatingTips: [
        { heading: 'Taste with Local Accompaniments', advice: 'Enjoy with warm rice, fresh sambols, or hot bread for the most authentic experience.' },
        { heading: 'Ask Locals for Recommendations', advice: 'Small family-run restaurants and roadside eateries often serve the freshest, most traditional recipes.' },
      ],
      pairing: 'Fresh King Coconut water or hot Ceylon tea.',
      priceExpectation: 'LKR 500 – LKR 1,500 ($1.80 – $5.00).',
    };

  const [matchingDestinations, otherFoods] = await Promise.all([
    getMatchingDestinations(food.regions),
    getOtherFoods(food.id),
  ]);

  const jsonLdRecipe = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: food.title,
    headline: food.tagline,
    description: food.desc,
    image: [food.image],
    recipeCuisine: 'Sri Lankan',
    keywords: `${food.title}, Sri Lankan food, Ceylon gastronomy`,
    recipeCategory: 'Main Course',
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
        name: food.title,
        item: `https://uncoverceylon.com/food/${food.id}`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#fcfdfd] text-slate-900 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdRecipe) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />

      {/* ━━━ Breadcrumb Bar ━━━ */}
      <div className="bg-[#0f1b2d] border-b border-slate-800 text-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between text-xs">
          <nav className="flex items-center gap-2 overflow-x-auto">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <Link href="/food" className="hover:text-white transition-colors">
              Food & Flavors
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-emerald-400 font-bold truncate max-w-[200px] sm:max-w-none">
              {food.title}
            </span>
          </nav>

          <Link
            href="/food"
            className="hidden sm:inline-flex items-center gap-1.5 text-slate-300 hover:text-white font-bold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Dishes</span>
          </Link>
        </div>
      </div>

      {/* ━━━ HERO HEADER ━━━ */}
      <section className="relative bg-[#0f1b2d] text-white overflow-hidden isolate pb-14 sm:pb-20 pt-8 sm:pt-12">
        <div className="absolute inset-0 z-0 opacity-25">
          <Image
            src={food.image}
            alt={food.title}
            fill
            className="object-cover blur-sm scale-105"
            unoptimized
          />
        </div>
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#0f1b2d] via-[#0f1b2d]/85 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider border border-emerald-500/30">
                  {food.badge}
                </span>
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                  {dossier.sinhalaName}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                {food.title}
              </h1>

              <p className="text-amber-400 font-bold text-sm sm:text-lg">
                {food.tagline}
              </p>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
                {food.desc}
              </p>

              {/* Provenance and Regions */}
              <div className="pt-2 flex items-center gap-2 text-xs sm:text-sm text-slate-300">
                <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="font-semibold text-white">Popular Locations:</span>
                <span className="text-slate-300">{food.regions}</span>
              </div>
            </div>

            {/* Right Card / High Quality Image */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden border-2 border-white/15 shadow-2xl aspect-[4/3] w-full max-w-md mx-auto group">
                <Image
                  src={food.image}
                  alt={food.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  unoptimized
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                  <span className="font-bold flex items-center gap-1">
                    <Utensils className="w-3.5 h-3.5 text-emerald-400" />
                    Authentic Ceylon Recipe
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md font-semibold">
                    {dossier.mealTime.split(' ')[0]}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ━━━ QUICK FACTS BAR ━━━ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 bg-white rounded-2xl p-4 sm:p-5 shadow-xl border border-slate-100 overflow-hidden">
          
          {/* Fact 1: Spice Level */}
          <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50/80 border border-slate-100 flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
              <Flame className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 block truncate">
                Spice Intensity
              </span>
              <span className="text-xs sm:text-sm font-black text-slate-900 truncate block">
                {dossier.spiceLevel}
              </span>
            </div>
          </div>

          {/* Fact 2: Meal Time */}
          <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50/80 border border-slate-100 flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 block truncate">
                Best Meal Time
              </span>
              <span className="text-xs sm:text-sm font-black text-slate-900 truncate block">
                {dossier.mealTime.split('(')[0]?.trim() || dossier.mealTime}
              </span>
            </div>
          </div>

          {/* Fact 3: Service Method */}
          <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50/80 border border-slate-100 flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Utensils className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 block truncate">
                Traditional Serving
              </span>
              <span className="text-xs sm:text-sm font-black text-slate-900 truncate block" title={dossier.servingStyle}>
                {dossier.servingStyle.split('on')[0]?.trim() || dossier.servingStyle}
              </span>
            </div>
          </div>

          {/* Fact 4: Estimated Cost */}
          <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50/80 border border-slate-100 flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 block truncate">
                Price Expectation
              </span>
              <span className="text-xs sm:text-sm font-black text-slate-900 truncate block" title={dossier.priceExpectation}>
                {dossier.priceExpectation.split('(')[0]?.trim() || dossier.priceExpectation}
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* ━━━ MAIN DOSSIER BODY ━━━ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Main Left Column */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Story & Heritage */}
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-sm space-y-6">
              <div className="inline-flex items-center gap-2 text-emerald-700 text-xs font-black uppercase tracking-wider">
                <Compass className="w-4 h-4 text-emerald-600" />
                <span>Culinary History & Heritage</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                The Heritage Story of {food.title}
              </h2>

              <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-normal">
                {dossier.culturalStory}
              </p>

              <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/60 text-slate-800 text-sm leading-relaxed flex items-start gap-3">
                <Coffee className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-amber-950 font-bold mb-1">
                    Ancient Roots:
                  </strong>
                  {dossier.historicalRoots}
                </div>
              </div>
            </div>

            {/* Collapsible Dropdown Sections (Anatomy, Ingredients, Local Guide) */}
            <FoodAccordionSections
              elements={dossier.elements}
              ingredients={dossier.ingredients}
              eatingTips={dossier.eatingTips}
              pairing={dossier.pairing}
            />

          </div>

          {/* Right Sticky Sidebar */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            
            {/* Quick Summary Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md space-y-5">
              <div className="relative h-44 rounded-2xl overflow-hidden">
                <Image
                  src={food.image}
                  alt={food.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-black">
                    {food.badge}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900">
                  {food.title}
                </h3>
                <p className="text-xs text-amber-700 font-bold mt-0.5">
                  {food.tagline}
                </p>
              </div>

              <div className="space-y-2 text-xs border-y border-slate-100 py-4">
                <div className="flex justify-between">
                  <span className="text-slate-500">Spice Level:</span>
                  <span className="font-bold text-slate-800">{dossier.spiceLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Best Time:</span>
                  <span className="font-bold text-slate-800">{dossier.mealTime.split(' ')[0]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Est. Price:</span>
                  <span className="font-bold text-emerald-700">{dossier.priceExpectation.split('(')[0]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Regions:</span>
                  <span className="font-bold text-slate-800 truncate max-w-[150px]">{food.regions}</span>
                </div>
              </div>

              <div className="space-y-2.5">
                <Link
                  href="/destinations"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#00aa6c] hover:bg-[#008f5a] text-white font-bold px-4 py-3 rounded-xl text-xs sm:text-sm shadow-md transition-all active:scale-95"
                >
                  <Compass className="w-4 h-4" />
                  <span>Explore Travel Destinations</span>
                </Link>

                <Link
                  href="/food"
                  className="w-full inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Food & Flavors</span>
                </Link>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ━━━ MORE FLAVORS OF CEYLON ━━━ */}
      {otherFoods.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 pt-16 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-[#00aa6c] text-xs font-black uppercase tracking-wider block mb-1">
                Continue Tasting Ceylon
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                More Iconic Island Dishes
              </h2>
            </div>
            <Link
              href="/food"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
            >
              <span>View All 6 Food Pillars</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {otherFoods.map((item, idx) => (
              <Link
                key={item.id || idx}
                href={`/food/${item.id}`}
                className="group rounded-3xl bg-white border border-slate-200/90 hover:border-emerald-500/40 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer block"
              >
                <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    unoptimized
                  />
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#0f1b2d] text-xs font-black shadow-md">
                      {item.badge}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 block">
                      {item.tagline}
                    </span>
                    <h3 className="text-base font-black text-slate-900 mt-1 group-hover:text-emerald-700 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed mt-1 line-clamp-2">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span className="truncate">{item.regions}</span>
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-bold group-hover:translate-x-1 transition-transform flex-shrink-0">
                      View <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
