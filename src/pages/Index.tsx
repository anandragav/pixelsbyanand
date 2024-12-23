import React from 'react';
import Hero from '../components/Hero';
import Gallery from '../components/Gallery';

const travelPhotos = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716',
    alt: 'Bridge and waterfalls'
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67',
    alt: 'River surrounded by rocks'
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b',
    alt: "Bird's eye view of mountains"
  }
];

const naturePhotos = [
  {
    id: '4',
    url: 'https://images.unsplash.com/photo-1472396961693-142e6e269027',
    alt: 'Deer in nature'
  },
  {
    id: '5',
    url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86',
    alt: 'Trees from below'
  },
  {
    id: '6',
    url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843',
    alt: 'Sunlight through trees'
  }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Gallery title="Travel Photography" photos={travelPhotos} />
      <Gallery title="Nature Photography" photos={naturePhotos} />
    </div>
  );
};

export default Index;