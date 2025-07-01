import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Settings, User, Menu, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import AuthModal from './AuthModal';
import toast from 'react-hot-toast';

const Header = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Successfully signed out');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to sign out');
    }
  };

  return (
    <>
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
              <span className="font-manrope font-semibold text-xl gradient-text">
                Relive
              </span>
            </motion.div>
            
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <div className="hidden md:flex items-center space-x-3 px-4 py-2 rounded-xl glass">
                    <div className="w-8 h-8 rounded-lg bg-gradient-premium p-0.5">
                      <div className="w-full h-full rounded-lg bg-obsidian-800 flex items-center justify-center text-sm">
                        {user?.name?.[0] || user?.email?.[0] || '👤'}
                      </div>
                    </div>
                    <span className="text-white font-medium text-sm">
                      {user?.name || user?.email?.split('@')[0] || 'User'}
                    </span>
                  </div>
                  
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
                    onClick={handleLogout}
                    className="p-3 rounded-xl glass glass-hover text-coral-400 hover:text-coral-300 transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-5 h-5" />
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAuthModal(true)}
                    className="px-6 py-2 rounded-xl glass glass-hover font-medium text-white border border-white/20 hover:border-aurora-400/50 transition-all duration-300"
                  >
                    Sign In
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAuthModal(true)}
                    className="btn-premium text-obsidian-900 font-bold px-6 py-2"
                  >
                    Get Started
                  </motion.button>
                </>
              )}
              
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

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
};

export default Header;