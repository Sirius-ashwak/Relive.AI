import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';
import { jsonDateReviver } from '../lib/utils';

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

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return supabaseUrl && supabaseKey && 
         supabaseUrl !== 'your_supabase_project_url' && 
         supabaseKey !== 'your_supabase_anon_key';
};

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
          if (isSupabaseConfigured()) {
            // Try to use Supabase authentication
            const { createClient } = await import('@supabase/supabase-js');
            const supabase = createClient(
              import.meta.env.VITE_SUPABASE_URL,
              import.meta.env.VITE_SUPABASE_ANON_KEY
            );

            const { data, error } = await supabase.auth.signInWithPassword({
              email,
              password,
            });

            if (error) {
              throw new Error(error.message);
            }

            if (data.user) {
              const user: User = {
                id: data.user.id,
                email: data.user.email || email,
                name: data.user.user_metadata?.name || email.split('@')[0],
                subscription: 'free',
                createdAt: new Date(data.user.created_at),
                avatar: '👤'
              };

              set({ user, isAuthenticated: true, isLoading: false });
              return;
            }
          }

          // Fallback to demo mode for specific demo credentials
          if (email === 'demo@relive.ai' && password === 'demo123456') {
            const user: User = {
              id: 'demo-user-1',
              email: 'demo@relive.ai',
              name: 'Demo User',
              subscription: 'free',
              createdAt: new Date(),
              avatar: '👤'
            };

            set({ user, isAuthenticated: true, isLoading: false });
            return;
          }

          // If not demo credentials and no Supabase, throw error
          throw new Error('Invalid login credentials. Please check your email and password, or try creating a new account.');

        } catch (error: any) {
          set({ isLoading: false });
          console.error('Login error:', error);
          throw error;
        }
      },

      register: async (email: string, password: string, name: string) => {
        set({ isLoading: true });
        
        try {
          if (isSupabaseConfigured()) {
            // Try to use Supabase authentication
            const { createClient } = await import('@supabase/supabase-js');
            const supabase = createClient(
              import.meta.env.VITE_SUPABASE_URL,
              import.meta.env.VITE_SUPABASE_ANON_KEY
            );

            const { data, error } = await supabase.auth.signUp({
              email,
              password,
              options: {
                data: {
                  name: name,
                }
              }
            });

            if (error) {
              throw new Error(error.message);
            }

            if (data.user) {
              const user: User = {
                id: data.user.id,
                email: data.user.email || email,
                name: name,
                subscription: 'free',
                createdAt: new Date(data.user.created_at),
                avatar: '👤'
              };

              set({ user, isAuthenticated: true, isLoading: false });
              return;
            }
          }

          // Fallback to demo mode
          const user: User = {
            id: Date.now().toString(),
            email,
            name,
            subscription: 'free',
            createdAt: new Date(),
            avatar: '👤'
          };

          set({ user, isAuthenticated: true, isLoading: false });

        } catch (error: any) {
          set({ isLoading: false });
          console.error('Registration error:', error);
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
      deserialize: (str) => {
        try {
          return JSON.parse(str, jsonDateReviver);
        } catch {
          return { state: { user: null, isAuthenticated: false, isLoading: false } };
        }
      },
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