import React from 'react';

interface Photo {
  id: string;
  url: string;
  alt: string;
  aspectRatio?: 'square' | 'portrait' | 'landscape';
}

interface GalleryProps {
  photos: Photo[];
}

const Gallery = ({ photos }: GalleryProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
      {photos.map((photo) => (
        <div 
          key={photo.id}
          className={`relative overflow-hidden ${
            photo.aspectRatio === 'portrait' ? 'row-span-2' : 
            photo.aspectRatio === 'landscape' ? 'col-span-2' : ''
          }`}
        >
          <img
            src={photo.url}
            alt={photo.alt}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
};

export default Gallery;