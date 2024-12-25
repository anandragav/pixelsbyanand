import React, { useState, useCallback } from 'react';
import ImageModal from '../ImageModal';
import GalleryGrid from './GalleryGrid';
import { useImages } from '@/hooks/useImages';
import { useRealtimeLikes } from '@/hooks/useRealtimeLikes';
import { handleImageLike } from '@/utils/likeUtils';
import type { Image } from './types';

interface GalleryProps {
  category?: string;
}

const Gallery = ({ category }: GalleryProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(-1);
  const { data: photos = [], isLoading, error } = useImages(category);
  
  // Set up realtime subscription
  useRealtimeLikes(category);

  const handleImageClick = useCallback((columnIndex: number, imageIndex: number) => {
    // Calculate the actual index in the photos array
    const actualIndex = Math.floor(photos.length / 5) * columnIndex + imageIndex;
    setSelectedImageIndex(actualIndex);
  }, [photos.length]);

  const handleCloseModal = useCallback(() => {
    setSelectedImageIndex(-1);
  }, []);

  if (error) {
    return (
      <div className="text-center py-8 text-foreground">
        Error loading images. Please try refreshing the page.
      </div>
    );
  }

  if (isLoading) {
    return <div className="text-center py-8 text-foreground">Loading...</div>;
  }

  // Split photos into 5 columns more evenly
  const columns: Image[][] = [[], [], [], [], []];
  const itemsPerColumn = Math.ceil(photos.length / 5);
  
  photos.forEach((photo, index) => {
    const columnIndex = Math.floor(index / itemsPerColumn);
    if (columnIndex < 5) {
      columns[columnIndex].push(photo);
    }
  });

  return (
    <>
      <GalleryGrid
        columns={columns}
        onImageClick={handleImageClick}
        onLike={handleImageLike}
      />

      <ImageModal
        images={photos}
        selectedImageIndex={selectedImageIndex}
        isOpen={selectedImageIndex !== -1}
        onClose={handleCloseModal}
        onLike={handleImageLike}
      />
    </>
  );
};

export default Gallery;