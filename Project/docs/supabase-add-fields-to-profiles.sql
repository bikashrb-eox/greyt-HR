-- =====================================================
-- Add Department and Designation to Profiles Table
-- =====================================================
-- This migration adds department and designation fields
-- to the profiles table to keep it as the source of
-- personal and professional information
-- =====================================================

-- Add department and designation columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS department text,
ADD COLUMN IF NOT EXISTS designation text;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_department ON public.profiles(department);
CREATE INDEX IF NOT EXISTS idx_profiles_designation ON public.profiles(designation);

-- =====================================================
-- Verification Queries
-- =====================================================

-- Check if columns were added
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_schema = 'public' 
--   AND table_name = 'profiles'
--   AND column_name IN ('department', 'designation');

-- View profiles with new fields
-- SELECT id, email, department, designation, status
-- FROM public.profiles;
