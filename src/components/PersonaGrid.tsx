import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import PersonaCard from './PersonaCard';
import { usePersonaStore } from '../store/personaStore';
import { useAuthStore } from '../store/authStore';
import { Database } from '../types/database';
import { Plus, Users, Sparkles } from 'lucide-react';

type Persona = Database['public']['Tables']['personas']['Row'];

interface PersonaGridProps {
  onStartChat: (persona: Persona) => void;
  onCreateMemory: () => void;
}

const PersonaGrid: React.FC<PersonaGridProps> = ({ onStartChat, onCreateMemory }) => {
  const { personas, isLoading, fetchPersonas } = usePersonaStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      fetchPersonas();
    }
  }, [user, fetchPersonas]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.6, 0.01, 0.05, 0.9] }
    }
  };

  if (isLoading) {
    return (
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-manrope text-4xl md:text-6xl font-bold mb-6 gradient-text">
              Loading Your Personas...
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card-premium animate-pulse">
                <div className="h-48 bg-white/5 rounded-xl"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass text-sm font-medium mb-6"
          >
            <Users className="w-4 h-4 text-aurora-400" />
            <span>Your Memory Personas</span>
          </motion.div>
          
          <h2 className="font-manrope text-3xl md:text-5xl font-bold mb-6 gradient-text">
            Who will you talk to today?
          </h2>
          
          <p className="text-lg text-obsidian-300 max-w-3xl mx-auto leading-relaxed">
            Choose from your memory companions - past loved ones, younger versions of yourself, 
            or future aspirations. Each persona learns and grows from your conversations.
          </p>
        </motion.div>

        {personas.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 rounded-3xl bg-gradient-premium p-1 mx-auto mb-6">
              <div className="w-full h-full rounded-3xl bg-obsidian-800 flex items-center justify-center">
                <Users className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-4">No Personas Yet</h3>
            <p className="text-obsidian-300 mb-8 max-w-md mx-auto">
              Create your first memory persona to start having meaningful conversations with AI companions.
            </p>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCreateMemory}
              className="btn-premium text-obsidian-900 font-bold flex items-center space-x-3 mx-auto"
            >
              <Plus className="w-5 h-5" />
              <span>Create Your First Memory</span>
            </motion.button>
          </motion.div>
        ) : (
          <>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {personas.map((persona) => (
                <motion.div key={persona.id} variants={itemVariants}>
                  <PersonaCard
                    persona={persona}
                    onStartChat={onStartChat}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Add new persona button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-12 text-center"
            >
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(14, 165, 233, 0.2)"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={onCreateMemory}
                className="inline-flex items-center space-x-3 px-8 py-4 rounded-2xl glass glass-hover border border-white/20 font-semibold text-white hover:border-aurora-400/50 transition-all duration-300"
              >
                <div className="w-6 h-6 rounded-full border-2 border-dashed border-current flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <span>Create New Memory</span>
                <Sparkles className="w-5 h-5 text-aurora-400" />
              </motion.button>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
};

export default PersonaGrid;