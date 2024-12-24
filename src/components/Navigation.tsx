import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-background/90 backdrop-blur-sm z-50 px-6 py-4 border-b">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-light tracking-wider text-foreground">
          PHOTOGRAPHER NAME
        </Link>
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-sm hover:underline text-foreground">Overview</Link>
          <Link to="/people" className="text-sm hover:underline text-foreground">People</Link>
          <Link to="/things" className="text-sm hover:underline text-foreground">Things</Link>
          <Link to="/contact" className="text-sm hover:underline text-foreground">Contact</Link>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 text-foreground">
            <Instagram size={20} />
          </a>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navigation;