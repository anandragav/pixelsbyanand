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
    const flatIndex = columnIndex + imageIndex * 5;
    setSelectedImageIndex(flatIndex);
  }, []);

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

  // Distribute images evenly across 5 columns
  const columns: Image[][] = [[], [], [], [], []];
  photos.forEach((photo, index) => {
    const columnIndex = index % 5;
    columns[columnIndex].push(photo);
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