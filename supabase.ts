import { createClient } from '@supabase/supabase-js';
import { RateLimiter } from './utils/RateLimiter';

// Note: Ensure your Supabase URL and Anon Key are correct.
// These allow the browser to securely communicate with your database via RLS.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const globalRateLimiter = new RateLimiter(15, 3); // 15 requests burst, 3 refill per second