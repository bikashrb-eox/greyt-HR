-- =====================================================
-- Make Employees Independent from Auth Users
-- =====================================================
-- This allows creating employee records without linking to auth.users
-- Employees will be standalone records with their own data

-- 1. Make user_id nullable
ALTER TABLE public.employees 
ALTER COLUMN user_id DROP NOT NULL;

-- 2. Drop unique constraint on user_id (if exists)
-- This allows multiple employees or no user_id at all
ALTER TABLE public.employees 
DROP CONSTRAINT IF EXISTS employees_user_id_key;

-- 3. Verify changes
-- SELECT column_name, is_nullable, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'employees' AND column_name = 'user_id';
