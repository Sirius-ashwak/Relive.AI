import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Clock, Heart, Sparkles } from 'lucide-react';

interface PersonaCardProps {
  name: string;
  type: 'memory' | 'younger' | 'future';
  lastInteraction: string;
  avatar: string;
  status: 'active' | 'sleeping' | 'learning';
  onClick?: () => void;
}

const PersonaCard: React.FC<PersonaCardProps> = ({
  name,
  type,
  lastInteraction,
  avatar,
  status,
  onClick
}) => {
  const getTypeGradient = () => {
    switch (type) {
      case 'memory': return 'from-coral-500/20 to-lavender-500/20';
      case 'younger': return 'from-aurora-500/20 to-sage-500/20';
      case 'future': return 'from-lavender-500/20 to-gold-500/20';
      default: return 'from-obsidian-600/20 to-obsidian-700/20';
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'memory': return 'Memory';
      case 'younger': return 'Younger You';
      case 'future': return 'Future You';
      default: return 'Persona';
    }
  };

  const getStatusIndicator = () => {
    switch (status) {
      case 'active': 
        return (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-sage-400 animate-pulse shadow-glow-blue" />
            <span className="text-xs text-sage-300 font-medium">Online</span>
          </div>
        );
      case 'sleeping': 
        return (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-obsidian-400" />
            <span className="text-xs text-obsidian-300 font-medium">Sleeping</span>
          </div>
        );
      case 'learning': 
        return (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-aurora-400 animate-pulse shadow-glow-purple" />
            <span className="text-xs text-aurora-300 font-medium">Learning</span>
          </div>
        );
    }
  };

  const getHoverShadow = () => {
    switch (type) {
      case 'memory': return 'hover:shadow-glow-purple';
      case 'younger': return 'hover:shadow-glow-blue';
      case 'future': return 'hover:shadow-glow-gold';
      default: return 'hover:shadow-premium';
    }
  };

  return (
    <motion.div
      whileHover={{ 
        y: -8,
        scale: 1.02,
      }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20,
        hover: { duration: 0.3 }
      }}
      onClick={onClick}
      className={`group relative card-premium cursor-pointer bg-gradient-to-br ${getTypeGradient()} overflow-hidden ${getHoverShadow()} border-2 border-white/10 hover:border-aurora-400/30`}
    >
      {/* Shimmer Effect */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.8 }}
        />
      </div>

      {/* Pulse Animation for Active Status */}
      {status === 'active' && (
        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-3xl border-2 border-aurora-400/40"
        />
      )}

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-aurora-400/60 rounded-full"
            style={{
              left: `${20 + i * 30}%`,
              top: `${30 + i * 20}%`,
            }}
            animate={{
              y: [-10, -20, -10],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="px-4 py-2 rounded-full bg-gradient-premium text-obsidian-900 text-xs font-bold">
            {getTypeLabel()}
          </div>
          {getStatusIndicator()}
        </div>

        {/* Avatar Section */}
        <div className="flex items-center space-x-4 mb-6">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="relative"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-premium p-0.5">
              <div className="w-full h-full rounded-2xl bg-obsidian-800 flex items-center justify-center text-2xl font-bold shadow-inner">
                {avatar}
              </div>
            </div>
            {status === 'active' && (
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute -inset-1 rounded-2xl bg-aurora-400/30 blur-sm"
              />
            )}
            <motion.div
              className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-premium flex items-center justify-center"
              whileHover={{ scale: 1.2 }}
            >
              <Sparkles className="w-3 h-3 text-obsidian-900" />
            </motion.div>
          </motion.div>
          
          <div className="flex-1">
            <h3 className="font-sora font-semibold text-lg text-white group-hover:text-aurora-300 transition-colors text-shadow">
              {name}
            </h3>
            <p className="text-sm text-obsidian-300 font-medium">
              {lastInteraction}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 btn-premium text-obsidian-900 font-bold flex items-center justify-center space-x-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm">Start Chat</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 glass glass-hover rounded-xl hover:bg-white/20 transition-all duration-300"
          >
            <Clock className="w-4 h-4 text-aurora-400" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 glass glass-hover rounded-xl hover:bg-white/20 transition-all duration-300"
          >
            <Heart className="w-4 h-4 text-coral-400" />
          </motion.button>
        </div>

        {/* Bottom Accent Line */}
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-gradient-premium rounded-full"
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
        />
      </div>
    </motion.div>
  );
};

export default PersonaCard;