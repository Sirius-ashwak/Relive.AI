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
      case 'memory': return 'from-coral-500/10 to-lavender-500/10';
      case 'younger': return 'from-aurora-500/10 to-sage-500/10';
      case 'future': return 'from-lavender-500/10 to-gold-500/10';
      default: return 'from-obsidian-600/10 to-obsidian-700/10';
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
            <div className="w-2 h-2 rounded-full bg-sage-400" />
            <span className="text-xs text-sage-400 font-medium">Online</span>
          </div>
        );
      case 'sleeping': 
        return (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-obsidian-400" />
            <span className="text-xs text-obsidian-400 font-medium">Sleeping</span>
          </div>
        );
      case 'learning': 
        return (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-aurora-400" />
            <span className="text-xs text-aurora-400 font-medium">Learning</span>
          </div>
        );
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20,
        hover: { duration: 0.2 }
      }}
      onClick={onClick}
      className={`group relative cursor-pointer bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 bg-gradient-to-br ${getTypeGradient()}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="px-3 py-1 rounded-full bg-gradient-premium text-obsidian-900 text-xs font-bold">
          {getTypeLabel()}
        </div>
        {getStatusIndicator()}
      </div>

      {/* Avatar Section */}
      <div className="flex items-center space-x-4 mb-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="relative"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-premium p-0.5">
            <div className="w-full h-full rounded-2xl bg-obsidian-800 flex items-center justify-center text-xl">
              {avatar}
            </div>
          </div>
          <motion.div
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-premium flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
          >
            <Sparkles className="w-2.5 h-2.5 text-obsidian-900" />
          </motion.div>
        </motion.div>
        
        <div className="flex-1">
          <h3 className="font-manrope font-semibold text-lg text-white group-hover:text-aurora-300 transition-colors">
            {name}
          </h3>
          <p className="text-sm text-obsidian-400 font-medium">
            {lastInteraction}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 btn-premium text-obsidian-900 font-bold flex items-center justify-center space-x-2 py-3"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="text-sm">Start Chat</span>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300"
        >
          <Clock className="w-4 h-4 text-aurora-400" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300"
        >
          <Heart className="w-4 h-4 text-coral-400" />
        </motion.button>
      </div>

      {/* Bottom Accent Line */}
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-premium rounded-full"
        initial={{ width: 0 }}
        whileInView={{ width: "100%" }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
    </motion.div>
  );
};

export default PersonaCard;