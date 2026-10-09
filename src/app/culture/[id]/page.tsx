import { prisma } from '@/lib/db';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Landmark,
  Clock,
  MapPin,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Heart,
  Share2,
  Compass,
  ArrowRight
} from 'lucide-react';
import { Metadata } from 'next';
import CultureAccordionSections, {
  HighlightItem,
  EtiquetteItem,
  PracticalTipItem,
  NearbyAttractionItem,
} from '@/components/CultureAccordionSections';
import { Place } from '@/types';
import PlaceCard from '@/components/PlaceCard';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ id: string }>;
}

const FALLBACK_CULTURES = [
  {
    id: 1,
    slug: 'cultural-triangle',
    title: 'The Cultural Triangle',
    tagline: 'Ancient Sacred Kingdoms',
    desc: 'The golden triangle connecting Anuradhapura, Polonnaruwa, and Sigiriya. Colossal white stupas, rock-cut Buddhas, and sophisticated hydraulic engineering built over two millennia ago.',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80',
    badge: 'UNESCO Wonder',
    period: '5th Century BC – 13th Century AD',
  },
  {
    id: 2,
    slug: 'temple-of-the-tooth',
    title: 'Temple of the Sacred Tooth',
    tagline: 'Spiritual Heart of Ceylon',
    desc: 'Located by the misty lake of Kandy, Sri Dalada Maligawa houses the sacred relic of Lord Buddha. Daily drumming ceremonies and the grand illuminated Esala Perahera procession with regal tusker elephants.',
    image: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1200&q=80',
    badge: 'Living Tradition',
    period: 'Central Province • Kandy',
  },
  {
    id: 3,
    slug: 'galle-fort',
    title: 'Galle Fort Ramparts',
    tagline: 'Colonial Maritime Fortress',
    desc: 'Built by the Portuguese in 1588 and reinforced by the Dutch East India Company. Cobblestone alleyways lined with colonial villas, chic cafes, antique jewelers, and sunset ramparts meeting the ocean.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80',
    badge: 'Colonial Living',
    period: '16th – 18th Century • Southern Coast',
  },
  {
    id: 4,
    slug: 'dambulla-cave-temples',
    title: 'Dambulla Cave Temples',
    tagline: 'Cave Sanctuary of Gold',
    desc: 'Five sacred cave sanctuaries hollowed into a massive granite rock face, housing 153 gilded Buddha statues and 2,100 square meters of ancient ceiling murals that have survived over 2,000 years.',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    badge: 'Cave Murals',
    period: '1st Century BC • Matale',
  },
  {
    id: 5,
    slug: 'traditional-mask-carving',
    title: 'Traditional Mask Carving',
    tagline: 'Ancient Folklore & Healing',
    desc: 'In the coastal village of Ambalangoda, master craftsmen carve intricate wooden Raksha and Kolam masks from light Kaduru wood, painted with natural pigments for ancient healing devil dances.',
    image: 'https://images.unsplash.com/photo-1586611292717-1d4a1e5d3c9c?auto=format&fit=crop&w=1200&q=80',
    badge: 'Folk Art',
    period: 'Southern Coast • Ambalangoda',
  },
  {
    id: 6,
    slug: 'adams-peak',
    title: 'Sacred Adam’s Peak (Sri Pada)',
    tagline: 'The Pilgrimage Above Clouds',
    desc: 'A 2,243m sacred pyramid peak revered by Buddhists, Hindus, Muslims, and Christians alike. Thousands climb 5,500 lantern-lit steps in midnight darkness to witness the sacred triangular sunrise shadow.',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    badge: 'Sacred Pilgrimage',
    period: 'Sabaragamuwa Province',
  },
];

interface CultureDossier {
  sinhalaName: string;
  unescoStatus: string;
  bestVisitingTime: string;
  entryInfo: string;
  culturalStory: string;
  historicalRoots: string;
  highlights: HighlightItem[];
  etiquette: EtiquetteItem[];
  practicalTips: PracticalTipItem[];
  nearbyAttractions?: NearbyAttractionItem[];
}

