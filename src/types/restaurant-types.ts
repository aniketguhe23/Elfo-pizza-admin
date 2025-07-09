export interface Item {
  id: number;
  name: string;
  description: string;
  image_url?: string;
  subcategory_id?: number;
  is_vegetarian: number;
  is_available: number;
  on_homePage: boolean;
  on_suggestions: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Restaurant {
  id: number;
  restaurants_no: string;
  name: string;
  address: string;
  city?: string;
  state?: string;
  pincode?: string;
  contact_email?: string;
  contact_phone?: string;
  opening_time: string;
  closing_time: string;
  is_active: boolean;
  logo_url?: string;
  banner_url?: string;
  created_at?: string;
  updated_at?: string;
  items: Item[];
}
