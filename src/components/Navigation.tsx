import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-background/90 backdrop-blur-sm z-50 px-8 md:px-16 lg:px-24 xl:px-32 2xl:px-48 py-6 border-b shadow-sm">
      <div className="max-w-[2400px] mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-light tracking-wider text-foreground">
          PHOTOGRAPHER NAME
        </Link>
        <div className="flex items-center gap-8">
          <Link to="/" className="text-sm hover:text-foreground/70 transition-colors">Overview</Link>
          <Link to="/people" className="text-sm hover:text-foreground/70 transition-colors">People</Link>
          <Link to="/things" className="text-sm hover:text-foreground/70 transition-colors">Things</Link>
          <Link to="/contact" className="text-sm hover:text-foreground/70 transition-colors">Contact</Link>
          <div className="flex items-center gap-4">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-foreground/70 transition-colors"
            >
              <Instagram size={18} />
            </a>
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-foreground/70 transition-colors"
            >
              <Facebook size={18} />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-foreground/70 transition-colors"
            >
              <Twitter size={18} />
            </a>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navigation;