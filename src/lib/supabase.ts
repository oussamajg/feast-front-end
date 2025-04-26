
import { createClient } from '@supabase/supabase-js';

// Replace with your Supabase URL and anon key
// Default to placeholder values to prevent the app from crashing completely
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Log a warning if environment variables are missing
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.error('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.');
  console.warn('Application will load with limited functionality. Please connect to Supabase via the Lovable interface.');
}

// Initialize supabase client with fallback values to prevent crashes
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
