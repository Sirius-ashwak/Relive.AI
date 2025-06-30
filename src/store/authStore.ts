import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';
import { jsonDateReviver } from '../lib/utils';
import { isSupabaseConfigured } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

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
        // Only create a demo user if Supabase is not configured
        if (!isSupabaseConfigured()) {
          const defaultUser: User = {
            id: uuidv4(), // Use proper UUID for demo user
            email: 'demo@relive.ai',
            name: 'Demo User',
            subscription: 'free',
            createdAt: new Date(),
            avatar: '👤'
          };

          set({ user: defaultUser, isAuthenticated: true });
        }
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
          } else {
            // Fallback to demo mode for specific demo credentials when Supabase is not configured
            if (email === 'demo@relive.ai' && password === 'demo123456') {
              const user: User = {
                id: uuidv4(), // Use proper UUID for demo user
                email: 'demo@relive.ai',
                name: 'Demo User',
                subscription: 'free',
                createdAt: new Date(),
                avatar: '👤'
              };

              set({ user, isAuthenticated: true, isLoading: false });
              return;
            }
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
          } else {
            // Fallback to demo mode when Supabase is not configured
            const user: User = {
              id: uuidv4(), // Use proper UUID for demo user
              email,
              name,
              subscription: 'free',
              createdAt: new Date(),
              avatar: '👤'
            };

            set({ user, isAuthenticated: true, isLoading: false });
          }

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