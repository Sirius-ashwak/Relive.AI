import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  User, 
  Calendar, 
  MessageCircle, 
  Heart, 
  Edit3, 
  Trash2,
  Clock,
  Brain,
  Tag,
  Users
} from 'lucide-react';
import { Database } from '../types/database';
import BlockchainVerificationButton from './BlockchainVerificationButton';

type Persona = Database['public']['Tables']['personas']['Row'];

interface PersonaDetailModalProps {
  persona: Persona;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (persona: Persona) => void;
  onDelete?: (persona: Persona) => void;
  onStartChat?: (persona: Persona) => void;
}

const PersonaDetailModal: React.FC<PersonaDetailModalProps> = ({
  persona,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onStartChat
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'memories' | 'blockchain'>('overview');

  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPersonaTypeInfo = (type: string) => {
    switch (type) {
      case 'memory':
        return { label: 'Memory Persona', color: 'text-coral-400', bg: 'bg-coral-400/20' };
      case 'younger':
        return { label: 'Younger Self', color: 'text-aurora-400', bg: 'bg-aurora-400/20' };
      case 'future':
        return { label: 'Future Self', color: 'text-lavender-400', bg: 'bg-lavender-400/20' };
      default:
        return { label: 'Custom Persona', color: 'text-sage-400', bg: 'bg-sage-400/20' };
    }
  };

  const typeInfo = getPersonaTypeInfo(persona.type);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-4xl bg-obsidian-900 rounded-3xl glass border border-white/20 max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-premium p-0.5">
              <div className="w-full h-full rounded-2xl bg-obsidian-800 flex items-center justify-center text-2xl">
                {persona.avatar}
              </div>
            </div>
            <div>
              <h2 className="font-manrope text-2xl font-bold text-white">{persona.name}</h2>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeInfo.bg} ${typeInfo.color}`}>
                  {typeInfo.label}
                </span>
                <span className={`w-2 h-2 rounded-full ${
                  persona.status === 'active' ? 'bg-sage-400' : 
                  persona.status === 'learning' ? 'bg-aurora-400' : 'bg-obsidian-400'
                }`} />
                <span className="text-obsidian-400 text-sm capitalize">{persona.status}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {onEdit && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onEdit(persona)}
                className="p-3 rounded-xl glass glass-hover"
              >
                <Edit3 className="w-5 h-5" />
              </motion.button>
            )}
            
            {onDelete && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onDelete(persona)}
                className="p-3 rounded-xl glass glass-hover text-coral-400"
              >
                <Trash2 className="w-5 h-5" />
              </motion.button>
            )}
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="p-3 rounded-xl glass glass-hover"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          {[
            { id: 'overview', label: 'Overview', icon: User },
            { id: 'memories', label: 'Memories', icon: Heart },
            { id: 'blockchain', label: 'Blockchain', icon: Brain }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'text-aurora-400 border-b-2 border-aurora-400 bg-aurora-400/5'
                  : 'text-obsidian-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Description */}
                <div>
                  <h3 className="font-semibold text-white mb-3">Description</h3>
                  <p className="text-obsidian-300 leading-relaxed">{persona.description}</p>
                </div>

                {/* Personality */}
                <div>
                  <h3 className="font-semibold text-white mb-3">Personality</h3>
                  <p className="text-obsidian-300 leading-relaxed">{persona.personality}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                    <MessageCircle className="w-6 h-6 text-aurora-400 mx-auto mb-2" />
                    <div className="text-xl font-bold text-white">{persona.conversation_count}</div>
                    <div className="text-xs text-obsidian-400">Conversations</div>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                    <Heart className="w-6 h-6 text-coral-400 mx-auto mb-2" />
                    <div className="text-xl font-bold text-white">{persona.memory_data.memories.length}</div>
                    <div className="text-xs text-obsidian-400">Memories</div>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                    <Tag className="w-6 h-6 text-lavender-400 mx-auto mb-2" />
                    <div className="text-xl font-bold text-white">{persona.memory_data.traits.length}</div>
                    <div className="text-xs text-obsidian-400">Traits</div>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                    <Calendar className="w-6 h-6 text-sage-400 mx-auto mb-2" />
                    <div className="text-xl font-bold text-white">
                      {Math.floor((Date.now() - new Date(persona.created_at).getTime()) / (1000 * 60 * 60 * 24))}
                    </div>
                    <div className="text-xs text-obsidian-400">Days Old</div>
                  </div>
                </div>

                {/* Traits */}
                <div>
                  <h3 className="font-semibold text-white mb-3">Key Traits</h3>
                  <div className="flex flex-wrap gap-2">
                    {persona.memory_data.traits.map((trait, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-aurora-400/20 text-aurora-300 rounded-full text-sm font-medium"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Relationships */}
                {persona.memory_data.relationships.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-white mb-3">Relationships</h3>
                    <div className="flex flex-wrap gap-2">
                      {persona.memory_data.relationships.map((relationship, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-coral-400/20 text-coral-300 rounded-full text-sm font-medium"
                        >
                          {relationship}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Metadata */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                  <div>
                    <h4 className="font-medium text-obsidian-300 mb-1">Created</h4>
                    <p className="text-white">{formatDate(persona.created_at)}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-obsidian-300 mb-1">Last Interaction</h4>
                    <p className="text-white">{formatDate(persona.last_interaction)}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'memories' && (
              <motion.div
                key="memories"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="font-semibold text-white mb-4">Stored Memories</h3>
                
                {persona.memory_data.memories.length === 0 ? (
                  <div className="text-center py-8">
                    <Heart className="w-12 h-12 text-obsidian-400 mx-auto mb-3" />
                    <p className="text-obsidian-400">No memories stored yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {persona.memory_data.memories.map((memory, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 rounded-xl bg-white/5 border border-white/10"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-coral-400/20 flex items-center justify-center flex-shrink-0 mt-1">
                            <Heart className="w-4 h-4 text-coral-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-obsidian-200 leading-relaxed">{memory}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'blockchain' && (
              <motion.div
                key="blockchain"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="font-semibold text-white mb-3">Blockchain Verification</h3>
                  <p className="text-obsidian-300 mb-6">
                    Verify this persona's memory data on the blockchain to create an immutable, 
                    permanent record that can be trusted for generations.
                  </p>
                </div>

                <BlockchainVerificationButton
                  persona={persona}
                  onVerificationComplete={(result) => {
                    console.log('Verification completed:', result);
                  }}
                />

                <div className="p-4 rounded-xl bg-aurora-500/10 border border-aurora-500/20">
                  <h4 className="font-medium text-aurora-300 mb-2">How Blockchain Verification Works</h4>
                  <div className="space-y-2 text-sm text-aurora-200">
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-aurora-400"></div>
                      <span>Memory data is uploaded to IPFS for decentralized storage</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-aurora-400"></div>
                      <span>A verification record is created on the Algorand blockchain</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-aurora-400"></div>
                      <span>The record becomes immutable and publicly verifiable</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-white/10">
          <div className="flex items-center space-x-2 text-obsidian-400 text-sm">
            <Clock className="w-4 h-4" />
            <span>Last updated {formatDate(persona.updated_at)}</span>
          </div>
          
          {onStartChat && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onStartChat(persona)}
              className="btn-premium text-obsidian-900 font-bold flex items-center space-x-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Start Conversation</span>
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PersonaDetailModal;