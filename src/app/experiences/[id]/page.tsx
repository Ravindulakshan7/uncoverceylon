import { prisma } from '@/lib/db';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Compass,
  Clock,
  MapPin,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Waves,
  Mountain,
  PawPrint,
  Train,
  Sun,
  Anchor,
  ArrowRight
} from 'lucide-react';
import { Metadata } from 'next';
import ExperienceAccordionSections, {
  ExperienceHighlight,
  GearItem,
  SafetyTip,
  SeasonGuide,
} from '@/components/ExperienceAccordionSections';
import { Place } from '@/types';
import PlaceCard from '@/components/PlaceCard';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ id: string }>;
}

const FALLBACK_EXPERIENCES = [
  {
    id: 1,
    slug: 'surfing',
    title: 'World-Class Surfing',
    tagline: 'Year-Round Coastal Swells',
    desc: 'With two alternating monsoon seasons, Sri Lanka offers peeling waves 365 days a year. From gentle, sandy breaks in Weligama and horseshoe bay peelers in Hiriketiya to legendary point breaks in Arugam Bay.',
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1200&q=80',
    seasons: 'South Coast (Nov–Apr) • East Coast (May–Sep)',
    badge: 'Popular',
  },
  {
    id: 2,
    slug: 'trains',
    title: 'Blue Highland Train Journeys',
    tagline: 'The World’s Most Scenic Railway',
    desc: 'Winding through emerald tea estates, pine cloud forests, and colonial stone bridges. Hang out the open doorway as mist brushes past and cross the famous Demodara Nine Arch Bridge.',
    image: 'https://images.unsplash.com/photo-1535463731090-e34f4b5098c5?auto=format&fit=crop&w=1200&q=80',
    seasons: 'Year-round • Kandy to Ella Route',
    badge: 'Must Do',
  },
  {
    id: 3,
    slug: 'safaris',
    title: 'Wild Leopard & Elephant Safaris',
    tagline: 'Untamed National Sanctuaries',
    desc: 'Home to the highest density of wild leopards on Earth in Yala Block 1, plus hundreds of free-roaming wild elephant herds across Udawalawe and the Minneriya gathering.',
    image: 'https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?auto=format&fit=crop&w=1200&q=80',
    seasons: 'Best: Feb–July • Yala & Udawalawe',
    badge: 'Wildlife',
  },
  {
    id: 4,
    slug: 'trekking',
    title: 'Peak Treks & Cloud Forests',
    tagline: 'Summits Above The Mist',
    desc: 'Scale 5,500 lantern-lit steps to Adam’s Peak for sunrise above the clouds, hike through the rolling tea trails to Ella Rock, or explore the endemic biodiversity of Knuckles Range.',
    image: 'https://images.unsplash.com/photo-1576706374778-95a95efff7b1?auto=format&fit=crop&w=1200&q=80',
    seasons: 'Dec–Apr Pilgrimage • Ella & Knuckles',
    badge: 'Adventure',
  },
  {
    id: 5,
    slug: 'whales',
    title: 'Blue Whale & Dolphin Expeditions',
    tagline: 'Giants of the Indian Ocean',
    desc: 'The deep ocean trench just off Mirissa brings the largest animals to ever live on Earth within swimming distance of the coast. Spot Blue Whales, Sperm Whales, and pods of spinner dolphins.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
    seasons: 'November to April • Mirissa & Trincomalee',
    badge: 'Ocean Safari',
  },
  {
    id: 6,
    slug: 'rafting',
    title: 'White Water Rafting & Canyoning',
    tagline: 'Jungle River Rush',
    desc: 'Paddle through grade 3 and 4 churning rapids on the Kelani River in Kitulgala, surrounded by lush rainforest where ‘The Bridge on the River Kwai’ was filmed. Rock sliding and waterfall abseiling included.',
    image: 'https://images.unsplash.com/photo-1467173572719-f14b9fb86e5f?auto=format&fit=crop&w=1200&q=80',
    seasons: 'Year-round • Kitulgala Rainforest',
    badge: 'Adrenaline',
  },
];

interface ExperienceDossier {
  sinhalaName: string;
  activityLevel: string;
  bestTimeOfDay: string;
  idealSeasons: string;
  adventureOverview: string;
  localStory: string;
  highlights: ExperienceHighlight[];
  gearChecklist: GearItem[];
  safetyTips: SafetyTip[];
  seasonGuide: SeasonGuide[];
}

