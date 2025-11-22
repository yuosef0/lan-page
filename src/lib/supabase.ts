import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Browser client that stores session in cookies (works with middleware)
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
