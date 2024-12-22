import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ydcjpytgpznarztystoo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkY2pweXRncHpuYXJ6dHlzdG9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk4NTM5NDAsImV4cCI6MjAyNTQyOTk0MH0.GQDJZv-URVqW0qZUvdxWUZYxR3p0JqeQ0BBxe_sLKYI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});