const EXPERIENCE_DOSSIERS: Record<string, ExperienceDossier> = {
  'world-class surfing': {
    sinhalaName: 'ශ්‍රී ලංකා රළ මත ලිස්සා යාම (Rala Matha Lissa Yaama)',
    activityLevel: 'Beginner to Advanced (Location Dependent)',
    bestTimeOfDay: 'Dawn Patrol (6:00 AM – 9:00 AM) & Sunset Glass-off',
    idealSeasons: 'South (Nov–Apr) | East (May–Sep)',
    adventureOverview:
      'Sri Lanka is globally celebrated as the ultimate year-round surf haven. When the Southwest monsoon brings stormy onshore winds to the South Coast, the East Coast comes alive with pristine offshore trade winds creating world-class right-hand point breaks in Arugam Bay. And when the Northeast monsoon rolls in, the South Coast transforms into a tranquil paradise of peeling turquoise waves from Weligama to Hiriketiya.',
    localStory:
      'From 1970s wandering Australian wave seekers arriving in VW vans to today’s thriving surf culture, local beach communities have built an authentic, welcoming coastal lifestyle filled with beachfront cafes, coconut shacks, and live reggae nights.',
    highlights: [
      {
        title: 'Weligama Sandy Beach Break',
        desc: 'A wide 2km sandy bay with gentle, rolling whitewater and green peeling waves. Perfect for beginners, surf camps, and longboard styling with soft sand underfoot.',
        tag: 'Beginners & Longboards',
      },
      {
        title: 'Arugam Bay Main Point',
        desc: 'One of the world’s most famous right-hand point breaks. Rips off a rocky headland, offering 400-meter peeling rides with fast barrel sections during peak season.',
        tag: 'World Pro Wave',
      },
      {
        title: 'Hiriketiya Horseshoe Cove',
        desc: 'A breathtaking horseshoe jungle bay featuring a forgiving sandy beach break in the middle and a peeling left-hand reef break hugging the rocky point.',
        tag: 'Jungle Bay Vibe',
      },
      {
        title: 'Midigama Reef Breaks (Rams & Lazy Left)',
        desc: 'A tranquil surfing village offering five distinct reef breaks within walking distance, from deep water mellow lefts to fast hollow wedges at Rams.',
        tag: 'Intermediate Reef',
      },
    ],
    gearChecklist: [
      {
        item: 'Zinc Sunblock & UV Rash Guard',
        detail: 'The tropical sun reflecting off the Indian Ocean is exceptionally powerful. Pack reef-safe zinc and 50+ UPF long-sleeve rash vests.',
      },
      {
        item: 'Reef Booties for Rocky Breaks',
        detail: 'Invaluable for rocky point breaks like Arugam Bay and Midigama to protect against sea urchins and shallow limestone reefs.',
      },
      {
        item: 'Tropical Water Wax & Spare Leash',
        detail: 'Water temperatures hover around 28°C–30°C year-round, requiring warm/tropical-rated surfboard wax for optimal grip.',
      },
      {
        item: 'Waterproof Dry Bag',
        detail: 'Keeps phones, dry clothes, and wallets completely dry during tuk-tuk rides between remote coastal bays.',
      },
    ],
    safetyTips: [
      {
        heading: 'Respect Lineup Priority & Surfing Etiquette',
        advice: 'The surfer closest to the breaking peak has right-of-way. Do not drop in on fellow riders, and apologize if you accidentally cause an obstruction.',
      },
      {
        heading: 'Check Tides on Shallow Reef Breaks',
        advice: 'Certain reef breaks become dangerously shallow at low tide. Ask resident local surf shacks for the optimal tidal window before paddling out.',
      },
      {
        heading: 'Stay Hydrated with Fresh King Coconuts',
        advice: 'Paddling for 3 hours under the tropical sun rapidly dehydrates you. Rehydrate with natural Thambili (King Coconut) available directly on the beach.',
      },
    ],
    seasonGuide: [
      { season: 'South Coast (Nov to Apr)', conditions: 'Glassy morning offshore breezes, clean swells 2–6ft, sunny skies in Weligama, Mirissa, and Hiriketiya.' },
      { season: 'East Coast (May to Sep)', conditions: 'Consistent Southern Ocean swells hitting Arugam Bay, Whiskey Point, and Peanut Farm with offshore trade winds.' },
    ],
  },

  'blue highland train journeys': {
    sinhalaName: 'උඩරට නිල් දුම්රිය චාරිකාව (Udarata Nil Dumriya)',
    activityLevel: 'Scenic Exploration & Cultural Journey',
    bestTimeOfDay: 'Morning Express (8:45 AM or 11:10 AM)',
    idealSeasons: 'Year-Round (Best visibility Dec–Apr & Jul–Aug)',
    adventureOverview:
      'Renowned by travelers and travel publications as the most scenic train journey on Earth, the colonial Main Line railway winds from Kandy into the misty high country of Nuwara Eliya and Ella. Engineered by the British in the 1860s to transport Ceylon black tea from high mountain plantations to Colombo harbor, the tracks traverse dizzying mountain ledges, roaring waterfalls, eucalyptus forests, and deep ravines.',
    localStory:
      'The rhythmic click-clack of the blue train, vendors wandering the carriages calling "Wade! Wade! Channa!", and passengers leaning peacefully out open windows to feel cool mountain mist make this a nostalgic, quintessential Sri Lankan memory.',
    highlights: [
      {
        title: 'Demodara Nine Arch Bridge',
        desc: 'A monumental colonial viaduct built in 1921 entirely out of brick, stone, and cement without a single piece of structural steel. Stands 24m high over deep tea valleys.',
        tag: 'Architectural Icon',
      },
      {
        title: 'Rolling Tea Terraces of Hatton & Nanu Oya',
        desc: 'Endless carpets of emerald Ceylon tea bushes tended by skilled tea pluckers, punctuated by roaring horsetail mountain cascades.',
        tag: 'Tea Highlands',
      },
      {
        title: 'Open Carriage Doors & Windows',
        desc: 'Traditional open doorways where travelers can sit safely, feel the refreshing highland breeze, and capture world-famous photographs.',
        tag: 'Iconic Experience',
      },
      {
        title: 'Demodara Railway Spiral Loop',
        desc: 'An ingenious engineering marvel where the train loops around a mountain and passes directly underneath itself through tunnel number 42.',
        tag: 'Engineering Marvel',
      },
    ],
    gearChecklist: [
      {
        item: 'Reserved 2nd or 3rd Class Tickets',
        detail: 'Book reserved seats 30 days in advance through the Sri Lanka Railways portal or authorized agencies to secure window seats.',
      },
      {
        item: 'Light Fleece or Windbreaker',
        detail: 'As the train climbs to Pattipola (the highest railway point at 1,898m), outside temperatures drop significantly into chilly mist.',
      },
      {
        item: 'Camera with Extra Batteries',
        detail: 'Non-stop photo opportunities around every bend will quickly drain phone and camera batteries during the 6-hour route.',
      },
      {
        item: 'Local Currency Cash for Train Vendors',
        detail: 'Carry small banknotes (LKR 100/500) for freshly fried spicy lentil vadai, roasted peanuts, and piping hot sweet milk tea served onboard.',
      },
    ],
    safetyTips: [
      {
        heading: 'Firmly Hold Handrails by Open Doors',
        advice: 'Never let go of the grab bars when standing or sitting in doorways. Trains sway unpredictably around mountain curves.',
      },
      {
        heading: 'Watch for Tunnels & Rock Walls',
        advice: 'Mountain tunnel openings and rocky overhangs are built very close to the carriage exterior. Never lean your head or selfie stick far outwards.',
      },
      {
        heading: 'Book Ella to Kandy for Easier Tickets',
        advice: 'Kandy to Ella is the most popular direction. Booking the reverse route (Ella to Kandy) often has significantly better ticket availability.',
      },
    ],
    seasonGuide: [
      { season: 'Peak Dry Season (Dec to Apr)', conditions: 'Clear mountain panoramas, bright sunny weather across the tea valleys, crisp mornings.' },
      { season: 'Misty Inter-Monsoon (May to Nov)', conditions: 'Atmospheric clouds and rolling mist drifting through carriage windows, dramatic waterfalls.' },
    ],
  },

  'wild leopard & elephant safaris': {
    sinhalaName: 'වනජීවී සෆාරි චාරිකා (Wanajeevee Safari)',
    activityLevel: 'Wildlife Safari & Photography',
    bestTimeOfDay: 'Early Morning (5:45 AM – 10:00 AM) & Afternoon (2:30 PM – 6:00 PM)',
    idealSeasons: 'Yala (Feb–Jul) | Minneriya (Jul–Oct) | Udawalawe (Year-round)',
    adventureOverview:
      'Sri Lanka boasts the highest wildlife density in South Asia. Known as the "Big Five of Ceylon" — the Sri Lankan Leopard, Asian Elephant, Sloth Bear, Blue Whale, and Sperm Whale — the island’s national parks offer extraordinary game drives. Yala National Park harbors the highest concentration of wild leopards on Earth, while Udawalawe guarantees encounters with hundreds of free-roaming wild elephant herds.',
    localStory:
      'Ancient kings built thousands of cascading artificial reservoirs called "Wewas" over 2,000 years ago. Today, these ancient water systems sustain thriving ecosystems where leopards hunt, painted storks nest, and elephants gather in massive congregations.',
    highlights: [
      {
        title: 'Yala Block 1 Leopard Tracking',
        desc: 'Home to the endemic Panthera pardus kotiya. Spot apex leopards lounging on massive sun-warmed granite rocks or stalking through thorny scrub.',
        tag: 'Leopard Capital',
      },
      {
        title: 'The Great Minneriya Elephant Gathering',
        desc: 'Recognized by Lonely Planet as one of the world’s top wildlife spectacles: up to 300 wild elephants congregate on the receding reservoir bed.',
        tag: 'Elephant Spectacle',
      },
      {
        title: 'Udawalawe Year-Round Herds',
        desc: 'Sprawling African-style grasslands with guaranteed elephant sightings, playful baby calves, water buffalo wallows, and crested serpent eagles.',
        tag: 'Guaranteed Sightings',
      },
      {
        title: 'Wilpattu Sloth Bear & Jungle Safari',
        desc: 'Sri Lanka’s largest national park, characterized by natural freshwater sand-rimmed lakes (Villus) and elusive Sri Lankan sloth bears.',
        tag: 'Wilderness & Lakes',
      },
    ],
    gearChecklist: [
      {
        item: 'Telephoto Zoom Lens (70-300mm+)',
        detail: 'Essential for capturing intimate wildlife moments, leopard expressions in trees, and birdlife without encroaching on animal space.',
      },
      {
        item: 'High-Quality Binoculars (8x42 or 10x42)',
        detail: 'Helps spot camouflaged leopards, owls, and crocodiles resting along water margins that the naked eye easily misses.',
      },
      {
        item: 'Dust Scarf / Bandana & Sunglasses',
        detail: 'Open-top 4x4 safari vehicles kick up fine red dust along park trails during dry-zone game drives.',
      },
      {
        item: 'Earth-Toned Clothing (Khaki / Green / Beige)',
        detail: 'Avoid bright neon reds, yellows, and whites which alert wild animals and cause them to retreat into dense bush.',
      },
    ],
    safetyTips: [
      {
        heading: 'Never Exit the Safari Jeep',
        advice: 'You must remain inside the safari vehicle at all times except at designated Department of Wildlife Conservation (DWC) rest stations.',
      },
      {
        heading: 'Maintain Absolute Silence Near Animals',
        advice: 'Sudden noises, loud shouting, or phone rings startle wild leopards and can trigger defensive elephant mock charges. Keep voices to a whisper.',
      },
      {
        heading: 'Choose Ethical, Licensed Safari Drivers',
        advice: 'Support verified local trackers who respect wildlife distance rules and refrain from crowding animals when a rare sighting is radioed in.',
      },
    ],
    seasonGuide: [
      { season: 'Yala Dry Season (Feb to Jul)', conditions: 'Low water levels force animals to congregate around remaining waterholes, maximizing leopard sightings.' },
      { season: 'Minneriya Gathering (Jul to Oct)', conditions: 'Peak dry season brings hundreds of elephants to feed on fresh sprouting grasses at the reservoir basin.' },
    ],
  },

  'peak treks & cloud forests': {
    sinhalaName: 'කඳු තරණය සහ වනාන්තර චාරිකා (Kandu Tharana)',
    activityLevel: 'Active Hiking & Endurance Trekking',
    bestTimeOfDay: 'Early Dawn (5:30 AM) for Golden Sunrise Panoramas',
    idealSeasons: 'Dec–Apr (Pilgrimages & Dry Mountain Trails)',
    adventureOverview:
      'The central highlands of Sri Lanka rise dramatically into a wonderland of mist-draped granite peaks, biodiversity-rich cloud forests, and UNESCO World Heritage wilderness. Trekkers can ascend Adam’s Peak under starry night skies, conquer the panoramic cliffs of Ella Rock, or navigate the untamed ridges of the Knuckles Mountain Range — home to endemic lizards found nowhere else on planet Earth.',
    localStory:
      'Traversing mountain trails reveals ancient footpath networks used by indigenous Vedda hunters, royal messengers, and British botanical surveyors who documented Ceylon’s legendary flora in the 19th century.',
    highlights: [
      {
        title: 'Knuckles Mountain Range Wilderness',
        desc: 'A rugged mountain range shaped like clenched knuckles, featuring 34 distinct peaks, pygmy cloud forests, cascading natural pools, and hidden villages.',
        tag: 'UNESCO Biosphere',
      },
      {
        title: 'Ella Rock & Little Adam’s Peak',
        desc: 'Iconic highland hikes starting through railway tracks, eucalyptus woods, and ascending to dizzying 1,000m cliff views gazing across Ella Gap.',
        tag: 'Panoramas',
      },
      {
        title: 'Horton Plains & World’s End Precipice',
        desc: 'A high-altitude windswept plateau terminating abruptly in a dramatic 870-meter vertical sheer drop into the Southern plains.',
        tag: 'Vertical Drop',
      },
      {
        title: 'The Pekoe Trail Stage Treks',
        desc: 'A 300km curated long-distance walking trail through historical tea country, connecting remote tea factories, hill towns, and forest passes.',
        tag: 'Heritage Trail',
      },
    ],
    gearChecklist: [
      {
        item: 'Sturdy Hiking Boots with Lugged Soles',
        detail: 'Mountain trails involve loose gravel, wet granite slabs, and muddy tree roots requiring dependable ankle support and grip.',
      },
      {
        item: 'Leech Socks (Knuckles & Rainforest Trails)',
        detail: 'Essential when trekking wet forest sections. Tightly woven leech socks worn over regular socks prevent harmless but irritating leeches.',
      },
      {
        item: 'Packable Rain Poncho & Warm Layers',
        detail: 'Mountain weather changes rapidly from warm sunshine to cold highland drizzle. Pack a lightweight waterproof shell.',
      },
      {
        item: 'Trekking Poles & Headlamp',
        detail: 'Poles significantly reduce knee strain on steep descents, and a headlamp is mandatory for sunrise summit climbs starting before dawn.',
      },
    ],
    safetyTips: [
      {
        heading: 'Always Hire a Certified Guide in Knuckles',
        advice: 'Dense mountain fog can envelope ridge trails within 5 minutes. Trekking with a knowledgeable local tracker ensures you remain on safe trails.',
      },
      {
        heading: 'Carry Minimum 2 Liters of Drinking Water',
        advice: 'High-altitude hiking under tropical humidity requires constant hydration. Bring a reusable water bottle or hydration bladder.',
      },
      {
        heading: 'Stay Back from World’s End Cliff Edges',
        advice: 'There are no safety fences at World’s End or Ella Rock cliff tops. Maintain a safe distance of at least 2 meters from sheer drops.',
      },
    ],
    seasonGuide: [
      { season: 'Highland Dry Season (Jan to Apr)', conditions: 'Clear blue mountain skies, crystal sharp visibility from viewpoints, dry forest trails.' },
      { season: 'Southwest Mountain Season (Jul to Sep)', conditions: 'Lush green tea plantations, rushing waterfalls at peak flow, cool mountain temperatures.' },
    ],
  },

  'blue whale & dolphin expeditions': {
    sinhalaName: 'තල්මසුන් සහ ඩොල්ෆින් නැරඹීම (Thalmasun Narambima)',
    activityLevel: 'Ocean Wildlife Safari',
    bestTimeOfDay: 'Early Morning Boat Departures (6:00 AM – 6:30 AM)',
    idealSeasons: 'Mirissa (Nov–Apr) | Trincomalee (May–Sep)',
    adventureOverview:
      'Sri Lanka is one of the only places on Earth where the largest creature to ever live — the magnificent Blue Whale (Balaenoptera musculus) — can be observed just a few nautical miles off the coast. The deep underwater continental shelf drops off steeply near Mirissa in the south and Trincomalee in the east, creating rich upwelling nutrient currents that attract resident pods of blue whales, sperm whales, and thousands of acrobatic spinner dolphins.',
    localStory:
      'Sri Lankan waters were declared a designated whale sanctuary in 1979. Coastal fishing communities have embraced ocean stewardship, transitioning from deep-sea fishing to responsible marine eco-tourism.',
    highlights: [
      {
        title: 'Blue Whale Fluke Dives',
        desc: 'Witnessing a 30-meter, 150-ton giant arch its massive back, blow a 10-meter spout of ocean mist, and lift its iconic tail fluke into the air before diving.',
        tag: 'Gentle Giant',
      },
      {
        title: 'Sperm Whale Pods',
        desc: 'The ocean’s deepest-diving toothed whales gathering in sociable family pods off the continental trench shelf.',
        tag: 'Deep Divers',
      },
      {
        title: 'Spinner Dolphin Super-Pods',
        desc: 'Hundreds of energetic spinner dolphins leaping 3 meters out of the water, performing multiple barrel spins alongside the boat’s bow wave.',
        tag: 'Acrobatic Pods',
      },
      {
        title: 'Pelagic Marine Encounters',
        desc: 'Chance sightings of rare Bryde’s whales, pilot whales, oceanic white-tip sharks, flying fish, and nesting Olive Ridley sea turtles.',
        tag: 'Ocean Diversity',
      },
    ],
    gearChecklist: [
      {
        item: 'Motion Sickness Prevention Tablets',
        detail: 'Indian Ocean swells can induce seasickness even in calm weather. Take motion sickness medication 30 minutes before boarding.',
      },
      {
        item: 'Polarized Sunglasses',
        detail: 'Polarized lenses eliminate reflective glare from ocean water, allowing you to clearly see whales swimming several meters under the surface.',
      },
      {
        item: 'Waterproof Phone Case / Dry Bag',
        detail: 'Protects delicate electronics and smartphones from ocean spray and salt mist while aboard open-deck boats.',
      },
      {
        item: 'Wide-Brim Sun Hat with Strap',
        detail: 'Ocean breezes are breezy and the sun is intense over open water. A secure strap prevents your hat from blowing away.',
      },
    ],
    safetyTips: [
      {
        heading: 'Insist on Responsible Eco-Friendly Vessels',
        advice: 'Book operators certified by the Department of Wildlife Conservation that keep an ethical 100m distance and never chase mothers with calves.',
      },
      {
        heading: 'Always Fasten Your Life Jacket',
        advice: 'Life jackets must remain securely fastened throughout the entire offshore voyage, particularly when moving around viewing decks.',
      },
      {
        heading: 'Choose Morning Departures',
        advice: 'Ocean swells are calmest at sunrise, providing the smoothest ride and the highest probability of spotting whale spouts against the horizon.',
      },
    ],
    seasonGuide: [
      { season: 'Mirissa Season (Nov to Apr)', conditions: 'Calm seas along the South Coast, peak whale sightings, excellent morning visibility.' },
      { season: 'Trincomalee Season (May to Sep)', conditions: 'Calm Eastern Ocean waters, sperm whale super-pods, deep blue bay conditions.' },
    ],
  },

  'white water rafting & canyoning': {
    sinhalaName: 'කැලණි ගඟේ ජල ක්‍රීඩා (Kelani Gange Jala Kreeda)',
    activityLevel: 'High Adrenaline Water Adventure',
    bestTimeOfDay: 'Morning (9:00 AM – 1:00 PM)',
    idealSeasons: 'Year-Round (Water levels peak with monsoon rains)',
    adventureOverview:
      'Kitulgala, nestled in the dense wet-zone rainforests of the Kelani River Valley, is Sri Lanka’s premier white water rafting and adventure playground. Rushing mountain waters plunge through grade 3 and grade 4 churning rapids with legendary names like "Killer Fall", "Head Chopper", and "Butter Crunch". Adventure seekers can combine river rafting with exhilarating jungle canyoning: sliding down natural polished granite water chutes and abseiling down roaring rainforest waterfalls.',
    localStory:
      'Kitulgala’s lush rainforest backdrop achieved global fame as the filming location for Sir David Lean’s 1957 classic "The Bridge on the River Kwai", which won seven Academy Awards. The river remains one of the cleanest in South Asia.',
    highlights: [
      {
        title: 'Grade 3 & 4 Kelani River Rapids',
        desc: 'A thrilling 5km white water run navigating seven distinct rapids surrounded by hanging jungle vines and roaring emerald rapids.',
        tag: 'White Water',
      },
      {
        title: 'Natural Granite Canyon Sliding',
        desc: 'Hike into hidden rainforest tributaries to slide down polished natural rock water flumes into deep, refreshing freshwater pools.',
        tag: 'Canyoning',
      },
      {
        title: 'Waterfall Abseiling & Rappelling',
        desc: 'Harness up and rappel directly down roaring 30-meter jungle waterfalls alongside certified white-water mountaineering guides.',
        tag: 'Adrenaline',
      },
      {
        title: 'Belilena Prehistoric Cave',
        desc: 'A nearby prehistoric rock shelter where archaeological excavations discovered skeletal remains of 30,000-year-old "Balangoda Man".',
        tag: 'Ancient History',
      },
    ],
    gearChecklist: [
      {
        item: 'Quick-Drying Swimwear or Boardshorts',
        detail: 'Avoid heavy cotton fabrics which absorb water and weigh you down. Quick-dry polyester or nylon rash guards are ideal.',
      },
      {
        item: 'Water Shoes or Trainers with Rubber Grip',
        detail: 'Mandatory footwear for navigating slippery river stones and riverbed boulders. Flip-flops and loose sandals are prohibited.',
      },
      {
        item: 'Waterproof Action Camera with Head Mount',
        detail: 'Secure your GoPro with a floaty handle or helmet strap to capture wild rapid crashes and canyoning jumps hands-free.',
      },
      {
        item: 'Dry Clothes & Towel for After Rafting',
        detail: 'Kitulgala adventure camps have hot showers and changing cabins where you can freshen up before enjoying a traditional village lunch.',
      },
    ],
    safetyTips: [
      {
        heading: 'Follow River Guide Commands Instantly',
        advice: 'Your steersman will call commands like "Paddle Forward!", "Back!", or "Hold!". Synchronized paddling keeps the raft upright in big drops.',
      },
      {
        heading: 'Float Feet-First If You Tumble In',
        advice: 'If tossed into white water, do not panic: adopt the defensive swimming posture on your back with feet pointed downstream to deflect off rocks.',
      },
      {
        heading: 'Ensure CE-Certified Helmets & Life Vests',
        advice: 'Only use safety gear that fits snugly. Double-check all buckle clips and chin straps before launching the raft.',
      },
    ],
    seasonGuide: [
      { season: 'Southwest Monsoon (May to Sep)', conditions: 'High river flow, churning adrenaline grade 4 rapids, thrilling high water conditions.' },
      { season: 'Dry Season (Dec to Apr)', conditions: 'Crystal clear emerald waters, technical rock navigation, perfect for families and beginners.' },
    ],
  },
};

