import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ydcjpytgpznarztystoo.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkY2pweXRncHpuYXJ6dHlzdG9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk4NTM5NDAsImV4cCI6MjAyNTQyOTk0MH0.GQDJZv-URVqW0qZUvdxWUZYxR3p0JqeQ0BBxe_sLKYI";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
});