const CULTURE_DOSSIERS: Record<string, CultureDossier> = {
  'the cultural triangle': {
    sinhalaName: 'සංස්කෘතික ත්‍රිකෝණය (Sanskarthika Thrikonaya)',
    unescoStatus: 'Multiple UNESCO World Heritage Sites',
    bestVisitingTime: 'Early Morning (6:30 AM – 10:00 AM) or Late Afternoon',
    entryInfo: 'Central Cultural Fund Passes & Individual Site Counters',
    culturalStory:
      'The Cultural Triangle forms the sacred cradle of Sri Lankan civilization, spanning across Anuradhapura, Polonnaruwa, and the towering citadel of Sigiriya. For over two millennia, sovereign Sinhala kings ruled from these sacred capitals, commissioning colossal brick stupas taller than the Roman Colosseum, intricate moonstone floor carvings, and breathtaking mirror walls with poetic graffiti. Here, spirituality and sophisticated hydraulic water gardens merged into a golden era of Southeast Asian art and engineering.',
    historicalRoots:
      'Founded under King Pandukabhaya in the 4th Century BC in Anuradhapura, evolving through royal dynasties until the Polonnaruwa medieval kingdom fell in the 13th Century.',
    highlights: [
      {
        title: 'Sigiriya Lion Rock Fortress',
        desc: 'A 200m monolithic rock citadel featuring 5th-century celestial cloud maiden frescoes, a polished mirror wall, and water gardens with gravity-fed fountains.',
        tag: 'Citadel',
      },
      {
        title: 'Ruwanwelisaya Sacred Stupa',
        desc: 'One of the world’s tallest ancient monuments in Anuradhapura, enshrining the largest collection of Buddha relics with an elephant wall perimeter.',
        tag: 'Sacred Stupa',
      },
      {
        title: 'Gal Vihara Rock Sculptures',
        desc: 'Four monumental granite Buddha statues in Polonnaruwa carved seamlessly into a single gneiss rock face with world-famous lifelike drape details.',
        tag: 'Sculpture',
      },
      {
        title: 'Jaya Sri Maha Bodhi',
        desc: 'The oldest documented human-planted tree in the world (planted 288 BC), brought as a sacred southern cutting from the Bodh Gaya enlightenment tree.',
        tag: 'Living Relic',
      },
    ],
    etiquette: [
      {
        rule: 'Modest Temple Attire Required',
        detail: 'Cover both shoulders and knees when entering religious grounds. Light, breathable white clothing is deeply respected by locals.',
      },
      {
        rule: 'Remove Shoes & Headwear',
        detail: 'All footwear, sandals, and hats must be removed at the outer boundary gates of stupas and temples. Clean socks help navigate hot sunny stone pavers.',
      },
      {
        rule: 'Never Turn Your Back to Buddha Statues',
        detail: 'Do not take selfies or poses with your back directly turned toward any Buddha image. Backing up respectfully is the customary posture.',
      },
    ],
    practicalTips: [
      {
        heading: 'Start Climbing Sigiriya Before 7:00 AM',
        advice: 'Beat both the scorching midday tropical sun and crowds by arriving as gates open at 6:30 AM. Bring at least 1.5 liters of drinking water.',
      },
      {
        heading: 'Rent a Bicycle in Ancient Polonnaruwa',
        advice: 'The ancient ruins span over 5 square kilometers. Renting a sturdy bicycle near the entrance gate lets you explore shady ruins at your own pace.',
      },
    ],
    nearbyAttractions: [
      { name: 'Pidurangala Rock', distance: '2 km north of Sigiriya', desc: 'Adventurous sunrise hike with dramatic views facing Sigiriya Fortress.' },
      { name: 'Minneriya National Park', distance: '20 km east', desc: 'World famous for the gathering of 300+ wild elephants at the ancient reservoir.' },
      { name: 'Ritigala Forest Monastery', distance: '35 km north', desc: 'Mystical jungle ruins covered in moss and ancient Ayurvedic stone baths.' },
    ],
  },

  'temple of the sacred tooth': {
    sinhalaName: 'ශ්‍රී දළදා මාළිගාව (Sri Dalada Maligawa)',
    unescoStatus: 'UNESCO World Heritage Site (Kandy)',
    bestVisitingTime: 'During Daily Thevava Pooja (5:30 AM, 9:30 AM, or 6:30 PM)',
    entryInfo: 'Foreign Visitor Counter at Main Entrance (LKR 2,000)',
    culturalStory:
      'Sheltered beside the royal lake of Kandy, Sri Dalada Maligawa is the most venerated shrine in the Buddhist world. Housing the sacred left canine tooth relic of Gautama Buddha, the temple has historically been the divine symbol of royal sovereignty in Sri Lanka: whoever held the relic held the divine mandate to govern the island. The multi-tiered gilded palace with golden canopy roof resonates daily with traditional Hewisi drumming and the scent of sweet jasmine and lotus offerings.',
    historicalRoots:
      'Smuggled to Sri Lanka in the 4th Century AD concealed in the hair of Princess Hemamala, the relic was enshrined in Kandy by King Vimaladharmasuriya I in 1595.',
    highlights: [
      {
        title: 'Golden Canopy Relic Chamber',
        desc: 'The innermost two-story chamber crowned with a solid gold roof donated in 1987, housing seven nested jewel-encrusted golden caskets containing the tooth relic.',
        tag: 'Inner Sanctum',
      },
      {
        title: 'Magul Maduwa (Royal Audience Hall)',
        desc: 'A masterpiece of Kandyan carved timber architecture with 64 carved halmilla wooden pillars where the historic Kandyan Convention was signed in 1815.',
        tag: 'Woodcraft',
      },
      {
        title: 'Paththirippuwa (Octagonal Pavilion)',
        desc: 'The iconic octagonal tower built by royal architect Devendra Mulachari where the King of Kandy addressed his kingdom.',
        tag: 'Royal Pavilion',
      },
      {
        title: 'Esala Perahera Pageant',
        desc: 'Sri Lanka’s most spectacular annual July/August pageant featuring 50+ decorated tuskers, hundreds of Kandyan fire dancers, drummers, and whip crackers.',
        tag: 'Living Festival',
      },
    ],
    etiquette: [
      {
        rule: 'Strict Dress Code at Security Checks',
        detail: 'Wear white or pale pastel clothing that covers shoulders, upper arms, and legs below knees. Sleeveless tops, shorts, and sheer fabrics are denied entry.',
      },
      {
        rule: 'Silence in the Upper Relic Chamber',
        detail: 'Maintain quiet reverence inside the inner wooden sanctuary. Drums sound intensely during the service, but personal quietude is expected.',
      },
      {
        rule: 'Photography Restrictions in Sanctum',
        detail: 'You may photograph outer courtyards and timber halls, but photography is strictly prohibited inside the direct relic casket viewing chamber.',
      },
    ],
    practicalTips: [
      {
        heading: 'Attend the 6:30 PM Evening Thevava',
        advice: 'The evening ritual is the most atmospheric: oil lamps illuminate the courtyards, conch shells echo across the lake, and the golden doors open for devotees.',
      },
      {
        heading: 'Stroll Kandy Lake at Sunset',
        advice: 'Walk the perimeter of Kandy Lake just before dusk for cool mountain breezes and stunning reflections of the temple’s illuminated cloud wall (Walakulu Bamma).',
      },
    ],
    nearbyAttractions: [
      { name: 'Royal Botanical Gardens, Peradeniya', distance: '6 km west', desc: 'World-renowned orchid house, giant Javan fig tree, and royal palm avenues.' },
      { name: 'Bahirawakanda Buddha Statue', distance: '2 km hillside', desc: 'Gigantic 88-foot white Buddha perched over Kandy Valley with sunset panoramas.' },
      { name: 'Udawatta Kele Sanctuary', distance: '1 km behind temple', desc: 'Historic royal forest reserve with ancient hermit monk meditation caves.' },
    ],
  },

  'galle fort ramparts': {
    sinhalaName: 'ගාල්ල ලන්දේසි බලකොටුව (Galle Dutch Fort)',
    unescoStatus: 'UNESCO World Heritage Site (Southern Province)',
    bestVisitingTime: 'Late Afternoon (4:00 PM – 7:00 PM Sunset)',
    entryInfo: 'Free Public Access 24/7 (Fort Ramparts)',
    culturalStory:
      'Galle Fort is South Asia’s best-preserved European fortified city, built originally by Portuguese seafaring explorers in 1588 and extensively reconstructed into an impenetrable bastion by the Dutch East India Company (VOC) during the 17th century. Enclosed within thick granite ramparts that defy Indian Ocean storm swells, the fort’s cobblestone grid streets are alive with colonial Dutch architecture, verandahs, vintage spice traders, gemstone artisans, and breezy ocean-view cafes.',
    historicalRoots:
      'First sighted by Lourenço de Almeida in 1505 when a storm blew his fleet off course, captured by the Dutch in 1640 and handed to the British Crown in 1796.',
    highlights: [
      {
        title: 'Flag Rock Bastion & Cliff Divers',
        desc: 'The southernmost point of the fort where Dutch signal flags once guided merchant frigates. Watch fearless local divers leap off sheer rocks into the ocean.',
        tag: 'Sunset Bastion',
      },
      {
        title: 'Galle Lighthouse (Pointe de Galle)',
        desc: 'The pristine 26.5m white lighthouse standing tall above palm fringed ramparts, originally constructed in 1848 and rebuilt in 1939.',
        tag: 'Maritime Icon',
      },
      {
        title: 'Dutch Reformed Church (Groote Kerk)',
        desc: 'Built in 1755 with honey-colored gables, tombstones paved into the sanctuary floor, and an organ loft with original Dutch baroque craftsmanship.',
        tag: 'Architecture',
      },
      {
        title: 'Old Dutch Hospital Precinct',
        desc: 'A colonnaded 17th-century hospital complex now repurposed into upscale seafood restaurants, gelato bars, and Ceylon tea tasting salons.',
        tag: 'Dining & Heritage',
      },
    ],
    etiquette: [
      {
        rule: 'Respect Historic Rampart Structures',
        detail: 'Do not climb or sit on damaged coral stone parapets. Stay within pedestrian walkways along the rampart ridge.',
      },
      {
        rule: 'Preserve Quiet on Residential Lanes',
        detail: 'Many residents have lived inside the fort for multiple generations. Avoid loud music and late-night disruption on inner cobblestone alleys.',
      },
      {
        rule: 'Support Ethical Local Craftspersons',
        detail: 'Seek certified gem merchants and lace-makers (Beeralu lace) preserving indigenous southern coastal handicrafts.',
      },
    ],
    practicalTips: [
      {
        heading: 'Walk the Full Rampart Perimeter at 5:00 PM',
        advice: 'Circumnavigating the entire 3km rampart takes about an hour. Sunset at Flag Rock offers incredible golden hour skies with cooling sea breezes.',
      },
      {
        heading: 'Sample Coastal Gelato & Ceylon Tea',
        advice: 'Tucked down Church Street and Leyn Baan Street are boutique cafes serving artisan lemongrass iced tea and cardamom ice cream.',
      },
    ],
    nearbyAttractions: [
      { name: 'Unawatuna Beach', distance: '5 km south', desc: 'Protected golden crescent bay with calm swimming waters and beachside cafes.' },
      { name: 'Jungle Beach & Japanese Peace Pagoda', distance: '4 km hillside', desc: 'Hidden secluded cove surrounded by monkey-filled jungle canopies.' },
      { name: 'Koggala Sea Turtle Hatchery & Lake', distance: '12 km south', desc: 'Stilt fishermen vantage points and tranquil freshwater lagoon boat rides.' },
    ],
  },

  'dambulla cave temples': {
    sinhalaName: 'දඹුල්ල රජමහා විහාරය (Dambulla Rajamaha Viharaya)',
    unescoStatus: 'UNESCO World Heritage Site (Central Province)',
    bestVisitingTime: 'Morning (7:30 AM – 10:30 AM) or Late Afternoon',
    entryInfo: 'Ticket Office at Base of Golden Temple (LKR 2,000)',
    culturalStory:
      'Carved into a colossal 160-meter high black granite rock outcropping, Dambulla is the largest and best-preserved cave temple complex in Sri Lanka. Dating back to the 1st century BC when exiled King Valagamba took refuge here from South Indian invaders, the five sanctuaries house 153 gilded Buddha statues, 3 statues of Sri Lankan monarchs, and 4 deities. Over 2,100 square meters of sacred Buddhist ceiling murals depict Mara’s temptations and the early history of Ceylon in vibrant earth pigments.',
    historicalRoots:
      'Refurbished and gilded with gold leaf by King Nissanka Malla of Polonnaruwa in 1190 AD, giving it the historic moniker "Rangiri Dambulla" (Golden Rock).',
    highlights: [
      {
        title: 'Cave 1: Devaraja Lena (Cave of the Divine King)',
        desc: 'Dominated by a monumental 14-meter reclining Buddha carved directly from the solid living granite rock face, with disciple Ananda at his feet.',
        tag: 'Reclining Buddha',
      },
      {
        title: 'Cave 2: Maharaja Lena (Cave of the Great Kings)',
        desc: 'The largest and most magnificent cave with 56 statues, life-sized statues of King Valagamba and King Nissanka Malla, and a sacred dripping spring.',
        tag: 'Grand Sanctum',
      },
      {
        title: 'Sacred Water Droplet Vessel',
        desc: 'A natural miracle inside Cave 2: crystal-clear water drips upwards from the cave ceiling fissure into an ornamental pot, never drying even in droughts.',
        tag: 'Mystic Phenomenon',
      },
      {
        title: 'Golden Temple & Giant Golden Buddha',
        desc: 'At the foot of the rock stands a contemporary 30-meter high gilded Buddha statue seated in the Dhyana Mudra posture above a dragon mouth entrance.',
        tag: 'Golden Monument',
      },
    ],
    etiquette: [
      {
        rule: 'Deposit Footwear Before Cave Entrances',
        detail: 'Shoe counters operate at the summit plateau. You must walk barefoot or in socks across the granite courtyard leading into the caves.',
      },
      {
        rule: 'Never Touch or Lean on Murals',
        detail: 'The priceless 2,000-year-old tempera ceiling frescoes are delicate. Flash photography is banned in certain caves to prevent pigment decay.',
      },
      {
        rule: 'Do Not Pose in Front of Statues',
        detail: 'Always face the camera with statues in the background from a side angle; never show your back or imitate hand mudras.',
      },
    ],
    practicalTips: [
      {
        heading: 'Purchase Tickets at the Base BEFORE Climbing',
        advice: 'The official ticket counter is situated at the bottom near the Golden Temple. There is no ticket counter at the summit of the rock!',
      },
      {
        heading: 'Wear Thick White Socks',
        advice: 'By noon, the black granite courtyard rock heats up intensely. White socks protect your soles from heat while keeping temple modesty.',
      },
    ],
    nearbyAttractions: [
      { name: 'Sigiriya Rock Fortress', distance: '19 km north-east', desc: 'Ancient 5th-century palace citadel on a sheer granite column.' },
      { name: 'Nalanda Gedige', distance: '25 km south', desc: 'Unique stone temple blending tantric Buddhist and Hindu architectural styles.' },
      { name: 'Popham’s Arboretum', distance: '3 km west', desc: 'Sri Lanka’s only dry-zone arboretum teeming with slender loris and night wildlife.' },
    ],
  },

  'traditional mask carving': {
    sinhalaName: 'සාම්ප්‍රදායික වෙස් මුහුණු කලාව (Traditional Mask Craft)',
    unescoStatus: 'Sri Lanka Living Cultural Heritage',
    bestVisitingTime: 'Morning to Afternoon (9:00 AM – 5:00 PM)',
    entryInfo: 'Free Admission to Artisans / Workshops & Folk Museums',
    culturalStory:
      'In the coastal town of Ambalangoda, ancient wooden mask carving is a deeply spiritual artisanal tradition passed down through generations of master woodcarvers (Gurunnanse). Used in ceremonial devil dances (Thovil and Sanni Yakuma) to cure psychological and physical ailments through spiritual exorcism, as well as comic folk operas (Kolam), each mask represents specific demons, mythical birds, cobras, or royalty. Carved from feather-light Kaduru wood (Strychnos nux-vomica), the masks are painted with natural plant extracts and mineral pigments.',
    historicalRoots:
      'Centuries of southern coastal healing shamanism and ancient animist ritual performance predating organized medical sciences in the island.',
    highlights: [
      {
        title: 'Gurulu Raksha (Mythical Bird Mask)',
        desc: 'The mythical solar eagle mask adorned with cobra serpents, believed to ward off evil spirits, bring protection to households, and usher prosperity.',
        tag: 'Protective Totem',
      },
      {
        title: 'Naga Raksha (Cobra Demon Mask)',
        desc: 'Intricately carved fierce demon crown surrounded by coiled cobras, representing the power to subjugate enemies and ward off malice.',
        tag: 'Iconic Mask',
      },
      {
        title: 'The 18 Sanni Exorcism Masks',
        desc: 'A diagnostic medical compendium: eighteen distinct masks each representing a specific illness from deafness, blindness, fever, to epilepsy.',
        tag: 'Ritual Medicine',
      },
      {
        title: 'Natural Dye & Pigment Preparation',
        desc: 'Traditional preparation of organic dyes using yellow clay, charred coconut shells, red sandalwood, and lime to achieve vivid enduring hues.',
        tag: 'Ancient Chemistry',
      },
    ],
    etiquette: [
      {
        rule: 'Respect Ritual Significance of Masks',
        detail: 'Recognize that these masks are spiritual instruments of healing and ancestral lore, not merely decorative curios.',
      },
      {
        rule: 'Ask Permission Before Filming Artisans',
        detail: 'Master woodcarvers appreciate a courteous greeting before filming their delicate chisel work and painting sessions.',
      },
      {
        rule: 'Purchase Direct from Certified Workshops',
        detail: 'Support true craft survival by purchasing authentic handmade Kaduru wood masks rather than mass-produced synthetic copies.',
      },
    ],
    practicalTips: [
      {
        heading: 'Visit the Ariyapala Mask Museum',
        advice: 'Located on the main Galle road in Ambalangoda, this world-renowned family museum offers an immersive free library and workshop demonstration.',
      },
      {
        heading: 'Try a Hands-on Mask Painting Workshop',
        advice: 'Several family studios allow travelers to paint their own pocket-sized Kaduru wood mask using traditional brush techniques to take home.',
      },
    ],
    nearbyAttractions: [
      { name: 'Madu Ganga River Safari', distance: '6 km north', desc: 'Mangrove boat safari through cinnamon peeling islands and fish spas.' },
      { name: 'Meetiyagoda Moonstone Mines', distance: '8 km inland', desc: 'The world’s only deep-shaft mine yielding luminous blue moonstone gems.' },
      { name: 'Ahungalla & Kosgoda Turtle Hatcheries', distance: '10 km north', desc: 'Sea turtle sanctuary conserving Olive Ridley, Green, and Leatherback turtles.' },
    ],
  },

  'sacred adam’s peak (sri pada)': {
    sinhalaName: 'ශ්‍රී පාදස්ථානය (Samanala Kanda / Adam’s Peak)',
    unescoStatus: 'Sacred World Heritage & Central Highlands Sanctuary',
    bestVisitingTime: 'Pilgrimage Season: December Poya to May Vesak Poya',
    entryInfo: 'Free Public Pilgrimage (Climb starts around midnight)',
    culturalStory:
      'Rising 2,243 meters into the central mist of the Sabaragamuwa highlands, Adam’s Peak (Sri Pada) is one of the most spiritually unified summits on Earth. At its pinnacle lies a sacred footprint depression: revered by Buddhists as the footprint of Lord Buddha (Sri Pada), by Hindus as Lord Shiva (Shivan Oli Padam), and by Christians and Muslims as the footprint of Adam after falling from Eden. Over centuries, pilgrims of all faiths ascend 5,500 lantern-lit steps through cold night winds to reach the shrine before dawn.',
    historicalRoots:
      'Mentioned in the Mahavamsa and visited by Marco Polo in 1292 and Ibn Battuta in 1344, protected under the divine guardianship of deity Saman.',
    highlights: [
      {
        title: 'Ira Sevaya (Mystical Sunrise Phenomenon)',
        desc: 'As dawn breaks, the sun casts an optical illusion: a perfect triangular shadow of the mountain projected onto the cloud canopy below.',
        tag: 'Optical Wonder',
      },
      {
        title: '5,500 Lantern-Lit Steps (Hatton Route)',
        desc: 'A continuous ribbon of glowing electric lights winding up through dense cloud forests, visible from miles away in the dark highland valley.',
        tag: 'The Sacred Stairway',
      },
      {
        title: 'Samana Devalaya & The Sacred Bell',
        desc: 'Pilgrims ring the bronze temple bell at the summit once for every successful pilgrimage ascent they have completed in their lifetime.',
        tag: 'Summit Ritual',
      },
      {
        title: 'Indikatupana (Needle Rock)',
        desc: 'A sacred rest stop where pilgrims thread needles and unravel white yarn along the trail in homage to an ancient legend of Buddha mending his robe.',
        tag: 'Pilgrim Custom',
      },
    ],
    etiquette: [
      {
        rule: 'Carry Warm Layered Clothing',
        detail: 'Temperatures plummet below 8°C with biting wind chill at the summit. Pack a thermal beanie, fleece jacket, and windbreaker.',
      },
      {
        rule: 'Keep the Mountain Sacred & Litter-Free',
        detail: 'Adam’s Peak is a fragile UNESCO biosphere reserve. Carry every piece of plastic and trash back down with you.',
      },
      {
        rule: 'Encourage Fellow Pilgrims (Karunawai)',
        detail: 'Locals greet every passerby with the compassionate blessing "Karunawai" (compassion to you) to share strength along the steep climb.',
      },
    ],
    practicalTips: [
      {
        heading: 'Start Climbing Between 1:00 AM and 2:00 AM',
        advice: 'From Nallathanniya (Hatton route), the climb takes 3.5 to 5 hours depending on fitness, ensuring you reach the summit 30 minutes before sunrise at 5:45 AM.',
      },
      {
        heading: 'Avoid Full Moon Weekends if Possible',
        advice: 'Poya (full moon) days and holiday weekends attract tens of thousands of local pilgrims, causing bottlenecks near the summit stairs.',
      },
    ],
    nearbyAttractions: [
      { name: 'Mohini & Gartmore Waterfalls', distance: 'Base of Nallathanniya', desc: 'Majestic waterfalls gushing through lush tea plantations near the trail base.' },
      { name: 'Castlereagh Reservoir', distance: '15 km north-east', desc: 'Picturesque emerald highland lake with scenic seaplane landings and tea bungalows.' },
      { name: 'Hatton Tea Estates', distance: '30 km drive', desc: 'World famous Ceylon black tea factory tours and panoramic mountain views.' },
    ],
  },
};

