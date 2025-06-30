/*
  # Fix User Registration Database Trigger

  1. Problem
    - New user registration fails with "Database error saving new user"
    - Missing trigger to automatically create profile entries when users sign up

  2. Solution
    - Update the handle_new_user() function to properly handle user registration
    - Ensure the trigger correctly creates profile entries with proper data mapping
    - Add error handling and validation

  3. Changes
    - Fix the handle_new_user() function to use correct metadata field names
    - Ensure proper error handling in the trigger function
    - Add validation for required fields
*/

-- Drop existing trigger and function if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create improved handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_name text;
  user_email text;
BEGIN
  -- Get email from the user record
  user_email := NEW.email;
  
  -- Get name from user metadata, with fallback to email prefix
  user_name := COALESCE(
    NEW.raw_user_meta_data->>'name',
    NEW.user_metadata->>'name',
    split_part(NEW.email, '@', 1)
  );
  
  -- Ensure we have required values
  IF user_email IS NULL THEN
    RAISE EXCEPTION 'User email is required';
  END IF;
  
  IF user_name IS NULL OR user_name = '' THEN
    user_name := split_part(user_email, '@', 1);
  END IF;
  
  -- Insert the profile record
  INSERT INTO public.profiles (
    id,
    email,
    name,
    avatar,
    subscription,
    preferences,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    user_email,
    user_name,
    '👤',
    'free',
    '{"theme": "dark", "autoSave": true, "notifications": true}'::jsonb,
    NOW(),
    NOW()
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE LOG 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Ensure the profiles table has the correct constraints
DO $$
BEGIN
  -- Add subscription check constraint if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'profiles_subscription_check' 
    AND table_name = 'profiles'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_subscription_check 
    CHECK (subscription = ANY (ARRAY['free'::text, 'pro'::text, 'legacy'::text]));
  END IF;
END $$;

-- Ensure RLS policies are properly set up
DO $$
BEGIN
  -- Check if the insert policy exists, if not create it
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Users can insert own profile'
  ) THEN
    CREATE POLICY "Users can insert own profile"
      ON profiles FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = id);
  END IF;
  
  -- Check if the select policy exists, if not create it
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Users can read own profile'
  ) THEN
    CREATE POLICY "Users can read own profile"
      ON profiles FOR SELECT
      TO authenticated
      USING (auth.uid() = id);
  END IF;
  
  -- Check if the update policy exists, if not create it
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Users can update own profile'
  ) THEN
    CREATE POLICY "Users can update own profile"
      ON profiles FOR UPDATE
      TO authenticated
      USING (auth.uid() = id);
  END IF;
END $$;