import React from 'react';

interface Photo {
  id: string;
  url: string;
  alt: string;
}

interface GalleryProps {
  title: string;
  photos: Photo[];
}

const Gallery = ({ title, photos }: GalleryProps) => {
  return (
    <section className="py-16 px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary">
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {photos.map((photo) => (
          <div 
            key={photo.id}
            className="relative overflow-hidden group aspect-[4/3]"
          >
            <img
              src={photo.url}
              alt={photo.alt}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Gallery;