import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-background/90 backdrop-blur-sm z-50 px-8 md:px-16 lg:px-24 xl:px-32 2xl:px-48 py-6 border-b shadow-sm">
      <div className="max-w-[2400px] mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-light tracking-wider text-foreground">
          ANAND VIJAYARAGAVAN
        </Link>
        <div className="flex items-center gap-8">
          <Link to="/" className="text-sm hover:text-foreground/70 transition-colors">Home</Link>
          <Link to="/contact" className="text-sm hover:text-foreground/70 transition-colors">Contact</Link>
          <div className="flex items-center gap-4">
            <a 
              href="https://www.instagram.com/fotosbyanand/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-foreground/70 transition-colors"
            >
              <Instagram size={18} />
            </a>
            <a 
              href="https://www.facebook.com/anandavadivelan" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-foreground/70 transition-colors"
            >
              <Facebook size={18} />
            </a>
            <a 
              href="https://x.com/anandVragav" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-foreground/70 transition-colors"
            >
              <X size={18} />
            </a>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navigation;