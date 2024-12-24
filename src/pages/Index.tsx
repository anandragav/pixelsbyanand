import React from 'react';
import Navigation from '../components/Navigation';
import Gallery from '../components/Gallery';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="pt-24 pb-16">
        <Gallery />
      </main>
    </div>
  );
};

export default Index;