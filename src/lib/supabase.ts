import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create a Supabase client that uses cookies for session storage
// This ensures consistency between client-side and server-side (middleware)
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
