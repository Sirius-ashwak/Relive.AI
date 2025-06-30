import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Database } from '../types/database';
import { useAuthStore } from './authStore';

type Persona = Database['public']['Tables']['personas']['Row'];
type PersonaInsert = Database['public']['Tables']['personas']['Insert'];
type PersonaUpdate = Database['public']['Tables']['personas']['Update'];

interface PersonaState {
  personas: Persona[];
  activePersona: Persona | null;
  isLoading: boolean;
  fetchPersonas: () => Promise<void>;
  addPersona: (persona: Omit<PersonaInsert, 'user_id'>) => Promise<void>;
  updatePersona: (id: string, updates: PersonaUpdate) => Promise<void>;
  deletePersona: (id: string) => Promise<void>;
  setActivePersona: (persona: Persona | null) => void;
  getPersonasByType: (type: Persona['type']) => Persona[];
}

export const usePersonaStore = create<PersonaState>((set, get) => ({
  personas: [],
  activePersona: null,
  isLoading: false,

  fetchPersonas: async () => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('personas')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      set({ personas: data || [], isLoading: false });
    } catch (error) {
      console.error('Error fetching personas:', error);
      set({ isLoading: false });
    }
  },

  addPersona: async (personaData) => {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('personas')
        .insert({
          ...personaData,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        personas: [data, ...state.personas]
      }));
    } catch (error) {
      console.error('Error adding persona:', error);
      throw error;
    }
  },

  updatePersona: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('personas')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        personas: state.personas.map(persona =>
          persona.id === id ? data : persona
        ),
        activePersona: state.activePersona?.id === id ? data : state.activePersona
      }));
    } catch (error) {
      console.error('Error updating persona:', error);
      throw error;
    }
  },

  deletePersona: async (id) => {
    try {
      const { error } = await supabase
        .from('personas')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        personas: state.personas.filter(persona => persona.id !== id),
        activePersona: state.activePersona?.id === id ? null : state.activePersona
      }));
    } catch (error) {
      console.error('Error deleting persona:', error);
      throw error;
    }
  },

  setActivePersona: (persona) => {
    set({ activePersona: persona });
  },

  getPersonasByType: (type) => {
    return get().personas.filter(persona => persona.type === type);
  }
}));