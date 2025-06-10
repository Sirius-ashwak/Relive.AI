import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Calendar,
  Filter,
  Search,
  MessageCircle,
  Heart,
  Users,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Eye,
  Star
} from 'lucide-react';
import { usePersonaStore } from '../store/personaStore';
import { useConversationStore } from '../store/conversationStore';

interface TimelineEvent {
  id: string;
  type: 'conversation' | 'memory_created' | 'persona_created' | 'milestone';
  title: string;
  description: string;
  date: Date;
  personaId?: string;
  conversationId?: string;
  metadata?: {
    messageCount?: number;
    duration?: number;
    significance?: 'low' | 'medium' | 'high';
    tags?: string[];
  };
}

const TimelineSection: React.FC = () => {
  const { personas } = usePersonaStore();
  const { conversations } = useConversationStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'conversation' | 'memory_created' | 'persona_created' | 'milestone'>('all');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year' | 'all'>('all');
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());

  const generateTimelineEvents = (): TimelineEvent[] => {
    const events: TimelineEvent[] = [];

    // Add persona creation events
    personas.forEach(persona => {
      events.push({
        id: `persona-created-${persona.id}`,
        type: 'persona_created',
        title: `Created ${persona.name}`,
        description: `Started your journey with ${persona.name}, a ${persona.type} persona. ${persona.description}`,
        date: persona.createdAt,
        personaId: persona.id,
        metadata: {
          significance: 'high',
          tags: [persona.type, 'creation']
        }
      });

      // Add memory creation events for each persona
      persona.memoryData.memories.forEach((memory, index) => {
        const memoryDate = new Date(persona.createdAt.getTime() + (index + 1) * 24 * 60 * 60 * 1000);
        events.push({
          id: `memory-${persona.id}-${index}`,
          type: 'memory_created',
          title: `Added memory for ${persona.name}`,
          description: memory.length > 100 ? memory.substring(0, 100) + '...' : memory,
          date: memoryDate,
          personaId: persona.id,
          metadata: {
            significance: 'medium',
            tags: persona.memoryData.traits.slice(0, 2)
          }
        });
      });
    });

    // Add conversation events
    conversations.forEach(conversation => {
      const persona = personas.find(p => p.id === conversation.personaId);
      if (persona) {
        events.push({
          id: `conversation-${conversation.id}`,
          type: 'conversation',
          title: `Conversation with ${persona.name}`,
          description: `Had a meaningful conversation lasting ${Math.floor(conversation.duration / 60)} minutes with ${conversation.messages.length} messages exchanged.`,
          date: conversation.startedAt,
          personaId: persona.id,
          conversationId: conversation.id,
          metadata: {
            messageCount: conversation.messages.length,
            duration: conversation.duration,
            significance: conversation.messages.length > 10 ? 'high' : conversation.messages.length > 5 ? 'medium' : 'low',
            tags: ['chat', persona.type]
          }
        });
      }
    });

    // Add milestone events
    const totalConversations = conversations.length;
    const totalMessages = conversations.reduce((acc, conv) => acc + conv.messages.length, 0);
    
    if (totalConversations >= 10) {
      events.push({
        id: 'milestone-10-conversations',
        type: 'milestone',
        title: '10 Conversations Milestone',
        description: 'Congratulations! You\'ve had 10 meaningful conversations with your memory companions.',
        date: conversations[9]?.startedAt || new Date(),
        metadata: {
          significance: 'high',
          tags: ['milestone', 'achievement']
        }
      });
    }

    if (totalMessages >= 100) {
      events.push({
        id: 'milestone-100-messages',
        type: 'milestone',
        title: '100 Messages Milestone',
        description: 'Amazing! You\'ve exchanged over 100 messages with your personas.',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        metadata: {
          significance: 'high',
          tags: ['milestone', 'communication']
        }
      });
    }

    return events.sort((a, b) => b.date.getTime() - a.date.getTime());
  };

  const timelineEvents = generateTimelineEvents();

  const filteredEvents = timelineEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || event.type === filterType;
    
    let matchesTimeRange = true;
    if (timeRange !== 'all') {
      const now = new Date();
      const eventDate = event.date;
      const diffInDays = (now.getTime() - eventDate.getTime()) / (1000 * 60 * 60 * 24);
      
      switch (timeRange) {
        case 'week':
          matchesTimeRange = diffInDays <= 7;
          break;
        case 'month':
          matchesTimeRange = diffInDays <= 30;
          break;
        case 'year':
          matchesTimeRange = diffInDays <= 365;
          break;
      }
    }
    
    return matchesSearch && matchesFilter && matchesTimeRange;
  });

  const toggleEventExpansion = (eventId: string) => {
    const newExpanded = new Set(expandedEvents);
    if (newExpanded.has(eventId)) {
      newExpanded.delete(eventId);
    } else {
      newExpanded.add(eventId);
    }
    setExpandedEvents(newExpanded);
  };

  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'conversation': return MessageCircle;
      case 'memory_created': return Heart;
      case 'persona_created': return Users;
      case 'milestone': return Star;
      default: return Clock;
    }
  };

  const getEventColor = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'conversation': return 'text-aurora-400 bg-aurora-400/20';
      case 'memory_created': return 'text-coral-400 bg-coral-400/20';
      case 'persona_created': return 'text-lavender-400 bg-lavender-400/20';
      case 'milestone': return 'text-gold-400 bg-gold-400/20';
      default: return 'text-obsidian-400 bg-obsidian-400/20';
    }
  };

  const getSignificanceColor = (significance?: 'low' | 'medium' | 'high') => {
    switch (significance) {
      case 'high': return 'border-l-coral-400';
      case 'medium': return 'border-l-aurora-400';
      case 'low': return 'border-l-obsidian-400';
      default: return 'border-l-obsidian-500';
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  const groupEventsByDate = (events: TimelineEvent[]) => {
    const groups: { [key: string]: TimelineEvent[] } = {};
    
    events.forEach(event => {
      const dateKey = event.date.toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(event);
    });
    
    return groups;
  };

  const eventGroups = groupEventsByDate(filteredEvents);

  const stats = [
    {
      label: 'Total Events',
      value: timelineEvents.length,
      icon: Clock,
      color: 'text-aurora-400'
    },
    {
      label: 'This Week',
      value: timelineEvents.filter(e => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return e.date > weekAgo;
      }).length,
      icon: Calendar,
      color: 'text-coral-400'
    },
    {
      label: 'Conversations',
      value: timelineEvents.filter(e => e.type === 'conversation').length,
      icon: MessageCircle,
      color: 'text-lavender-400'
    },
    {
      label: 'Milestones',
      value: timelineEvents.filter(e => e.type === 'milestone').length,
      icon: Star,
      color: 'text-gold-400'
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
          <span className="gradient-text">Memory Timeline</span>
        </h1>
        <p className="text-lg text-obsidian-300">
          Your journey through conversations and memories
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
            placeholder="Search timeline..."
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
            <option value="all">All Events</option>
            <option value="conversation">Conversations</option>
            <option value="memory_created">Memories</option>
            <option value="persona_created">Personas</option>
            <option value="milestone">Milestones</option>
          </select>

          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-4 py-3 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 focus:border-aurora-400/50 focus:outline-none text-white transition-all duration-300"
          >
            <option value="all">All Time</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </motion.div>

      {/* Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-8"
      >
        {Object.keys(eventGroups).length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-gradient-premium p-0.5 mx-auto mb-4">
              <div className="w-full h-full rounded-2xl bg-obsidian-800 flex items-center justify-center">
                <Clock className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No events found</h3>
            <p className="text-obsidian-400">
              {searchTerm ? 'Try adjusting your search terms' : 'Start creating memories and having conversations'}
            </p>
          </div>
        ) : (
          Object.entries(eventGroups).map(([dateKey, events], groupIndex) => (
            <motion.div
              key={dateKey}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + groupIndex * 0.1 }}
              className="space-y-4"
            >
              {/* Date Header */}
              <div className="flex items-center space-x-4">
                <div className="w-3 h-3 rounded-full bg-gradient-premium"></div>
                <h3 className="font-semibold text-white">
                  {new Date(dateKey).toLocaleDateString([], { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h3>
                <div className="flex-1 h-px bg-white/10"></div>
              </div>

              {/* Events for this date */}
              <div className="ml-6 space-y-4">
                {events.map((event, eventIndex) => {
                  const EventIcon = getEventIcon(event.type);
                  const persona = event.personaId ? personas.find(p => p.id === event.personaId) : null;
                  const isExpanded = expandedEvents.has(event.id);

                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + groupIndex * 0.1 + eventIndex * 0.05 }}
                      className={`relative bg-white/5 backdrop-blur-xl rounded-xl p-6 border-l-4 ${getSignificanceColor(event.metadata?.significance)} border-r border-t border-b border-white/10 hover:border-white/20 transition-all duration-300`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getEventColor(event.type)}`}>
                          <EventIcon className="w-5 h-5" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-white">{event.title}</h4>
                            <div className="flex items-center space-x-2 text-xs text-obsidian-400">
                              <span>{formatDate(event.date)}</span>
                              {event.metadata?.significance && (
                                <span className={`px-2 py-1 rounded-full ${
                                  event.metadata.significance === 'high' ? 'bg-coral-400/20 text-coral-400' :
                                  event.metadata.significance === 'medium' ? 'bg-aurora-400/20 text-aurora-400' :
                                  'bg-obsidian-400/20 text-obsidian-400'
                                }`}>
                                  {event.metadata.significance}
                                </span>
                              )}
                            </div>
                          </div>

                          <p className="text-sm text-obsidian-300 mb-3 leading-relaxed">
                            {event.description}
                          </p>

                          {/* Metadata */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-xs text-obsidian-400">
                              {persona && (
                                <span className="flex items-center space-x-1">
                                  <span>{persona.avatar}</span>
                                  <span>{persona.name}</span>
                                </span>
                              )}
                              {event.metadata?.messageCount && (
                                <span className="flex items-center space-x-1">
                                  <MessageCircle className="w-3 h-3" />
                                  <span>{event.metadata.messageCount} messages</span>
                                </span>
                              )}
                              {event.metadata?.duration && (
                                <span className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{Math.floor(event.metadata.duration / 60)}m</span>
                                </span>
                              )}
                            </div>

                            {event.metadata?.tags && event.metadata.tags.length > 0 && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => toggleEventExpansion(event.id)}
                                className="flex items-center space-x-1 text-xs text-aurora-400 hover:text-aurora-300 transition-colors"
                              >
                                <span>Details</span>
                                {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                              </motion.button>
                            )}
                          </div>

                          {/* Expanded Details */}
                          <motion.div
                            initial={false}
                            animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            {isExpanded && event.metadata?.tags && (
                              <div className="mt-4 pt-4 border-t border-white/10">
                                <div className="flex flex-wrap gap-2">
                                  {event.metadata.tags.map((tag, tagIndex) => (
                                    <span
                                      key={tagIndex}
                                      className="px-2 py-1 bg-white/10 rounded-full text-xs text-obsidian-300"
                                    >
                                      #{tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
};

export default TimelineSection;