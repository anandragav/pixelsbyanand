import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';
import ImageModal from '../ImageModal';
import GalleryGrid from './GalleryGrid';
import type { Image } from './types';

interface GalleryProps {
  category?: string;
}

const Gallery = ({ category }: GalleryProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(-1);
  const queryClient = useQueryClient();

  const { data: photos = [], isLoading, error } = useQuery({
    queryKey: ['photos', category],
    queryFn: async () => {
      try {
        console.log('Fetching images with category:', category);
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
          toast.error('Failed to load images');
          throw error;
        }

        if (!data) {
          console.log('No data returned from Supabase');
          return [];
        }

        console.log('Raw data from Supabase:', data);
        
        const processedData = data.map(photo => ({
          ...photo,
          likes_count: photo.likes?.[0]?.count || 0
        }));

        console.log('Processed images:', processedData);
        console.log('Total processed images:', processedData.length);
        
        return processedData;
      } catch (error) {
        console.error('Error in queryFn:', error);
        throw error;
      }
    },
    retry: 2,
    staleTime: 1000 * 60, // 1 minute
  });

  useEffect(() => {
    if (!photos) return;
    
    console.log('Current photos array:', photos);
    console.log('Number of photos:', photos.length);
    
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'likes'
        },
        (payload) => {
          console.log('Received likes update:', payload);
          queryClient.invalidateQueries({ queryKey: ['photos', category] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, category, photos]);

  const handleLike = async (imageId: string) => {
    console.log('Attempting to like image:', imageId);
    const { error } = await supabase
      .from('likes')
      .insert({ image_id: imageId });

    if (error) {
      console.error('Error liking image:', error);
      toast.error('Failed to like image');
      return;
    }

    toast.success('Image liked!');
  };

  const handleImageClick = (columnIndex: number, imageIndex: number) => {
    const flatIndex = columnIndex + (imageIndex * 5);
    console.log('Image clicked. Column index:', columnIndex, 'Image index:', imageIndex, 'Flat index:', flatIndex);
    console.log('Total images:', photos.length);
    setSelectedImageIndex(flatIndex);
  };

  const handleCloseModal = () => {
    console.log('Closing modal');
    setSelectedImageIndex(-1);
  };

  if (error) {
    console.error('Gallery error:', error);
    return <div className="text-center py-8 text-foreground">Error loading images. Please try again.</div>;
  }

  if (isLoading) {
    return <div className="text-center py-8 text-foreground">Loading...</div>;
  }

  // Split photos into 5 columns
  const columns = [[], [], [], [], []].map(() => [] as Image[]);
  photos.forEach((photo, index) => {
    const columnIndex = index % 5;
    console.log(`Adding photo ${index} to column ${columnIndex}:`, photo);
    columns[columnIndex].push(photo);
  });

  // Log the final column distribution
  console.log('Column distribution:', columns.map(col => col.length));

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