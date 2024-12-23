import React from 'react';
import Navigation from '../components/Navigation';
import Gallery from '../components/Gallery';

const photos = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
    alt: 'Mountain landscape',
    aspectRatio: 'landscape'
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716',
    alt: 'Waterfall in forest',
    aspectRatio: 'portrait'
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b',
    alt: 'Mountain lake',
    aspectRatio: 'square'
  },
  {
    id: '4',
    url: 'https://images.unsplash.com/photo-1472396961693-142e6e269027',
    alt: 'Wildlife in nature',
    aspectRatio: 'landscape'
  },
  {
    id: '5',
    url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86',
    alt: 'Forest canopy',
    aspectRatio: 'portrait'
  },
  {
    id: '6',
    url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843',
    alt: 'Sunrise through trees',
    aspectRatio: 'square'
  }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="pt-24 px-6 pb-16">
        <Gallery photos={photos} />
      </main>
    </div>
  );
};

export default Index;