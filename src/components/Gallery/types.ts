import type { Database } from '@/integrations/supabase/types';

export type BaseImage = Database['public']['Tables']['images']['Row'];

export interface Image extends BaseImage {
  likes_count?: number;
  likes?: Array<{ count: number }>;
}