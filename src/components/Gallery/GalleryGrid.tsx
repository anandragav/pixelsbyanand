import React from 'react';
import GalleryColumn from './GalleryColumn';
import type { Image } from './types';

interface GalleryGridProps {
  columns: Image[][];
  onImageClick: (columnIndex: number, imageIndex: number) => void;
  onLike: (imageId: string) => void;
}

const GalleryGrid = ({ columns, onImageClick, onLike }: GalleryGridProps) => {
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <div 
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-[2000px] mx-auto px-4"
      onContextMenu={handleContextMenu}
    >
      {columns.map((column, columnIndex) => (
        <GalleryColumn
          key={columnIndex}
          column={column}
          columnIndex={columnIndex}
          onImageClick={onImageClick}
          onLike={onLike}
        />
      ))}
    </div>
  );
};

export default GalleryGrid;