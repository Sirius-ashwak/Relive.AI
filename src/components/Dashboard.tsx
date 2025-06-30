import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Users, Heart, Clock, TrendingUp, Sparkles, Plus, Brain } from 'lucide-react';
import { usePersonaStore } from '../store/personaStore';
import { useConversationStore } from '../store/conversationStore';
import { useAuthStore } from '../store/authStore';
import { Database } from '../types/database';

type Persona = Database['public']['Tables']['personas']['Row'];

interface DashboardProps {
  onStartChat: (persona: Persona) => void;
  onCreateMemory: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onStartChat, onCreateMemory }) => {
  const { personas, isLoading: personasLoading, fetchPersonas } = usePersonaStore();
  const { conversations, isLoading: conversationsLoading, fetchConversations } = useConversationStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      fetchPersonas();
      fetchConversations();
    }
  }, [user, fetchPersonas, fetchConversations]);

  const stats = [
    {
      label: 'Active Personas',
      value: personas.filter(p => p.status === 'active').length,
      icon: Users,
      color: 'text-aurora-400'
    },
    {
      label: 'Conversations',
      value: conversations.length,
      icon: MessageCircle,
      color: 'text-coral-400'
    },
    {
      label: 'Memories',
      value: personas.reduce((acc, p) => acc + (p.memory_data?.memories?.length || 0), 0),
      icon: Heart,
      color: 'text-lavender-400'
    },
    {
      label: 'Hours',
      value: Math.floor(conversations.reduce((acc, c) => acc + (c.duration || 0), 0) / 60),
      icon: Clock,
      color: 'text-sage-400'
    }
  ];

  const recentPersonas = personas
    .sort((a, b) => new Date(b.last_interaction).getTime() - new Date(a.last_interaction).getTime())
    .slice(0, 3);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const days = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  };

  const isLoading = personasLoading || conversationsLoading;

  return (
    <div className="space-y-12">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="font-manrope text-3xl font-bold mb-3">
          <span className="gradient-text">Welcome Back{user?.name ? `, ${user.name}` : ''}</span>
        </h1>
        <p className="text-lg text-obsidian-300">
          Your memory companions are ready to continue your conversations
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            whileHover={{ y: -2 }}
            className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
              <TrendingUp className="w-4 h-4 text-sage-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {isLoading ? '...' : stat.value}
            </div>
            <div className="text-sm text-obsidian-400">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCreateMemory}
          className="p-6 rounded-2xl bg-gradient-to-br from-aurora-500/20 to-lavender-500/20 border border-aurora-500/30 hover:border-aurora-500/50 transition-all duration-300 text-left group"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-premium flex items-center justify-center">
              <Plus className="w-6 h-6 text-obsidian-900" />
            </div>
            <div>
              <h3 className="font-semibold text-white group-hover:text-aurora-300 transition-colors">
                Create New Memory
              </h3>
              <p className="text-sm text-obsidian-400">
                Add a new persona to your collection
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-aurora-400">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Get started</span>
          </div>
        </motion.button>

        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-coral-500/20 to-sage-500/20 border border-coral-500/30 text-left"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-coral-500 to-sage-500 flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">AI Powered</h3>
              <p className="text-sm text-obsidian-400">
                Advanced memory intelligence
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-coral-400">
            <div className="w-2 h-2 rounded-full bg-sage-400 animate-pulse"></div>
            <span className="text-sm font-medium">Ready to chat</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Recent Conversations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-manrope text-xl font-semibold text-white">Recent Conversations</h2>
          {personas.length === 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCreateMemory}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/15 rounded-xl border border-white/20 hover:border-white/30 transition-all duration-300 text-white font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Memory</span>
            </motion.button>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 animate-pulse">
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
        ) : recentPersonas.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-premium p-0.5 mx-auto mb-4">
              <div className="w-full h-full rounded-2xl bg-obsidian-800 flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Personas Yet</h3>
            <p className="text-obsidian-400 mb-6">
              Create your first memory persona to start having conversations
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCreateMemory}
              className="btn-premium text-obsidian-900 font-bold"
            >
              Create Your First Memory
            </motion.button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {recentPersonas.map((persona, index) => (
              <motion.div
                key={persona.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ x: 4 }}
                onClick={() => onStartChat(persona)}
                className="group bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 cursor-pointer transition-all duration-300"
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-gradient-premium p-0.5">
                      <div className="w-full h-full rounded-xl bg-obsidian-800 flex items-center justify-center text-lg">
                        {persona.avatar}
                      </div>
                    </div>
                    {persona.status === 'active' && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-sage-400 border-2 border-obsidian-950" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-white group-hover:text-aurora-300 transition-colors">
                        {persona.name}
                      </h3>
                      <span className="text-sm text-obsidian-400">
                        {formatTimeAgo(persona.last_interaction)}
                      </span>
                    </div>
                    <p className="text-sm text-obsidian-400 mt-1">
                      {persona.conversation_count} conversations
                    </p>
                  </div>

                  <motion.div
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    whileHover={{ scale: 1.1 }}
                  >
                    <MessageCircle className="w-5 h-5 text-aurora-400" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;