function generateFallbackCultureDossier(title: string, tagline: string, desc: string): CultureDossier {
  return {
    sinhalaName: `${title} (ශ්‍රී ලංකා උරුමය)`,
    unescoStatus: 'Sri Lanka Living Cultural Heritage',
    bestVisitingTime: 'Morning (8:00 AM – 11:00 AM) or Sunset',
    entryInfo: 'Local Heritage / Visitor Counters',
    culturalStory:
      desc ||
      `${title} represents an essential dimension of Sri Lankan culture and living history. Spanning generations of oral lore, traditional architecture, and craftsmanship, it stands as a testament to the island’s rich multi-ethnic civilizational legacy.`,
    historicalRoots:
      'Rooted in centuries of indigenous royal patronage, folk rituals, and deep spiritual reverence that define Sri Lanka.',
    highlights: [
      {
        title: `${title} Signature Architecture`,
        desc: 'Traditional design techniques showcasing authentic Sri Lankan stonework, woodcraft, or spiritual symbolism.',
        tag: 'Signature',
      },
      {
        title: 'Cultural Significance',
        desc: 'Passed down through master craftspeople and preserved by community devotion over centuries.',
        tag: 'Living Heritage',
      },
      {
        title: 'Community Traditions',
        desc: 'Vibrant local rituals, seasonal festivals, and authentic island stories celebrated here.',
        tag: 'Customs',
      },
      {
        title: 'Scenic Surrounding Landscape',
        desc: 'Set amidst picturesque tropical terrain, ancient water systems, or coastal sea panoramas.',
        tag: 'Landscape',
      },
    ],
    etiquette: [
      {
        rule: 'Modest Dress Recommended',
        detail: 'Wear comfortable, respectful clothing covering shoulders and knees when visiting cultural and sacred locations.',
      },
      {
        rule: 'Respect Local Customs',
        detail: 'Always ask permission before taking photos of elders or spiritual ceremonies, and maintain courteous quiet.',
      },
      {
        rule: 'Preserve Historical Artifacts',
        detail: 'Avoid touching ancient stone carvings, murals, or historic wood surfaces to protect them for future generations.',
      },
    ],
    practicalTips: [
      {
        heading: 'Visit Early in the Day',
        advice: 'Morning hours offer the best natural lighting for photography, comfortable temperatures, and unhurried exploration.',
      },
      {
        heading: 'Engage with Local Guides',
        advice: 'Licensed local storytellers provide deep historical context and fascinating folklore you will never find in standard guidebooks.',
      },
    ],
    nearbyAttractions: [
      { name: 'Central Cultural Landmarks', distance: 'Nearby', desc: 'Historic monuments, local temples, and lively bazaar streets.' },
    ],
  };
}

