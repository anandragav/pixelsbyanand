import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import type { Image } from './types';

export const useImages = (category?: string) => {
  return useQuery({
    queryKey: ['photos', category],
    queryFn: async () => {
      try {
        let query = supabase
          .from('images')
          .select('*, likes(count)')
          .order('created_at', { ascending: false });
        
        if (category) {
          query = query.eq('category', category);
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching images:', error);
          throw error;
        }

        if (!data) {
          return [];
        }
        
        return data.map(photo => ({
          ...photo,
          likes_count: photo.likes?.[0]?.count || 0
        }));
      } catch (error) {
        console.error('Error in queryFn:', error);
        throw error;
      }
    },
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 1000 * 60 // 1 minute
  });
};