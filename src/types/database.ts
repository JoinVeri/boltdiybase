export interface Business {
  id: string;
  name: string;
  description: string | null;
  city: string;
  state: string;
  category: string;
  website: string | null;
  employee_count: number | null;
  founded_year: number | null;
  rating: number;
  review_count: number;
  image_url: string | null;
  youtube_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  pinterest_url: string | null;
  google_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface BusinessPhoto {
  id: string;
  business_id: string;
  url: string;
  caption: string | null;
  order: number;
  created_at: string;
}

export interface Review {
  id: string;
  business_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

export interface City {
  id: string;
  name: string;
  state: string;
  population: number | null;
  latitude: number | null;
  longitude: number | null;
  timezone: string | null;
  created_at: string;
}

export interface Service {
  id: string;
  name: string;
  description: string | null;
  category: string;
  parent_id: string | null;
  created_at: string;
}

export interface BusinessCity {
  business_id: string;
  city_id: string;
  primary_location: boolean;
  created_at: string;
}

export interface BusinessService {
  business_id: string;
  service_id: string;
  price_range: string | null;
  is_verified: boolean;
  created_at: string;
}

export interface ProService {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  price_range: string | null;
  created_at: string;
}

export interface ProServiceCity {
  pro_service_id: string;
  city_id: string;
  is_primary: boolean;
  service_radius: number | null;
  created_at: string;
}