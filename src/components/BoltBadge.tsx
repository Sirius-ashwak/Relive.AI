import React, { useState } from 'react';
import { motion } from 'framer-motion';

const BoltBadge: React.FC = () => {
  const [imageError, setImageError] = useState(false);

  // Enhanced SVG version of the Bolt.new badge
  const BoltSVG = () => (
    <svg 
      width="64" 
      height="64" 
      viewBox="0 0 64 64" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* White circle background */}
      <circle cx="32" cy="32" r="32" fill="white"/>
      
      {/* Bolt icon */}
      <path 
        d="M20 18 L36 18 L28 32 L44 32 L24 46 L32 32 L20 32 Z" 
        fill="#FF6154"
      />
      
      {/* Text */}
      <text 
        x="32" 
        y="56" 
        textAnchor="middle" 
        fill="#333" 
        fontSize="8" 
        fontWeight="bold" 
        fontFamily="Arial, sans-serif"
      >
        BOLT.NEW
      </text>
    </svg>
  );

  return (
    <motion.a
      href="https://bolt.new/"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.8, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.5, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className="fixed top-6 right-6 z-50 group cursor-pointer"
      title="Built with Bolt.new - Click to visit"
    >
      <div className="relative w-16 h-16">
        {/* Enhanced glow effect */}
        <motion.div 
          className="absolute inset-0 rounded-full bg-white/30 blur-lg"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        
        {/* Outer ring with gradient */}
        <div className="absolute inset-0 rounded-full border-2 border-white/40 group-hover:border-white/70 transition-all duration-300 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm" />
        
        {/* Badge content */}
        <div className="relative w-full h-full rounded-full bg-white shadow-2xl group-hover:shadow-white/30 transition-all duration-300 overflow-hidden">
          {!imageError ? (
            <img 
              src="/white_circle_360x360.png" 
              alt="Built with Bolt.new" 
              className="w-full h-full object-cover rounded-full"
              onError={() => {
                console.log('Bolt badge image failed to load, using SVG fallback');
                setImageError(true);
              }}
              onLoad={() => console.log('Bolt badge image loaded successfully')}
            />
          ) : (
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center p-2">
              <BoltSVG />
            </div>
          )}
        </div>
        
        {/* Hover effect overlay */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-aurora-500/20 to-lavender-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Pulsing ring animation */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-aurora-400/50"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
      
      {/* Enhanced Tooltip */}
      <motion.div 
        className="absolute top-full right-0 mt-3 px-3 py-2 bg-black/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap backdrop-blur-sm border border-white/20"
        initial={{ y: -10, opacity: 0 }}
        whileHover={{ y: 0, opacity: 1 }}
      >
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-aurora-400"></div>
          <span className="font-medium">Built with Bolt.new</span>
        </div>
        {/* Tooltip arrow */}
        <div className="absolute -top-1 right-4 w-2 h-2 bg-black/90 border-l border-t border-white/20 transform rotate-45"></div>
      </motion.div>
    </motion.a>
  );
};

export default BoltBadge;