import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if we have the required environment variables and they're not placeholder values
const isSupabaseConfigured = () => {
  return !!(
    supabaseUrl && 
    supabaseAnonKey && 
    supabaseUrl !== 'your_supabase_project_url' && 
    supabaseAnonKey !== 'your_supabase_anon_key' &&
    supabaseUrl.includes('supabase.co') &&
    supabaseAnonKey.length > 20
  );
};

// Check if we have the required environment variables
if (!isSupabaseConfigured()) {
  console.warn('⚠️ Supabase environment variables not found or are placeholder values. Using demo mode.');
  console.warn('To enable full functionality, add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file');
}

// Create a mock client if environment variables are missing
const createMockClient = () => ({
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    signInWithPassword: () => Promise.reject(new Error('Supabase not configured')),
    signUp: () => Promise.reject(new Error('Supabase not configured')),
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
  },
  from: () => ({
    select: () => ({ eq: () => ({ order: () => Promise.resolve({ data: [], error: null }) }) }),
    insert: () => ({ select: () => ({ single: () => Promise.reject(new Error('Supabase not configured')) }) }),
    update: () => ({ eq: () => ({ select: () => ({ single: () => Promise.reject(new Error('Supabase not configured')) }) }) }),
    delete: () => ({ eq: () => Promise.reject(new Error('Supabase not configured')) })
  })
});

export const supabase = isSupabaseConfigured() 
  ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  : createMockClient() as any;

// Helper functions for common operations
export const getCurrentUser = async () => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured. Please add environment variables.');
  }
  
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

export const signOut = async () => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured. Please add environment variables.');
  }
  
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const signInWithEmail = async (email: string, password: string) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file to enable authentication.');
  }
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) throw error;
  return data;
};

export const signUpWithEmail = async (email: string, password: string, name: string) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file to enable authentication.');
  }
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name
      }
    }
  });
  if (error) throw error;
  return data;
};

// Export the configuration check function
export { isSupabaseConfigured };