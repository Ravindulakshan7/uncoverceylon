import { prisma } from '../src/lib/db';

async function seed() {
  const foodCount = await prisma.foodItem.count();
  if (foodCount === 0) {
    await prisma.foodItem.createMany({
      data: [
        {
          title: 'Village Rice & Curry',
          tagline: '7-Curry Clay Pot Feast',
          desc: 'Slow-cooked in clay pots over cinnamon wood. Fragrant red rice served with jackfruit polos curry, tempered dhal, coconut pol sambol, and crispy papadum.',
          image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
          badge: 'Must Try',
          regions: 'Island-wide • Matale • Ella',
          sort_order: 1,
        },
        {
          title: 'Midnight Kottu Roti',
          tagline: 'The Sound of Sri Lankan Nights',
          desc: 'The rhythmic clatter of metal blades slicing godamba roti, fresh vegetables, eggs, and rich spicy chicken or cheese curry on a sizzling hot plate.',
          image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80',
          badge: 'Street Icon',
          regions: 'Colombo • Galle Face • Kandy',
          sort_order: 2,
        },
        {
          title: 'Jaffna & Coastal Seafood',
          tagline: 'Fiery Crab & Ocean Grills',
          desc: 'World-renowned Jaffna crab curry infused with roasted curry powder, moringa leaves, and coconut milk, alongside fresh catch grilled right on the beach.',
          image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
          badge: 'Seafood',
          regions: 'Jaffna • Negombo • Mirissa',
          sort_order: 3,
        },
        {
          title: 'Crispy Hoppers (Appa)',
          tagline: 'Bowl-Shaped Coconut Pancakes',
          desc: 'Crisp lacy golden edges with a soft, pillowy coconut center. Enjoyed plain, with a runny steamed egg, and fiery lunu miris onion relish.',
          image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
          badge: 'Breakfast & Dinner',
          regions: 'All Provinces',
          sort_order: 4,
        },
        {
          title: 'Highland Ceylon Tea',
          tagline: 'The World’s Finest Brew',
          desc: 'Handpicked two leaves and a bud from misty mountains above 1,800m. Golden liquor with subtle floral notes, served with traditional English cake.',
          image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
          badge: 'Highland Heritage',
          regions: 'Nuwara Eliya • Kandy • Ella',
          sort_order: 5,
        },
        {
          title: 'Curd & Kithul Treacle',
          tagline: 'Ancient Natural Sweetness',
          desc: 'Rich, thick water buffalo curd poured with smoky, amber-gold sweet nectar tapped from wild highland Kithul palm trees. A centuries-old dessert.',
          image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
          badge: 'Ancient Sweet',
          regions: 'Ruhuna • Tissamaharama • Wellawaya',
          sort_order: 6,
        },
      ],
    });
    console.log('Seeded foods');
  }

  const cultureCount = await prisma.cultureItem.count();
  if (cultureCount === 0) {
    await prisma.cultureItem.createMany({
      data: [
        {
          title: 'The Cultural Triangle',
          tagline: 'Ancient Sacred Kingdoms',
          desc: 'The golden triangle connecting Anuradhapura, Polonnaruwa, and Sigiriya. Colossal white stupas, rock-cut Buddhas, and sophisticated hydraulic engineering built over two millennia ago.',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80',
          badge: 'UNESCO Wonder',
          period: '5th Century BC – 13th Century AD',
          sort_order: 1,
        },
        {
          title: 'Temple of the Sacred Tooth',
          tagline: 'Spiritual Heart of Ceylon',
          desc: 'Located by the misty lake of Kandy, Sri Dalada Maligawa houses the sacred relic of Lord Buddha. Daily drumming ceremonies and the grand illuminated Esala Perahera procession with regal tusker elephants.',
          image: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=800&q=80',
          badge: 'Living Tradition',
          period: 'Central Province • Kandy',
          sort_order: 2,
        },
        {
          title: 'Galle Fort Ramparts',
          tagline: 'Colonial Maritime Fortress',
          desc: 'Built by the Portuguese in 1588 and reinforced by the Dutch East India Company. Cobblestone alleyways lined with colonial villas, chic cafes, antique jewelers, and sunset ramparts meeting the ocean.',
          image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
          badge: 'Colonial Living',
          period: '16th – 18th Century • Southern Coast',
          sort_order: 3,
        },
        {
          title: 'Dambulla Cave Temples',
          tagline: 'Cave Sanctuary of Gold',
          desc: 'Five sacred cave sanctuaries hollowed into a massive granite rock face, housing 153 gilded Buddha statues and 2,100 square meters of ancient ceiling murals that have survived over 2,000 years.',
          image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
          badge: 'Cave Murals',
          period: '1st Century BC • Matale',
          sort_order: 4,
        },
        {
          title: 'Traditional Mask Carving',
          tagline: 'Ancient Folklore & Healing',
          desc: 'In the coastal village of Ambalangoda, master craftsmen carve intricate wooden Raksha and Kolam masks from light Kaduru wood, painted with natural pigments for ancient healing devil dances.',
          image: 'https://images.unsplash.com/photo-1586611292717-1d4a1e5d3c9c?auto=format&fit=crop&w=800&q=80',
          badge: 'Folk Art',
          period: 'Southern Coast • Ambalangoda',
          sort_order: 5,
        },
        {
          title: 'Sacred Adam’s Peak (Sri Pada)',
          tagline: 'The Pilgrimage Above Clouds',
          desc: 'A 2,243m sacred pyramid peak revered by Buddhists, Hindus, Muslims, and Christians alike. Thousands climb 5,500 lantern-lit steps in midnight darkness to witness the sacred triangular sunrise shadow.',
          image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
          badge: 'Sacred Summit',
          period: 'Dec–Apr Pilgrimage Season',
          sort_order: 6,
        },
      ],
    });
    console.log('Seeded cultures');
  }

  const expCount = await prisma.experienceItem.count();
  if (expCount === 0) {
    await prisma.experienceItem.createMany({
      data: [
        {
          title: 'World-Class Surfing',
          tagline: 'Year-Round Coastal Swells',
          desc: 'With two alternating monsoon seasons, Sri Lanka offers peeling waves 365 days a year. From gentle, sandy breaks in Weligama and horseshoe bay peelers in Hiriketiya to legendary point breaks in Arugam Bay.',
          image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80',
          badge: 'Popular',
          seasons: 'South Coast (Nov–Apr) • East Coast (May–Sep)',
          sort_order: 1,
        },
        {
          title: 'Blue Highland Train Journeys',
          tagline: 'The World’s Most Scenic Railway',
          desc: 'Winding through emerald tea estates, pine cloud forests, and colonial stone bridges. Hang out the open doorway as mist brushes past and cross the famous Demodara Nine Arch Bridge.',
          image: 'https://images.unsplash.com/photo-1535463731090-e34f4b5098c5?auto=format&fit=crop&w=800&q=80',
          badge: 'Must Do',
          seasons: 'Year-round • Kandy to Ella Route',
          sort_order: 2,
        },
        {
          title: 'Wild Leopard & Elephant Safaris',
          tagline: 'Untamed National Sanctuaries',
          desc: 'Home to the highest density of wild leopards on Earth in Yala Block 1, plus hundreds of free-roaming wild elephant herds across Udawalawe and the Minneriya gathering.',
          image: 'https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?auto=format&fit=crop&w=800&q=80',
          badge: 'Wildlife',
          seasons: 'Best: Feb–July • Yala & Udawalawe',
          sort_order: 3,
        },
        {
          title: 'Peak Treks & Cloud Forests',
          tagline: 'Summits Above The Mist',
          desc: 'Scale 5,500 lantern-lit steps to Adam’s Peak for sunrise above the clouds, hike through the rolling tea trails to Ella Rock, or explore the endemic biodiversity of Knuckles Range.',
          image: 'https://images.unsplash.com/photo-1576706374778-95a95efff7b1?auto=format&fit=crop&w=800&q=80',
          badge: 'Adventure',
          seasons: 'Dec–Apr Pilgrimage • Ella & Knuckles',
          sort_order: 4,
        },
        {
          title: 'Blue Whale & Dolphin Expeditions',
          tagline: 'Giants of the Indian Ocean',
          desc: 'The deep ocean trench just off Mirissa brings the largest animals to ever live on Earth within swimming distance of the coast. Spot Blue Whales, Sperm Whales, and pods of spinner dolphins.',
          image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
          badge: 'Ocean',
          seasons: 'Nov–Apr Season • Mirissa & Trinco',
          sort_order: 5,
        },
        {
          title: 'Kitulgala White Water Rafting',
          tagline: 'Adrenaline on the Kelani River',
          desc: 'Navigate Grade 2 and Grade 3 rapids through lush tropical rainforests where Bridge on the River Kwai was filmed, accompanied by canyoning, confidence jumps, and waterfall abseiling.',
          image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=800&q=80',
          badge: 'Water Thrills',
          seasons: 'Year-round • Sabaragamuwa Province',
          sort_order: 6,
        },
      ],
    });
    console.log('Seeded experiences');
  }
}

seed()
  .then(() => console.log('SEED COMPLETE'))
  .catch(console.error);
