import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';
import ImageModal from '../ImageModal';
import GalleryGrid from './GalleryGrid';
import type { Image } from './types';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface GalleryProps {
  category?: string;
}

const Gallery = ({ category }: GalleryProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(-1);
  const queryClient = useQueryClient();
  const channelRef = useRef<RealtimeChannel | null>(null);

  const { data: photos = [], isLoading, error } = useQuery({
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

  // Set up realtime subscription
  useEffect(() => {
    const setupRealtimeSubscription = async () => {
      // Clean up previous subscription if it exists
      if (channelRef.current) {
        await supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }

      const channel = supabase
        .channel('schema-db-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'likes'
          },
          () => {
            queryClient.invalidateQueries({ queryKey: ['photos', category] });
          }
        )
        .subscribe();

      channelRef.current = channel;
    };

    setupRealtimeSubscription();

    // Cleanup function
    return () => {
      const cleanup = async () => {
        if (channelRef.current) {
          await supabase.removeChannel(channelRef.current);
          channelRef.current = null;
        }
      };
      cleanup();
    };
  }, [queryClient, category]);

  const handleLike = async (imageId: string) => {
    try {
      const { error } = await supabase
        .from('likes')
        .insert({ image_id: imageId });

      if (error) {
        console.error('Error liking image:', error);
        toast.error('Failed to like image');
        return;
      }

      toast.success('Image liked!');
    } catch (error) {
      console.error('Error in handleLike:', error);
      toast.error('Failed to like image');
    }
  };

  const handleImageClick = useCallback((columnIndex: number, imageIndex: number) => {
    const flatIndex = columnIndex + (imageIndex * 5);
    setSelectedImageIndex(flatIndex);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedImageIndex(-1);
  }, []);

  if (error) {
    console.error('Gallery error:', error);
    return (
      <div className="text-center py-8 text-foreground">
        Error loading images. Please try refreshing the page.
      </div>
    );
  }

  if (isLoading) {
    return <div className="text-center py-8 text-foreground">Loading...</div>;
  }

  // Split photos into 5 columns
  const columns = [[], [], [], [], []].map(() => [] as Image[]);
  photos.forEach((photo, index) => {
    columns[index % 5].push(photo);
  });

  return (
    <>
      <GalleryGrid
        columns={columns}
        onImageClick={handleImageClick}
        onLike={handleLike}
      />

      <ImageModal
        images={photos}
        selectedImageIndex={selectedImageIndex}
        isOpen={selectedImageIndex !== -1}
        onClose={handleCloseModal}
        onLike={handleLike}
      />
    </>
  );
};

export default Gallery;