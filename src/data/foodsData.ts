export interface FoodVariety {
  name: string;
  tag: string;
  desc: string;
}

export interface FoodDishItem {
  id: number;
  slug: string;
  title: string;
  tagline: string;
  sub?: string;
  tag: 'street' | 'curry' | 'seafood' | 'sweets' | 'drinks' | string;
  cuisine: string;
  meal: string;
  price: string;
  spice: string;
  serving: string;
  locations: string;
  img: string;
  seed: string;
  desc: string;
  heritage?: string;
  varieties?: FoodVariety[];
  ingredients?: string;
  howToEat?: string;
}

export const FOODS_DATA: FoodDishItem[] = [
  {
    id: 1,
    slug: 'midnight-kottu-roti',
    title: 'Midnight Kottu Roti',
    tagline: 'The Sound of Sri Lankan Nights',
    sub: 'Colombo · Street Icon',
    tag: 'street',
    cuisine: 'Street Food',
    meal: 'Dinner',
    price: 'LKR 350 – LKR 850',
    spice: 'Medium to Fiery',
    serving: 'Sizzling Hot Plate',
    locations: 'Colombo · Galle Face · Kandy',
    img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=1000&q=85',
    seed: 'kottu',
    desc: 'The rhythmic clatter of metal blades slicing godamba roti, fresh vegetables, eggs, and rich spicy chicken or cheese curry on a sizzling hot plate.',
    heritage: "Kottu Roti is the undisputed anthem of Sri Lankan nocturnal life. The distinct, rhythmic metal-on-steel clatter of twin blunt cleavers echoing through tropical night air signals a street cook chopping unleavened Godamba roti with cabbage, leeks, onions, scrambled eggs, and fiery curry.",
    varieties: [
      { name: 'Chicken Kottu', tag: 'Classic', desc: 'Shredded godamba roti tossed with tender chicken curry, egg, and leeks.' },
      { name: 'Cheese Kottu', tag: 'Indulgent', desc: 'Melted cheese folded through the stir-fry for a modern Sri Lankan twist.' },
      { name: 'Vegetable Kottu', tag: 'Vegetarian', desc: 'Cabbage, carrots, leeks, and onions with curry sauce and egg.' },
      { name: 'Dolphin Kottu', tag: 'Fusion', desc: 'A coastal variation with seafood and a squeeze of fresh lime.' }
    ],
    ingredients: 'Godamba roti, eggs, leeks, cabbage, carrots, onions, green chilies, curry leaves, Ceylon curry powder, chicken or vegetable curry, coconut oil.',
    howToEat: 'Best eaten hot, straight from the plate with a fork or your fingers. Add a side of curry gravy for extra moisture. Pair with a cold lime juice or iced Milo.'
  },
  {
    id: 2,
    slug: 'village-rice-curry',
    title: 'Village Rice & Curry',
    tagline: '7-Curry Clay Pot Feast',
    sub: 'Kandy · Traditional',
    tag: 'curry',
    cuisine: 'Sri Lankan',
    meal: 'Lunch',
    price: 'LKR 450 – LKR 1,200',
    spice: 'Balanced to Fiery (Customizable)',
    serving: 'Earthen Terracotta Clay Pots',
    locations: 'Island-wide · Matale · Ella',
    img: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=1000&q=85',
    seed: 'villageRice',
    desc: 'Slow-cooked in clay pots over cinnamon wood. Fragrant red rice served with jackfruit polos curry, tempered dhal, coconut pol sambol, and crispy papadam.',
    heritage: "In traditional Sri Lankan village culture, cooking rice and curry is a slow, sacred craft. The hearth is fueled by aged cinnamon and rubber firewood, transferring a subtle smoky wood aroma into earthen terracotta clay pots called 'Mati Walan'. This natural porous clay gently circulates heat, tenderizing jackfruit and spices while preserving delicate antioxidants.",
    varieties: [
      { name: 'Polos Ambulha', tag: 'Signature', desc: 'The crown jewel of vegetarian curries: tender young jackfruit slow-simmered with roasted spices and dried goraka.' },
      { name: 'Creamy Parippu (Dhal)', tag: 'Comfort', desc: 'Smooth, tempered red split lentils cooked in golden turmeric and thick coconut milk.' },
      { name: 'Fresh Pol Sambol', tag: 'Fiery', desc: 'Hand-scraped coconut pounded with shallots, dried red chilies, crushed black pepper, and fresh lime.' },
      { name: 'Wambatu Moju', tag: 'Sweet & Sour', desc: 'Deep-fried caramelized baby eggplant relish glazed with coconut vinegar, mustard seed paste, and wild honey.' },
      { name: 'Gotu Kola Mallum', tag: 'Herbaceous', desc: 'Shredded Asian pennywort herbs lightly warmed with freshly grated coconut and crushed sea salt.' },
      { name: 'Crispy Papadam', tag: 'Crunch', desc: 'Sun-dried lentil wafers flash-fried in hot coconut oil until bubbly and golden crisp.' }
    ],
    ingredients: 'Red raw rice (Rathu Kakulu), young jackfruit, red split lentils, fresh grated coconut, goraka (gamboge), Ceylon cinnamon, curry leaves, pandan leaves, turmeric, dried red chilies, mustard seeds, coconut vinegar.',
    howToEat: 'Mix a small portion of each curry with rice using your right hand. Add pol sambol for heat and papadam for crunch. Traditionally eaten with fingers — the tactile experience is part of the ritual. Pair with iced king coconut water.'
  },
  {
    id: 3,
    slug: 'egg-hoppers',
    title: 'Egg Hoppers (Appa)',
    tagline: 'Bowl-Shaped Coconut Pancakes',
    sub: 'Galle · Breakfast',
    tag: 'street',
    cuisine: 'Breakfast',
    meal: 'Breakfast',
    price: 'LKR 80 – LKR 200',
    spice: 'Mild',
    serving: 'Fresh Off the Wok',
    locations: 'Galle · Colombo · All Provinces',
    img: 'https://images.unsplash.com/photo-1567337710282-00832b415979?auto=format&fit=crop&w=1000&q=85',
    seed: 'hoppers',
    desc: 'Crispy golden edges with a soft, pillowy coconut centre. Enjoyed plain, with a warm steamed egg, and fiery lunu miris.',
    heritage: 'Hoppers are the quintessential Sri Lankan breakfast. The fermented rice batter is swirled into a small wok, creating a bowl-shaped pancake with lacy edges and a soft, spongy centre. The egg version — with a whole egg cracked into the middle — is a national favourite.',
    varieties: [
      { name: 'Plain Hopper', tag: 'Classic', desc: 'Crispy edges, soft centre — the base of every hopper.' },
      { name: 'Egg Hopper', tag: 'Signature', desc: 'A whole egg cracked into the centre and steamed until just set.' },
      { name: 'String Hopper', tag: 'Alternative', desc: 'Steamed rice noodle nests, softer and served with curry.' },
      { name: 'Milk Hopper', tag: 'Sweet', desc: 'Sweetened with coconut milk and jaggery, served as dessert.' }
    ],
    ingredients: 'Fermented rice flour, coconut milk, coconut water, yeast, a pinch of sugar, salt, eggs (for egg hoppers).',
    howToEat: 'Tear off the crispy edges with your fingers, dip into lunu miris (chili-onion sambol), and eat with the soft centre. Best eaten fresh, straight from the wok.'
  },
  {
    id: 4,
    slug: 'jaffna-coastal-seafood',
    title: 'Jaffna & Coastal Seafood',
    tagline: 'Fiery Crab & Ocean Grills',
    sub: 'Negombo · Seafood',
    tag: 'seafood',
    cuisine: 'Coastal',
    meal: 'Dinner',
    price: 'LKR 1,200 – LKR 3,500',
    spice: 'Fiery',
    serving: 'Banana Leaf Platter',
    locations: 'Jaffna · Negombo · Mirissa',
    img: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=1000&q=85',
    seed: 'seafood',
    desc: 'World-renowned Jaffna crab curry infused with roasted curry powder, moong dal, and coconut milk, alongside fresh lagoon prawns, cuttlefish, and reef fish.',
    heritage: 'The northern Jaffna peninsula has a distinct culinary identity shaped by Tamil heritage, coral-fringed lagoons, and centuries of spice trade. Crab curry here is roasted, not simmered — the spice blend is dry-roasted before it ever meets the coconut milk, creating a darker, smokier, deeper flavour.',
    varieties: [
      { name: 'Jaffna Crab Curry', tag: 'Signature', desc: 'Fresh lagoon crab simmered in roasted curry powder, moong dal, and thick coconut milk.' },
      { name: 'Negombo Prawn Curry', tag: 'Coastal', desc: 'Sweet lagoon prawns in a tangy tamarind and coconut sauce.' },
      { name: 'Grilled Reef Fish', tag: 'Simple', desc: 'Whole reef fish grilled over coconut husk embers with lime and sea salt.' },
      { name: 'Cuttlefish Fry', tag: 'Crispy', desc: 'Tender cuttlefish rings tossed in spiced batter and flash-fried.' }
    ],
    ingredients: 'Fresh crab, prawns, cuttlefish, reef fish, roasted curry powder, moong dal, coconut milk, tamarind, curry leaves, garlic, ginger, green chilies, Ceylon cinnamon.',
    howToEat: 'Served on a banana leaf. Use your hands to break the crab shells — the sauce is meant to be licked off. Pair with red rice or string hoppers. A cold beer or lime soda balances the heat.'
  },
  {
    id: 5,
    slug: 'ceylon-tea-tasting',
    title: 'Ceylon Tea Tasting',
    tagline: 'The Golden Brew of the Highlands',
    sub: 'Nuwara Eliya · Drink',
    tag: 'drinks',
    cuisine: 'Beverage',
    meal: 'Afternoon',
    price: 'LKR 200 – LKR 800',
    spice: 'None',
    serving: 'Porcelain Cup',
    locations: 'Nuwara Eliya · Kandy · Ella',
    img: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1000&q=85',
    seed: 'tea',
    desc: 'Hand-picked from misty highland estates, Ceylon tea is prized worldwide for its bright, brisk character and delicate floral notes.',
    heritage: "Ceylon tea has been grown in Sri Lanka's central highlands since 1867, when Scottish planter James Taylor planted the first tea bushes in Loolecondera. Today, the island is one of the world's largest tea exporters, with seven distinct regional flavour profiles.",
    varieties: [
      { name: 'Nuwara Eliya', tag: 'Delicate', desc: "High-grown, light and floral — often called the 'champagne of teas'." },
      { name: 'Kandy', tag: 'Brisk', desc: 'Mid-grown, strong and full-bodied with a coppery colour.' },
      { name: 'Uva', tag: 'Aromatic', desc: 'Eastern highlands — distinctive menthol and eucalyptus notes.' },
      { name: 'Ruhuna', tag: 'Rich', desc: 'Low-grown, dark and rich with a malty finish.' }
    ],
    ingredients: 'Pure Ceylon black tea leaves (single estate or blended). Optional: milk, sugar, lime, or cardamom.',
    howToEat: 'Brew with freshly boiled water for 3–5 minutes. Serve black to appreciate the highland character, or with a splash of milk. Pair with a piece of jaggery or a shortbread biscuit.'
  },
  {
    id: 6,
    slug: 'pol-sambol',
    title: 'Coconut Sambol (Pol Sambol)',
    tagline: 'The Soul of Sri Lankan Tables',
    sub: 'Island-wide · Side',
    tag: 'curry',
    cuisine: 'Condiment',
    meal: 'Side',
    price: 'LKR 150 – LKR 350',
    spice: 'Fiery',
    serving: 'Small Earthen Bowl',
    locations: 'Island-wide',
    img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1000&q=85',
    seed: 'polsambol',
    desc: 'Hand-scraped coconut pounded with shallots, dried red chilies, and lime — the essential Sri Lankan side.',
    heritage: 'Pol sambol is on every Sri Lankan table, at every meal. It is simple, fresh, and fiercely flavourful — a true taste of the island.',
    varieties: [
      { name: 'Classic Red', tag: 'Signature', desc: 'Coconut, dry chili flakes, shallots, lime, and sea salt.' },
      { name: 'Maldive Fish', tag: 'Umami', desc: 'With dried Maldive fish chips for rich smoky depth.' }
    ],
    ingredients: 'Fresh grated coconut, dried red chilies, shallots, lime, salt, Maldive fish (optional).',
    howToEat: 'Served alongside rice and curry, hoppers, string hoppers, or tucked inside warm pol roti.'
  },
  {
    id: 7,
    slug: 'king-coconut',
    title: 'King Coconut (Thambili)',
    tagline: 'Nature’s Living Electrolyte Drink',
    sub: 'Southern Coast · Drink',
    tag: 'drinks',
    cuisine: 'Beverage',
    meal: 'Any time',
    price: 'LKR 100 – LKR 250',
    spice: 'None',
    serving: 'Fresh Whole Shell',
    locations: 'Southern Coast · Island-wide',
    img: 'https://images.unsplash.com/photo-1580984969071-a8da5656c2fb?auto=format&fit=crop&w=1000&q=85',
    seed: 'kingcoconut',
    desc: 'The bright orange king coconut — nature’s electrolyte drink, served straight from the shell with a straw.',
    heritage: 'King coconut is native strictly to Sri Lanka and grows only in tropical warmth. Unlike green coconuts used for oil and cooking, Thambili is prized purely for its cooling, sweet mineral nectar.',
    varieties: [
      { name: 'Fresh Thambili', tag: 'Classic', desc: 'Chilled, straight from the freshly sliced shell.' },
      { name: 'Thambili with Lime', tag: 'Refreshing', desc: 'Squeeze of fresh kaffir lime for a citrus lift.' }
    ],
    ingredients: 'Fresh king coconut water, optional lime or ice.',
    howToEat: 'Best served cold, straight from the shell. Drink the water, then ask the vendor to split it so you can scoop out the soft coconut jelly inside.'
  },
  {
    id: 8,
    slug: 'watalappan',
    title: 'Watalappan',
    tagline: 'Steamed Spiced Coconut Custard',
    sub: 'Jaffna · Dessert',
    tag: 'sweets',
    cuisine: 'Dessert',
    meal: 'Dessert',
    price: 'LKR 250 – LKR 600',
    spice: 'None',
    serving: 'Sliced Squares',
    locations: 'Jaffna · Colombo · Island-wide',
    img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=85',
    seed: 'watalappan',
    desc: 'A rich, steamed coconut custard made with dark kithul jaggery, cardamom, nutmeg, and cashews — the crown jewel of Sri Lankan festive desserts.',
    heritage: "Watalappan has its roots in the Malay and Moor communities of Sri Lanka. The name derives from the Tamil 'vattalappam' — a steamed pudding traditionally prepared for festive Eid and wedding banquets.",
    varieties: [
      { name: 'Classic Jaggery', tag: 'Traditional', desc: 'Deep palm jaggery with cardamom and nutmeg.' },
      { name: 'Cashew Topped', tag: 'Rich', desc: 'Whole cashews pressed into the top before steaming.' }
    ],
    ingredients: 'Coconut milk, kithul jaggery, farm eggs, cardamom, nutmeg, cloves, whole cashews, pandan leaves.',
    howToEat: 'Served chilled in small squares. Best after a spicy rice and curry meal — the cool, sweet custard gently soothes the palate.'
  },
  {
    id: 9,
    slug: 'crab-curry',
    title: 'Grilled Jaffna Crab',
    tagline: 'Coastal Charcoal Fire Feast',
    sub: 'Jaffna · Coastal',
    tag: 'seafood',
    cuisine: 'Coastal',
    meal: 'Dinner',
    price: 'LKR 1,500 – LKR 3,000',
    spice: 'Fiery',
    serving: 'Clay Pot & Shell Cracker',
    locations: 'Jaffna · Negombo',
    img: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=1000&q=85',
    seed: 'jaffnacrab',
    desc: 'Fresh northern mud crabs grilled over wood coals with spicy tamarind paste, garlic, and cracked pepper.',
    heritage: "Negombo and Jaffna lagoon crabs are famous throughout Asia for their sweet claw meat. The curry is slow-cooked for hours to let the crab absorb the spices.",
    varieties: [
      { name: 'Jaffna Roasted', tag: 'Signature', desc: 'Dark, smoky, with roasted curry powder and moong dal.' },
      { name: 'Dry Crab Fry', tag: 'Crispy', desc: 'Crab tossed in dry toasted spices and curry leaves.' }
    ],
    ingredients: 'Fresh lagoon crab, coconut milk, roasted curry powder, moong dal, tamarind, curry leaves, garlic, ginger, green chilies.',
    howToEat: 'Served with red rice or string hoppers. Break the shells with your hands and scoop up the thick gravy.'
  },
  {
    id: 10,
    slug: 'curd-treacle',
    title: 'Curd & Treacle (Kiri Pani)',
    tagline: 'Ancient Buffalo Milk Sweet',
    sub: 'Kandy · Dessert',
    tag: 'sweets',
    cuisine: 'Dessert',
    meal: 'Dessert',
    price: 'LKR 200 – LKR 450',
    spice: 'None',
    serving: 'Clay Pot & Jug',
    locations: 'Kandy · Ruhuna · Island-wide',
    img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1000&q=85',
    seed: 'curd',
    desc: 'Thick buffalo curd served in a clay pot, drizzled with golden kithul treacle — Sri Lanka’s oldest and most beloved dessert.',
    heritage: 'Kithul treacle is harvested from the inflorescence of the wild highland Kithul palm. The sap is boiled down into a thick, smoky syrup that balances the rich tartness of buffalo curd.',
    varieties: [
      { name: 'Buffalo Curd', tag: 'Traditional', desc: 'Thick, creamy curd naturally set inside terracotta dishes.' },
      { name: 'Kithul Treacle', tag: 'Signature', desc: 'Smoky, viscous amber palm nectar drizzled abundantly.' }
    ],
    ingredients: 'Water buffalo milk curd, 100% pure kithul palm treacle.',
    howToEat: 'Scoop a generous spoonful of curd, drizzle with amber treacle, and enjoy slowly.'
  },
  {
    id: 11,
    slug: 'string-hoppers',
    title: 'String Hoppers (Idiyappam)',
    tagline: 'Steamed Rice Flour Noodle Nests',
    sub: 'Anuradhapura · Breakfast',
    tag: 'curry',
    cuisine: 'Breakfast',
    meal: 'Breakfast',
    price: 'LKR 100 – LKR 300',
    spice: 'Mild',
    serving: 'Steamed Nests',
    locations: 'Anuradhapura · Colombo · Island-wide',
    img: 'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=1000&q=85',
    seed: 'stringhoppers',
    desc: 'Steamed rice noodle nests, delicate and soft, served with coconut milk kiri hodi and fiery pol sambol.',
    heritage: 'String hoppers are a breakfast staple across Sri Lanka, made by pressing steamed rice flour dough through fine mesh moulds into lacy woven rounds.',
    varieties: [
      { name: 'White Rice', tag: 'Classic', desc: 'Delicate, fluffy steamed white rice noodles.' },
      { name: 'Red Raw Rice', tag: 'Nutritious', desc: 'Heirloom red rice flour packed with fiber.' }
    ],
    ingredients: 'Rice flour, water, salt. Accompaniments: coconut milk curry (kiri hodi) and pol sambol.',
    howToEat: 'Tear up 3–4 string hoppers, pour warm kiri hodi over them, and blend in pol sambol with your fingers.'
  },
  {
    id: 12,
    slug: 'seeni-sambol-bun',
    title: 'Seeni Sambol Bun',
    tagline: 'Caramelized Sweet Onion Pastry',
    sub: 'Colombo · Snack',
    tag: 'street',
    cuisine: 'Snack',
    meal: 'Snack',
    price: 'LKR 80 – LKR 200',
    spice: 'Mild to Spicy',
    serving: 'Bakery Fresh',
    locations: 'Colombo · Island-wide',
    img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=85',
    seed: 'bun',
    desc: 'Soft golden bakery buns stuffed with sweet, caramelized onion relish — a beloved island tea-time companion.',
    heritage: 'Seeni sambol is a sweet caramelized onion relish slow-cooked with tamarind and raw sugar. Stuffed into tender rolls, it forms the backbone of Sri Lankan bakery culture.',
    varieties: [
      { name: 'Classic Seeni', tag: 'Signature', desc: 'Sweet onion relish with cinnamon and cardamom.' },
      { name: 'Spicy Fish Bun', tag: 'Savory', desc: 'Stuffed with spiced tuna and potato mash.' }
    ],
    ingredients: 'Wheat flour, yeast, caramelized onions, tamarind pulp, jaggery, cardamom, chili flakes.',
    howToEat: 'Enjoy fresh and warm with a hot cup of Ceylon milk tea.'
  },
  {
    id: 13,
    slug: 'prawn-vadai',
    title: 'Prawn Vadai',
    tagline: 'Crispy Seaside Prawn Fritters',
    sub: 'Batticaloa · Street',
    tag: 'seafood',
    cuisine: 'Street Food',
    meal: 'Snack',
    price: 'LKR 100 – LKR 250',
    spice: 'Medium to Hot',
    serving: 'Fried Fresh',
    locations: 'Batticaloa · Galle Face · Negombo',
    img: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=1000&q=85',
    seed: 'vadai',
    desc: 'Crispy lentil fritters studded with whole crunchy prawns, flash-fried fresh at seaside carts.',
    heritage: 'Prawn vadai is a coastal street food classic. Soaked red lentils are coarsely ground with herbs and cumin, pressed with whole shell-on prawns, and deep-fried.',
    varieties: [
      { name: 'Whole Lagoon Prawn', tag: 'Signature', desc: 'Crispy shell-on whole prawns embedded in spiced dhal.' },
      { name: 'Masala Vadai', tag: 'Spicy', desc: 'Extra crushed fennel, coriander, and bird’s eye chilies.' }
    ],
    ingredients: 'Red split lentils, whole lagoon prawns, curry leaves, shallots, green chilies, turmeric, coconut oil.',
    howToEat: 'Eat whole, shell and all, with a squeeze of fresh lime juice while strolling the ocean promenade.'
  },
  {
    id: 14,
    slug: 'faluda',
    title: 'Faluda',
    tagline: 'Sweet Rose Milk Ice Float',
    sub: 'Colombo · Sweet Drink',
    tag: 'drinks',
    cuisine: 'Beverage',
    meal: 'Dessert Drink',
    price: 'LKR 250 – LKR 600',
    spice: 'None',
    serving: 'Tall Glass with Spoon',
    locations: 'Colombo · Pettah · Island-wide',
    img: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=1000&q=85',
    seed: 'faluda',
    desc: 'A tall, colourful rose-flavoured drink with basil seeds, jelly, and ice cream — Sri Lanka’s favourite cooling beverage.',
    heritage: 'Faluda arrived in Sri Lanka via ancient Persian and Moor maritime trade, evolving into an indispensable street indulgence on warm Colombo afternoons.',
    varieties: [
      { name: 'Classic Rose', tag: 'Traditional', desc: 'Rose syrup, sweet basil seeds (Kasakasa), jelly, and vanilla ice cream.' },
      { name: 'Special Kulfi', tag: 'Rich', desc: 'Enriched with condensed milk and chopped pistachios.' }
    ],
    ingredients: 'Rose syrup, whole chilled milk, soaked basil seeds, vermicelli strands, jelly cubes, vanilla ice cream scoop.',
    howToEat: 'Stir gently with a long spoon to mix the rose syrup and basil seeds, eating the ice cream first.'
  },
  {
    id: 15,
    slug: 'kokis',
    title: 'Kokis',
    tagline: 'Lacy Festive Rosette Fritters',
    sub: 'Island-wide · Festive',
    tag: 'sweets',
    cuisine: 'Festive Snack',
    meal: 'Snack',
    price: 'LKR 100 – LKR 250',
    spice: 'None',
    serving: 'Crispy Lace Rosette',
    locations: 'Island-wide · Festive',
    img: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=1000&q=85',
    seed: 'kokis',
    desc: 'Crispy, lacy rice flour and coconut milk fritters — a cherished must-have at Sinhala and Tamil New Year.',
    heritage: 'Kokis is crafted using decorative brass moulds dipped into coconut milk batter and fried until crisp and golden.',
    varieties: [
      { name: 'Traditional Wheel', tag: 'Classic', desc: 'Delicate floral pattern fried to golden crispness.' },
      { name: 'Savory Cumin', tag: 'Spiced', desc: 'Lightly seasoned with toasted cumin and turmeric.' }
    ],
    ingredients: 'Rice flour, coconut milk, farm eggs, turmeric powder, sea salt, coconut oil for frying.',
    howToEat: 'A wonderfully crunchy finger snack, best enjoyed with strong hot Ceylon black tea.'
  },
  {
    id: 16,
    slug: 'tropical-fruit',
    title: 'Tropical Fruit Platter',
    tagline: 'Sun-Ripened Island Harvest',
    sub: 'Island-wide · Fresh',
    tag: 'sweets',
    cuisine: 'Fresh',
    meal: 'Snack',
    price: 'LKR 200 – LKR 500',
    spice: 'None',
    serving: 'Fresh Cut Slices',
    locations: 'Island-wide',
    img: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=1000&q=85',
    seed: 'fruit',
    desc: 'A vibrant platter of sun-ripened papaya, red watermelon, wild mangoes, passion fruit, and golden bananas.',
    heritage: 'Sri Lanka’s lush tropical soils yield an astounding bounty of fruits year-round, sold fresh at wayside stalls with chili salt.',
    varieties: [
      { name: 'Classic Mix', tag: 'Signature', desc: 'Papaya, pineapple, watermelon, and sweet Cavendish bananas.' },
      { name: 'Jungle Seasonal', tag: 'Exotic', desc: 'Rambutan, mangosteen, passion fruit, and sour soursop.' }
    ],
    ingredients: 'Fresh seasonal fruits, served with sea salt and crushed red chili flakes.',
    howToEat: 'Eat with a fork or toothpicks, lightly dipping sweet fruit slices into chili salt for an authentic Sri Lankan flavor kick.'
  },
  {
    id: 17,
    slug: 'devilled-chicken',
    title: 'Devilled Chicken',
    tagline: 'Fiery Sweet, Sour & Savory Stir-Fry',
    sub: 'Colombo · Fusion',
    tag: 'curry',
    cuisine: 'Fusion',
    meal: 'Dinner',
    price: 'LKR 550 – LKR 1,200',
    spice: 'Medium to Fiery',
    serving: 'Sizzling Plate',
    locations: 'Colombo · Island-wide',
    img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1000&q=85',
    seed: 'devilled',
    desc: 'Sri Lankan-Chinese fusion — crispy fried chicken tossed with crunchy bell peppers, onions, and a sticky sweet-hot chili glaze.',
    heritage: 'Devilled dishes are a beloved legacy of Sri Lanka’s street restaurants, combining Chinese wok frying with local tropical spices.',
    varieties: [
      { name: 'Crispy Chicken', tag: 'Classic', desc: 'Marinated deep-fried chicken cubes glazed with chili sauce.' },
      { name: 'Devilled Calamari', tag: 'Seafood', desc: 'Tender squid rings wok-fried with banana peppers and garlic.' }
    ],
    ingredients: 'Chicken breast, banana peppers, red onions, garlic, ginger, dark soy sauce, tomato ketchup, chili paste.',
    howToEat: 'Pairs exceptionally well with egg fried rice, roast bread, or as a savory pub snack.'
  },
  {
    id: 18,
    slug: 'wood-apple-juice',
    title: 'Wood Apple Juice',
    tagline: 'Tangy Jungle Superfruit Nectar',
    sub: 'Island-wide · Drink',
    tag: 'drinks',
    cuisine: 'Beverage',
    meal: 'Any time',
    price: 'LKR 150 – LKR 350',
    spice: 'None',
    serving: 'Tall Frosted Glass',
    locations: 'Dry Zone · Hambantota · Dambulla',
    img: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=1000&q=85',
    seed: 'woodapple',
    desc: 'Tangy, refreshing juice made from indigenous hard-shelled Divul (wood apple), sweetened with raw jaggery.',
    heritage: 'Wood apple is an ancient wild fruit prized by Ayurvedic healers for gut health, crushed by villagers and mixed with coconut milk.',
    varieties: [
      { name: 'Traditional Jaggery', tag: 'Classic', desc: 'Blended with thick coconut milk and grated kithul jaggery.' },
      { name: 'Tangy Lime', tag: 'Fresh', desc: 'Pure pulp with water, lime juice, and sea salt.' }
    ],
    ingredients: 'Ripe wood apple pulp, coconut milk or water, raw cane sugar or jaggery, crushed ice.',
    howToEat: 'Drink thoroughly chilled on a sweltering afternoon.'
  },
  {
    id: 19,
    slug: 'seabass',
    title: 'Fresh Sea Bass',
    tagline: 'Charcoal-Grilled Whole Ocean Catch',
    sub: 'Trincomalee · Coastal',
    tag: 'seafood',
    cuisine: 'Coastal',
    meal: 'Dinner',
    price: 'LKR 900 – LKR 2,200',
    spice: 'Mild',
    serving: 'Whole Grilled Fish',
    locations: 'Trincomalee · East Coast · Mirissa',
    img: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1000&q=85',
    seed: 'seabass',
    desc: 'Whole fresh sea bass grilled over coconut husk embers with lime, garlic, and coarse sea salt.',
    heritage: 'East coast fishing communities have perfected the art of grilling ocean catches over fragrant coconut embers for centuries.',
    varieties: [
      { name: 'Ember Grilled', tag: 'Classic', desc: 'Whole fish grilled with lemon butter and fresh cracked pepper.' },
      { name: 'Tawa Fried', tag: 'Crispy', desc: 'Marinated with chili paste and flash-seared on an iron griddle.' }
    ],
    ingredients: 'Freshly caught sea bass, lime juice, garlic paste, sea salt, ground black pepper, coconut oil.',
    howToEat: 'Squeeze grilled lime over the fish and enjoy with garlic bread or steamed rice.'
  },
  {
    id: 20,
    slug: 'street-corn',
    title: 'Street Corn (Bhutta)',
    tagline: 'Charcoal-Roasted Sweetcorn on the Cob',
    sub: 'Galle Face · Snack',
    tag: 'street',
    cuisine: 'Snack',
    meal: 'Snack',
    price: 'LKR 80 – LKR 200',
    spice: 'Optional',
    serving: 'Hot on the Cob',
    locations: 'Galle Face Green · Colombo · Island-wide',
    img: 'https://images.unsplash.com/photo-1595231776515-ddffb1f4eb73?auto=format&fit=crop&w=1000&q=85',
    seed: 'corn',
    desc: 'Grilled sweetcorn on the cob, basted with melted butter, red chili powder, and tangy lime juice.',
    heritage: 'Galle Face Green in Colombo is legendary for sunset snack stalls, with glowing embers roasting thousands of sweetcorn cobs daily.',
    varieties: [
      { name: 'Spicy Chili Lime', tag: 'Signature', desc: 'Rubbed vigorously with fresh lime wedge and red chili salt.' },
      { name: 'Melted Butter', tag: 'Rich', desc: 'Generously brushed with rich butter and cracked black pepper.' }
    ],
    ingredients: 'Fresh sweetcorn on the cob, salted butter, red chili powder, lime wedges, sea salt.',
    howToEat: 'Hold the husk and eat straight off the steaming cob while watching the ocean waves.'
  }
];
