import type { Database } from '@/integrations/supabase/types';

export type Image = Database['public']['Tables']['images']['Row'] & {
  likes_count?: number;
};