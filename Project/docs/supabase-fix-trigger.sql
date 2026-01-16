-- =====================================================
-- Fix the trigger function to work with RLS
-- =====================================================
-- Run this to update your existing trigger function
-- =====================================================

-- Update the function to include SECURITY DEFINER
-- This allows it to bypass RLS when creating profiles
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

  -- If EMPLOYEE role doesn't exist, raise exception
  IF employee_role_id IS NULL THEN
    RAISE EXCEPTION 'EMPLOYEE role not found';
  END IF;

  -- Assign default role
  INSERT INTO public.user_roles (user_id, role_id)
  VALUES (NEW.id, employee_role_id)
  ON CONFLICT (user_id, role_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- The trigger should already exist, but recreate it to be safe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
