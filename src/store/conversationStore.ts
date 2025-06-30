import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Database } from '../types/database';
import { useAuthStore } from './authStore';

type Conversation = Database['public']['Tables']['conversations']['Row'];
type ConversationInsert = Database['public']['Tables']['conversations']['Insert'];
type Message = Database['public']['Tables']['messages']['Row'];
type MessageInsert = Database['public']['Tables']['messages']['Insert'];

interface ConversationWithMessages extends Conversation {
  messages: Message[];
}

interface ConversationState {
  conversations: ConversationWithMessages[];
  activeConversation: ConversationWithMessages | null;
  isLoading: boolean;
  fetchConversations: () => Promise<void>;
  createConversation: (personaId: string, title?: string) => Promise<string>;
  addMessage: (conversationId: string, message: Omit<MessageInsert, 'conversation_id'>) => Promise<void>;
  setActiveConversation: (conversation: ConversationWithMessages | null) => void;
  getConversationsByPersona: (personaId: string) => ConversationWithMessages[];
  endConversation: (conversationId: string) => Promise<void>;
}

export const useConversationStore = create<ConversationState>((set, get) => ({
  conversations: [],
  activeConversation: null,
  isLoading: false,

  fetchConversations: async () => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    set({ isLoading: true });
    try {
      // Fetch conversations with their messages
      const { data: conversations, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('last_message_at', { ascending: false });

      if (convError) throw convError;

      // Fetch messages for each conversation
      const conversationsWithMessages = await Promise.all(
        (conversations || []).map(async (conv) => {
          const { data: messages, error: msgError } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: true });

          if (msgError) throw msgError;

          return {
            ...conv,
            messages: messages || []
          };
        })
      );

      set({ conversations: conversationsWithMessages, isLoading: false });
    } catch (error) {
      console.error('Error fetching conversations:', error);
      set({ isLoading: false });
    }
  },

  createConversation: async (personaId: string, title?: string) => {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          persona_id: personaId,
          user_id: user.id,
          title: title || `Conversation ${new Date().toLocaleDateString()}`
        })
        .select()
        .single();

      if (error) throw error;

      const newConversation: ConversationWithMessages = {
        ...data,
        messages: []
      };

      set(state => ({
        conversations: [newConversation, ...state.conversations],
        activeConversation: newConversation
      }));

      return data.id;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  },

  addMessage: async (conversationId: string, messageData) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          ...messageData,
          conversation_id: conversationId
        })
        .select()
        .single();

      if (error) throw error;

      // Update conversation's last_message_at
      await supabase
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', conversationId);

      set(state => ({
        conversations: state.conversations.map(conv =>
          conv.id === conversationId
            ? {
                ...conv,
                messages: [...conv.messages, data],
                last_message_at: new Date().toISOString()
              }
            : conv
        ),
        activeConversation: state.activeConversation?.id === conversationId
          ? {
              ...state.activeConversation,
              messages: [...state.activeConversation.messages, data],
              last_message_at: new Date().toISOString()
            }
          : state.activeConversation
      }));
    } catch (error) {
      console.error('Error adding message:', error);
      throw error;
    }
  },

  setActiveConversation: (conversation) => {
    set({ activeConversation: conversation });
  },

  getConversationsByPersona: (personaId) => {
    return get().conversations.filter(conv => conv.persona_id === personaId);
  },

  endConversation: async (conversationId) => {
    try {
      const { error } = await supabase
        .from('conversations')
        .update({ is_active: false })
        .eq('id', conversationId);

      if (error) throw error;

      set(state => ({
        conversations: state.conversations.map(conv =>
          conv.id === conversationId
            ? { ...conv, is_active: false }
            : conv
        ),
        activeConversation: state.activeConversation?.id === conversationId
          ? null
          : state.activeConversation
      }));
    } catch (error) {
      console.error('Error ending conversation:', error);
      throw error;
    }
  }
}));