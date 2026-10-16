export interface ExperienceVariety {
  name: string;
  tag: string;
  desc: string;
}

export interface NearbyExperienceSpot {
  name: string;
  distance: string;
  desc: string;
}

export interface IslandExperienceItem {
  id: number;
  slug: string;
  title: string;
  tagline: string;
  sub: string;
  tag: 'surf' | 'safari' | 'rail' | 'hiking' | 'ocean' | 'adrenaline' | string;
  categoryLabel: string;
  season: string;
  badge: string;
  timing: string;
  entryInfo: string;
  difficulty: string;
  locations: string;
  img: string;
  seed: string;
  desc: string;
  heritage: string;
  ancientRoots: string;
  varieties: ExperienceVariety[];
  gearChecklist: string;
  localSafetyTips: string;
  nearbySpots?: NearbyExperienceSpot[];
}

export const EXPERIENCES_DATA: IslandExperienceItem[] = [
  {
    id: 1,
    slug: 'world-class-surfing',
    title: 'World-Class Surfing on Peeling Breaks',
    tagline: 'Year-Round Warm Ocean Swells & Bohemian Bays',
    sub: 'Weligama · Hiriketiya · Arugam Bay',
    tag: 'surf',
    categoryLabel: 'Surf Breaks',
    season: 'South Coast: Nov–Apr · East Coast: May–Sep',
    badge: 'Popular',
    timing: 'Dawn Patrol (6:00 AM – 8:30 AM) or Glassy Sunset',
    entryInfo: 'Board rental ~LKR 1,500/hr · 1-on-1 Lessons ~LKR 4,000',
    difficulty: 'All Levels: Beginner beach breaks to Pro reef points',
    locations: 'Weligama · Midigama · Hiriketiya · Arugam Bay',
    img: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1200&q=85',
    seed: 'surfexp',
    desc: 'With two alternating monsoon seasons, Sri Lanka is a year-round tropical surf sanctuary. From gentle sandy beginner rollers in Weligama to the legendary peeling right-hand point break of Arugam Bay.',
    heritage: "Sri Lanka's surf culture took root in the 1970s when pioneering travelers discovered the endless peeling right-hand point breaks of Arugam Bay on the remote eastern shoreline. Today, the island offers an unmatched surf experience: bath-warm 28°C water without wetsuits, palm-fringed horseshoe bays, laid-back beachside smoothie shacks, and friendly local surf instructors who know every sandbank and reef contour by heart.",
    ancientRoots: "Because the southwest and northeast monsoons alternate throughout the year, when the south coast is blown out by rain from May to September, the eastern shores of Arugam Bay turn glassy and offshore.",
    varieties: [
      { name: 'Weligama Sandy Bay', tag: 'Beginner Paradise', desc: 'A vast protected sandy horseshoe bay with mellow gentle rollers, ideal for your very first wave.' },
      { name: 'Hiriketiya Horseshoe Cove', tag: 'Intermediate', desc: 'A bohemian jungle bay with a left-hand reef break on one side and a gentle beach break in the middle.' },
      { name: 'Arugam Bay Main Point', tag: 'Advanced Right', desc: 'World-famous sand-bottom point break offering long, clean right-hand peelers up to 400 meters.' },
      { name: 'Midigama Rams & Lazy Left', tag: 'Reef Breaks', desc: 'A collection of classic reef breaks along the coastal road with hollow barrels and deep water peaks.' }
    ],
    gearChecklist: 'UV rash vest, reef-safe mineral zinc sunblock, tropical surf wax, surfboard leash, and hydration electrolytes.',
    localSafetyTips: 'Respect local lineup etiquette: always yield to the surfer closest to the wave peak. Beware of shallow sea urchin beds on rocky reef breaks; wear booties if you are unfamiliar with entry and exit channels.',
    nearbySpots: [
      { name: 'Mirissa Secret Beach', distance: '6 km east of Weligama', desc: 'Hidden cove with tidal rock pools and beach bar.' },
      { name: 'Kushtarajagala Rock Carving', distance: '1 km from Weligama bay', desc: 'Ancient 9th-century Bodhisattva carved into coastal rock.' }
    ]
  },
  {
    id: 2,
    slug: 'blue-highland-train-journey',
    title: 'Blue Highland Train Journeys',
    tagline: 'The World’s Most Scenic Railway Through the Clouds',
    sub: 'Kandy to Ella · Nine Arch Bridge',
    tag: 'rail',
    categoryLabel: 'Scenic Rail',
    season: 'Year-Round (Best views: Dec–Apr & Jul–Aug)',
    badge: 'Must Do',
    timing: 'Morning departures (8:45 AM or 11:10 AM trains)',
    entryInfo: 'Reserved 2nd/3rd class tickets LKR 1,500 – 3,000',
    difficulty: 'Easy & Relaxing scenic train journey',
    locations: 'Kandy · Hatton · Nanu Oya · Ella',
    img: 'https://images.unsplash.com/photo-1535463731090-e34f4b5098c5?auto=format&fit=crop&w=1200&q=85',
    seed: 'trainjourney',
    desc: 'Winding through emerald tea estates, pine cloud forests, and mist-shrouded mountain passes. Hang out the open doorway as crisp highland air rushes past and cross the famous Demodara Nine Arch Bridge.',
    heritage: "Constructed by British colonial engineers in the late 19th century to transport Ceylon tea from high mountain plantations to Colombo harbor, this railway is widely considered the most beautiful train journey on Earth. The iconic blue carriages snake through 46 tunnels, hug precipitous cliff edges above deep green valleys, and cross gravity-defying viaducts built entirely of brick, stone, and cement without a single piece of steel.",
    ancientRoots: "The Demodara Nine Arch Bridge, built during World War I, was completed by local master builders who redesigned the spans using only stone masonry when steel was reallocated for wartime use.",
    varieties: [
      { name: 'Demodara Nine Arch Bridge', tag: 'Iconic Viaduct', desc: 'A 91-meter curved stone viaduct nestled inside thick jungle near Ella, famous for the passing blue train.' },
      { name: 'Great Western Mountain Pass', tag: 'Tea Valleys', desc: 'Sweeping emerald tea slopes with colorful sari-clad pickers waving at passengers.' },
      { name: 'Demodara Loop', tag: 'Engineering Feat', desc: 'A spiraling railway track that passes through a tunnel directly underneath its own station.' },
      { name: 'Nanu Oya High Plateau', tag: 'Misty Pines', desc: 'Ascending toward Nuwara Eliya through eucalyptus trees and cascading roadside waterfalls.' }
    ],
    gearChecklist: 'Camera with wide lens, light warm sweater or cardigan (mountain temperatures drop), bottled water, and local train snacks like hot vadai.',
    localSafetyTips: 'Book reserved seats 30 days in advance via Sri Lanka Railways online portal. When leaning out of open doorways for photos, always keep a firm grip with both hands and look ahead for incoming tunnel walls and foliage.',
    nearbySpots: [
      { name: 'Little Adam’s Peak, Ella', distance: '2 km from Ella station', desc: 'Gentle 45-minute hike through tea estates to a breathtaking ridge.' },
      { name: 'Ravana Falls', distance: '5 km south of Ella', desc: 'Cascading multi-tiered waterfall steeped in Ramayana mythology.' }
    ]
  },
  {
    id: 3,
    slug: 'wild-leopard-elephant-safari',
    title: 'Wild Leopard & Elephant Safaris',
    tagline: 'Untamed National Sanctuaries of Yala & Udawalawe',
    sub: 'Yala · Udawalawe · Minneriya',
    tag: 'safari',
    categoryLabel: 'Wildlife Safari',
    season: 'Best: Feb–July (Dry season when animals gather at waterholes)',
    badge: 'Big Game',
    timing: 'Dawn Safari (5:30 AM – 9:30 AM) or Afternoon (2:30 PM – 6:30 PM)',
    entryInfo: 'Park entry ticket + Private 4x4 Safari Jeep hire',
    difficulty: 'Easy jeep safari suitable for all ages',
    locations: 'Yala · Udawalawe · Wilpattu · Tissamaharama',
    img: 'https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?auto=format&fit=crop&w=1200&q=85',
    seed: 'safariexp',
    desc: 'Sri Lanka boasts the highest density of wild leopards on Earth in Yala Block 1, alongside hundreds of gentle wild elephants roaming free across savannah plains, sloth bears, and mugger crocodiles.',
    heritage: "Sri Lanka has been a pioneer in wildlife conservation for over two millennia: King Devanampiya Tissa established the world's first recorded wildlife sanctuary at Mihintale in the 3rd Century BC. Today, Yala National Park's mix of scrub jungle, brackish coastal lagoons, and monumental granite rock boulders creates the ultimate predator habitat for Panthera pardus kotiya, the Sri Lankan leopard.",
    ancientRoots: "Because there are no lions or tigers on the island, the Sri Lankan leopard evolved as the undisputed apex predator of the ecosystem, making them far bolder and more easily observed basking on open rock slabs during daylight.",
    varieties: [
      { name: 'Yala National Park Block 1', tag: 'Leopard Kingdom', desc: 'World’s highest concentration of wild leopards, sloth bears, spotted deer, and wild boar.' },
      { name: 'Udawalawe Reservoir Safari', tag: 'Elephant Haven', desc: 'Guaranteed sightings of large wild elephant breeding herds and playful baby calves in open grasslands.' },
      { name: 'Minneriya Elephant Gathering', tag: 'Annual Wonder', desc: 'Between July and October, up to 300+ wild elephants gather on dried lakebeds to socialize and graze.' },
      { name: 'Wilpattu Leopard & Villu Safari', tag: 'Lakes & Forest', desc: 'Dense rainforest wilderness centered around natural sand-rimmed rainwater lakes (villus).' }
    ],
    gearChecklist: 'High-magnification binoculars, telephoto camera lens (70-300mm), dust scarf or bandana, polarized sunglasses, and neutral earth-toned clothing.',
    localSafetyTips: 'Never stand up or hang out of the safari jeep. Always maintain quiet voices when approaching wild elephants. Choose experienced, ethical safari drivers who do not crowd or harass animals around sightings.',
    nearbySpots: [
      { name: 'Elephant Transit Home, Udawalawe', distance: '1 km from park entrance', desc: 'Rehabilitation center nursing orphaned baby elephants before wild release.' },
      { name: 'Tissa Wewa Bird Lake', distance: 'Tissamaharama town', desc: 'Ancient reservoir shaded by giant rain trees roosting thousands of flying foxes.' }
    ]
  },
  {
    id: 4,
    slug: 'blue-whale-ocean-safari',
    title: 'Blue Whale & Dolphin Expeditions',
    tagline: 'Giants of the Deep Ocean Trench',
    sub: 'Mirissa · Trincomalee · Kalpitiya',
    tag: 'ocean',
    categoryLabel: 'Ocean Safari',
    season: 'Mirissa: Nov–Apr · Trincomalee: May–Sep · Kalpitiya: Nov–Apr',
    badge: 'Ocean Safari',
    timing: '6:30 AM departure (Calm morning ocean conditions)',
    entryInfo: 'Ethical boat expedition ticket ~LKR 12,000 – 18,000',
    difficulty: 'Moderate boat trip (Sea-sickness medication recommended)',
    locations: 'Mirissa · Southern Coast · Trincomalee',
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=85',
    seed: 'whaleexp',
    desc: 'The deep underwater continental shelf drops just 5 nautical miles off Mirissa, bringing the largest creatures to ever exist on planet Earth—mighty Blue Whales—within easy reach of the coastline.',
    heritage: "Sri Lanka's southern coastline is uniquely positioned along the global migration highway of marine giants. Nutrient-rich upwellings from deep submarine trenches attract resident and migratory pods of Blue Whales (reaching up to 30 meters in length), Sperm Whales, Bryde’s Whales, and super-pods of playful Spinner Dolphins that leap in synchronized acrobatics alongside boat bows.",
    ancientRoots: "The southern tip of Sri Lanka is one of the very few places in the world where blue whales can be observed year-round due to the island’s steep drop-off directly into abyssal depths.",
    varieties: [
      { name: 'Blue Whale Deep Encounters', tag: 'Ocean Giant', desc: 'Spotting massive 10-meter vapor blows and the iconic tail fluke diving into azure waters.' },
      { name: 'Spinner Dolphin Super-Pods', tag: 'Acrobatics', desc: 'Hundreds of spinning dolphins riding boat bow waves and leaping multiple body-lengths into the air.' },
      { name: 'Sperm Whale Pods', tag: 'Deep Divers', desc: 'Enormous toothed whales diving thousands of feet into the ocean trenches to hunt giant squid.' },
      { name: 'Trincomalee Swami Rock Trench', tag: 'East Coast Safari', desc: 'Deep-water whale watching off the serene natural harbor of Trincomalee during the summer monsoon.' }
    ],
    gearChecklist: 'Sea-sickness tablets (take 30 mins before boarding), wide-brim hat with chin strap, sunscreen, and telephoto camera lens.',
    localSafetyTips: 'Only book with licensed, ethical operators adhering to international whale-watching safety codes: keeping at least 100 meters distance and never cutting across the path of a mother and calf.',
    nearbySpots: [
      { name: 'Coconut Tree Hill, Mirissa', distance: '2 km from harbor', desc: 'Iconic dome-shaped palm promontory overlooking turquoise waves.' },
      { name: 'Parrot Rock, Mirissa', distance: 'Mirissa main beach', desc: 'Clamber up this small red islet at low tide for beach views.' }
    ]
  },
  {
    id: 5,
    slug: 'white-water-rafting-kitulgala',
    title: 'Kitulgala White Water Rafting & Canyoning',
    tagline: 'Jungle River Rapids & Rainforest Waterfalls',
    sub: 'Kitulgala · Kelani River Valley',
    tag: 'adrenaline',
    categoryLabel: 'Adrenaline Rush',
    season: 'Year-Round (Best thrill after monsoon rains)',
    badge: 'Thrills',
    timing: 'Morning sessions (9:00 AM – 1:00 PM) for clear river waters',
    entryInfo: 'Rafting + Canyoning package ~LKR 5,000 – 8,000 per person',
    difficulty: 'Moderate: Grade 2 & 3 rapids (No prior experience needed)',
    locations: 'Kitulgala · Sabaragamuwa Province',
    img: 'https://images.unsplash.com/photo-1467173572719-f14b9fb86e5f?auto=format&fit=crop&w=1200&q=85',
    seed: 'raftingexp',
    desc: 'Paddle through churning Class 3 and 4 rapids down the lush jungle-fringed Kelani River where ‘The Bridge on the River Kwai’ was filmed, combined with natural rock sliding and waterfall jumps.',
    heritage: "Kitulgala is Sri Lanka’s undisputed adventure capital, tucked in a lush wet-zone rainforest gorge where crystal-clear mountain tributaries cascade into the mighty Kelani River. After navigating famous rapids named 'Virgin’s Breast', 'Butter Crunch', and 'Killer Fall', adventurers can hike into hidden jungle ravines for canyoning—sliding down smooth mossy rock shoots into deep natural plunge pools.",
    ancientRoots: "The prehistoric Belilena Caves located in the nearby rainforest hills have yielded human skeletal remains of the 'Balangoda Man' dating back over 30,000 years.",
    varieties: [
      { name: 'Kelani River White Water Run', tag: 'Class 3 Rapids', desc: 'A 5-kilometer exhilarating river descent navigating 7 distinct adrenaline-pumping rapids.' },
      { name: 'Rainforest Canyoning & Rock Slides', tag: 'Water Slides', desc: 'Natural water-carved stone shoots where you slide into deep, emerald-green jungle pools.' },
      { name: 'Waterfall Abseiling (Rappelling)', tag: 'Vertical Thrill', desc: 'Rappelling down the face of a cascading 100-foot jungle waterfall with safety harness and ropes.' },
      { name: 'Flat-Water Jungle Kayaking', tag: 'Scenic Paddle', desc: 'Peaceful paddling downstream spotting endemic kingfishers, monitor lizards, and hornbills.' }
    ],
    gearChecklist: 'Quick-dry swim shorts, water booties or secure sandals (no flip-flops), waterproof action camera, and dry change of clothes.',
    localSafetyTips: 'Lifejackets and certified white-water helmets are mandatory on all river runs. Listen intently to the river guide’s paddle commands (Forward, Back, Hold, Get Down). Secure all eyeglasses with a strap.',
    nearbySpots: [
      { name: 'Belilena Prehistoric Cave', distance: '8 km from Kitulgala', desc: 'Archaeological cave site revealing Stone Age hunter-gatherer tools.' },
      { name: 'Makandawa Rainforest Reserve', distance: 'Cross river by dugout canoe', desc: 'One of the oldest bird sanctuaries in Sri Lanka with 54 endemic species.' }
    ]
  },
  {
    id: 6,
    slug: 'knuckles-cloud-forest-trekking',
    title: 'Knuckles Range Cloud Forest Trekking',
    tagline: 'Misty Ridges, Hidden Cascades & Endemic Wilderness',
    sub: 'Matale & Kandy Borders · Central Highlands',
    tag: 'hiking',
    categoryLabel: 'Mountain Trek',
    season: 'Best: Dec–Apr & Jun–Sep (Driest hiking months)',
    badge: 'Adventure',
    timing: 'Early morning start (7:00 AM) to summit before afternoon mist',
    entryInfo: 'Forest Department Pass + Mandatory Certified Forest Guide',
    difficulty: 'Moderate to Challenging: Steep rocky terrain & stream crossings',
    locations: 'Rangala · Corbet’s Gap · Meemure · Matale',
    img: 'https://images.unsplash.com/photo-1576706374778-95a95efff7b1?auto=format&fit=crop&w=1200&q=85',
    seed: 'knucklesexp',
    desc: 'Named for its striking resemblance to the knuckles of a clenched fist, this UNESCO World Heritage mountain range features 34 peaks, dwarf cloud forests, cascading waterfalls, and ancient isolated villages.',
    heritage: "Rising sharply between Kandy and the eastern dry plains, the Knuckles Mountain Range is one of Sri Lanka’s most critical biodiversity hotspots. Shrouded in perpetual highland mist, its microclimates range from lowland dry forest to stunted elfin moss forests at 1,900m summits. Hidden deep within the range lies Meemure, one of the country's most isolated traditional villages, where villagers still practice sustainable chena cultivation.",
    ancientRoots: "The range is home to species found nowhere else on planet Earth, including the endemic leaf-nosed lizard (Ceratophora tennentii) and rare highland dwarf orchids.",
    varieties: [
      { name: 'Corbet’s Gap & Cloud Forest Ridge', tag: 'Viewpoint', desc: 'A windswept deep mountain gap offering dramatic drop-offs into rolling valleys and pine forests.' },
      { name: 'Meemure Isolated Village Trail', tag: 'Cultural Trek', desc: 'A remote 14-km trek descending into a secluded ancient village shaded by the pyramid peak Lakegala.' },
      { name: 'Five Knuckles Peak Summit', tag: 'Challenging', desc: 'Full-day rugged ridge climb traversing the distinct granite knuckles with 360-degree panoramas.' },
      { name: 'Sera Ella & Mini World’s End', tag: 'Cascades', desc: 'A dramatic twin waterfall with a natural cave path directly behind the cascading curtain of water.' }
    ],
    gearChecklist: 'Sturdy hiking boots with ankle support, anti-leech socks, rain poncho, lightweight thermal jacket, trail snacks, and insect repellent.',
    localSafetyTips: 'Never hike the Knuckles without a registered local guide; dense fog and sudden squalls can drop visibility to near zero within minutes. Carry plenty of drinking water as mountain springs require purification.',
    nearbySpots: [
      { name: 'Lakegala Mountain Peak', distance: 'Meemure boundary', desc: 'Sharp pyramid mountain where King Ravana is said to have launched his flying chariot.' },
      { name: 'Hunnasgiriya Viewpoint', distance: 'En route to Rangala', desc: 'Spectacular hairpin bends with sweeping valley views.' }
    ]
  },
  {
    id: 7,
    slug: 'pigeon-island-marine-snorkeling',
    title: 'Pigeon Island Marine Coral Snorkeling',
    tagline: 'Live Coral Reefs, Sea Turtles & Blacktip Reef Sharks',
    sub: 'Nilaveli · Trincomalee · Eastern Coast',
    tag: 'ocean',
    categoryLabel: 'Marine Safari',
    season: 'Best: May to October (Calm turquoise waters on east coast)',
    badge: 'Marine Park',
    timing: '8:30 AM – 11:30 AM (Crystal clear visibility before afternoon breeze)',
    entryInfo: 'Marine National Park Ticket + Boat Transfer from Nilaveli Beach',
    difficulty: 'Easy snorkeling suitable for families and beginners',
    locations: 'Nilaveli · Trincomalee · Eastern Province',
    img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=85',
    seed: 'pigeonexp',
    desc: 'Located 1 km off the powdery white sands of Nilaveli Beach, Pigeon Island is one of Sri Lanka’s two marine national parks, containing shallow live coral gardens teeming with hundreds of tropical fish species.',
    heritage: "Named after the wild rock pigeons that nest in its rocky crevices, Pigeon Island is a marine sanctuary renowned for its powdery white coral sands and crystalline turquoise shallows. Snorkelers swimming straight off the beach can encounter harmless juvenile Blacktip Reef Sharks patrolling coral gullies, alongside endangered Hawksbill and Green Sea Turtles grazing on seagrass and soft corals.",
    ancientRoots: "The island's coral reef comprises over 100 species of live stony corals, including vibrant branching Acropora corals, brain corals, and purple sea anemones hosting clownfish colonies.",
    varieties: [
      { name: 'Blacktip Reef Shark Shallows', tag: 'Shark Encounter', desc: 'Snorkel alongside docile juvenile blacktip reef sharks in shallow 2-meter turquoise waters.' },
      { name: 'Sea Turtle Coral Corridors', tag: 'Marine Life', desc: 'Gliding above majestic Hawksbill turtles gently coming up for breath above colorful coral heads.' },
      { name: 'Live Acropora Coral Gardens', tag: 'Coral Diversity', desc: 'Expansive fields of staghorn, table, and brain corals teeming with clownfish, parrotfish, and angelfish.' },
      { name: 'Outer Reef Wall Drift', tag: 'Deep Snorkel', desc: 'For strong swimmers: a steep coral wall drop-off hosting giant trevally, barracuda, and moray eels.' }
    ],
    gearChecklist: 'Fins, mask, snorkel, reef-safe mineral sunscreen (protects fragile corals), and a waterproof underwater phone pouch or GoPro.',
    localSafetyTips: 'Never stand on, kick, or touch live coral formations as they take decades to regenerate. Do not touch or chase sea turtles. Wear a rash vest to prevent sunburn while floating.',
    nearbySpots: [
      { name: 'Nilaveli Powder White Beach', distance: '1 km boat ride to mainland', desc: 'Wide, uncrowded white sand beach with shallow, warm swimming waters.' },
      { name: 'Koneswaram Kovil (Temple of Thousand Pillars)', distance: '16 km south in Trinco', desc: 'Iconic clifftop Hindu temple perched high above the Indian Ocean.' }
    ]
  },
  {
    id: 8,
    slug: 'hot-air-ballooning-kandalama',
    title: 'Hot Air Ballooning Over Ancient Citadels',
    tagline: 'Floating at Sunrise Above Lakes, Jungles & Sigiriya',
    sub: 'Kandalama · Dambulla · Cultural Triangle',
    tag: 'adrenaline',
    categoryLabel: 'Aerial Flight',
    season: 'November to April (Calm morning winds across Cultural Triangle)',
    badge: 'Exclusive',
    timing: 'Dawn takeoff (6:00 AM) to catch first golden rays over lakes',
    entryInfo: 'Advance booking ~LKR 65,000 – 85,000 per person (Includes champagne)',
    difficulty: 'Easy & Peaceful scenic flight',
    locations: 'Kandalama · Dambulla · Habarana',
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=85',
    seed: 'balloonexp',
    desc: 'Drift silently with the morning wind over ancient reservoirs, lush tropical jungle canopies, wild elephant corridors, and the monolithic silhouette of Sigiriya Rock Fortress glowing pink at dawn.',
    heritage: "Hot air ballooning over the Cultural Triangle provides an eagle’s-eye perspective on how ancient Sinhala kings engineered their civilization. As your balloon gently lifts off from the shores of Kandalama Lake, you witness vast artificial lakes reflecting the morning sun, jungle waterways feeding green rice paddies, and wild peacocks taking flight through tree crowns below.",
    ancientRoots: "Pilots adjust altitude to skim just above the calm lake waters to touch lily pads, before firing the burners to ascend thousands of feet for panoramic vistas stretching toward the central highlands.",
    varieties: [
      { name: 'Sunrise Over Sigiriya Horizon', tag: 'Aerial Wonder', desc: 'Viewing the dramatic silhouette of Lion Rock Fortress rising sheer out of morning jungle mist.' },
      { name: 'Kandalama Lake Skim', tag: 'Water Reflection', desc: 'Floating inches above glassy lake waters reflecting water birds and lotus blossoms.' },
      { name: 'Wild Elephant Corridors', tag: 'Wildlife From Above', desc: 'Spotting wild elephant herds feeding peacefully in forest clearings undisturbed by engine noise.' },
      { name: 'Traditional Champagne Toast', tag: 'Celebration', desc: 'Landing in a rural village field and celebrating with chilled champagne and fresh tropical fruit.' }
    ],
    gearChecklist: 'Camera with wrist strap, comfortable flat walking shoes for field landing, sunhat, and lightweight layers for cool dawn air.',
    localSafetyTips: 'Flights are strictly weather-dependent; pilots make final safety calls based on morning wind speeds and fog. Book early in your itinerary so flights can be rescheduled in case of morning rain.',
    nearbySpots: [
      { name: 'Heritance Kandalama Hotel', distance: 'Overlooking lake', desc: 'Geoffrey Bawa’s architectural masterpiece carved into a natural cliff face.' },
      { name: 'Dambulla Cave Temples', distance: '10 km south', desc: 'Five ancient gilded cave sanctuaries.' }
    ]
  },
  {
    id: 9,
    slug: 'ella-rock-little-adams-peak',
    title: 'Ella Rock & Little Adam’s Peak Treks',
    tagline: 'Highland Gap Vistas, Tea Trails & Flying Ravana Zipline',
    sub: 'Ella · Badulla District · Uva Province',
    tag: 'hiking',
    categoryLabel: 'Highland Trails',
    season: 'Year-Round (Best clear mountain views: Dec–Apr)',
    badge: 'Popular Trek',
    timing: 'Sunrise start (5:30 AM for Little Adam’s / 7:00 AM for Ella Rock)',
    entryInfo: 'Free trail access (Zipline and Mega-Swing tickets sold on site)',
    difficulty: 'Little Adam’s: Easy (45 min) · Ella Rock: Moderate (3.5 hrs)',
    locations: 'Ella · Uva Province',
    img: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=85',
    seed: 'ellahike',
    desc: 'Ella is Sri Lanka’s adventure backpacker capital, nestled in a dramatic cleft in the central highlands with panoramic gap vistas reaching all the way to the southern Indian Ocean on clear mornings.',
    heritage: "Ella has evolved from a sleepy tea village into an international hiking haven. Little Adam’s Peak (named for its sacred mountain namesake) offers a gentle zigzag path through emerald tea plantations leading to a dramatic ridge overlooking Ella Gap. For the more adventurous, Ella Rock takes hikers across railway tracks, over wooden footbridges, and through fragrant eucalyptus forests to a cliff precipice offering views over miles of jungle valleys.",
    ancientRoots: "According to the ancient Hindu epic Ramayana, King Ravana hid Princess Sita in the subterranean limestone caverns of Ravana Cave located just beneath the hiking ridge.",
    varieties: [
      { name: 'Little Adam’s Peak Ridge Hike', tag: 'Gentle Walk', desc: 'A scenic 45-minute stroll through manicured tea bushes to panoramic summit viewpoints.' },
      { name: 'Ella Rock Cliff Summit', tag: 'Full Trek', desc: 'A 3.5-hour adventurous trek crossing railway tracks, tea estates, and pine forests to a dramatic drop.' },
      { name: 'Flying Ravana Zipline', tag: 'Aerial Thrill', desc: 'Sri Lanka’s longest two-wire zip line soaring over green tea hills at speeds up to 80 km/h.' },
      { name: 'Nine Arch Bridge Jungle Walk', tag: 'Iconic Walk', desc: 'A peaceful forest path descending directly to the historic railway viaduct.' }
    ],
    gearChecklist: 'Sturdy trainers or trail shoes, sun protection, light windbreaker, water bottle, and small change for local coconut vendors along the trail.',
    localSafetyTips: 'When walking along the railway track towards Ella Rock, always step completely off the tracks into the gravel shoulder when train horns sound. Take the left-hand path after the iron bridge to avoid getting misled by self-appointed guides.',
    nearbySpots: [
      { name: 'Ravana Cave & Temple', distance: '3 km south', desc: 'Historic cave linked to the ancient Ramayana epic.' },
      { name: 'Diyaluma Waterfall', distance: '30 km south', desc: 'Sri Lanka’s second highest waterfall with famous natural infinity rock pools.' }
    ]
  },
  {
    id: 10,
    slug: 'traditional-stilt-fishing-koggala',
    title: 'Traditional Stilt Fishing at Dusk',
    tagline: 'The Ancient Art of Ritipanna Against Ocean Sunsets',
    sub: 'Koggala · Ahangama · Southern Coastline',
    tag: 'surf',
    categoryLabel: 'Coastal Art',
    season: 'November to April (Calmest sea swell and golden sunsets)',
    badge: 'Living Tradition',
    timing: 'Golden hour (5:00 PM – 6:30 PM) or Early dawn (6:00 AM)',
    entryInfo: 'Free viewing along beach (Modest tip appreciated for close photos)',
    difficulty: 'Easy cultural photography along the beach shoreline',
    locations: 'Koggala · Ahangama · Kathaluwa · Southern Province',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=85',
    seed: 'stiltfish',
    desc: 'Practiced exclusively on Sri Lanka’s southern coastline, fishermen balance with poise on wooden crossbars lashed to submerged poles, casting lines into breaking surf without scaring schools of fish.',
    heritage: "Locally known as 'Ritipanna', stilt fishing was invented along the southern shores during World War II when food shortages and overcrowding on fishing spots compelled resourceful locals to plant vertical poles into submerged coral reefs. Balancing on a narrow crossbar called a 'Petta' with one hand while holding a slender bamboo rod with the other, fishermen catch spotted herrings (Koraburuwa) and mackerel directly from the breaking waves.",
    ancientRoots: "The poles are carved from sturdy local wood and embedded firmly into coral fissures, often passed down from father to son across coastal fishing families.",
    varieties: [
      { name: 'Ritipanna Sunset Silhouettes', tag: 'Photography', desc: 'The iconic sight of balanced fishermen framed against glowing crimson and gold ocean sunsets.' },
      { name: 'Hand-Line Fish Craft', tag: 'Technique', desc: 'Using barbless hooks with no bait, twitching the line in the surf to attract fish by rapid movement.' },
      { name: 'Try Stilt Balancing', tag: 'Experience', desc: 'Climb onto an empty stilt pole under the guidance of a local fisherman to experience the balance required.' },
      { name: 'Koggala Martin Wickramasinghe Museum', tag: 'Folk Heritage', desc: 'The ancestral folk home of Sri Lanka’s celebrated author showcasing ancient fishing gear.' }
    ],
    gearChecklist: 'Camera with portrait lens, sandals or reef shoes for walking in the tidal shallows, and a light beach towel.',
    localSafetyTips: 'Respect the fishermen: while some fishermen pose for travelers, many still fish for their daily livelihoods. Be polite, ask before taking close-up portraits, and offer a modest customary tip (LKR 500 – 1,000) for photo sessions.',
    nearbySpots: [
      { name: 'Koggala Lake Cinnamon Islands', distance: '1 km inland', desc: 'Tranquil lagoon boat safari visiting temple islands and cinnamon peelers.' },
      { name: 'Ahangama Surf Village', distance: '3 km east', desc: 'Vibrant coastal surf town filled with specialty coffee cafes and rooftop sunsets.' }
    ]
  },
  {
    id: 11,
    slug: 'adam-peak-midnight-pilgrimage',
    title: 'Midnight Lantern Pilgrimage of Adam’s Peak',
    tagline: '5,500 Steps Through the Night to the Sacred Sunrise',
    sub: 'Nallathanniya · Central Highlands',
    tag: 'hiking',
    categoryLabel: 'Night Pilgrimage',
    season: 'December to May (Pilgrimage season when stairs are fully illuminated)',
    badge: 'Epic Trek',
    timing: 'Depart base at 1:00 AM to reach summit by 5:30 AM',
    entryInfo: 'Free public access (Donation boxes available at shrines)',
    difficulty: 'Strenuous: 5,500 continuous stone steps (Requires good fitness)',
    locations: 'Nallathanniya · Hatton · Sabaragamuwa',
    img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=85',
    seed: 'midnightadams',
    desc: 'Join thousands of pilgrims chanting devotional blessings as they climb 5,500 illuminated steps into the starry night, reaching the 2,243m summit just as the golden triangular sunrise shadow sweeps across cloud valleys.',
    heritage: "There are few journeys in South Asia as spiritually intoxicating as the midnight climb of Sri Pada. As you ascend through the cool mountain mist, the trail is lined with small stalls serving steaming cups of sugary ginger tea and hot deep-fried vadai. Generations of pilgrims—grandmothers carried in woven slings, young parents carrying infants, and international travelers—climb together in a rare shared atmosphere of profound peace and encouragement.",
    ancientRoots: "When you reach the summit at dawn, the bronze temple bell tolls once for every time a pilgrim has conquered the sacred mountain.",
    varieties: [
      { name: 'Ira Sevaya (Sunrise Shadow)', tag: 'Phenomenon', desc: 'The mysterious triangular shadow cast by the conical peak on the western clouds at sunrise.' },
      { name: 'Seetha Gangula (Holy River)', tag: 'Pilgrim Stop', desc: 'An icy mountain stream halfway up where pilgrims ritually wash face and hands.' },
      { name: 'Indikatupana (Needle & Thread)', tag: 'Tradition', desc: 'Pilgrims unravel spools of white thread along trail posts following an ancient legend.' },
      { name: 'Summit Bell Toll', tag: 'Ritual', desc: 'Ring the ancient summit bell once for every pilgrimage you have completed in your lifetime.' }
    ],
    gearChecklist: 'Thermal base layers, fleece jacket, warm knit beanie, gloves, raincoat, knee supports or walking poles, and energy bars.',
    localSafetyTips: 'The descent is demanding on knee joints; take frequent short breaks and consider using trekking poles. The weather at the peak can turn chilly and windy within minutes while waiting for sunrise.',
    nearbySpots: [
      { name: 'Maussakelle Reservoir', distance: 'Nallathanniya town', desc: 'Scenic mountain lake framed by pine forests and tea estates.' },
      { name: 'Castlereagh Reservoir', distance: '25 km north in Hatton', desc: 'Picturesque lake with seaplane landings and heritage tea bungalows.' }
    ]
  },
  {
    id: 12,
    slug: 'minneriya-wild-elephant-gathering',
    title: 'The Great Elephant Gathering of Minneriya',
    tagline: 'Up to 300 Wild Elephants on Ancient Lake Shores',
    sub: 'Minneriya · Habarana · Cultural Triangle',
    tag: 'safari',
    categoryLabel: 'Wildlife Spectacle',
    season: 'Peak: July to October (Dry season gathering)',
    badge: 'World Wonder',
    timing: 'Late afternoon (3:00 PM – 6:30 PM) as elephants emerge from jungle',
    entryInfo: 'National Park Permit + 4x4 Jeep hire',
    difficulty: 'Easy jeep safari suitable for all travelers',
    locations: 'Minneriya · Kaudulla · North Central Province',
    img: 'https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?auto=format&fit=crop&w=1200&q=85',
    seed: 'minneriyagathering',
    desc: 'Recognized by Lonely Planet and National Geographic as one of the world’s top 10 wildlife spectacles, the Minneriya Gathering brings together up to 300 wild Asian elephants on the fertile shores of an ancient 3rd-century reservoir.',
    heritage: "Built in the 3rd Century AD by King Mahasena, Minneriya Wewa is a marvel of ancient hydraulic civil engineering. During the prolonged dry season between July and October, the reservoir waters recede, exposing miles of lush, tender green grasses. Drawn by water and fresh fodder, herds of wild elephants converge from across the surrounding dry-zone forests to socialize, bathe, play, and mate in plain view.",
    ancientRoots: "Visitors can observe complex social hierarchies: matriarchs directing young mothers, baby calves frolicking in the mud shallows, and massive tuskers posturing peacefully across the open grasslands.",
    varieties: [
      { name: 'Minneriya Lakebed Gathering', tag: 'World Spectacle', desc: 'Hundreds of wild elephants feeding and socializing side-by-side along the receding water’s edge.' },
      { name: 'Kaudulla National Park Corridor', tag: 'Alternative Gathering', desc: 'When elephants migrate between parks, Kaudulla offers equally breathtaking herds on its lakebed.' },
      { name: 'Eco Park Night Safari', tag: 'Jungle Corridor', desc: 'Adjoining forest reserve where elephants feed amongst tall teak and palu trees.' },
      { name: 'Birdwatching Over Reservoir', tag: 'Avian Life', desc: 'Flocks of painted storks, spot-billed pelicans, and grey herons fishing in the lake shallows.' }
    ],
    gearChecklist: 'Telephoto zoom lens (200-400mm), binoculars, dust mask, sunglasses, and earth-toned clothing.',
    localSafetyTips: 'Always stay inside your jeep. Ensure your driver maintains a respectful distance and turns off the engine when elephants approach to drink or cross tracks.',
    nearbySpots: [
      { name: 'Habarana Eco Hub', distance: '12 km west', desc: 'Lush village hub famous for Ayurvedic wellness spas and treehouse retreats.' },
      { name: 'Sigiriya Lion Rock', distance: '18 km southwest', desc: 'Colossal 5th-century rock citadel palace.' }
    ]
  }
];
