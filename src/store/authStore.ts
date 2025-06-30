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

// Helper function to validate UUID format
const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

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
              // Check if profile exists in profiles table
              const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', data.user.id)
                .single();

              let profile = profileData;

              // If profile doesn't exist, create it
              if (profileError && profileError.code === 'PGRST116') {
                const newProfile = {
                  id: data.user.id,
                  email: data.user.email || email,
                  name: data.user.user_metadata?.name || email.split('@')[0],
                  avatar: '👤',
                  subscription: 'free',
                  preferences: {
                    theme: 'dark',
                    autoSave: true,
                    notifications: true
                  }
                };

                const { data: insertedProfile, error: insertError } = await supabase
                  .from('profiles')
                  .insert(newProfile)
                  .select()
                  .single();

                if (insertError) {
                  throw new Error(`Failed to create profile: ${insertError.message}`);
                }

                profile = insertedProfile;
              } else if (profileError) {
                throw new Error(`Failed to fetch profile: ${profileError.message}`);
              }

              const user: User = {
                id: profile.id,
                email: profile.email,
                name: profile.name,
                subscription: profile.subscription || 'free',
                createdAt: new Date(profile.created_at),
                avatar: profile.avatar || '👤'
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
              // Create profile in profiles table
              const newProfile = {
                id: data.user.id,
                email: data.user.email || email,
                name: name,
                avatar: '👤',
                subscription: 'free',
                preferences: {
                  theme: 'dark',
                  autoSave: true,
                  notifications: true
                }
              };

              const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .insert(newProfile)
                .select()
                .single();

              if (profileError) {
                // If profile creation fails, we should still handle the case gracefully
                console.error('Profile creation error:', profileError);
                // Don't throw here as the user is already created in auth
              }

              const profile = profileData || newProfile;

              const user: User = {
                id: profile.id,
                email: profile.email,
                name: profile.name,
                subscription: profile.subscription || 'free',
                createdAt: new Date(profile.created_at || new Date()),
                avatar: profile.avatar || '👤'
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
        if (state) {
          const isSupabaseConfiguredNow = isSupabaseConfigured();
          
          // If Supabase is configured and we have a user with invalid UUID or demo user, clear auth
          if (isSupabaseConfiguredNow && state.user) {
            const hasInvalidUUID = !isValidUUID(state.user.id);
            const isDemoUser = state.user.email === 'demo@relive.ai';
            
            if (hasInvalidUUID || isDemoUser) {
              // Clear the authentication state to force re-login with valid Supabase credentials
              state.user = null;
              state.isAuthenticated = false;
              return;
            }
          }
          
          // If Supabase is not configured and we don't have a valid authenticated user, initialize demo user
          if (!isSupabaseConfiguredNow && !state.isAuthenticated) {
            state.initializeUser();
          }
        }
      }
    }
  )
);