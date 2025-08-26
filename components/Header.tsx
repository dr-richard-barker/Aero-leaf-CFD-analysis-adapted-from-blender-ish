
import React from 'react';
import { LeafIcon } from './icons/LeafIcon';

const Header: React.FC = () => {
  return (
    <header className="bg-surface shadow-md">
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <LeafIcon className="w-8 h-8 text-accent" />
          <h1 className="text-2xl font-bold text-text-primary">
            AeroLeaf <span className="text-secondary">CFD</span>
          </h1>
        </div>
        <p className="text-sm text-text-secondary hidden md:block">Blender-Integrated Airflow Analysis</p>
      </div>
    </header>
  );
};

export default Header;
