-- =====================================================
-- Fix Supabase "Database error saving new user" Issue
-- =====================================================
-- Run this SQL in your Supabase SQL Editor
-- Dashboard > SQL Editor > New Query
-- =====================================================

-- Option 1: Create a basic profiles table and trigger (Recommended)
-- This is the most common setup that Supabase expects

-- Step 1: Create profiles table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Step 2: Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Step 3: Create policy to allow users to read their own profile
CREATE POLICY "Users can view own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

-- Step 4: Create policy to allow users to update their own profile
CREATE POLICY "Users can update own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Step 5: Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 6: Create trigger on auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- Option 2: If you don't need a profiles table,
-- check and remove any broken triggers
-- =====================================================

-- List all triggers on auth.users
-- SELECT * FROM pg_trigger WHERE tgrelid = 'auth.users'::regclass;

-- If you find a trigger causing issues, you can drop it:
-- DROP TRIGGER IF EXISTS <trigger_name> ON auth.users;

-- =====================================================
-- Verification: Test the setup
-- =====================================================
-- After running this, try signing up again.
-- You can verify the trigger works by checking:
-- SELECT * FROM public.profiles;
