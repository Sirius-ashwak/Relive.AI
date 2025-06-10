import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  initializeUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      initializeUser: () => {
        // Create a default user for demo purposes
        const defaultUser: User = {
          id: 'demo-user-1',
          email: 'demo@relive.ai',
          name: 'Demo User',
          subscription: 'free',
          createdAt: new Date(),
          avatar: '👤'
        };

        set({ user: defaultUser, isAuthenticated: true });
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const user: User = {
            id: '1',
            email,
            name: email.split('@')[0],
            subscription: 'free',
            createdAt: new Date(),
            avatar: '👤'
          };

          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (email: string, password: string, name: string) => {
        set({ isLoading: true });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const user: User = {
            id: Date.now().toString(),
            email,
            name,
            subscription: 'free',
            createdAt: new Date(),
            avatar: '👤'
          };

          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateUser: (updates: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...updates } });
        }
      }
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        // Initialize user if not already authenticated
        if (state && !state.isAuthenticated) {
          state.initializeUser();
        }
      }
    }
  )
);

// Initialize user on app start
if (typeof window !== 'undefined') {
  const store = useAuthStore.getState();
  if (!store.isAuthenticated) {
    store.initializeUser();
  }
}