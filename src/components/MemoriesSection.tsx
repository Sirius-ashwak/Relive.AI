import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Search, 
  Filter, 
  Plus, 
  Calendar,
  Tag,
  Eye,
  Edit3,
  Trash2,
  Download,
  Share2,
  Lock,
  Unlock,
  Image,
  Video,
  Mic,
  FileText
} from 'lucide-react';
import { usePersonaStore } from '../store/personaStore';
import { useConversationStore } from '../store/conversationStore';

interface Memory {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'audio' | 'video' | 'photo';
  personaId?: string;
  tags: string[];
  isPrivate: boolean;
  createdAt: Date;
  lastAccessed: Date;
  accessCount: number;
}

const MemoriesSection: React.FC = () => {
  const { personas } = usePersonaStore();
  const { conversations } = useConversationStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'text' | 'audio' | 'video' | 'photo'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'accessed' | 'title'>('recent');

  // Generate memories from conversations and personas
  const generateMemories = (): Memory[] => {
    const memories: Memory[] = [];

    // Create memories from persona data
    personas.forEach(persona => {
      persona.memoryData.memories.forEach((memory, index) => {
        memories.push({
          id: `persona-${persona.id}-${index}`,
          title: `Memory with ${persona.name}`,
          content: memory,
          type: 'text',
          personaId: persona.id,
          tags: persona.memoryData.traits.slice(0, 3),
          isPrivate: false,
          createdAt: persona.createdAt,
          lastAccessed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
          accessCount: Math.floor(Math.random() * 20) + 1
        });
      });
    });

    // Create memories from conversations
    conversations.forEach(conversation => {
      const persona = personas.find(p => p.id === conversation.personaId);
      if (persona && conversation.messages.length > 0) {
        const significantMessages = conversation.messages.filter(msg => msg.content.length > 50);
        if (significantMessages.length > 0) {
          const randomMessage = significantMessages[Math.floor(Math.random() * significantMessages.length)];
          memories.push({
            id: `conversation-${conversation.id}`,
            title: `Conversation with ${persona.name}`,
            content: randomMessage.content,
            type: 'text',
            personaId: persona.id,
            tags: ['conversation', persona.type],
            isPrivate: false,
            createdAt: conversation.startedAt,
            lastAccessed: conversation.lastMessageAt,
            accessCount: conversation.messages.length
          });
        }
      }
    });

    // Add some sample multimedia memories
    const sampleMemories: Memory[] = [
      {
        id: 'sample-1',
        title: 'Family Vacation Voice Note',
        content: 'A heartwarming voice message about our last family vacation to the mountains.',
        type: 'audio',
        tags: ['family', 'vacation', 'mountains'],
        isPrivate: true,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        lastAccessed: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        accessCount: 8
      },
      {
        id: 'sample-2',
        title: 'Childhood Photo Collection',
        content: 'A collection of childhood photos that bring back wonderful memories.',
        type: 'photo',
        tags: ['childhood', 'photos', 'nostalgia'],
        isPrivate: false,
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        lastAccessed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        accessCount: 15
      },
      {
        id: 'sample-3',
        title: 'Birthday Video Message',
        content: 'A special birthday video message from loved ones.',
        type: 'video',
        tags: ['birthday', 'celebration', 'love'],
        isPrivate: false,
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        lastAccessed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        accessCount: 12
      }
    ];

    return [...memories, ...sampleMemories];
  };

  const memories = generateMemories();

  const filteredMemories = memories
    .filter(memory => {
      const matchesSearch = memory.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           memory.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           memory.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesFilter = filterType === 'all' || memory.type === filterType;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'oldest':
          return a.createdAt.getTime() - b.createdAt.getTime();
        case 'accessed':
          return b.lastAccessed.getTime() - a.lastAccessed.getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const getTypeIcon = (type: Memory['type']) => {
    switch (type) {
      case 'text': return FileText;
      case 'audio': return Mic;
      case 'video': return Video;
      case 'photo': return Image;
      default: return FileText;
    }
  };

  const getTypeColor = (type: Memory['type']) => {
    switch (type) {
      case 'text': return 'text-aurora-400';
      case 'audio': return 'text-coral-400';
      case 'video': return 'text-lavender-400';
      case 'photo': return 'text-sage-400';
      default: return 'text-obsidian-400';
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  const stats = [
    {
      label: 'Total Memories',
      value: memories.length,
      icon: Heart,
      color: 'text-coral-400'
    },
    {
      label: 'Private',
      value: memories.filter(m => m.isPrivate).length,
      icon: Lock,
      color: 'text-aurora-400'
    },
    {
      label: 'This Month',
      value: memories.filter(m => {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return m.createdAt > monthAgo;
      }).length,
      icon: Calendar,
      color: 'text-lavender-400'
    },
    {
      label: 'Most Viewed',
      value: Math.max(...memories.map(m => m.accessCount), 0),
      icon: Eye,
      color: 'text-sage-400'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="font-manrope text-3xl font-bold mb-3">
          <span className="gradient-text">Your Memories</span>
        </h1>
        <p className="text-lg text-obsidian-300">
          Preserved moments and conversations that matter most
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10 text-center"
          >
            <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
            <div className="text-xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-xs text-obsidian-400">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4"
      >
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-obsidian-400" />
          <input
            type="text"
            placeholder="Search memories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 focus:border-aurora-400/50 focus:outline-none text-white placeholder-obsidian-400 transition-all duration-300"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-3">
          <Filter className="w-5 h-5 text-obsidian-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-4 py-3 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 focus:border-aurora-400/50 focus:outline-none text-white transition-all duration-300"
          >
            <option value="all">All Types</option>
            <option value="text">Text</option>
            <option value="audio">Audio</option>
            <option value="video">Video</option>
            <option value="photo">Photos</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-3 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 focus:border-aurora-400/50 focus:outline-none text-white transition-all duration-300"
          >
            <option value="recent">Most Recent</option>
            <option value="oldest">Oldest First</option>
            <option value="accessed">Recently Viewed</option>
            <option value="title">Alphabetical</option>
          </select>
        </div>

        {/* Add Memory Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-premium rounded-xl font-semibold text-obsidian-900"
        >
          <Plus className="w-5 h-5" />
          <span>Add Memory</span>
        </motion.button>
      </motion.div>

      {/* Memories Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        {filteredMemories.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-gradient-premium p-0.5 mx-auto mb-4">
              <div className="w-full h-full rounded-2xl bg-obsidian-800 flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No memories found</h3>
            <p className="text-obsidian-400">
              {searchTerm ? 'Try adjusting your search terms' : 'Start creating memories with your personas'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMemories.map((memory, index) => {
              const TypeIcon = getTypeIcon(memory.type);
              const persona = memory.personaId ? personas.find(p => p.id === memory.personaId) : null;

              return (
                <motion.div
                  key={memory.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="group bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 cursor-pointer transition-all duration-300"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center`}>
                        <TypeIcon className={`w-5 h-5 ${getTypeColor(memory.type)}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-white group-hover:text-aurora-300 transition-colors line-clamp-1">
                          {memory.title}
                        </h3>
                        <p className="text-xs text-obsidian-400">
                          {formatDate(memory.createdAt)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {memory.isPrivate ? (
                        <Lock className="w-4 h-4 text-coral-400" />
                      ) : (
                        <Unlock className="w-4 h-4 text-sage-400" />
                      )}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                        >
                          <Edit3 className="w-3 h-3 text-aurora-400" />
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <p className="text-sm text-obsidian-300 mb-4 line-clamp-3 leading-relaxed">
                    {memory.content}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {memory.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-white/10 rounded-full text-xs text-obsidian-300"
                      >
                        #{tag}
                      </span>
                    ))}
                    {memory.tags.length > 3 && (
                      <span className="px-2 py-1 bg-white/10 rounded-full text-xs text-obsidian-400">
                        +{memory.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs text-obsidian-400">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>{memory.accessCount}</span>
                      </span>
                      {persona && (
                        <span className="flex items-center space-x-1">
                          <span>{persona.avatar}</span>
                          <span>{persona.name}</span>
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                      >
                        <Share2 className="w-3 h-3" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                      >
                        <Download className="w-3 h-3" />
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

export default MemoriesSection;