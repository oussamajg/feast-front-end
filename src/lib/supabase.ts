
import { createClient } from '@supabase/supabase-js';

// Replace with your Supabase URL and anon key
// Default to empty strings to prevent the app from crashing completely
// This allows the app to load, even though Supabase features won't work
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Log a warning if environment variables are missing
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Define database types for better TypeScript support
export type Category = {
  id: string;
  user_id: string;
  name: string;
  created_at?: string;
};

export type MenuItem = {
  id: string;
  user_id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  created_at?: string;
};
