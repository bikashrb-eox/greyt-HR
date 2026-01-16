-- =====================================================
-- Complete Supabase Database Setup with Roles
-- =====================================================
-- Run this SQL in your Supabase SQL Editor
-- This includes all tables, triggers, and RLS policies
-- =====================================================

-- Step 1: Create roles table
CREATE TABLE IF NOT EXISTS public.roles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text UNIQUE NOT NULL
);

-- Step 2: Insert default roles
INSERT INTO public.roles (name) VALUES
  ('ADMIN'),
  ('MANAGER'),
  ('EMPLOYEE')
ON CONFLICT (name) DO NOTHING;

-- Step 3: Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text,
  status text DEFAULT 'ACTIVE',
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Step 4: Create user_roles junction table
CREATE TABLE IF NOT EXISTS public.user_roles (
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  role_id uuid REFERENCES public.roles(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, role_id)
);

-- Step 5: Create function to handle new user signup
-- Note: SECURITY DEFINER allows the function to bypass RLS
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  employee_role_id uuid;
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;

  -- Fetch role ID safely
  SELECT id INTO employee_role_id
  FROM public.roles
  WHERE name = 'EMPLOYEE';

  -- If EMPLOYEE role doesn't exist, create it
  IF employee_role_id IS NULL THEN
    INSERT INTO public.roles (name) VALUES ('EMPLOYEE') RETURNING id INTO employee_role_id;
  END IF;

  -- Assign default role
  INSERT INTO public.user_roles (user_id, role_id)
  VALUES (NEW.id, employee_role_id)
  ON CONFLICT (user_id, role_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 6: Create trigger on auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Step 7: Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Step 8: Create RLS Policies for profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Step 9: Create RLS Policies for roles
DROP POLICY IF EXISTS "Authenticated users can view roles" ON public.roles;
CREATE POLICY "Authenticated users can view roles" 
  ON public.roles 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Step 10: Create RLS Policies for user_roles
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
CREATE POLICY "Users can view own roles" 
  ON public.user_roles 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Step 11: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON public.user_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- =====================================================
-- Verification Queries
-- =====================================================

-- Check if tables exist
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' AND table_name IN ('roles', 'profiles', 'user_roles');

-- Check roles
-- SELECT * FROM public.roles;

-- Check profiles (after signup)
-- SELECT * FROM public.profiles;

-- Check user roles (after signup)
-- SELECT 
--   p.email,
--   r.name as role_name
-- FROM public.profiles p
-- JOIN public.user_roles ur ON p.id = ur.user_id
-- JOIN public.roles r ON ur.role_id = r.id;
