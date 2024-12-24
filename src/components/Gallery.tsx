import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import type { Database } from '@/integrations/supabase/types';
import ImageModal from './ImageModal';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';

type Image = Database['public']['Tables']['images']['Row'] & {
  likes_count?: number;
};

interface GalleryProps {
  category?: string;
}

const Gallery = ({ category }: GalleryProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(-1);
  const queryClient = useQueryClient();

  // Fetch images
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

  // Subscribe to likes changes
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

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault();
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

  // Split photos into 5 columns instead of 4
  const columns = [[], [], [], [], []].map(() => [] as Image[]);
  
  photos.forEach((photo, index) => {
    columns[index % 5].push(photo);
  });

  return (
    <>
      <div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-[2000px] mx-auto px-4"
        onContextMenu={handleContextMenu}
      >
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className="flex flex-col gap-4">
            {column.map((photo, imageIndex) => (
              <div 
                key={photo.id}
                className="relative overflow-hidden group select-none cursor-pointer"
                onClick={() => handleImageClick(columnIndex, imageIndex)}
              >
                <img
                  src={photo.url}
                  alt={photo.alt}
                  className="w-full object-cover transition-transform duration-500 hover:scale-105 pointer-events-none"
                  loading="lazy"
                  onDragStart={handleDragStart}
                  style={{ WebkitUserSelect: 'none', userSelect: 'none' }}
                />
                <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-background/50 dark:bg-foreground/10 px-2 py-1 rounded-full">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(photo.id);
                    }}
                    className="text-foreground hover:text-red-500 transition-colors"
                  >
                    <Heart size={16} />
                  </button>
                  <span className="text-foreground text-sm">{photo.likes_count || 0}</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

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
