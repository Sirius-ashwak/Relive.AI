import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Settings, User, Menu } from 'lucide-react';

const Header = () => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto">
        <nav className="glass glass-hover rounded-2xl px-6 py-3 flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-premium p-0.5">
              <div className="w-full h-full rounded-xl bg-obsidian-800 flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
            </div>
            <span className="font-sora font-semibold text-xl gradient-text">
              Relive
            </span>
          </motion.div>
          
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 rounded-xl glass glass-hover"
            >
              <Settings className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 rounded-xl glass glass-hover"
            >
              <User className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 rounded-xl glass glass-hover md:hidden"
            >
              <Menu className="w-5 h-5" />
            </motion.button>
          </div>
        </nav>
      </div>
    </motion.header>
  );
};

export default Header;