async function getCultureItem(idOrSlug: string) {
  const numericId = parseInt(idOrSlug, 10);
  if (!isNaN(numericId)) {
    try {
      const dbItem = await prisma.cultureItem.findUnique({
        where: { id: numericId },
      });
      if (dbItem) return dbItem;
    } catch (e) {
      console.error('Error fetching culture item by ID:', e);
    }
    const fallback = FALLBACK_CULTURES.find((c) => c.id === numericId);
    if (fallback) return fallback;
  }

  // Try matching slug or title in DB
  try {
    const allDb = await prisma.cultureItem.findMany();
    const found = allDb.find(
      (c) =>
        c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === idOrSlug.toLowerCase() ||
        c.title.toLowerCase() === idOrSlug.toLowerCase().replace(/-/g, ' ')
    );
    if (found) return found;
  } catch (e) {
    console.error('Error searching culture items in DB:', e);
  }

  // Try matching fallback slug or title
  const cleanParam = idOrSlug.toLowerCase();
  const fallbackMatch = FALLBACK_CULTURES.find(
    (c) =>
      c.slug === cleanParam ||
      c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === cleanParam ||
      c.title.toLowerCase().includes(cleanParam.replace(/-/g, ' '))
  );
  if (fallbackMatch) return fallbackMatch;

  return null;
}

