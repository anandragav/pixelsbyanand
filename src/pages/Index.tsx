import React from 'react';
import Navigation from '../components/Navigation';
import Gallery from '../components/Gallery';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main className="pt-28 pb-24 px-8 md:px-16 lg:px-24 xl:px-32 2xl:px-48">
        <Gallery />
      </main>
      <Footer />
    </div>
  );
};

export default Index;