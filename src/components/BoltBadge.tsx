import React from 'react';
import { motion } from 'framer-motion';

const BoltBadge: React.FC = () => {
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
          className="absolute inset-0 rounded-full bg-white/40 blur-xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        
        {/* Outer ring with strong border */}
        <div className="absolute inset-0 rounded-full border-4 border-white/60 group-hover:border-white/90 transition-all duration-300 bg-white/20 backdrop-blur-sm shadow-2xl" />
        
        {/* Main badge content - Custom image */}
        <div className="relative w-full h-full rounded-full bg-white shadow-2xl group-hover:shadow-white/40 transition-all duration-300 overflow-hidden flex items-center justify-center">
          <img 
            src="/white_circle_360x360.png" 
            alt="Built with Bolt.new"
            className="w-12 h-12 object-contain"
          />
        </div>
        
        {/* Hover effect overlay */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-aurora-500/30 to-lavender-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Pulsing ring animation for attention */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-aurora-400/60"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.6, 0, 0.6],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Secondary pulse for more visibility */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-white/80"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.8, 0, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
      </div>
      
      {/* Enhanced Tooltip with better visibility */}
      <motion.div 
        className="absolute top-full right-0 mt-4 px-4 py-3 bg-black/95 text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap backdrop-blur-sm border-2 border-white/30 shadow-2xl"
        initial={{ y: -10, opacity: 0 }}
        whileHover={{ y: 0, opacity: 1 }}
      >
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 rounded-full bg-aurora-400 animate-pulse"></div>
          <div>
            <div className="font-bold text-white">Built with Bolt.new</div>
            <div className="text-xs text-gray-300">AI-powered development</div>
          </div>
        </div>
        {/* Tooltip arrow */}
        <div className="absolute -top-2 right-6 w-4 h-4 bg-black/95 border-l-2 border-t-2 border-white/30 transform rotate-45"></div>
      </motion.div>
      
      {/* Additional visual indicator */}
      <motion.div
        className="absolute -top-1 -right-1 w-4 h-4 bg-aurora-400 rounded-full border-2 border-white shadow-lg"
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="w-full h-full rounded-full bg-aurora-400 animate-pulse"></div>
      </motion.div>
    </motion.a>
  );
};

export default BoltBadge;