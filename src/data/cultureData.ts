export interface CultureVariety {
  name: string;
  tag: string;
  desc: string;
}

export interface NearbyCulturalSite {
  name: string;
  distance: string;
  desc: string;
}

export interface CultureHeritageItem {
  id: number;
  slug: string;
  title: string;
  sinhalaName: string;
  tagline: string;
  sub: string;
  tag: 'unesco' | 'temples' | 'citadels' | 'rituals' | 'crafts' | 'pilgrimage' | string;
  categoryLabel: string;
  epoch: string;
  badge: string;
  timing: string;
  entryInfo: string;
  preservation: string;
  dressCode: string;
  locations: string;
  img: string;
  seed: string;
  desc: string;
  heritage: string;
  ancientRoots: string;
  varieties: CultureVariety[];
  architecturalElements: string;
  etiquetteTips: string;
  nearbySites?: NearbyCulturalSite[];
}

export const CULTURE_DATA: CultureHeritageItem[] = [
  {
    id: 1,
    slug: 'sigiriya-rock-fortress',
    title: 'Sigiriya Rock Fortress',
    sinhalaName: 'සීගිරිය බලකොටුව (Lion Rock Citadel)',
    tagline: 'Palace in the Clouds & Ancient Wonder',
    sub: 'Matale · Cultural Triangle',
    tag: 'unesco',
    categoryLabel: 'UNESCO Wonder',
    epoch: '5th Century AD · King Kasyapa',
    badge: 'UNESCO Wonder',
    timing: '6:30 AM – 10:00 AM (Cool morning breeze)',
    entryInfo: 'CCF Ticket Counter / $36 USD (Foreigners)',
    preservation: 'UNESCO World Heritage Site (1982)',
    dressCode: 'Light breathable clothing, sunhat & sturdy climbing shoes',
    locations: 'Dambulla · Matale · Central Province',
    img: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1200&q=85',
    seed: 'sigiriya',
    desc: 'Rising 200 meters sheer above central jungle plains, Sigiriya is an audacious 5th-century royal pleasure palace, water garden citadel, and open-air art gallery crowned atop a colossal granite monolith.',
    heritage: "Erected by King Kasyapa (477–495 AD) after usurping the royal throne, Sigiriya served both as an impregnable fortress and an otherworldly aesthetic haven. The sheer granite monolith was sculpted into the likeness of a roaring lion guarding the stairway to the heavens. Visitors climbed through gigantic carved lion paws onto precipitous wooden stairways flanked by the 'Mirror Wall'—polished so brilliantly with egg white and wild bee honey that the monarch could see his reflection as he walked.",
    ancientRoots: "Sigiriya's hydraulic water gardens are among the oldest surviving landscaped gardens in the world. Gravity-fed conduits beneath subterranean limestone aquifers still operate ancient fountains to this day during monsoon rains.",
    varieties: [
      { name: 'Celestial Cloud Maidens', tag: 'Frescoes', desc: '5th-century tempera murals painted on sheltered rock pockets depicting heavenly Apsara maidens bearing lotus blossoms.' },
      { name: 'The Mirror Wall', tag: 'Poetry', desc: 'Ancient polished plaster adorned with poetic verses etched by pilgrims between the 6th and 14th centuries.' },
      { name: 'Royal Water Gardens', tag: 'Engineering', desc: 'Symmetrical terraced gardens, island pavilions, and gravity-powered underground fountains.' },
      { name: 'The Lion Paws Terrace', tag: 'Architecture', desc: 'Gigantic brick-and-mortar lion paws flanking the final sheer vertical climb to the summit palace ruins.' }
    ],
    architecturalElements: 'Carved gneiss rock cisterns, brick-masonry defensive ramparts, polished stucco fresco plaster, marble throne slabs, and gravity-driven hydraulic channels.',
    etiquetteTips: 'Do not touch or use flash photography on the ancient fresco murals. Maintain absolute silence near wild hornet nesting areas marked along the spiral stairs. Carry at least 1.5 liters of drinking water and wear sun protection.',
    nearbySites: [
      { name: 'Pidurangala Rock', distance: '2 km north', desc: 'Steep adventurous hike offering the best panoramic sunrise view of Sigiriya.' },
      { name: 'Minneriya National Park', distance: '18 km east', desc: 'Famous for the annual gathering of hundreds of wild elephants.' }
    ]
  },
  {
    id: 2,
    slug: 'temple-of-the-tooth',
    title: 'Temple of the Sacred Tooth',
    sinhalaName: 'ශ්‍රී දළදා මාළිගාව (Sri Dalada Maligawa)',
    tagline: 'Spiritual Sanctuary of the Golden Relic',
    sub: 'Kandy · Central Highlands',
    tag: 'temples',
    categoryLabel: 'Living Tradition',
    epoch: '16th – 18th Century · Kandyan Kingdom',
    badge: 'Sacred Relic',
    timing: '5:30 AM, 9:30 AM, 6:30 PM (Daily Thevava Pujas)',
    entryInfo: 'Main Gate Counter / LKR 2,000 (Foreigners)',
    preservation: 'UNESCO World Heritage City (1988)',
    dressCode: 'Strict: Pure white or modest clothes covering shoulders & knees',
    locations: 'Kandy · Central Province',
    img: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1200&q=85',
    seed: 'dalada',
    desc: 'Sheltered beside the royal lake of Kandy, Sri Dalada Maligawa houses the sacred left canine tooth relic of Gautama Buddha—the divine symbol of royal sovereignty across ancient Ceylon.',
    heritage: "For over two millennia, the sacred tooth relic was the island's ultimate talisman: whoever safeguarded the relic held the moral mandate to rule Ceylon. Smuggled to Sri Lanka concealed inside the hair of Princess Hemamala in the 4th Century AD, the relic was eventually enshrined in the hill capital of Kandy. Every evening, the temple resonates with the thundering pulse of Hewisi drums, conch shell clarions, and the fragrant mist of freshly picked purple water lilies and white jasmine.",
    ancientRoots: "The Esala Perahera pageant held every July/August is one of Asia's most magnificent religious festivals, where decorated tusker elephants carry the sacred casket accompanied by hundreds of fire dancers, drummers, and whip crackers.",
    varieties: [
      { name: 'Golden Canopy Shrine', tag: 'Inner Sanctum', desc: 'The two-story inner chamber crowned with a solid gold roof, housing seven nested jewel-encrusted golden caskets.' },
      { name: 'Magul Maduwa (Audience Hall)', tag: 'Woodcraft', desc: 'An open royal hall supported by 64 hand-carved halmilla timber pillars carved with classic Kandyan floral motifs.' },
      { name: 'Paththirippuwa (Octagon)', tag: 'Royal Tower', desc: 'The iconic octagonal tower built by King Sri Vikrama Rajasinha overlooking Kandy Lake.' },
      { name: 'Aluth Maligawa Museum', tag: 'History', desc: 'Exhibits illustrating the relic’s perilous journey across ancient kingdoms to Kandy.' }
    ],
    architecturalElements: 'Carved halmilla and teak pillars, gilded copper roof tiles, moonstone thresholds (Sandakada Pahana), and whitewashed cloud parapet walls (Walakulu Bamma).',
    etiquetteTips: 'Remove shoes and headwear at the outer temple perimeter. Dress strictly in white or pale pastel clothing that covers shoulders and knees. Maintain quiet reverence during the holy Thevava drumming pujas. Photography inside the relic casket chamber is prohibited.',
    nearbySites: [
      { name: 'Royal Botanical Gardens, Peradeniya', distance: '6 km west', desc: 'Over 4,000 plant species and world-famous orchid collections.' },
      { name: 'Bahirawakanda Giant Buddha', distance: '2 km hillside', desc: 'Panoramas of Kandy city and the sacred lake.' }
    ]
  },
  {
    id: 3,
    slug: 'galle-dutch-fort',
    title: 'Galle Dutch Fort Ramparts',
    sinhalaName: 'ගාල්ල ලන්දේසි බලකොටුව (Galle Dutch Fort)',
    tagline: 'Living Colonial Maritime Citadel',
    sub: 'Galle · Southern Coast',
    tag: 'citadels',
    categoryLabel: 'Maritime Heritage',
    epoch: '16th – 18th Century · Portuguese & Dutch VOC',
    badge: 'Colonial Living',
    timing: '4:30 PM – 7:00 PM (Golden hour & ocean sunset)',
    entryInfo: 'Free 24/7 public access to ramparts & streets',
    preservation: 'UNESCO World Heritage Site (1988)',
    dressCode: 'Casual seaside resort wear & comfortable walking sandals',
    locations: 'Galle · Southern Province',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=85',
    seed: 'gallefort',
    desc: 'South Asia’s best-preserved fortified European city, built by Portuguese explorers in 1588 and fortified into an impenetrable bastion of thick coral-and-granite ramparts by the Dutch East India Company.',
    heritage: "Galle Fort is a living, breathing time capsule. Within its 36-hectare perimeter, Dutch colonial villas with red-tiled rooflines and arched verandahs line cobblestone streets named Church Street, Pedlar Street, and Leyn Baan. Today, descendants of Dutch, Moorish, and Sinhalese merchant families live side by side with artisan jewelers, spice merchants, boutique bookshops, and gelato parlors.",
    ancientRoots: "Flag Rock Bastion was originally used by Dutch sentries to hoist maritime signal flags warning ships of dangerous reefs. At sunset, local youth dive from sheer stone ramparts directly into ocean waves below.",
    varieties: [
      { name: 'Galle Lighthouse & Point Utrecht', tag: 'Bastion', desc: 'Built in 1939 beside ancient gun emplacements, framed by swaying palms over turquoise sea.' },
      { name: 'Dutch Reformed Church (Groote Kerk)', tag: 'Architecture', desc: 'Built in 1755 with honeycombed vaults, organ loft, and gravestones of Dutch commanders.' },
      { name: 'Flag Rock Sunset Bastion', tag: 'Panoramic', desc: 'The southernmost rampart point where locals leap into sea foam as the sun sinks into the Indian Ocean.' },
      { name: 'National Maritime Museum', tag: 'Artifacts', desc: 'Housed within the original Dutch VOC warehouse storing ship anchors, spices, and porcelain.' }
    ],
    architecturalElements: 'Coral-and-granite rampart masonry, VOC East India Company crests, Dutch gable facades, underground storm sewer networks, and hardwood verandah colonnades.',
    etiquetteTips: 'Watch footing carefully along rampart edges as there are sheer drops to the rocks and ocean below. Support local lace makers (Beeralu lace) and independent gem craftsmen. Sunset along the western ramparts is the premier photography window.',
    nearbySites: [
      { name: 'Unawatuna Beach', distance: '5 km southeast', desc: 'Golden horseshoe bay with beachside seafood cafes.' },
      { name: 'Koggala Lake & Stilt Fishermen', distance: '12 km east', desc: 'Cinnamon islands and iconic dusk stilt fishing.' }
    ]
  },
  {
    id: 4,
    slug: 'dambulla-cave-temples',
    title: 'Dambulla Royal Cave Temples',
    sinhalaName: 'දඹුල්ල රජමහා විහාරය (Rangiri Dambulla)',
    tagline: 'Golden Rock Monasteries & Ceiling Murals',
    sub: 'Matale · Cultural Triangle',
    tag: 'temples',
    categoryLabel: 'UNESCO Sanctuary',
    epoch: '1st Century BC · King Valagamba',
    badge: 'Cave Sanctuary',
    timing: '7:00 AM – 10:30 AM or 3:30 PM – 6:00 PM',
    entryInfo: 'LKR 2,000 Foreign Ticket Counter (Buy before climb)',
    preservation: 'UNESCO World Heritage Site (1991)',
    dressCode: 'Strict temple attire: Shoulders and knees fully covered',
    locations: 'Dambulla · Central Province',
    img: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=85',
    seed: 'dambulla',
    desc: 'Five breathtaking sacred cave sanctuaries hollowed beneath an enormous granite rock face, sheltering 153 gilded Buddha statues and 2,100 square meters of vivid ancient ceiling murals.',
    heritage: "When King Valagamba was driven from Anuradhapura by South Indian invaders in 103 BC, Buddhist monks provided him sanctuary in these remote cliffside caves for 14 years. Upon reclaiming his throne, the grateful king transformed the caves into monumental gilded rock shrines. Subsequent Sinhala monarchs continued decorating the vaults with life-sized reclining Buddhas and murals painted with mineral pigments.",
    ancientRoots: "The drip ledge (katāre) carved into the rock brow above the caves prevents rain from flowing into the shrines. Brahmi inscriptions carved beneath the ledge date monastic presence back over 2,200 years.",
    varieties: [
      { name: 'Cave of the Divine King (Devaraja Lena)', tag: 'Cave 1', desc: 'Houses a colossal 14-meter reclining Buddha statue sculpted directly out of solid bedrock.' },
      { name: 'Cave of Great Kings (Maharaja Lena)', tag: 'Cave 2', desc: 'The largest cave with 56 statues, sacred drip-spring vessel, and life-size figures of kings Valagamba and Nissanka Malla.' },
      { name: 'Great New Temple (Maha Alut Vihara)', tag: 'Cave 3', desc: 'Decorated by King Kirti Sri Rajasinha with 50 seated and standing Buddha images and ceiling floral motifs.' },
      { name: 'Western Cave (Pascima Vihara)', tag: 'Cave 4', desc: 'Features a miniature stupa (Soma Cetiya) that once housed sacred royal jewelry.' }
    ],
    architecturalElements: 'Rock-hewn granite drip ledges, hand-carved bed-rock sculptures, natural ochre and indigo ceiling frescoes, and brass lotus flower altars.',
    etiquetteTips: 'Buy tickets at the bottom ticket office before climbing the rock staircase. Footwear must be deposited at the temple entry counter; bring thick socks because granite rocks get searingly hot under midday sunshine. Do not pose with your back turned to Buddha statues.',
    nearbySites: [
      { name: 'Dambulla Dedicated Economic Centre', distance: '3 km south', desc: 'Massive, bustling wholesale vegetable and tropical fruit trading market.' },
      { name: 'Ibbankatuwa Megalithic Tombs', distance: '5 km southwest', desc: 'Prehistoric burial site dating to 750 BC.' }
    ]
  },
  {
    id: 5,
    slug: 'anuradhapura-sacred-city',
    title: 'Sacred City of Anuradhapura',
    sinhalaName: 'අනුරාධපුර පුජා නගරය (Atamasthana)',
    tagline: 'Cradle of Sinhalese Civilization & Colossal Stupas',
    sub: 'Anuradhapura · North Central Province',
    tag: 'unesco',
    categoryLabel: 'Ancient Kingdom',
    epoch: '4th Century BC – 11th Century AD',
    badge: 'Ancient Capital',
    timing: '6:00 AM – 9:30 AM (Peaceful dawn chanting)',
    entryInfo: 'CCF Ticket $30 USD (Passes valid for major monuments)',
    preservation: 'UNESCO World Heritage Site (1982)',
    dressCode: 'White clothing strongly recommended; shoulders & knees covered',
    locations: 'Anuradhapura · North Central Province',
    img: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1200&q=85',
    seed: 'anuradhapura',
    desc: 'The ancient spiritual heart of Ceylon for over a thousand years. Home to towering snow-white brick stupas taller than the pyramids of Egypt and the world’s oldest documented human-planted tree.',
    heritage: "Founded around 377 BC by King Pandukabhaya, Anuradhapura flourished into one of the most sophisticated hydraulic cities in the ancient world. Vast artificial lakes (wewas) supplied drinking water to monasteries holding tens of thousands of meditating monks. Here stands Jaya Sri Maha Bodhi, a sapling of the sacred fig tree under which Gautama Buddha attained enlightenment in Bodh Gaya, brought to Sri Lanka by Theri Sanghamitta in 288 BC.",
    ancientRoots: "Ruwanwelisaya stupa, built by warrior king Dutugemunu in 140 BC, enshrines the largest collection of Buddha relics on Earth. Its perimeter wall features hundreds of lifelike sculpted elephant figures shoulder-to-shoulder.",
    varieties: [
      { name: 'Jaya Sri Maha Bodhi', tag: 'Living Relic', desc: 'The world’s oldest documented tree planted in 288 BC, tended continuously by royal caretakers for 2,300+ years.' },
      { name: 'Ruwanwelisaya Stupa', tag: 'Maha Thupa', desc: 'A majestic 103m soaring white hemispherical stupa surrounded by an imposing elephant sculptured frieze.' },
      { name: 'Jetavanaramaya Stupa', tag: 'Brick Wonder', desc: 'The third tallest monument of the ancient world behind the Giza Pyramids, built with 93.3 million baked clay bricks.' },
      { name: 'Samadhi Buddha Statue', tag: 'Granite Masterpiece', desc: 'A 4th-century meditating Buddha carved from dolomite marble reflecting supreme serenity.' }
    ],
    architecturalElements: 'Hand-molded kiln-baked terracotta bricks, granite guardstones (Muragala), moonstone semicircular threshold slabs, and granite hydraulic water conduits.',
    etiquetteTips: 'Remove shoes and hats at the outer courtyard entrances of all stupas and bodhi shrines. White garments are deeply appreciated. Always circumambulate stupas in a clockwise direction (Pradakshina). Rent a bicycle or hire a tuk-tuk to navigate the vast distances.',
    nearbySites: [
      { name: 'Mihintale Sacred Hill', distance: '12 km east', desc: 'The sacred mountain cradle where Buddhism was first introduced to Ceylon.' },
      { name: 'Wilpattu National Park', distance: '35 km west', desc: 'Sri Lanka’s largest national park famous for wild leopards and natural lakes.' }
    ]
  },
  {
    id: 6,
    slug: 'polonnaruwa-ancient-city',
    title: 'Medieval City of Polonnaruwa',
    sinhalaName: 'පොළොන්නරුව රාජධානිය (Medieval Capital)',
    tagline: 'Granite Colossi & Royal Pleasure Gardens',
    sub: 'Polonnaruwa · North Central Province',
    tag: 'citadels',
    categoryLabel: 'UNESCO Citadel',
    epoch: '11th – 13th Century · King Parakramabahu I',
    badge: 'Medieval Glory',
    timing: '7:30 AM – 11:00 AM (Cycle through shady groves)',
    entryInfo: 'CCF Archeology Museum Ticket / $30 USD',
    preservation: 'UNESCO World Heritage Site (1982)',
    dressCode: 'Modest lightweight attire; socks for hot stones',
    locations: 'Polonnaruwa · North Central Province',
    img: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=85',
    seed: 'polonnaruwa',
    desc: 'The medieval capital that succeeded Anuradhapura, renowned for the colossal rock-cut Buddhas of Gal Vihara and King Parakramabahu’s sea-like reservoir, the Parakrama Samudra.',
    heritage: "King Parakramabahu the Great famously decreed: 'Not even a single drop of water that falls from the sky shall flow into the sea without being made useful to mankind.' His vision culminated in the inland sea Parakrama Samudra, feeding vast rice paddies that earned Sri Lanka the title 'Granary of the East'. Polonnaruwa represents the zenith of medieval Sinhala stone sculpture and defensive citadel design.",
    ancientRoots: "Gal Vihara is universally acknowledged as a masterpiece of world rock sculpture. Four giant figures—seated, standing with folded arms, and an enormous 14-meter reclining Buddha—were carved seamlessly out of a single continuous granite gneiss outcrop.",
    varieties: [
      { name: 'Gal Vihara Rock Sculptures', tag: 'Rock Art', desc: 'Monumental Buddhas carved seamlessly into a single granite rock face with fluid flowing robes.' },
      { name: 'Vatadage Circular Relic House', tag: 'Architecture', desc: 'Concentric stone terraces adorned with exquisitely preserved moonstones and dwarf guardstones.' },
      { name: 'Royal Palace of Parakramabahu', tag: 'Citadel Ruins', desc: 'Ruins of a seven-story palace with massive 3-meter thick brick masonry walls and royal bath pavilions.' },
      { name: 'Rankoth Vehera', tag: 'Stupa', desc: 'A 55-meter golden pinnacle stupa, the largest built in the medieval Polonnaruwa kingdom.' }
    ],
    architecturalElements: 'Carved gneiss rock friezes, tiered stone lotus bathing pools (Kumuna Pokuna), brick stupas, and hydraulic sluice gates (Bisokotuwa).',
    etiquetteTips: 'Rent a sturdy bicycle at the archeological museum entrance to ride under the shaded tree canopy between monuments. Do not pose in front of Gal Vihara with your back turned toward the rock sculptures. Remove footwear before walking onto the sacred stone terraces.',
    nearbySites: [
      { name: 'Parakrama Samudra Bund', distance: '1 km west', desc: 'Magnificent lake sunset views against the misty central highlands.' },
      { name: 'Kaudulla National Park', distance: '25 km north', desc: 'Seasonal elephant gathering corridor.' }
    ]
  },
  {
    id: 7,
    slug: 'adams-peak-sri-pada',
    title: 'Sacred Adam’s Peak (Sri Pada)',
    sinhalaName: 'ශ්‍රී පාදස්ථානය (Samanala Kanda)',
    tagline: 'Pilgrimage Above the Clouds to the Sacred Footprint',
    sub: 'Nallathanniya · Sabaragamuwa Province',
    tag: 'pilgrimage',
    categoryLabel: 'Sacred Pilgrimage',
    epoch: 'Ancient Sacred Lore · Revered for 1,000+ years',
    badge: 'Sacred Mountain',
    timing: 'Midnight start (1:00 AM) to summit for 6:00 AM Sunrise',
    entryInfo: 'Free public pilgrimage access (Dec to May season)',
    preservation: 'Central Highlands UNESCO World Heritage (2010)',
    dressCode: 'Warm thermal layers, fleece jacket, beanie & sturdy hiking boots',
    locations: 'Hatton · Ratnapura · Sabaragamuwa',
    img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=85',
    seed: 'sripada',
    desc: 'A soaring 2,243m conical pyramid peak revered across four world religions: Buddhists venerate Lord Buddha’s sacred footprint, Hindus praise Shiva, and Christians and Muslims honor Adam.',
    heritage: "For over a thousand years, pilgrims from every faith and walk of life have climbed the 5,500 lantern-lit steps through the cold misty night to reach the summit shrine. Elderly devotees and young children chant traditional pilgrim folk blessings: 'Karunawai! Karunawai!' As dawn breaks, the golden sun rises above the horizon, casting the mountain's famous triangular shadow across the sea of clouds below—a phenomenon known as the 'Ira Sevaya'.",
    ancientRoots: "Marco Polo noted the sacred pilgrimage route in the 13th century, writing that the mountain held sacred treasures and was visited by pilgrims from kingdoms throughout the East.",
    varieties: [
      { name: 'Ira Sevaya (Sacred Sunrise)', tag: 'Spectacle', desc: 'The mystical triangular shadow projected onto the western cloud banks at dawn.' },
      { name: 'The Sacred Footprint (Sri Pada)', tag: 'Shrine', desc: 'The revered 1.8-meter rock indent enclosed within the summit golden shrine house.' },
      { name: 'Lantern-Lit Stairway', tag: 'Night Climb', desc: 'A glittering ribbon of electric lamps winding through pristine cloud forest and tea valleys.' },
      { name: 'Peace Pagoda', tag: 'Japanese Temple', desc: 'A serene white stupa built at the mountain’s base by Japanese monks of Nipponzan Myohoji.' }
    ],
    architecturalElements: 'Granite and hand-cut stone steps, safety chains installed by ancient kings, summit bronze bells rung once for every climb, and mountain stupas.',
    etiquetteTips: 'The official pilgrimage season runs from Unduvap Poya (December) to Vesak Poya (May). Temperatures at the summit can plummet below 8°C with gusting winds; bring warm thermal clothing and a rainproof windbreaker. Encourage fellow pilgrims with respectful greetings.',
    nearbySites: [
      { name: 'Laxapana & Aberdeen Waterfalls', distance: '15 km north', desc: 'Dramatic cascading waterfalls through deep canyon rainforests.' },
      { name: 'Nuwara Eliya Tea Estates', distance: '45 km east', desc: 'Colonial hill town with misty tea plantations.' }
    ]
  },
  {
    id: 8,
    slug: 'ambalangoda-mask-carving',
    title: 'Traditional Mask Carving of Ambalangoda',
    sinhalaName: 'අම්බලන්ගොඩ වෙස් මුහුණු කලාව (Ritual Folk Art)',
    tagline: 'Ancient Folklore, Devil Dances & Healing Rituals',
    sub: 'Ambalangoda · Southern Coast',
    tag: 'crafts',
    categoryLabel: 'Folk Heritage',
    epoch: 'Centuries-old Southern Folk Tradition',
    badge: 'Master Craft',
    timing: '9:00 AM – 5:00 PM (Artisan workshops & museum tours)',
    entryInfo: 'Free museum entry (Workshops & mask purchases available)',
    preservation: 'National Intangible Cultural Heritage',
    dressCode: 'Casual comfortable attire',
    locations: 'Ambalangoda · Southern Province',
    img: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1200&q=85',
    seed: 'maskcarving',
    desc: 'In the coastal village of Ambalangoda, master craftsmen carve intricate demon and animal masks from lightweight Kaduru wood, painted with natural pigments for ancient healing devil dances and satirical comedies.',
    heritage: "Mask-making in southern Sri Lanka is rooted in ancient healing systems and community theatre. The masks fall into three distinct genres: 'Raksha' masks depicting mythical demon guardians like the Cobra Demon (Naga Raksha) and Fire Demon (Gini Raksha) used in pageants; 'Sanni' masks used in 18 ancient exorcism rituals (Daha Ata Sanniya) to cure physical and psychological ailments; and 'Kolam' masks worn in comedic village theatre.",
    ancientRoots: "The wood is sourced exclusively from the wild Kaduru tree (Strychnos nux-vomica), which is soft, lightweight, and naturally insect-resistant. The raw wood is seasoned over smoky coconut husk hearths before chiseling.",
    varieties: [
      { name: 'Naga Raksha (Cobra Demon)', tag: 'Raksha', desc: 'Features a fierce demon face flanked by twenty rearing cobra hoods, symbolizing protection and power.' },
      { name: 'Maha Kola Sanni Yaka', tag: 'Healing', desc: 'The supreme demon of disease holding victims in his claws, flanked by all 18 mini-masks of human illness.' },
      { name: 'Gini Raksha (Fire Demon)', tag: 'Spectacle', desc: 'Flaming red headdress symbolizing fire, designed to ward off malevolent evil eyes (asvaha).' },
      { name: 'Kolam Folk Masks', tag: 'Satire', desc: 'Carved caricatures of kings, village headmen, soldiers, and village gossips used in comic plays.' }
    ],
    architecturalElements: 'Smoke-cured Kaduru wood, hand-ground organic mineral pigments (yellow ochre, ground cinnabar, lamp soot), and chisels passed down 5 generations.',
    etiquetteTips: 'Visit the Ariyapala Traditional Masks Museum to watch third-generation master carvers at work. Purchasing an authentic hand-carved mask directly supports indigenous artisan families and preserves this heritage from mass-produced resin copies.',
    nearbySites: [
      { name: 'Madu Ganga River Safari', distance: '7 km north', desc: 'Mangrove boat safari through cinnamon peeling islands.' },
      { name: 'Hikkaduwa Coral Reef', distance: '12 km south', desc: 'Marine sanctuary with sea turtles and lively beach dining.' }
    ]
  },
  {
    id: 9,
    slug: 'kataragama-sacred-shrine',
    title: 'Ruhunu Kataragama Maha Devalaya',
    sinhalaName: 'රුහුණු කතරගම මහා දේවාලය (Sacred Multi-Faith Shrine)',
    tagline: 'Mystical Shrines, Coconut Smashes & Fire Walking',
    sub: 'Kataragama · Uva & Southern Border',
    tag: 'rituals',
    categoryLabel: 'Multi-Faith Shrine',
    epoch: '2nd Century BC · King Dutugemunu Foundation',
    badge: 'Living Miracle',
    timing: '6:30 AM, 10:30 AM, 6:30 PM (Grand Pooja Rituals)',
    entryInfo: 'Free public entry to sacred complex',
    preservation: 'Protected Sacred Cultural Reserve',
    dressCode: 'Modest temple clothing; red or white cloth; remove footwear',
    locations: 'Kataragama · Monaragala / Hambantota',
    img: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=85',
    seed: 'kataragama',
    desc: 'Sri Lanka’s most mystical pilgrimage center, where Buddhists, Hindus, Muslims, and indigenous Vedda people unite to worship Lord Murugan (Skanda-Kumara) in an atmosphere of intense devotion and miracle lore.',
    heritage: "Set beside the sacred Menik Ganga (River of Gems), Kataragama defies conventional religious boundaries. Here, King Dutugemunu built the first devalaya in the 2nd Century BC after praying for divine victory. In the evenings, devotees bathe in the river before carrying wicker baskets piled high with tropical fruit, coconuts, and fragrant flowers to the sanctum. Coconuts are smashed with intense fervor on iron altars as prayers are sent to the six-faced god.",
    ancientRoots: "The sacred Esala Festival features the legendary 'Theemithi' (fire walking ceremony), where barefoot devotees traverse a glowing pit of red-hot tamarind embers without injury through profound meditation.",
    varieties: [
      { name: 'Maha Devalaya', tag: 'Inner Sanctum', desc: 'The central shrine draped in ceremonial curtains concealing the divine presence of Lord Murugan.' },
      { name: 'Kiri Vehera Stupa', tag: 'Buddhist Stupa', desc: 'An ancient milk-white stupa built by King Mahasena on the site where Lord Buddha meditated.' },
      { name: 'Sella Kataragama', tag: 'Jungle Shrine', desc: 'The forest riverbank where Lord Murugan is believed to have met his consort Valli Amma.' },
      { name: 'Menik Ganga Ritual Bath', tag: 'Cleansing', desc: 'Sacred river where pilgrims submerge themselves before offering their prayers.' }
    ],
    architecturalElements: 'Carved wooden sanctum portals, sacred brass oil lamps, fire-walking ember pits, and clay incense burners.',
    etiquetteTips: 'Remove shoes at the holy gate bridge before entering the devalaya grounds. You can purchase a fruit basket offering (Puja Vattiya) from local stalls outside. Sashing a coconut on the stone slab is done after whispering your heart’s earnest wish.',
    nearbySites: [
      { name: 'Yala National Park (Katagamuwa Gate)', distance: '12 km east', desc: 'World’s highest concentration of wild leopards.' },
      { name: 'Bundala Wetland Sanctuary', distance: '30 km south', desc: 'Ramsar wetland teeming with thousands of migratory flamingos.' }
    ]
  },
  {
    id: 10,
    slug: 'mihintale-sacred-mountain',
    title: 'Mihintale Sacred Mountain',
    sinhalaName: 'මිහින්තලේ පුණ්‍ය භූමිය (Cradle of Buddhism)',
    tagline: 'Granite Stairway to the Dawn of Enlightenment',
    sub: 'Mihintale · North Central Province',
    tag: 'temples',
    categoryLabel: 'Sacred Cradle',
    epoch: '3rd Century BC · King Devanampiya Tissa',
    badge: 'Cradle of Faith',
    timing: '5:30 AM – 8:30 AM (Breathtaking misty dawn climb)',
    entryInfo: 'LKR 1,000 Foreign Ticket Counter',
    preservation: 'National Sacred Archeological Sanctuary',
    dressCode: 'White clothes; shoulders and knees covered',
    locations: 'Mihintale · Anuradhapura District',
    img: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1200&q=85',
    seed: 'mihintale',
    desc: 'A sacred mountain peak ascended by 1,840 grand granite stairs carved through frangipani trees, where Arahat Mahinda met King Devanampiya Tissa in 247 BC, bringing Buddhism to Ceylon.',
    heritage: "In the 3rd Century BC, King Devanampiya Tissa was hunting royal stags across the wooded hills of Mihintale when a voice called out: 'Tissa! Halt!' Upon turning, the monarch met Arahat Mahinda, son of Indian Emperor Ashoka. After testing the king's intellectual discernment with riddles about mango trees, the monk delivered the Dhamma, converting the king and establishing Sri Lanka’s Buddhist heritage.",
    ancientRoots: "Mihintale is also the site of one of the world's earliest organized medical hospitals, complete with ancient stone immersion baths where patients were soaked in medicinal herb infusions.",
    varieties: [
      { name: 'Ambasthala Stupa', tag: 'Sacred Spot', desc: 'Built over the precise mango grove clearing where Arahat Mahinda met King Tissa.' },
      { name: 'Aradhana Gala (Meditation Rock)', tag: 'Summit Panorama', desc: 'A dramatic windswept granite rock pinnacle with railings offering 360-degree jungle views.' },
      { name: 'Maha Seya Stupa', tag: 'White Stupa', desc: 'The summit stupa enshrining relics of Arahat Mahinda visible from miles away across the plains.' },
      { name: 'Ancient Hospital Complex', tag: 'Ayurveda', desc: 'Preserved ruins of a 9th-century monastic hospital with stone herbal immersion tubs.' }
    ],
    architecturalElements: '1,840 hand-laid granite steps flanked by Araliya frangipani trees, monolithic rock inscription slabs, and ancient stone medicine troughs.',
    etiquetteTips: 'Start climbing early in the morning or late afternoon to avoid the scorching sun on the granite steps. Bring clean white socks to wear on the upper stone terraces. Clambering up Aradhana Gala requires gripping iron safety railings in windy conditions.',
    nearbySites: [
      { name: 'Anuradhapura Ancient City', distance: '12 km west', desc: 'Vast sacred kingdom with Ruwanwelisaya and Sri Maha Bodhi.' },
      { name: 'Kaludiya Pokuna (Dark Water Pond)', distance: '3 km south', desc: 'Tranquil forest monastery ruins wrapped around a black water pond.' }
    ]
  },
  {
    id: 11,
    slug: 'nallur-kandaswamy-kovil',
    title: 'Nallur Kandaswamy Kovil',
    sinhalaName: 'නල්ලූර් කන්දස්වාමි කෝවිල (Jaffna Golden Kovil)',
    tagline: 'Gilded Dravidian Gopurams & Sacred Drumming',
    sub: 'Jaffna · Northern Peninsula',
    tag: 'temples',
    categoryLabel: 'Northern Heritage',
    epoch: '10th Century Origins · Rebuilt in 1734',
    badge: 'Dravidian Splendor',
    timing: 'Daily Pujas at 4:30 AM, 10:30 AM, 4:30 PM, 6:00 PM',
    entryInfo: 'Free public entry',
    preservation: 'Premier Hindu Sanctuary of Northern Sri Lanka',
    dressCode: 'Strict: Men must remove shirts; women in sarees/modest dresses',
    locations: 'Jaffna · Northern Province',
    img: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=85',
    seed: 'nallur',
    desc: 'The jewel of northern Tamil culture and Dravidian architecture, with golden soaring gopuram towers, ornate brass oil lamps, and deeply moving Nadaswaram horn rituals.',
    heritage: "Nallur was once the royal capital of the Jaffna Kingdom. The temple complex is surrounded by an immense red-and-white striped boundary wall. Inside, brass oil chandeliers reflect against polished granite floors as the powerful, hypnotic vibrations of Thavil drums and Nadaswaram horns pierce the fragrant air thick with camphor and sandalwood. The annual 25-day festival in August draws hundreds of thousands of Hindu devotees from across the worldwide diaspora.",
    ancientRoots: "The deity venerated is Lord Murugan in the form of his divine lance, the Vel. The massive silver chariot (Simhasanam) and carved wooden juggernauts are pulled through streets by thousands of chanting pilgrims.",
    varieties: [
      { name: 'Southern Golden Gopuram', tag: 'Architecture', desc: 'A stunning nine-story tower intricately carved with thousands of colorful deities and celestial figures.' },
      { name: 'The Sacred Step-Well (Theertham)', tag: 'Holy Water', desc: 'An ornate stepped bathing pool where ceremonial ritual cleansings take place.' },
      { name: 'Ther Chariot Procession', tag: 'Festival', desc: 'A monumental wooden chariot carved with epic scenes, pulled by bare-chested devotees.' },
      { name: 'Inner Pillared Mandapams', tag: 'Sanctum', desc: 'High-vaulted brass-lined corridors where daily musical pujas echo.' }
    ],
    architecturalElements: 'Dravidian gopuram masonry, polished granite colonnades, gilded brass flagstaff (Kodimaram), and silver ceremonial palanquins.',
    etiquetteTips: 'Men must remove shirts and enter bare-chested with sarongs or trousers. Women should dress in modest traditional attire. Remove all footwear at the outer courtyard entrance. Silence must be maintained within the inner sanctum.',
    nearbySites: [
      { name: 'Jaffna Fort', distance: '4 km west', desc: 'Expansive pentagonal Dutch fort overlooking the lagoon.' },
      { name: 'Casuarina Beach', distance: '25 km northwest', desc: 'White sand shallow beach shaded by casuarina pine trees.' }
    ]
  },
  {
    id: 12,
    slug: 'yapahuwa-rock-fortress',
    title: 'Yapahuwa Rock Fortress Citadel',
    sinhalaName: 'යාපහුව බලකොටුව (Rock Citadel & Lion Staircase)',
    tagline: 'The Forgotten Mountain Citadel of the Sacred Tooth',
    sub: 'Maho · North Western Province',
    tag: 'citadels',
    categoryLabel: 'Ancient Citadel',
    epoch: '13th Century AD · King Bhuvanekabahu I',
    badge: 'Hidden Wonder',
    timing: '7:00 AM – 10:30 AM (Cool morning shade)',
    entryInfo: 'CCF Ticket / LKR 1,500 Foreigners',
    preservation: 'Protected Archeological Citadel Reserve',
    dressCode: 'Sturdy walking shoes & modest temple attire',
    locations: 'Kurunegala · Wayamba Province',
    img: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=85',
    seed: 'yapahuwa',
    desc: 'Often hailed as Sri Lanka’s second Sigiriya, Yapahuwa was the 13th-century cliff-top capital housing the Sacred Tooth Relic, famous for its breathtaking ornamental granite lion staircase.',
    heritage: "Following the fall of Polonnaruwa to invading forces, King Bhuvanekabahu I (1272–1284 AD) withdrew into the rock-strewn hills of Wayamba. He fortified the 100-meter sheer granite rock into a dramatic citadel and royal sanctuary for the Tooth Relic. The crowning glory of Yapahuwa is its monumental stone staircase carved with dancers, drummers, and the celebrated Yapahuwa Lions with open jaws and bulging eyes that now grace the Sri Lankan 10-rupee banknote.",
    ancientRoots: "At the summit of the stairway stands the intricately carved doorway of the Tooth Relic temple, crafted with Chinese, Cambodian, and South Indian stylistic influences testament to Ceylon's medieval global trade.",
    varieties: [
      { name: 'The Ornamental Lion Staircase', tag: 'Masterpiece', desc: 'A dramatic, steep granite flight of stairs flanked by sculpted stone lions, dancers, and dwarfs.' },
      { name: 'Tooth Relic Temple Porch', tag: 'Stone Carving', desc: 'The summit temple entrance featuring perforated stone window screens that filtered tropical breezes.' },
      { name: 'Summit Fortress Ruins', tag: 'Viewpoint', desc: 'Remains of the king’s lookout posts offering boundless views of coconut palms and rock outcrops.' },
      { name: 'Archeological Museum', tag: 'Artifacts', desc: 'Houses ancient Chinese Song dynasty ceramics and coins unearthed on the citadel grounds.' }
    ],
    architecturalElements: 'Granite cantilevered stairs, relief-carved female dancers, pierced stone window screens (Jali), and outer protective moats and ramparts.',
    etiquetteTips: 'The stone steps are quite steep and narrow; climb deliberately and use handrails. The summit area is windswept and exposed, so avoid climbing during thunderstorms. Visit the museum near the base before starting your ascent.',
    nearbySites: [
      { name: 'Kurunegala Elephant Rock (Athugala)', distance: '40 km south', desc: 'Panoramic town named after its massive animal-shaped rocks.' },
      { name: 'Panduwasnuwara Ancient Capital', distance: '30 km west', desc: 'Ruined 12th-century circular palace and moated city.' }
    ]
  }
];
