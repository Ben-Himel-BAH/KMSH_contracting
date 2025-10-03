// Type definitions for the application

export interface Company {
  company_id: number;
  legal_name: string;
  duns_number?: string;
  cage_code?: string;
  website_url?: string;
  founded_date?: string;
  primary_location_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Contract {
  contract_id: number;
  contract_number: string;
  title?: string;
  description?: string;
  company_id: number;
  place_of_performance_location_id?: number;
  date_awarded: string;
  start_date?: string;
  end_date?: string;
  total_value: number;
  total_obligated?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Location {
  location_id: number;
  address_line1: string;
  address_line2?: string;
  city: string;
  state_province: string;
  postal_code: string;
  country_code: string;
  latitude?: number;
  longitude?: number;
}

export interface User {
  user_id: number;
  username: string;
  email: string;
  is_active: number;
}

// Chart data types
export interface ChartData {
  name: string;
  value: number;
}

export interface LineChartData {
  year: number;
  value: number;
}

export interface RadarData {
  subject: string;
  A: number;
  B: number;
}