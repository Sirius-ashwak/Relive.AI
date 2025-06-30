import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Clock, Heart, Sparkles, MoreVertical, Eye } from 'lucide-react';
import PersonaDetailModal from './PersonaDetailModal';
import { Database } from '../types/database';

type Persona = Database['public']['Tables']['personas']['Row'];

interface PersonaCardProps {
  persona: Persona;
  onClick?: () => void;
  onEdit?: (persona: Persona) => void;
  onDelete?: (persona: Persona) => void;
  onStartChat?: (persona: Persona) => void;
}

const PersonaCard: React.FC<PersonaCardProps> = ({
  persona,
  onClick,
  onEdit,
  onDelete,
  onStartChat
}) => {
  const [showDetailModal, setShowDetailModal] = useState(false);

  const getTypeColor = () => {
    switch (persona.type) {
      case 'memory': return 'text-coral-400';
      case 'younger': return 'text-aurora-400';
      case 'future': return 'text-lavender-400';
      default: return 'text-obsidian-400';
    }
  };

  const getTypeLabel = () => {
    switch (persona.type) {
      case 'memory': return 'Memory';
      case 'younger': return 'Younger You';
      case 'future': return 'Future You';
      default: return 'Persona';
    }
  };

  const getStatusIndicator = () => {
    switch (persona.status) {
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

  const formatLastInteraction = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else {
      setShowDetailModal(true);
    }
  };

  return (
    <>
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
        onClick={handleCardClick}
        className="group relative cursor-pointer bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className={`px-3 py-1 rounded-full bg-white/10 ${getTypeColor()} text-xs font-bold`}>
            {getTypeLabel()}
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIndicator()}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                setShowDetailModal(true);
              }}
              className="p-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Eye className="w-4 h-4 text-aurora-400" />
            </motion.button>
          </div>
        </div>

        {/* Avatar Section */}
        <div className="flex items-center space-x-4 mb-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative"
          >
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-xl">
              {persona.avatar}
            </div>
            <motion.div
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white/20 border border-white/30 flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
            >
              <Sparkles className="w-2.5 h-2.5 text-aurora-400" />
            </motion.div>
          </motion.div>
          
          <div className="flex-1">
            <h3 className="font-manrope font-semibold text-lg text-white group-hover:text-aurora-300 transition-colors">
              {persona.name}
            </h3>
            <p className="text-sm text-obsidian-400 font-medium">
              {formatLastInteraction(persona.last_interaction)}
            </p>
          </div>
        </div>

        {/* Description Preview */}
        <div className="mb-6">
          <p className="text-sm text-obsidian-300 leading-relaxed line-clamp-2">
            {persona.description}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="text-center">
            <div className="text-lg font-bold text-aurora-400">{persona.conversation_count}</div>
            <div className="text-xs text-obsidian-400">Chats</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-coral-400">{persona.memory_data.memories.length}</div>
            <div className="text-xs text-obsidian-400">Memories</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-lavender-400">{persona.memory_data.traits.length}</div>
            <div className="text-xs text-obsidian-400">Traits</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation();
              onStartChat?.(persona);
            }}
            className="flex-1 bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/30 text-white font-medium flex items-center justify-center space-x-2 py-3 rounded-xl transition-all duration-300"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm">Start Chat</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              setShowDetailModal(true);
            }}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300"
          >
            <Eye className="w-4 h-4 text-aurora-400" />
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
          className={`absolute bottom-0 left-0 h-0.5 rounded-full ${
            persona.type === 'memory' ? 'bg-coral-400' :
            persona.type === 'younger' ? 'bg-aurora-400' :
            'bg-lavender-400'
          }`}
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
      </motion.div>

      {/* Detail Modal */}
      <PersonaDetailModal
        persona={persona}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        onEdit={onEdit}
        onDelete={onDelete}
        onStartChat={onStartChat}
      />
    </>
  );
};

export default PersonaCard;