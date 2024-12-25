import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import type { Image } from '@/components/Gallery/types';
import { toast } from 'sonner';

export const useImages = (category?: string) => {
  return useQuery({
    queryKey: ['photos', category],
    queryFn: async () => {
      try {
        console.log('Fetching images...');
        let query = supabase
          .from('images')
          .select('*, likes(count)')
          .order('created_at', { ascending: false });
        
        if (category) {
          query = query.eq('category', category);
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error('Supabase error:', error);
          toast.error('Failed to fetch images');
          throw error;
        }

        if (!data) {
          console.log('No data returned from query');
          return [];
        }
        
        console.log('Number of images fetched:', data.length);
        console.log('Raw data from database:', data);
        
        const processedData = data.map(photo => ({
          ...photo,
          likes_count: photo.likes?.[0]?.count || 0
        }));

        console.log('Processed data:', processedData);
        
        return processedData;
      } catch (error) {
        console.error('Error in queryFn:', error);
        toast.error('Failed to load images');
        throw error;
      }
    },
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 1000 * 60 // 1 minute
  });
};