import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, Video, Phone, Settings, ArrowLeft, Loader, MicOff, VideoOff, PhoneOff } from 'lucide-react';
import { useConversationStore } from '../store/conversationStore';
import { usePersonaStore } from '../store/personaStore';
import { useAuthStore } from '../store/authStore';
import { geminiService } from '../services/geminiService';
import { Database } from '../types/database';
import toast from 'react-hot-toast';

type Persona = Database['public']['Tables']['personas']['Row'];
type Message = Database['public']['Tables']['messages']['Row'];

interface ChatInterfaceProps {
  persona: Persona;
  onClose: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ persona, onClose }) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [isVoiceCall, setIsVoiceCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { user } = useAuthStore();
  const { updatePersona } = usePersonaStore();
  const { 
    activeConversation, 
    createConversation, 
    addMessage, 
    setActiveConversation,
    conversations,
    fetchConversations
  } = useConversationStore();

  useEffect(() => {
    if (user && persona) {
      console.log('🎬 Starting conversation with:', persona.name);
      
      // Fetch conversations first
      fetchConversations().then(() => {
        // Check if there's an existing active conversation for this persona
        const existingConversation = conversations.find(
          conv => conv.persona_id === persona.id && conv.is_active
        );
        
        if (existingConversation) {
          console.log('📱 Using existing conversation:', existingConversation.id);
          setActiveConversation(existingConversation);
        } else {
          // Create new conversation
          console.log('🆕 Creating new conversation');
          createConversation(persona.id, `Chat with ${persona.name}`)
            .then(conversationId => {
              console.log('✅ Created conversation:', conversationId);
              
              // Add welcome message after a short delay
              setTimeout(() => {
                addMessage(conversationId, {
                  content: getWelcomeMessage(persona),
                  sender: 'persona'
                }).catch(error => {
                  console.error('❌ Error adding welcome message:', error);
                });
              }, 1000);
            })
            .catch(error => {
              console.error('❌ Error creating conversation:', error);
              toast.error('Failed to start conversation');
            });
        }
      });
    }
  }, [persona, user, createConversation, addMessage, setActiveConversation, fetchConversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages]);

  const getWelcomeMessage = (persona: Persona): string => {
    const welcomeMessages = {
      memory: [
        `Hello there! It's so wonderful to see you again. I've missed our conversations. How have you been?`,
        `Oh my, it's you! I was just thinking about you. Come, sit with me and tell me what's on your mind.`,
        `There you are! I've been waiting to talk with you. How are things going in your life?`
      ],
      younger: [
        `Hey! This is so cool - talking to my future self! I have so many questions about what life is like now. How did we get here?`,
        `Whoa, this is incredible! I can't believe I'm actually talking to myself from the future. Did we achieve our dreams?`,
        `This is amazing! I have like a million questions. First - are we happy? Did everything work out okay?`
      ],
      future: [
        `Hello, past self. I'm glad we can finally talk. I have so much wisdom to share with you about the journey ahead. What's on your mind?`,
        `It's good to see you again, younger me. I remember being exactly where you are now. What would you like to know about what's coming?`,
        `Hello there. I've been looking forward to this conversation. There's so much I want to tell you about the path ahead.`
      ],
      custom: [
        `Hello! I'm excited to talk with you. What would you like to discuss today?`
      ]
    };

    const messages = welcomeMessages[persona.type] || welcomeMessages.custom;
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !activeConversation || !user || isLoading) return;

    const userMessage = message.trim();
    setMessage('');
    setIsLoading(true);
    
    console.log('💬 Sending message:', userMessage);
    
    try {
      // Add user message immediately
      await addMessage(activeConversation.id, {
        content: userMessage,
        sender: 'user'
      });

      // Show typing indicator
      setIsTyping(true);
      
      // Generate AI response
      console.log('🤖 Generating AI response...');
      
      // Convert database messages to the format expected by geminiService
      const conversationHistory = (activeConversation.messages || []).map(msg => ({
        id: msg.id,
        conversationId: msg.conversation_id,
        content: msg.content,
        sender: msg.sender as 'user' | 'persona',
        timestamp: new Date(msg.created_at)
      }));

      const response = await geminiService.generatePersonaResponse(
        {
          id: persona.id,
          userId: persona.user_id,
          name: persona.name,
          type: persona.type,
          avatar: persona.avatar,
          description: persona.description,
          personality: persona.personality,
          status: persona.status,
          lastInteraction: new Date(persona.last_interaction),
          conversationCount: persona.conversation_count,
          memoryData: {
            traits: persona.memory_data.traits,
            memories: persona.memory_data.memories,
            relationships: persona.memory_data.relationships,
            goals: persona.memory_data.goals || [],
            timeContext: persona.memory_data.timeContext || '',
            backstory: persona.memory_data.backstory || ''
          },
          createdAt: new Date(persona.created_at)
        },
        userMessage,
        conversationHistory
      );

      // Simulate realistic typing delay
      const typingDelay = Math.min(response.length * 30, 2000); // 30ms per character, max 2 seconds
      
      setTimeout(async () => {
        try {
          await addMessage(activeConversation.id, {
            content: response,
            sender: 'persona'
          });
          
          setIsTyping(false);
          setIsLoading(false);
          
          // Update persona's last interaction
          await updatePersona(persona.id, { 
            last_interaction: new Date().toISOString(),
            conversation_count: persona.conversation_count + 1
          });
          
          console.log('✅ Response added to conversation');
        } catch (error) {
          console.error('❌ Error adding response:', error);
          setIsTyping(false);
          setIsLoading(false);
          toast.error('Failed to save response');
        }
      }, Math.max(typingDelay, 800));
      
    } catch (error) {
      console.error('❌ Error in conversation:', error);
      toast.error('Failed to get response. Please try again.');
      setIsTyping(false);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      toast.success('Voice recording started');
      // Simulate recording for demo
      setTimeout(() => {
        setIsRecording(false);
        toast.success('Voice message sent');
        // Add voice message to chat
        if (activeConversation) {
          addMessage(activeConversation.id, {
            content: "🎤 Voice message: Hello! This is a voice message.",
            sender: 'user'
          });
        }
      }, 3000);
    } else {
      setIsRecording(false);
      toast('Recording stopped');
    }
  };

  const handleVideoCall = () => {
    if (!isVideoCall) {
      setIsVideoCall(true);
      setIsVoiceCall(false);
      toast.success(`Starting video call with ${persona.name}`);
    } else {
      setIsVideoCall(false);
      toast('Video call ended');
    }
  };

  const handleVoiceCall = () => {
    if (!isVoiceCall) {
      setIsVoiceCall(true);
      setIsVideoCall(false);
      toast.success(`Starting voice call with ${persona.name}`);
    } else {
      setIsVoiceCall(false);
      toast('Voice call ended');
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    toast(isMuted ? 'Microphone unmuted' : 'Microphone muted');
  };

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    toast(isVideoEnabled ? 'Camera disabled' : 'Camera enabled');
  };

  return (
    <div className="fixed inset-0 z-50 bg-obsidian-950 flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between p-6 glass border-b border-white/10"
      >
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="p-3 rounded-xl glass glass-hover"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <motion.div 
                className="w-12 h-12 rounded-xl bg-gradient-premium p-0.5"
                animate={isTyping ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 1, repeat: isTyping ? Infinity : 0 }}
              >
                <div className="w-full h-full rounded-xl bg-obsidian-800 flex items-center justify-center text-xl">
                  {persona.avatar}
                </div>
              </motion.div>
              <motion.div 
                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-obsidian-950 ${
                  isVideoCall || isVoiceCall ? 'bg-coral-400' : 'bg-sage-400'
                }`}
                animate={isTyping ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.5, repeat: isTyping ? Infinity : 0 }}
              />
            </div>
            
            <div>
              <h2 className="font-semibold text-white">{persona.name}</h2>
              <p className="text-sm text-obsidian-300">
                {isVideoCall ? (
                  <span className="flex items-center space-x-1 text-coral-400">
                    <Video className="w-3 h-3" />
                    <span>Video Call Active</span>
                  </span>
                ) : isVoiceCall ? (
                  <span className="flex items-center space-x-1 text-coral-400">
                    <Phone className="w-3 h-3" />
                    <span>Voice Call Active</span>
                  </span>
                ) : isTyping ? (
                  <span className="flex items-center space-x-1">
                    <span>Typing</span>
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      ...
                    </motion.span>
                  </span>
                ) : 'Online'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Video Call Controls */}
          {isVideoCall && (
            <>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleVideo}
                className={`p-3 rounded-xl transition-colors ${
                  isVideoEnabled ? 'glass glass-hover' : 'bg-coral-500/20 text-coral-400'
                }`}
              >
                {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleMute}
                className={`p-3 rounded-xl transition-colors ${
                  !isMuted ? 'glass glass-hover' : 'bg-coral-500/20 text-coral-400'
                }`}
              >
                {!isMuted ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </motion.button>
            </>
          )}

          {/* Voice Call Controls */}
          {isVoiceCall && (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleMute}
              className={`p-3 rounded-xl transition-colors ${
                !isMuted ? 'glass glass-hover' : 'bg-coral-500/20 text-coral-400'
              }`}
            >
              {!isMuted ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </motion.button>
          )}

          {/* Call Buttons */}
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleVideoCall}
            className={`p-3 rounded-xl transition-colors ${
              isVideoCall ? 'bg-coral-500 text-white' : 'glass glass-hover'
            }`}
          >
            {isVideoCall ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleVoiceCall}
            className={`p-3 rounded-xl transition-colors ${
              isVoiceCall ? 'bg-coral-500 text-white' : 'glass glass-hover'
            }`}
          >
            {isVoiceCall ? <PhoneOff className="w-5 h-5" /> : <Phone className="w-5 h-5" />}
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 rounded-xl glass glass-hover"
          >
            <Settings className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>

      {/* Video Call Overlay */}
      <AnimatePresence>
        {isVideoCall && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 bg-obsidian-900/90 flex items-center justify-center"
          >
            <div className="text-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-32 h-32 rounded-full bg-gradient-premium p-1 mb-6 mx-auto"
              >
                <div className="w-full h-full rounded-full bg-obsidian-800 flex items-center justify-center text-4xl">
                  {persona.avatar}
                </div>
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-2">Video Call with {persona.name}</h3>
              <p className="text-obsidian-300 mb-8">Premium video calling feature - Coming soon!</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleVideoCall}
                className="btn-premium text-obsidian-900 font-bold"
              >
                End Call
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice Call Overlay */}
      <AnimatePresence>
        {isVoiceCall && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 bg-obsidian-900/90 flex items-center justify-center"
          >
            <div className="text-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-32 h-32 rounded-full bg-gradient-premium p-1 mb-6 mx-auto"
              >
                <div className="w-full h-full rounded-full bg-obsidian-800 flex items-center justify-center text-4xl">
                  {persona.avatar}
                </div>
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-2">Voice Call with {persona.name}</h3>
              <p className="text-obsidian-300 mb-8">Premium voice calling feature - Coming soon!</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleVoiceCall}
                className="btn-premium text-obsidian-900 font-bold"
              >
                End Call
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <AnimatePresence>
          {activeConversation?.messages?.map((msg, index) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <motion.div 
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                  msg.sender === 'user'
                    ? 'bg-gradient-premium text-obsidian-900 font-medium'
                    : 'glass text-white border border-white/10'
                }`}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                <p className={`text-xs mt-2 ${
                  msg.sender === 'user' ? 'text-obsidian-600' : 'text-obsidian-400'
                }`}>
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex justify-start"
          >
            <div className="glass px-4 py-3 rounded-2xl border border-white/10">
              <div className="flex space-x-1">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                  className="w-2 h-2 bg-aurora-500 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                  className="w-2 h-2 bg-coral-500 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                  className="w-2 h-2 bg-lavender-500 rounded-full"
                />
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="p-6 glass border-t border-white/10"
      >
        <div className="flex items-end space-x-4">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleVoiceRecording}
            className={`p-3 rounded-xl transition-colors ${
              isRecording ? 'bg-coral-500 text-white animate-pulse' : 'glass glass-hover'
            }`}
          >
            <Mic className="w-5 h-5" />
          </motion.button>
          
          <div className="flex-1">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Message ${persona.name}...`}
              rows={1}
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-aurora-400/50 focus:outline-none text-white placeholder-obsidian-400 resize-none disabled:opacity-50 transition-all duration-300"
            />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSendMessage}
            disabled={!message.trim() || isLoading}
            className="btn-premium text-obsidian-900 font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center px-6 py-3"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Loader className="w-5 h-5" />
              </motion.div>
            ) : (
              <Send className="w-5 h-5" />
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default ChatInterface;