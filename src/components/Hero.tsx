import React from 'react';

const Hero = () => {
  return (
    <div className="relative h-screen flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1469474968028-56623f02e42e")',
          filter: 'brightness(0.7)'
        }}
      />
      <div className="relative z-10 text-center text-white">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 animate-fade-in">
          Capturing Moments
        </h1>
        <p className="text-xl md:text-2xl animate-slide-up">
          Travel & Nature Photography
        </p>
      </div>
    </div>
  );
};

export default Hero;