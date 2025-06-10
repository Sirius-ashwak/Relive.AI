import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Search, Filter, Clock, User, Trash2, Archive, MoreVertical, Star } from 'lucide-react';
import { useConversationStore } from '../store/conversationStore';
import { usePersonaStore } from '../store/personaStore';
import { Persona } from '../types';

interface ConversationsSectionProps {
  onStartChat: (persona: Persona) => void;
}

const ConversationsSection: React.FC<ConversationsSectionProps> = ({ onStartChat }) => {
  const { conversations } = useConversationStore();
  const { personas } = usePersonaStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'active' | 'archived'>('all');

  const getPersonaById = (id: string) => personas.find(p => p.id === id);

  const filteredConversations = conversations
    .filter(conv => {
      const persona = getPersonaById(conv.personaId);
      const matchesSearch = persona?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           conv.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterType === 'all' || 
                           (filterType === 'active' && conv.isActive) ||
                           (filterType === 'archived' && !conv.isActive);
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime());

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'memory': return 'from-coral-500/20 to-lavender-500/20 border-coral-500/30';
      case 'younger': return 'from-aurora-500/20 to-sage-500/20 border-aurora-500/30';
      case 'future': return 'from-lavender-500/20 to-gold-500/20 border-lavender-500/30';
      default: return 'from-obsidian-600/20 to-obsidian-700/20 border-obsidian-500/30';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="font-manrope text-4xl font-bold mb-4">
          <span className="gradient-text">Conversations</span>
        </h1>
        <p className="text-xl text-obsidian-300">
          Your chat history with memory companions
        </p>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4"
      >
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-obsidian-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-premium pl-12"
          />
        </div>
        
        <div className="flex items-center space-x-3">
          <Filter className="w-5 h-5 text-obsidian-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as 'all' | 'active' | 'archived')}
            className="input-premium min-w-[160px]"
          >
            <option value="all">All Conversations</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div className="card-premium text-center bg-gradient-to-br from-aurora-500/10 to-lavender-500/10 border border-aurora-500/20">
          <div className="text-2xl font-bold text-aurora-400 mb-1">{conversations.length}</div>
          <div className="text-sm text-obsidian-300">Total</div>
        </div>
        <div className="card-premium text-center bg-gradient-to-br from-coral-500/10 to-aurora-500/10 border border-coral-500/20">
          <div className="text-2xl font-bold text-coral-400 mb-1">
            {conversations.filter(c => c.isActive).length}
          </div>
          <div className="text-sm text-obsidian-300">Active</div>
        </div>
        <div className="card-premium text-center bg-gradient-to-br from-lavender-500/10 to-gold-500/10 border border-lavender-500/20">
          <div className="text-2xl font-bold text-lavender-400 mb-1">
            {conversations.reduce((acc, c) => acc + c.messages.length, 0)}
          </div>
          <div className="text-sm text-obsidian-300">Messages</div>
        </div>
        <div className="card-premium text-center bg-gradient-to-br from-sage-500/10 to-aurora-500/10 border border-sage-500/20">
          <div className="text-2xl font-bold text-sage-400 mb-1">
            {formatDuration(conversations.reduce((acc, c) => acc + c.duration, 0))}
          </div>
          <div className="text-sm text-obsidian-300">Time</div>
        </div>
      </motion.div>

      {/* Conversations List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        {filteredConversations.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-2xl bg-gradient-premium p-0.5 mx-auto mb-6">
              <div className="w-full h-full rounded-2xl bg-obsidian-800 flex items-center justify-center">
                <MessageCircle className="w-10 h-10 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-white mb-3">No conversations found</h3>
            <p className="text-obsidian-400 max-w-md mx-auto">
              {searchTerm ? 'Try adjusting your search terms' : 'Start a conversation with one of your personas to see them here'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredConversations.map((conversation, index) => {
              const persona = getPersonaById(conversation.personaId);
              if (!persona) return null;

              const lastMessage = conversation.messages[conversation.messages.length - 1];

              return (
                <motion.div
                  key={conversation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className={`card-premium cursor-pointer group bg-gradient-to-br ${getTypeColor(persona.type)} border-2 hover:border-aurora-400/50 transition-all duration-300`}
                  onClick={() => onStartChat(persona)}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-xl bg-gradient-premium p-0.5">
                          <div className="w-full h-full rounded-xl bg-obsidian-800 flex items-center justify-center text-lg">
                            {persona.avatar}
                          </div>
                        </div>
                        {conversation.isActive && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-sage-400 border-2 border-obsidian-950 animate-pulse" />
                        )}
                      </div>
                      
                      <div>
                        <h3 className="font-manrope font-semibold text-lg text-white group-hover:text-aurora-300 transition-colors">
                          {persona.name}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-obsidian-400">
                          <span>{conversation.messages.length} messages</span>
                          <span>•</span>
                          <span>{formatDate(conversation.lastMessageAt)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 rounded-lg glass glass-hover opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle menu
                      }}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </motion.button>
                  </div>

                  {/* Last Message Preview */}
                  {lastMessage && (
                    <div className="mb-6">
                      <div className="p-4 rounded-xl bg-obsidian-800/50 border border-white/10">
                        <p className="text-obsidian-300 text-sm line-clamp-2">
                          <span className="text-aurora-400 font-medium">
                            {lastMessage.sender === 'user' ? 'You: ' : `${persona.name}: `}
                          </span>
                          {lastMessage.content}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-obsidian-400 mb-6">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatDuration(conversation.duration)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4" />
                      <span>4.9</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 btn-premium text-obsidian-900 font-semibold text-sm py-3"
                      onClick={(e) => {
                        e.stopPropagation();
                        onStartChat(persona);
                      }}
                    >
                      Continue Chat
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-3 glass glass-hover rounded-xl"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle archive
                      }}
                    >
                      <Archive className="w-4 h-4 text-aurora-400" />
                    </motion.button>
                  </div>

                  {/* Bottom Accent */}
                  <motion.div
                    className="absolute bottom-0 left-0 h-1 bg-gradient-premium rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ConversationsSection;