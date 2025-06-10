import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Persona } from '../types';

interface PersonaState {
  personas: Persona[];
  activePersona: Persona | null;
  isLoading: boolean;
  addPersona: (persona: Omit<Persona, 'id' | 'createdAt'>) => void;
  updatePersona: (id: string, updates: Partial<Persona>) => void;
  deletePersona: (id: string) => void;
  setActivePersona: (persona: Persona | null) => void;
  getPersonasByType: (type: Persona['type']) => Persona[];
}

const defaultPersonas: Persona[] = [
  {
    id: '1',
    userId: '1',
    name: 'Mom (Age 45)',
    type: 'memory',
    avatar: '👩',
    description: 'Your loving mother who always knew the right words to say',
    personality: 'Warm, caring, wise, and always supportive. She has a gentle way of giving advice and making you feel loved.',
    status: 'active',
    lastInteraction: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    conversationCount: 23,
    memoryData: {
      traits: ['caring', 'wise', 'patient', 'loving'],
      memories: ['bedtime stories', 'cooking together', 'life advice'],
      relationships: ['mother-child bond', 'family traditions']
    },
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  },
  {
    id: '2',
    userId: '1',
    name: 'You at 16',
    type: 'younger',
    avatar: '🧑',
    description: 'Your teenage self, full of dreams and curiosity',
    personality: 'Energetic, curious, sometimes rebellious, full of dreams and aspirations. Asks lots of questions about the future.',
    status: 'learning',
    lastInteraction: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    conversationCount: 15,
    memoryData: {
      traits: ['curious', 'energetic', 'dreamy', 'ambitious'],
      memories: ['high school', 'first crush', 'future plans'],
      relationships: ['friends', 'family', 'teachers'],
      goals: ['graduate', 'go to college', 'change the world'],
      timeContext: 'teenage years'
    },
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
  },
  {
    id: '3',
    userId: '1',
    name: 'Future You (35)',
    type: 'future',
    avatar: '👨‍💼',
    description: 'Your successful future self with wisdom and experience',
    personality: 'Confident, wise, successful, and grounded. Offers practical advice based on experience and achievement.',
    status: 'active',
    lastInteraction: new Date(Date.now() - 24 * 60 * 60 * 1000),
    conversationCount: 31,
    memoryData: {
      traits: ['confident', 'wise', 'successful', 'balanced'],
      memories: ['career achievements', 'life lessons', 'relationships'],
      relationships: ['professional network', 'life partner', 'mentees'],
      goals: ['mentor others', 'build legacy', 'enjoy life'],
      timeContext: 'successful future'
    },
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
  }
];

export const usePersonaStore = create<PersonaState>()(
  persist(
    (set, get) => ({
      personas: defaultPersonas,
      activePersona: null,
      isLoading: false,

      addPersona: (personaData) => {
        const newPersona: Persona = {
          ...personaData,
          id: Date.now().toString(),
          createdAt: new Date()
        };
        set(state => ({ personas: [...state.personas, newPersona] }));
      },

      updatePersona: (id, updates) => {
        set(state => ({
          personas: state.personas.map(persona =>
            persona.id === id ? { ...persona, ...updates } : persona
          )
        }));
      },

      deletePersona: (id) => {
        set(state => ({
          personas: state.personas.filter(persona => persona.id !== id),
          activePersona: state.activePersona?.id === id ? null : state.activePersona
        }));
      },

      setActivePersona: (persona) => {
        set({ activePersona: persona });
      },

      getPersonasByType: (type) => {
        return get().personas.filter(persona => persona.type === type);
      }
    }),
    {
      name: 'persona-storage',
    }
  )
);