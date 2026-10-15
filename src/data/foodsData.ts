export interface FoodDishItem {
  id: number;
  title: string;
  sub: string;
  tag: 'street' | 'curry' | 'seafood' | 'sweets' | 'drinks' | string;
  img: string;
  seed: string;
}

export const FOODS_DATA: FoodDishItem[] = [
  { id: 1, title: 'Midnight Kottu Roti', sub: 'Colombo · Street Icon', tag: 'street', img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80', seed: 'kottu' },
  { id: 2, title: 'Rice & Curry Platter', sub: 'Kandy · Traditional', tag: 'curry', img: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&q=80', seed: 'ricecurry' },
  { id: 3, title: 'Egg Hoppers (Appa)', sub: 'Galle · Breakfast', tag: 'street', img: 'https://images.unsplash.com/photo-1567337710282-00832b415979?auto=format&fit=crop&w=600&q=80', seed: 'hoppers' },
  { id: 4, title: 'Lagoon Crab Curry', sub: 'Negombo · Seafood', tag: 'seafood', img: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=600&q=80', seed: 'crab' },
  { id: 5, title: 'Ceylon Tea Tasting', sub: 'Nuwara Eliya · Drink', tag: 'drinks', img: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80', seed: 'tea' },
  { id: 6, title: 'Coconut Sambol (Pol Sambol)', sub: 'Island-wide · Side', tag: 'curry', img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80', seed: 'sambol' },
  { id: 7, title: 'King Coconut (Thambili)', sub: 'Southern Coast · Drink', tag: 'drinks', img: 'https://images.unsplash.com/photo-1580984969071-a8da5656c2fb?auto=format&fit=crop&w=600&q=80', seed: 'kingcoconut' },
  { id: 8, title: 'Watalappan', sub: 'Jaffna · Dessert', tag: 'sweets', img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80', seed: 'watalappan' },
  { id: 9, title: 'Grilled Jaffna Crab', sub: 'Jaffna · Coastal', tag: 'seafood', img: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=600&q=80', seed: 'jaffnacrab' },
  { id: 10, title: 'Curd & Treacle (Kiri Pani)', sub: 'Kandy · Dessert', tag: 'sweets', img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80', seed: 'curd' },
  { id: 11, title: 'String Hoppers (Idiyappam)', sub: 'Anuradhapura · Breakfast', tag: 'curry', img: 'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=600&q=80', seed: 'stringhoppers' },
  { id: 12, title: 'Seeni Sambol Bun', sub: 'Colombo · Snack', tag: 'street', img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80', seed: 'bun' },
  { id: 13, title: 'Prawn Vadai', sub: 'Batticaloa · Street', tag: 'seafood', img: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=600&q=80', seed: 'vadai' },
  { id: 14, title: 'Faluda', sub: 'Colombo · Sweet Drink', tag: 'drinks', img: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80', seed: 'faluda' },
  { id: 15, title: 'Kokis', sub: 'Island-wide · Festive', tag: 'sweets', img: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=600&q=80', seed: 'kokis' },
  { id: 16, title: 'Tropical Fruit Platter', sub: 'Island-wide · Fresh', tag: 'sweets', img: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80', seed: 'fruit' },
  { id: 17, title: 'Devilled Chicken', sub: 'Colombo · Fusion', tag: 'curry', img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=600&q=80', seed: 'devilled' },
  { id: 18, title: 'Wood Apple Juice', sub: 'Island-wide · Drink', tag: 'drinks', img: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=600&q=80', seed: 'woodapple' },
  { id: 19, title: 'Fresh Sea Bass', sub: 'Trincomalee · Coastal', tag: 'seafood', img: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80', seed: 'seabass' },
  { id: 20, title: 'Street Corn (Bhutta)', sub: 'Galle Face · Snack', tag: 'street', img: 'https://images.unsplash.com/photo-1595231776515-ddffb1f4eb73?auto=format&fit=crop&w=600&q=80', seed: 'corn' },
];