async function getRelatedHeritagePlaces(): Promise<Place[]> {
  try {
    const raw = await prisma.place.findMany({
      where: {
        category: {
          in: ['Ancient Sites', 'Historical', 'Religious Places'],
        },
      },
      orderBy: { rating: 'desc' },
      take: 3,
    });
    return raw.map((p) => ({
      ...p,
      created_at: p.created_at.toISOString(),
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const item = await getCultureItem(id);
  if (!item) {
    return {
      title: 'Cultural Heritage Site — UncoverCeylon',
      description: 'Discover ancient kingdoms, sacred temples, and timeless legends of Sri Lanka.',
    };
  }

  const title = `${item.title} — Ancient Kingdoms & Culture of Sri Lanka | UncoverCeylon`;
  const description = `${item.tagline}. ${item.desc}`.slice(0, 160);

  return {
    title,
    description,
    keywords: [
      item.title,
      'Sri Lanka heritage',
      'Sri Lanka culture',
      'UNESCO Sri Lanka',
      item.badge,
      item.period || 'Culture of Sri Lanka',
    ],
    openGraph: {
      title,
      description,
      images: [
        {
          url: item.image,
          width: 1200,
          height: 630,
          alt: item.title,
        },
      ],
      type: 'article',
    },
    alternates: {
      canonical: `https://uncoverceylon.com/culture/${id}`,
    },
  };
}

export default async function CultureDetailPage({ params }: PageProps) {
  const { id } = await params;
  const item = await getCultureItem(id);

  if (!item) {
    notFound();
  }

  const lookupKey = item.title.toLowerCase().trim();
  const dossier =
    CULTURE_DOSSIERS[lookupKey] ||
    Object.entries(CULTURE_DOSSIERS).find(([key]) => lookupKey.includes(key))?.[1] ||
    generateFallbackCultureDossier(item.title, item.tagline, item.desc);

  const relatedPlaces = await getRelatedHeritagePlaces();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: item.title,
    description: item.desc,
    image: item.image,
    alternateName: dossier.sinhalaName,
    touristType: ['Cultural Tourism', 'Heritage Tourism', 'Historical Sightseeing'],
    isAccessibleForFree: dossier.entryInfo.toLowerCase().includes('free'),
    breadcrumb: {
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
          name: 'Culture & Heritage',
          item: 'https://uncoverceylon.com/culture',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: item.title,
          item: `https://uncoverceylon.com/culture/${id}`,
        },
      ],
    },
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-emerald-500/20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ━━━ 1. BREADCRUMBS & TOP NAV ━━━ */}
      <div className="bg-[#0b1320] text-slate-300 border-b border-slate-800/80 sticky top-16 z-30 backdrop-blur-md bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-1.5 sm:gap-2 truncate">
            <Link
              href="/"
              className="text-slate-400 hover:text-white transition-colors truncate"
            >
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <Link
              href="/culture"
              className="text-slate-400 hover:text-white transition-colors truncate"
            >
              Culture & Heritage
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <span className="text-emerald-400 font-bold truncate">
              {item.title}
            </span>
          </div>

          <Link
            href="/culture"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold transition-all shrink-0 ml-3 text-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">All Heritage</span>
          </Link>
        </div>
      </div>

      {/* ━━━ 2. HERO COVER BANNER ━━━ */}
      <section className="relative bg-[#0f1b2d] text-white overflow-hidden isolate">
        <div className="absolute inset-0 z-0">
          <Image
            src={item.image}
            alt={item.title}
            fill
            priority
            className="object-cover object-center opacity-40 scale-102 transition-transform duration-1000"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1b2d] via-[#0f1b2d]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f1b2d]/90 via-[#0f1b2d]/50 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-16 sm:pb-20">
          <div className="max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md text-emerald-300 text-xs font-black uppercase tracking-wider border border-emerald-400/30">
                <Landmark className="w-3.5 h-3.5" />
                <span>{item.badge || 'Living Heritage'}</span>
              </span>

              {item.period && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white/90 text-xs font-semibold border border-white/15">
                  <Clock className="w-3 h-3 text-emerald-400" />
                  <span>{item.period}</span>
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              {item.title}
            </h1>

            {dossier.sinhalaName && (
              <p className="text-emerald-400 text-sm sm:text-base font-bold tracking-wide">
                {dossier.sinhalaName}
              </p>
            )}

            <p className="text-base sm:text-xl text-white/85 font-medium leading-relaxed max-w-2xl">
              {item.desc}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs sm:text-sm">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-slate-200 font-semibold backdrop-blur-md">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>{item.period || 'Sri Lanka'}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-emerald-300 font-semibold backdrop-blur-md">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{dossier.unescoStatus}</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ 3. QUICK FACTS BAR (RESPONSIVE & OVERFLOW-SAFE) ━━━ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-4 sm:p-6 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
          
          <div className="flex items-start gap-3 min-w-0 pt-2 lg:pt-0">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#00aa6c] flex items-center justify-center shrink-0 border border-emerald-100">
              <Clock className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block truncate">
                Best Timing
              </span>
              <span className="text-xs sm:text-sm font-black text-slate-900 block mt-0.5 truncate" title={dossier.bestVisitingTime}>
                {dossier.bestVisitingTime}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 min-w-0 pt-2 lg:pt-0 lg:pl-6">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
              <Landmark className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block truncate">
                Historical Epoch
              </span>
              <span className="text-xs sm:text-sm font-black text-slate-900 block mt-0.5 truncate" title={item.period || 'Ancient Era'}>
                {item.period || 'Ancient Era'}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 min-w-0 pt-4 lg:pt-0 lg:pl-6">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block truncate">
                Preservation
              </span>
              <span className="text-xs sm:text-sm font-black text-slate-900 block mt-0.5 truncate" title={dossier.unescoStatus}>
                {dossier.unescoStatus}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 min-w-0 pt-4 lg:pt-0 lg:pl-6">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block truncate">
                Admission Guide
              </span>
              <span className="text-xs sm:text-sm font-black text-slate-900 block mt-0.5 truncate" title={dossier.entryInfo}>
                {dossier.entryInfo}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* ━━━ 4. MAIN CONTENT & DOSSIER ━━━ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12 sm:space-y-16">
        
        {/* Cultural Narrative & Historical Roots */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00aa6c]" />
            <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#00aa6c]">
              Historical Chronicles & Living Lore
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
              <p className="font-normal">
                {dossier.culturalStory}
              </p>
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-1.5">
                <h3 className="text-xs font-black uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-[#00aa6c]" />
                  <span>Dynastic Origin & Ancient Lineage</span>
                </h3>
                <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed font-medium">
                  {dossier.historicalRoots}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Heritage Summary
              </h3>
              <ul className="space-y-3 text-xs text-slate-600">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Recognition:</strong> {dossier.unescoStatus}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Best Hours:</strong> {dossier.bestVisitingTime}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Access:</strong> {dossier.entryInfo}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Category:</strong> {item.badge || 'Heritage Pillar'}</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Accordion / Collapsible Sections for Details */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
              Dossier & Essential Visitor Guidelines
            </h2>
            <span className="text-xs text-slate-400 font-semibold">
              Click to expand
            </span>
          </div>

          <CultureAccordionSections
            highlights={dossier.highlights}
            etiquette={dossier.etiquette}
            practicalTips={dossier.practicalTips}
            nearbyAttractions={dossier.nearbyAttractions}
          />
        </section>

        {/* Related Cultural Places from Database */}
        {relatedPlaces.length > 0 && (
          <section className="space-y-6 pt-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <span className="text-[#00aa6c] text-xs font-black uppercase tracking-wider">
                  Verified Heritage Destinations
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mt-1">
                  Explore Sacred Sites Nearby
                </h2>
              </div>
              <Link
                href="/destinations?category=Ancient+Sites"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#00aa6c] hover:underline"
              >
                <span>View all ancient sites</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPlaces.map((place, index) => (
                <PlaceCard key={place.id} place={place} index={index} />
              ))}
            </div>
          </section>
        )}

        {/* Bottom CTA Banner */}
        <section className="bg-gradient-to-br from-[#0f1b2d] to-[#162740] rounded-3xl p-8 sm:p-12 text-white text-center relative overflow-hidden isolate shadow-xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-400/30">
              <Compass className="w-3.5 h-3.5" />
              <span>Explore Island History</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Discover More Sacred Wonders
            </h2>
            <p className="text-white/80 text-xs sm:text-base leading-relaxed">
              From rock cave sanctuaries to royal cloud fortresses, embark on a cultural journey through the ancient heart of Sri Lanka.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/culture"
                className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-500/25"
              >
                Browse All Culture Pillars
              </Link>
              <Link
                href="/destinations"
                className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm transition-all border border-white/20"
              >
                Explore Destinations Map
              </Link>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
