import React from 'react';
import { motion } from 'framer-motion';
import PersonaCard from './PersonaCard';
import { usePersonaStore } from '../store/personaStore';
import { Persona } from '../types';

interface PersonaGridProps {
  onStartChat: (persona: Persona) => void;
  onCreateMemory: () => void;
}

const PersonaGrid: React.FC<PersonaGridProps> = ({ onStartChat, onCreateMemory }) => {
  const { personas } = usePersonaStore();

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

  return (
    <section className="py-24 px-6 aurora-bg">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass text-sm font-medium mb-6"
          >
            <div className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse"></div>
            <span>Your Memory Personas</span>
          </motion.div>
          
          <h2 className="font-sora text-4xl md:text-6xl font-bold mb-6 gradient-text">
            Who will you talk to today?
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Choose from your memory companions - past loved ones, younger versions of yourself, 
            or future aspirations. Each persona learns and grows from your conversations.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {personas.map((persona) => (
            <motion.div key={persona.id} variants={itemVariants}>
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
        </motion.div>

        {/* Add new persona button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(94, 241, 255, 0.2)"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={onCreateMemory}
            className="inline-flex items-center space-x-3 px-8 py-4 rounded-2xl glass glass-hover border border-white/20 font-semibold text-white hover:border-accent-cyan/50 transition-all duration-300"
          >
            <div className="w-6 h-6 rounded-full border-2 border-dashed border-current flex items-center justify-center">
              <span className="text-sm">+</span>
            </div>
            <span>Create New Memory</span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default PersonaGrid;