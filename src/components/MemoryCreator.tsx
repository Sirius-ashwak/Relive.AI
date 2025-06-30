import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Upload, Mic, Video, Save, X, Sparkles, AlertCircle } from 'lucide-react';
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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const { addPersona } = usePersonaStore();
  const { user } = useAuthStore();

  const personaTypes = [
    {
      type: 'memory' as const,
      title: 'Memory of Someone',
      description: 'Create a persona of a loved one, friend, or someone important to you',
      icon: '👥',
      gradient: 'from-coral-500/20 to-lavender-500/20',
      examples: [
        'My grandmother who always told amazing stories',
        'My best friend from college who was so funny',
        'My father who gave the best advice'
      ]
    },
    {
      type: 'younger' as const,
      title: 'Younger You',
      description: 'Talk to a past version of yourself from any age or time period',
      icon: '🧒',
      gradient: 'from-aurora-500/20 to-coral-500/20',
      examples: [
        'Me at 16 when I was full of dreams',
        'My childhood self who loved adventure',
        'Me in college when everything seemed possible'
      ]
    },
    {
      type: 'future' as const,
      title: 'Future You',
      description: 'Envision and converse with your future self and aspirations',
      icon: '🚀',
      gradient: 'from-lavender-500/20 to-sage-500/20',
      examples: [
        'My successful future self in 10 years',
        'The wise version of me at 60',
        'My future self who achieved all my goals'
      ]
    }
  ];

  const validateStep1 = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!personaType) {
      newErrors.personaType = 'Please select a persona type';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!memoryText.trim()) {
      newErrors.memoryText = 'Please describe the memory or person';
    } else if (memoryText.trim().length < 20) {
      newErrors.memoryText = 'Please provide more details (at least 20 characters)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleCreateMemory = async () => {
    if (!validateStep2()) return;
    
    if (!user) {
      toast.error('Please log in to create a memory');
      return;
    }

    setIsCreating(true);
    setErrors({});
    
    try {
      console.log('🎭 Creating persona:', { personaType, memoryText: memoryText.slice(0, 50) + '...' });
      
      // Generate persona data using AI
      const personaData = await geminiService.createPersonaFromMemory(memoryText, personaType);
      
      // Prepare persona for database
      const newPersona = {
        name: personaName.trim() || personaData.name || `${personaType} Persona`,
        type: personaType,
        avatar: personaTypes.find(t => t.type === personaType)?.icon || '👤',
        description: personaData.description || memoryText.slice(0, 100) + '...',
        personality: personaData.personality || 'A warm and understanding persona',
        status: 'active' as const,
        memory_data: {
          traits: personaData.traits || ['caring', 'wise'],
          memories: personaData.memories || [memoryText],
          relationships: personaData.relationships || ['family'],
          goals: personaData.goals || [],
          timeContext: personaData.timeContext || '',
          backstory: personaData.backstory || ''
        }
      };

      console.log('💾 Saving persona to database:', newPersona);
      
      // Save to Supabase
      await addPersona(newPersona);
      
      toast.success(`${newPersona.name} created successfully! 🎉`);
      
      // Reset form and close
      resetForm();
      onClose();
      
    } catch (error) {
      console.error('❌ Error creating memory:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('not authenticated')) {
          toast.error('Please log in to create memories');
        } else if (error.message.includes('network')) {
          toast.error('Network error. Please check your connection.');
        } else {
          toast.error(`Failed to create memory: ${error.message}`);
        }
      } else {
        toast.error('Failed to create memory. Please try again.');
      }
      
      setErrors({ general: 'Failed to create memory. Please try again.' });
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setPersonaType('memory');
    setMemoryText('');
    setPersonaName('');
    setErrors({});
    setIsCreating(false);
  };

  const handleClose = () => {
    if (!isCreating) {
      resetForm();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-2xl bg-obsidian-900 rounded-3xl p-8 glass border border-white/20 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-premium flex items-center justify-center">
              <Brain className="w-6 h-6 text-obsidian-900" />
            </div>
            <div>
              <h2 className="font-manrope text-2xl font-bold text-white">Create Memory</h2>
              <p className="text-obsidian-400">Step {step} of 2</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isCreating}
            className="p-2 rounded-xl glass glass-hover disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Display */}
        <AnimatePresence>
          {errors.general && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 rounded-xl bg-coral-500/20 border border-coral-500/50 flex items-center space-x-3"
            >
              <AlertCircle className="w-5 h-5 text-coral-400 flex-shrink-0" />
              <p className="text-coral-200 text-sm">{errors.general}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 1: Choose Persona Type */}
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
                    className={`p-6 rounded-2xl text-left transition-all duration-300 border ${
                      personaType === type.type
                        ? `bg-gradient-to-r ${type.gradient} border-aurora-500/50`
                        : 'glass glass-hover border-white/10'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="text-3xl">{type.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white mb-2">{type.title}</h4>
                        <p className="text-obsidian-300 text-sm mb-3">{type.description}</p>
                        <div className="text-xs text-obsidian-400">
                          <p className="font-medium mb-1">Examples:</p>
                          <ul className="space-y-1">
                            {type.examples.map((example, idx) => (
                              <li key={idx}>• {example}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
              {errors.personaType && (
                <p className="text-coral-400 text-sm mt-2">{errors.personaType}</p>
              )}
            </div>

            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNextStep}
                className="btn-premium text-obsidian-900 font-bold"
              >
                Continue
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Memory Details */}
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
                  <label className="block text-sm font-medium text-obsidian-300 mb-2">
                    Persona Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={personaName}
                    onChange={(e) => setPersonaName(e.target.value)}
                    placeholder={`e.g., ${
                      personaType === 'memory' ? 'Mom, Grandpa, Best Friend' :
                      personaType === 'younger' ? 'Me at 16, College Me' :
                      'Future Me, Successful Me'
                    }`}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-aurora-400/50 focus:outline-none text-white placeholder-obsidian-400 transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-obsidian-300 mb-2">
                    Describe the Memory or Person *
                  </label>
                  <textarea
                    value={memoryText}
                    onChange={(e) => setMemoryText(e.target.value)}
                    placeholder={`Share details about this ${
                      personaType === 'memory' ? 'person' : 'version of yourself'
                    }. Include their personality, how they spoke, important moments you shared, their values, or anything that made them special...

Example: "My grandmother was the most caring person I knew. She always had a warm smile and would tell me stories about her childhood. She taught me to be kind to everyone and always said 'treat others how you want to be treated.' She loved baking cookies and would always have fresh ones when I visited. Her voice was gentle but strong, and she never let me leave without a hug and some life advice."`}
                    rows={8}
                    className={`w-full px-4 py-3 rounded-xl bg-white/5 border transition-all duration-300 text-white placeholder-obsidian-400 resize-none ${
                      errors.memoryText ? 'border-coral-500/50' : 'border-white/10 focus:border-aurora-400/50'
                    } focus:outline-none`}
                  />
                  <div className="flex justify-between items-center mt-2">
                    {errors.memoryText ? (
                      <p className="text-coral-400 text-sm">{errors.memoryText}</p>
                    ) : (
                      <p className="text-xs text-obsidian-400">
                        The more details you provide, the more authentic the conversations will be.
                      </p>
                    )}
                    <p className="text-xs text-obsidian-500">
                      {memoryText.length} characters
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep(1)}
                disabled={isCreating}
                className="px-6 py-3 glass glass-hover rounded-xl font-semibold text-white disabled:opacity-50"
              >
                Back
              </button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreateMemory}
                disabled={isCreating || !memoryText.trim()}
                className="flex items-center space-x-2 btn-premium text-obsidian-900 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
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