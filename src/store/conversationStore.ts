import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Conversation, Message } from '../types';

interface ConversationState {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  isLoading: boolean;
  createConversation: (personaId: string, userId: string) => string;
  addMessage: (conversationId: string, message: Omit<Message, 'id' | 'timestamp'>) => void;
  setActiveConversation: (conversation: Conversation | null) => void;
  getConversationsByPersona: (personaId: string) => Conversation[];
  endConversation: (conversationId: string) => void;
}

export const useConversationStore = create<ConversationState>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversation: null,
      isLoading: false,

      createConversation: (personaId: string, userId: string) => {
        const newConversation: Conversation = {
          id: Date.now().toString(),
          personaId,
          userId,
          title: `Conversation ${new Date().toLocaleDateString()}`,
          messages: [],
          startedAt: new Date(),
          lastMessageAt: new Date(),
          duration: 0,
          isActive: true
        };

        set(state => ({
          conversations: [...state.conversations, newConversation],
          activeConversation: newConversation
        }));

        return newConversation.id;
      },

      addMessage: (conversationId: string, messageData) => {
        const newMessage: Message = {
          ...messageData,
          id: Date.now().toString(),
          timestamp: new Date()
        };

        set(state => ({
          conversations: state.conversations.map(conv =>
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: [...conv.messages, newMessage],
                  lastMessageAt: new Date()
                }
              : conv
          ),
          activeConversation: state.activeConversation?.id === conversationId
            ? {
                ...state.activeConversation,
                messages: [...state.activeConversation.messages, newMessage],
                lastMessageAt: new Date()
              }
            : state.activeConversation
        }));
      },

      setActiveConversation: (conversation) => {
        set({ activeConversation: conversation });
      },

      getConversationsByPersona: (personaId) => {
        return get().conversations.filter(conv => conv.personaId === personaId);
      },

      endConversation: (conversationId) => {
        set(state => ({
          conversations: state.conversations.map(conv =>
            conv.id === conversationId
              ? { ...conv, isActive: false }
              : conv
          ),
          activeConversation: state.activeConversation?.id === conversationId
            ? null
            : state.activeConversation
        }));
      }
    }),
    {
      name: 'conversation-storage',
    }
  )
);