import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Upload, Mic, Video, Save, X, Sparkles } from 'lucide-react';
import { usePersonaStore } from '../store/personaStore';
import { useAuthStore } from '../store/authStore';
import { geminiService } from '../services/geminiService';
import toast from 'react-hot-toast';

interface MemoryCreatorProps {
  isOpen: boolean;
  onClose: () => void;
}

const MemoryCreator: React.FC<MemoryCreatorProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [personaType, setPersonaType] = useState<'memory' | 'younger' | 'future'>('memory');
  const [memoryText, setMemoryText] = useState('');
  const [personaName, setPersonaName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  
  const { addPersona } = usePersonaStore();
  const { user } = useAuthStore();

  const personaTypes = [
    {
      type: 'memory' as const,
      title: 'Memory of Someone',
      description: 'Create a persona of a loved one, friend, or someone important to you',
      icon: '👥',
      gradient: 'from-accent-pink/20 to-accent-purple/20'
    },
    {
      type: 'younger' as const,
      title: 'Younger You',
      description: 'Talk to a past version of yourself from any age or time period',
      icon: '🧒',
      gradient: 'from-accent-cyan/20 to-accent-pink/20'
    },
    {
      type: 'future' as const,
      title: 'Future You',
      description: 'Envision and converse with your future self and aspirations',
      icon: '🚀',
      gradient: 'from-accent-purple/20 to-accent-cyan/20'
    }
  ];

  const handleCreateMemory = async () => {
    if (!memoryText.trim() || !user) {
      toast.error('Please provide memory details');
      return;
    }

    setIsCreating(true);
    try {
      const personaData = await geminiService.createPersonaFromMemory(memoryText, personaType);
      
      const newPersona = {
        userId: user.id,
        name: personaName || personaData.name || `${personaType} Persona`,
        type: personaType,
        avatar: personaTypes.find(t => t.type === personaType)?.icon || '👤',
        description: personaData.description || memoryText.slice(0, 100) + '...',
        personality: personaData.personality || 'Warm and understanding persona',
        status: 'active' as const,
        lastInteraction: new Date(),
        conversationCount: 0,
        memoryData: {
          traits: personaData.traits || ['caring', 'wise'],
          memories: personaData.memories || [memoryText],
          relationships: personaData.relationships || ['family']
        }
      };

      addPersona(newPersona);
      toast.success('Memory persona created successfully!');
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error creating memory:', error);
      toast.error('Failed to create memory. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setPersonaType('memory');
    setMemoryText('');
    setPersonaName('');
  };

  if (!isOpen) return null;

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
        className="w-full max-w-2xl bg-dark-400 rounded-3xl p-8 glass border border-white/20"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-aurora flex items-center justify-center">
              <Brain className="w-6 h-6 text-dark-500" />
            </div>
            <div>
              <h2 className="font-sora text-2xl font-bold text-white">Create Memory</h2>
              <p className="text-gray-400">Step {step} of 2</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl glass glass-hover"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Choose Memory Type</h3>
              <div className="grid gap-4">
                {personaTypes.map((type) => (
                  <motion.button
                    key={type.type}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setPersonaType(type.type)}
                    className={`p-6 rounded-2xl text-left transition-all duration-300 ${
                      personaType === type.type
                        ? 'bg-gradient-to-r ' + type.gradient + ' border-accent-cyan/50'
                        : 'glass glass-hover'
                    } border`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="text-3xl">{type.icon}</div>
                      <div>
                        <h4 className="font-semibold text-white mb-2">{type.title}</h4>
                        <p className="text-gray-300 text-sm">{type.description}</p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStep(2)}
                className="px-6 py-3 bg-gradient-aurora rounded-xl font-semibold text-dark-500"
              >
                Continue
              </motion.button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Memory Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Persona Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={personaName}
                    onChange={(e) => setPersonaName(e.target.value)}
                    placeholder="e.g., Mom, Younger Me, Future Self"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-accent-cyan/50 focus:outline-none text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Describe the Memory or Person
                  </label>
                  <textarea
                    value={memoryText}
                    onChange={(e) => setMemoryText(e.target.value)}
                    placeholder="Share details about this person or memory. Include their personality, how they spoke, important moments you shared, their values, or anything that made them special..."
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-accent-cyan/50 focus:outline-none text-white placeholder-gray-400 resize-none"
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    The more details you provide, the more authentic the conversations will be.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 glass glass-hover rounded-xl font-semibold text-white"
              >
                Back
              </button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreateMemory}
                disabled={isCreating || !memoryText.trim()}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-aurora rounded-xl font-semibold text-dark-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="w-5 h-5" />
                    </motion.div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Create Memory</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default MemoryCreator;