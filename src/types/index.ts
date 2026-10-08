export interface Place {
  id: number;
  name: string;
  description: string;
  short_description: string;
  location: string;
  province: string;
  category: string;
  lat: number;
  lng: number;
  image_url: string;
  gallery: string; // JSON string array
  tips: string;
  best_time: string;
  entry_fee: string;
  distance_km: number;
  rating: number;
  review_count: number;
  featured: number;
  created_at: string;
}

export interface Review {
  id: number;
  place_id: number;
  place_name?: string;
  author: string;
  rating: number;
  comment: string;
  status?: 'approved' | 'pending' | 'spam' | string;
  created_at: string;
}

export type CategoryType =
  | 'All'
  | 'Beaches'
  | 'Waterfalls'
  | 'Mountains'
  | 'Ancient Sites'
  | 'Wildlife'
  | 'Hidden Gems'
  | 'Historical'
  | 'Religious Places';

export interface ActivityLog {
  id: number;
  action: string;
  entity_type: string;
  entity_id: string;
  details: string;
  actor: string;
  created_at: string;
}
