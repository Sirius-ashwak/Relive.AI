import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Search, Filter, Clock, MoreVertical, Star, Archive } from 'lucide-react';
import { useConversationStore } from '../store/conversationStore';
import { usePersonaStore } from '../store/personaStore';
import { useAuthStore } from '../store/authStore';
import { Database } from '../types/database';

type Persona = Database['public']['Tables']['personas']['Row'];
type ConversationWithMessages = Database['public']['Tables']['conversations']['Row'] & {
  messages: Database['public']['Tables']['messages']['Row'][];
};

interface ConversationsSectionProps {
  onStartChat: (persona: Persona) => void;
}

const ConversationsSection: React.FC<ConversationsSectionProps> = ({ onStartChat }) => {
  const { conversations, isLoading, fetchConversations } = useConversationStore();
  const { personas, fetchPersonas } = usePersonaStore();
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'active' | 'archived'>('all');

  useEffect(() => {
    if (user) {
      fetchConversations();
      fetchPersonas();
    }
  }, [user, fetchConversations, fetchPersonas]);

  const getPersonaById = (id: string) => personas.find(p => p.id === id);

  const filteredConversations = conversations
    .filter(conv => {
      const persona = getPersonaById(conv.persona_id);
      const matchesSearch = persona?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           conv.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterType === 'all' || 
                           (filterType === 'active' && conv.is_active) ||
                           (filterType === 'archived' && !conv.is_active);
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime());

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
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

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="font-manrope text-3xl font-bold mb-3">
            <span className="gradient-text">Loading Conversations...</span>
          </h1>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10 animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-white/10"></div>
                <div className="flex-1">
                  <div className="h-4 bg-white/10 rounded mb-2"></div>
                  <div className="h-3 bg-white/5 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="font-manrope text-3xl font-bold mb-3">
          <span className="gradient-text">Conversations</span>
        </h1>
        <p className="text-lg text-obsidian-300">
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
            className="w-full pl-12 pr-4 py-3 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 focus:border-aurora-400/50 focus:outline-none text-white placeholder-obsidian-400 transition-all duration-300"
          />
        </div>
        
        <div className="flex items-center space-x-3">
          <Filter className="w-5 h-5 text-obsidian-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as 'all' | 'active' | 'archived')}
            className="px-4 py-3 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 focus:border-aurora-400/50 focus:outline-none text-white min-w-[160px] transition-all duration-300"
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
        <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10 text-center">
          <div className="text-xl font-bold text-aurora-400 mb-1">{conversations.length}</div>
          <div className="text-xs text-obsidian-400">Total</div>
        </div>
        <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10 text-center">
          <div className="text-xl font-bold text-coral-400 mb-1">
            {conversations.filter(c => c.is_active).length}
          </div>
          <div className="text-xs text-obsidian-400">Active</div>
        </div>
        <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10 text-center">
          <div className="text-xl font-bold text-lavender-400 mb-1">
            {conversations.reduce((acc, c) => acc + (c.messages?.length || 0), 0)}
          </div>
          <div className="text-xs text-obsidian-400">Messages</div>
        </div>
        <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10 text-center">
          <div className="text-xl font-bold text-sage-400 mb-1">
            {formatDuration(conversations.reduce((acc, c) => acc + (c.duration || 0), 0))}
          </div>
          <div className="text-xs text-obsidian-400">Time</div>
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
            <div className="w-16 h-16 rounded-2xl bg-gradient-premium p-0.5 mx-auto mb-4">
              <div className="w-full h-full rounded-2xl bg-obsidian-800 flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No conversations found</h3>
            <p className="text-obsidian-400">
              {searchTerm ? 'Try adjusting your search terms' : 'Start a conversation with one of your personas'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredConversations.map((conversation, index) => {
              const persona = getPersonaById(conversation.persona_id);
              if (!persona) return null;

              const lastMessage = conversation.messages?.[conversation.messages.length - 1];

              return (
                <motion.div
                  key={conversation.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  whileHover={{ x: 4 }}
                  className="group bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10 hover:border-white/20 cursor-pointer transition-all duration-300"
                  onClick={() => onStartChat(persona)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-xl bg-gradient-premium p-0.5">
                        <div className="w-full h-full rounded-xl bg-obsidian-800 flex items-center justify-center text-lg">
                          {persona.avatar}
                        </div>
                      </div>
                      {conversation.is_active && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-sage-400 border-2 border-obsidian-950" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-white group-hover:text-aurora-300 transition-colors truncate">
                          {persona.name}
                        </h3>
                        <span className="text-sm text-obsidian-400 flex-shrink-0 ml-2">
                          {formatDate(conversation.last_message_at)}
                        </span>
                      </div>
                      
                      {lastMessage && (
                        <p className="text-sm text-obsidian-400 truncate">
                          <span className="text-aurora-400">
                            {lastMessage.sender === 'user' ? 'You: ' : `${persona.name}: `}
                          </span>
                          {lastMessage.content}
                        </p>
                      )}
                      
                      <div className="flex items-center space-x-4 mt-2 text-xs text-obsidian-500">
                        <span className="flex items-center space-x-1">
                          <MessageCircle className="w-3 h-3" />
                          <span>{conversation.messages?.length || 0}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatDuration(conversation.duration || 0)}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Star className="w-3 h-3" />
                          <span>4.9</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle archive
                        }}
                      >
                        <Archive className="w-4 h-4 text-aurora-400" />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle menu
                        }}
                      >
                        <MoreVertical className="w-4 h-4 text-obsidian-400" />
                      </motion.button>
                    </div>
                  </div>
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