function generateFallbackExperienceDossier(title: string, tagline: string, desc: string): ExperienceDossier {
  return {
    sinhalaName: `${title} (ශ්‍රී ලංකා වික්‍රමාන්විත)`,
    activityLevel: 'Outdoor Adventure Experience',
    bestTimeOfDay: 'Morning (7:00 AM – 11:00 AM) or Late Afternoon',
    idealSeasons: 'Year-Round (Weather permitting)',
    adventureOverview:
      desc ||
      `${title} is one of Sri Lanka’s most exhilarating outdoor experiences. Immerse yourself in the island’s rich natural landscapes, thrilling terrain, and authentic local guidance.`,
    localStory:
      'Rooted in Sri Lanka’s abundant natural beauty, protected biospheres, and warm island hospitality that welcomes adventure travelers from across the world.',
    highlights: [
      {
        title: `${title} Signature Adventure`,
        desc: 'The premier route and key viewpoints that make this activity legendary across the island.',
        tag: 'Highlight',
      },
      {
        title: 'Scenic Natural Backdrop',
        desc: 'Surrounded by pristine coastlines, lush mountain rainforests, or untamed national sanctuaries.',
        tag: 'Landscape',
      },
      {
        title: 'Local Island Guides',
        desc: 'Experienced local trackers and instructors who ensure safe, unforgettable excursions.',
        tag: 'Local Expertise',
      },
      {
        title: 'Thrilling Photo Vantage Points',
        desc: 'Unmatched vistas and dramatic angles perfect for capturing memories of your journey.',
        tag: 'Vantage Point',
      },
    ],
    gearChecklist: [
      {
        item: 'Comfortable Outdoor Clothing',
        detail: 'Breathable, lightweight clothing suitable for tropical weather conditions and active movement.',
      },
      {
        item: 'Reliable Footwear',
        detail: 'Sturdy trail shoes or water-safe footwear depending on the terrain of your adventure.',
      },
      {
        item: 'Sun Protection & Hydration',
        detail: 'Wide-brim hat, high-SPF sunscreen, and a refillable water bottle to stay hydrated.',
      },
      {
        item: 'Dry Bag / Water Protection',
        detail: 'Protects mobile phones, cameras, and personal essentials during outdoor expeditions.',
      },
    ],
    safetyTips: [
      {
        heading: 'Engage Certified Local Instructors',
        advice: 'Always embark on outdoor adventures accompanied by licensed guides who understand local tides, trails, and weather patterns.',
      },
      {
        heading: 'Check Current Weather Conditions',
        advice: 'Confirm local weather forecasts and safety recommendations before departing on outdoor excursions.',
      },
    ],
    seasonGuide: [
      { season: 'Dry Season Months', conditions: 'Optimal clear skies, smooth trails, and maximum outdoor visibility.' },
      { season: 'Inter-Monsoon Months', conditions: 'Lush tropical greenery, dramatic skies, and refreshing island showers.' },
    ],
  };
}

