import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Create a standard client for public/anon operations
export const supabase = createClient(supabaseUrl, supabaseKey);

// Create an admin client for server-side operations (bypassing RLS)
// Requires SUPABASE_SERVICE_ROLE_KEY in .env
const serviceRoleKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdmin = serviceRoleKey
  ? createClient(supabaseUrl, serviceRoleKey)
  : supabase; // Fallback to anon client if no service key (debugging purposes)
