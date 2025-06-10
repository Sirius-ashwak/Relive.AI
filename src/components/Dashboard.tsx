import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Users, Heart, Clock, TrendingUp, Sparkles } from 'lucide-react';
import PersonaCard from './PersonaCard';
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
      color: 'from-accent-cyan/20 to-accent-pink/20'
    },
    {
      label: 'Conversations',
      value: conversations.length,
      icon: MessageCircle,
      color: 'from-accent-pink/20 to-accent-purple/20'
    },
    {
      label: 'Memories Preserved',
      value: personas.reduce((acc, p) => acc + p.memoryData.memories.length, 0),
      icon: Heart,
      color: 'from-accent-purple/20 to-accent-cyan/20'
    },
    {
      label: 'Hours Talked',
      value: Math.floor(conversations.reduce((acc, c) => acc + c.duration, 0) / 60),
      icon: Clock,
      color: 'from-accent-cyan/20 to-accent-purple/20'
    }
  ];

  const recentPersonas = personas
    .sort((a, b) => b.lastInteraction.getTime() - a.lastInteraction.getTime())
    .slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="font-sora text-4xl font-bold mb-4">
          <span className="gradient-text">Welcome Back</span>
        </h1>
        <p className="text-xl text-gray-300">
          Your memory companions are waiting to continue your conversations
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className={`p-6 rounded-2xl glass glass-hover bg-gradient-to-br ${stat.color}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-aurora p-0.5">
                <div className="w-full h-full rounded-xl bg-dark-400 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-gray-300">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Personas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-sora text-2xl font-bold text-white">Recent Conversations</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCreateMemory}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-aurora rounded-xl font-semibold text-dark-500"
          >
            <Sparkles className="w-4 h-4" />
            <span>New Memory</span>
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentPersonas.map((persona, index) => (
            <motion.div
              key={persona.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <PersonaCard
                name={persona.name}
                type={persona.type}
                lastInteraction={`${Math.floor((Date.now() - persona.lastInteraction.getTime()) / (1000 * 60 * 60 * 24))} days ago`}
                avatar={persona.avatar}
                status={persona.status}
                onClick={() => onStartChat(persona)}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="p-6 rounded-2xl glass glass-hover">
          <h3 className="font-semibold text-white mb-4">Memory Insights</h3>
          <p className="text-gray-300 mb-4">
            Your conversations are helping preserve precious memories and creating meaningful connections.
          </p>
          <div className="flex items-center space-x-2 text-accent-cyan">
            <Heart className="w-4 h-4" />
            <span className="text-sm">View detailed analytics</span>
          </div>
        </div>

        <div className="p-6 rounded-2xl glass glass-hover">
          <h3 className="font-semibold text-white mb-4">AI Learning Progress</h3>
          <p className="text-gray-300 mb-4">
            Your personas are continuously learning from your conversations to become more authentic.
          </p>
          <div className="flex items-center space-x-2 text-accent-purple">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm">See learning updates</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;