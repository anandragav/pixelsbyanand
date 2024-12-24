import React from 'react';
import { Heart } from 'lucide-react';
import type { Image } from './types';

interface GalleryImageProps {
  photo: Image;
  onImageClick: () => void;
  onLike: (imageId: string) => void;
}

const GalleryImage = ({ photo, onImageClick, onLike }: GalleryImageProps) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div 
      className="relative overflow-hidden group select-none cursor-pointer"
      onClick={onImageClick}
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
            onLike(photo.id);
          }}
          className="text-foreground hover:text-red-500 transition-colors"
        >
          <Heart size={16} />
        </button>
        <span className="text-foreground text-sm">{photo.likes_count || 0}</span>
      </div>
    </div>
  );
};

export default GalleryImage;