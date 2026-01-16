-- =====================================================
-- Row Level Security (RLS) Policies for Supabase
-- =====================================================
-- Run this SQL in your Supabase SQL Editor AFTER
-- creating the tables and triggers
-- =====================================================

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Policy: Service role can insert profiles (for triggers)
-- This is handled by the trigger function with SECURITY DEFINER

-- Enable RLS on roles table
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone authenticated can view roles
CREATE POLICY "Authenticated users can view roles" 
  ON public.roles 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Enable RLS on user_roles table
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own roles
CREATE POLICY "Users can view own roles" 
  ON public.user_roles 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy: Admins can view all user roles
CREATE POLICY "Admins can view all user roles"
ON public.user_roles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid()
    AND r.name = 'ADMIN'
  )
);

-- Allow ADMIN to insert roles for users
CREATE POLICY "Admins can assign roles"
ON public.user_roles
FOR INSERT
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid()
    AND r.name = 'ADMIN'
  )
);

-- Allow ADMIN to delete roles
CREATE POLICY "Admins can remove roles"
ON public.user_roles
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid()
    AND r.name = 'ADMIN'
  )
);

-- Policy: Service role can insert user_roles (for triggers)
-- This is handled by the trigger function with SECURITY DEFINER

-- Optional: Allow admins to view all profiles
-- Uncomment if you want admins to see all user profiles
CREATE POLICY "Admins can view all profiles" 
  ON public.profiles 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'ADMIN'
    )
  );

-- Optional: Allow managers to view employee profiles
-- Uncomment if you want managers to see employee profiles
/*
CREATE POLICY "Managers can view employee profiles" 
  ON public.profiles 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name IN ('ADMIN', 'MANAGER')
    )
  );
*/
