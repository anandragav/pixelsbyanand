import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import type { Database } from '@/integrations/supabase/types';

type Image = Database['public']['Tables']['images']['Row'];

interface GalleryProps {
  category?: string;
}

const Gallery = ({ category }: GalleryProps) => {
  const { data: photos = [], isLoading } = useQuery({
    queryKey: ['photos', category],
    queryFn: async () => {
      let query = supabase
        .from('images')
        .select('*');
      
      if (category) {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as Image[];
    }
  });

  // Prevent right click
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  // Prevent drag
  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault();
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  // Split photos into 4 columns
  const columns = [[], [], [], []].map(() => [] as Image[]);
  
  photos.forEach((photo, index) => {
    columns[index % 4].push(photo);
  });

  return (
    <div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-[2000px] mx-auto px-4"
      onContextMenu={handleContextMenu}
    >
      {columns.map((column, columnIndex) => (
        <div key={columnIndex} className="flex flex-col gap-4">
          {column.map((photo) => (
            <div 
              key={photo.id}
              className="relative overflow-hidden group select-none"
            >
              <img
                src={photo.url}
                alt={photo.alt}
                className="w-full object-cover transition-transform duration-500 hover:scale-105 pointer-events-none"
                loading="lazy"
                onDragStart={handleDragStart}
                style={{ WebkitUserSelect: 'none', userSelect: 'none' }}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Gallery;