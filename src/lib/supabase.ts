import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jxhgbfxmyxnbvvxlqvzm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4aGdiZnhteXhuYnZ2eGxxdnptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk4NTM5NDAsImV4cCI6MjAyNTQyOTk0MH0.GQDJZv-URVqW0qZUvdxWUZYxR3p0JqeQ0BBxe_sLKYI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);