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

  const { data: photos = [], isLoading } = useQuery({
    queryKey: ['photos', category],
    queryFn: async () => {
      let query = supabase
        .from('images')
        .select('*, likes(count)');
      
      if (category) {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data.map(photo => ({
        ...photo,
        likes_count: photo.likes?.[0]?.count || 0
      }));
    }
  });

  useEffect(() => {
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

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, category]);

  const handleLike = async (imageId: string) => {
    const { error } = await supabase
      .from('likes')
      .insert({ image_id: imageId });

    if (error) {
      toast.error('Failed to like image');
      return;
    }

    toast.success('Image liked!');
  };

  const handleImageClick = (columnIndex: number, imageIndex: number) => {
    const flatIndex = columnIndex + (imageIndex * 5);
    console.log('Image clicked. Setting index to:', flatIndex);
    console.log('Total images:', photos.length);
    setSelectedImageIndex(flatIndex);
  };

  const handleCloseModal = () => {
    console.log('Closing modal');
    setSelectedImageIndex(-1);
  };

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