async function getExperienceItem(idOrSlug: string) {
  const numericId = parseInt(idOrSlug, 10);
  if (!isNaN(numericId)) {
    try {
      const dbItem = await prisma.experienceItem.findUnique({
        where: { id: numericId },
      });
      if (dbItem) return dbItem;
    } catch (e) {
      console.error('Error fetching experience item by ID:', e);
    }
    const fallback = FALLBACK_EXPERIENCES.find((e) => e.id === numericId);
    if (fallback) return fallback;
  }

  // Try matching slug or title in DB
  try {
    const allDb = await prisma.experienceItem.findMany();
    const found = allDb.find(
      (e) =>
        e.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === idOrSlug.toLowerCase() ||
        e.title.toLowerCase() === idOrSlug.toLowerCase().replace(/-/g, ' ')
    );
    if (found) return found;
  } catch (e) {
    console.error('Error searching experience items in DB:', e);
  }

  // Try matching fallback slug or title
  const cleanParam = idOrSlug.toLowerCase();
  const fallbackMatch = FALLBACK_EXPERIENCES.find(
    (e) =>
      e.slug === cleanParam ||
      e.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === cleanParam ||
      e.title.toLowerCase().includes(cleanParam.replace(/-/g, ' '))
  );
  if (fallbackMatch) return fallbackMatch;

  return null;
}

