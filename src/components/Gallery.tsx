import React from 'react';

interface Photo {
  id: string;
  url: string;
  alt: string;
  aspectRatio: 'square' | 'portrait' | 'landscape';
}

interface GalleryProps {
  photos: Photo[];
}

const Gallery = ({ photos }: GalleryProps) => {
  // Split photos into 4 columns
  const columns = [[], [], [], []].map(() => [] as Photo[]);
  
  photos.forEach((photo, index) => {
    columns[index % 4].push(photo);
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-[2000px] mx-auto px-4">
      {columns.map((column, columnIndex) => (
        <div key={columnIndex} className="flex flex-col gap-4">
          {column.map((photo) => (
            <div 
              key={photo.id}
              className="relative overflow-hidden group"
            >
              <img
                src={photo.url}
                alt={photo.alt}
                className="w-full object-cover transition-transform duration-500 hover:scale-105"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Gallery;