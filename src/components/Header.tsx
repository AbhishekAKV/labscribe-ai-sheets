
import React from 'react';

const Header = () => {
  return (
    <div className="text-center mb-10 relative">
      <h1 className="text-5xl md:text-6xl font-light tracking-[8px] mb-3 
                     bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent
                     animate-pulse">
        LABSHEET
      </h1>
      <p className="text-gray-400 text-lg tracking-[2px]">
        AI-Powered Laboratory Documentation Generator
      </p>
    </div>
  );
};

export default Header;