async function getRelatedAdventurePlaces(): Promise<Place[]> {
  try {
    const raw = await prisma.place.findMany({
      where: {
        category: {
          in: ['Beaches', 'Mountains', 'Wildlife', 'Waterfalls'],
        },
        featured: 1,
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
  const item = await getExperienceItem(id);
  if (!item) {
    return {
      title: 'Island Experience & Adventure — UncoverCeylon',
      description: 'Discover world-class surfing, scenic train rides, safaris, and outdoor adventures in Sri Lanka.',
    };
  }

  const title = `${item.title} — Outdoor Adventures & Experiences in Sri Lanka | UncoverCeylon`;
  const description = `${item.tagline}. ${item.desc}`.slice(0, 160);

  return {
    title,
    description,
    keywords: [
      item.title,
      'Sri Lanka adventure',
      'Sri Lanka activities',
      item.badge,
      item.seasons || 'Sri Lanka experiences',
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
      canonical: `https://uncoverceylon.com/experiences/${id}`,
    },
  };
}

export default async function ExperienceDetailPage({ params }: PageProps) {
  const { id } = await params;
  const item = await getExperienceItem(id);

  if (!item) {
    notFound();
  }

  const lookupKey = item.title.toLowerCase().trim();
  const dossier =
    EXPERIENCE_DOSSIERS[lookupKey] ||
    Object.entries(EXPERIENCE_DOSSIERS).find(([key]) => lookupKey.includes(key))?.[1] ||
    generateFallbackExperienceDossier(item.title, item.tagline, item.desc);

  const relatedPlaces = await getRelatedAdventurePlaces();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: item.title,
    description: item.desc,
    image: item.image,
    alternateName: dossier.sinhalaName,
    touristType: ['Adventure Tourism', 'Eco Tourism', 'Outdoor Recreation'],
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
          name: 'Island Experiences',
          item: 'https://uncoverceylon.com/experiences',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: item.title,
          item: `https://uncoverceylon.com/experiences/${id}`,
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
              href="/experiences"
              className="text-slate-400 hover:text-white transition-colors truncate"
            >
              Island Experiences
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <span className="text-emerald-400 font-bold truncate">
              {item.title}
            </span>
          </div>

          <Link
            href="/experiences"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold transition-all shrink-0 ml-3 text-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">All Experiences</span>
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
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#10b981]/20 backdrop-blur-md text-emerald-300 text-xs font-black uppercase tracking-wider border border-[#10b981]/30">
                <Compass className="w-3.5 h-3.5" />
                <span>{item.badge || 'Curated Adventure'}</span>
              </span>

              {item.seasons && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white/90 text-xs font-semibold border border-white/15">
                  <Calendar className="w-3 h-3 text-emerald-400" />
                  <span>{item.seasons}</span>
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
                <span>{item.seasons || 'Island-wide'}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-emerald-300 font-semibold backdrop-blur-md">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{dossier.activityLevel}</span>
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
                Optimal Timing
              </span>
              <span className="text-xs sm:text-sm font-black text-slate-900 block mt-0.5 truncate" title={dossier.bestTimeOfDay}>
                {dossier.bestTimeOfDay}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 min-w-0 pt-2 lg:pt-0 lg:pl-6">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block truncate">
                Ideal Seasons
              </span>
              <span className="text-xs sm:text-sm font-black text-slate-900 block mt-0.5 truncate" title={dossier.idealSeasons}>
                {dossier.idealSeasons}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 min-w-0 pt-4 lg:pt-0 lg:pl-6">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block truncate">
                Activity Level
              </span>
              <span className="text-xs sm:text-sm font-black text-slate-900 block mt-0.5 truncate" title={dossier.activityLevel}>
                {dossier.activityLevel}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 min-w-0 pt-4 lg:pt-0 lg:pl-6">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block truncate">
                Classification
              </span>
              <span className="text-xs sm:text-sm font-black text-slate-900 block mt-0.5 truncate" title={item.badge || 'Adventure'}>
                {item.badge || 'Adventure'}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* ━━━ 4. MAIN CONTENT & DOSSIER ━━━ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12 sm:space-y-16">
        
        {/* Adventure Narrative & Island Story */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00aa6c]" />
            <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#00aa6c]">
              Adventure Dossier & Coast-to-Coast Guide
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
              <p className="font-normal">
                {dossier.adventureOverview}
              </p>
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-1.5">
                <h3 className="text-xs font-black uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-[#00aa6c]" />
                  <span>The Island Story</span>
                </h3>
                <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed font-medium">
                  {dossier.localStory}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Experience Snapshot
              </h3>
              <ul className="space-y-3 text-xs text-slate-600">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Fitness Level:</strong> {dossier.activityLevel}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Optimal Departure:</strong> {dossier.bestTimeOfDay}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Seasonality:</strong> {dossier.idealSeasons}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Badge:</strong> {item.badge || 'Popular'}</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Accordion / Collapsible Sections for Details */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
              Hotspots, Gear Checklist & Safety Guide
            </h2>
            <span className="text-xs text-slate-400 font-semibold">
              Click to expand
            </span>
          </div>

          <ExperienceAccordionSections
            highlights={dossier.highlights}
            gearChecklist={dossier.gearChecklist}
            safetyTips={dossier.safetyTips}
            seasonGuide={dossier.seasonGuide}
          />
        </section>

        {/* Related Adventure Places from Database */}
        {relatedPlaces.length > 0 && (
          <section className="space-y-6 pt-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <span className="text-[#00aa6c] text-xs font-black uppercase tracking-wider">
                  Verified Adventure Destinations
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mt-1">
                  Explore Outdoor Hotspots
                </h2>
              </div>
              <Link
                href="/destinations"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#00aa6c] hover:underline"
              >
                <span>View all destinations</span>
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
              <span>Epic Island Adventures</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Ready to Explore Sri Lanka?
            </h2>
            <p className="text-white/80 text-xs sm:text-base leading-relaxed">
              From dawn surf patrols to high mountain cloud forest summits, experience the untamed beauty of Ceylon.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/experiences"
                className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-500/25"
              >
                Browse All Experiences
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
