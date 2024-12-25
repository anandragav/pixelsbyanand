import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://abhidmrpkgtdxzyfmnzw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiaGlkbXJwa2d0ZHh6eWZtbnp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUwMjI1NzUsImV4cCI6MjA1MDU5ODU3NX0.5VgF3lYSolH9ku6KrRmlnO-Dw0ld9cbFerXUZ8Q5CDk";

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    },
    db: {
      schema: 'public'
    },
    global: {
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    }
  }
);