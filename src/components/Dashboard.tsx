import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Users, Heart, Clock, TrendingUp, Sparkles, Plus } from 'lucide-react';
import { usePersonaStore } from '../store/personaStore';
import { useConversationStore } from '../store/conversationStore';
import { Persona } from '../types';

interface DashboardProps {
  onStartChat: (persona: Persona) => void;
  onCreateMemory: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onStartChat, onCreateMemory }) => {
  const { personas } = usePersonaStore();
  const { conversations } = useConversationStore();

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
      value: personas.reduce((acc, p) => acc + p.memoryData.memories.length, 0),
      icon: Heart,
      color: 'text-lavender-400'
    },
    {
      label: 'Hours',
      value: Math.floor(conversations.reduce((acc, c) => acc + c.duration, 0) / 60),
      icon: Clock,
      color: 'text-sage-400'
    }
  ];

  const recentPersonas = personas
    .sort((a, b) => b.lastInteraction.getTime() - a.lastInteraction.getTime())
    .slice(0, 3);

  const formatTimeAgo = (date: Date) => {
    const days = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  };

  return (
    <div className="space-y-12">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="font-manrope text-3xl font-bold mb-3">
          <span className="gradient-text">Welcome Back</span>
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
            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-obsidian-400">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Conversations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-manrope text-xl font-semibold text-white">Recent Conversations</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCreateMemory}
            className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/15 rounded-xl border border-white/20 hover:border-white/30 transition-all duration-300 text-white font-medium"
          >
            <Plus className="w-4 h-4" />
            <span>New Memory</span>
          </motion.button>
        </div>

        <div className="space-y-4">
          {recentPersonas.map((persona, index) => (
            <motion.div
              key={persona.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
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
                      {formatTimeAgo(persona.lastInteraction)}
                    </span>
                  </div>
                  <p className="text-sm text-obsidian-400 mt-1">
                    {persona.conversationCount} conversations
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
      </motion.div>
    </div>
  );
};

export default Dashboard;