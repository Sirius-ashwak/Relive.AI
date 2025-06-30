import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Sparkles, Clock, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import AuthModal from './AuthModal';
import BoltBadge from './BoltBadge';

interface HeroProps {
  onStartApp?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStartApp }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { isAuthenticated } = useAuthStore();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      onStartApp?.();
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center aurora-bg overflow-hidden">
        {/* Bolt.new Badge */}
        <BoltBadge />

        {/* Premium Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ 
              x: [0, 100, 0],
              y: [0, -50, 0],
              rotate: [0, 180, 360]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-aurora-500/20 to-lavender-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ 
              x: [0, -80, 0],
              y: [0, 60, 0],
              rotate: [360, 180, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-coral-500/20 to-aurora-500/20 rounded-full blur-3xl"
          />
        </div>

        <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6"
          >
            <span className="inline-flex items-center space-x-2 px-6 py-3 rounded-full glass text-sm font-medium">
              <Sparkles className="w-4 h-4 text-aurora-400" />
              <span>Premium AI Memory Companion</span>
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-manrope text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight text-shadow-lg"
          >
            <span className="gradient-text">Talk to the Past.</span>
            <br />
            <span className="text-white">Shape Your Future.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl md:text-2xl text-obsidian-200 mb-12 max-w-4xl mx-auto leading-relaxed text-shadow"
          >
            Experience sophisticated conversations with AI replicas of people you know, 
            past versions of yourself, or future aspirations. Preserve memories, revisit loved ones, 
            and heal through authentic dialogue.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(14, 165, 233, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetStarted}
              className="group btn-premium text-obsidian-900 font-bold flex items-center space-x-3"
            >
              <Play className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span>{isAuthenticated ? 'Enter App' : 'Start Your Journey'}</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-3 px-8 py-4 glass glass-hover rounded-2xl font-semibold text-white text-lg"
            >
              <Clock className="w-6 h-6" />
              <span>Explore Features</span>
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mt-16 flex items-center justify-center space-x-8 text-sm text-obsidian-300"
          >
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-sage-400 animate-pulse"></div>
              <span>Real-time AI</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-aurora-400 animate-pulse"></div>
              <span>Voice Cloning</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-lavender-400 animate-pulse"></div>
              <span>Memory Preservation</span>
            </div>
          </motion.div>
        </div>
      </section>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
};

export default Hero;