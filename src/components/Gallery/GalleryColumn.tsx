import React from 'react';
import GalleryImage from './GalleryImage';
import type { Image } from './types';

interface GalleryColumnProps {
  column: Image[];
  columnIndex: number;
  onImageClick: (columnIndex: number, imageIndex: number) => void;
  onLike: (imageId: string) => void;
}

const GalleryColumn = ({ column, columnIndex, onImageClick, onLike }: GalleryColumnProps) => {
  return (
    <div className="flex flex-col gap-4">
      {column.map((photo, imageIndex) => (
        <GalleryImage
          key={photo.id}
          photo={photo}
          onImageClick={() => onImageClick(columnIndex, imageIndex)}
          onLike={onLike}
        />
      ))}
    </div>
  );
};

export default GalleryColumn;