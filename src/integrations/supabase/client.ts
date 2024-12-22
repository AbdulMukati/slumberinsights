import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ydcjpytgpznarztystoo.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkY2pweXRncHpuYXJ6dHlzdG9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ4NDg4MjAsImV4cCI6MjA1MDQyNDgyMH0.ZrJFqRZW_dJ2kLLAOIqqjT6PEQTY6g1dLPGc6BHDyC4";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
});