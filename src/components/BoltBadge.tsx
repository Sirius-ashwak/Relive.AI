import React, { useState } from 'react';
import { motion } from 'framer-motion';

const BoltBadge: React.FC = () => {
  const [imageError, setImageError] = useState(false);

  // SVG version of the Bolt.new badge as fallback
  const BoltSVG = () => (
    <svg 
      width="64" 
      height="64" 
      viewBox="0 0 360 360" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <circle cx="180" cy="180" r="180" fill="white"/>
      <circle cx="180" cy="180" r="170" fill="black"/>
      <path 
        d="M120 100 L200 100 L160 180 L240 180 L140 260 L180 180 L120 180 Z" 
        fill="white"
      />
      <path 
        d="M60 60 Q60 40 80 40 L280 40 Q300 40 300 60 L300 260 Q300 280 280 280 L80 280 Q60 280 60 260 Z" 
        fill="none" 
        stroke="white" 
        strokeWidth="2"
      />
      <text 
        x="180" 
        y="320" 
        textAnchor="middle" 
        fill="white" 
        fontSize="24" 
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
      title="Powered by Bolt.new - Click to visit"
    >
      <div className="relative w-16 h-16">
        {/* Enhanced glow effect */}
        <motion.div 
          className="absolute inset-0 rounded-full bg-white/20 blur-lg"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-2 border-white/30 group-hover:border-white/60 transition-all duration-300" />
        
        {/* Badge content */}
        <div className="relative w-full h-full rounded-full bg-white shadow-2xl group-hover:shadow-white/20 transition-all duration-300 overflow-hidden">
          {!imageError ? (
            <img 
              src="/white_circle_360x360.png" 
              alt="Powered by Bolt.new" 
              className="w-full h-full object-cover rounded-full"
              onError={() => setImageError(true)}
              onLoad={() => console.log('Bolt badge image loaded successfully')}
            />
          ) : (
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-black text-2xl font-black mb-1">⚡</div>
                <div className="text-black text-[8px] font-black leading-none">BOLT</div>
                <div className="text-black text-[8px] font-black leading-none">.NEW</div>
              </div>
            </div>
          )}
        </div>
        
        {/* Hover effect overlay */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-aurora-500/20 to-lavender-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      {/* Tooltip */}
      <div className="absolute top-full right-0 mt-2 px-3 py-1 bg-black/80 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
        Built with Bolt.new
      </div>
    </motion.a>
  );
};

export default BoltBadge;