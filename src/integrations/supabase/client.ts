import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = 'https://abhidmrpkgtdxzyfmnzw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiaGlkbXJwa2d0ZHh6eWZtbnp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDM0OTg0MDAsImV4cCI6MjAxOTA3NDQwMH0.VTQF5qHvBrOxcHDGHqwNBNGFOOEFQQbEe7xHhxK8HXc';

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
);