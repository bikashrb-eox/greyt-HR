-- =====================================================
-- FIX: Infinite Recursion in RLS Policies
-- =====================================================
-- The fetchEmployees query was timing out because of a circular dependency:
-- Employees Policy -> queries user_role_view -> queries user_roles -> triggers user_roles Policy -> queries user_roles -> LOOK!

-- We fix this by creating a SECURE function that bypasses RLS to check roles.

-- 1. Create helper function to check roles securely
CREATE OR REPLACE FUNCTION public.get_my_role_names()
RETURNS SETOF text
LANGUAGE sql
SECURITY DEFINER -- Crucial: Runs with owner permissions, bypassing RLS
SET search_path = public
STABLE
AS $$
  SELECT r.name
  FROM public.user_roles ur
  JOIN public.roles r ON ur.role_id = r.id
  WHERE ur.user_id = auth.uid();
$$;

-- Grant access to the function
GRANT EXECUTE ON FUNCTION public.get_my_role_names() TO authenticated;

-- 2. Update Employees Policy to use the helper function
DROP POLICY IF EXISTS "HR and Admin can read all employees" ON public.employees;

CREATE POLICY "HR and Admin can read all employees"
  ON public.employees
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM get_my_role_names() role
      WHERE role IN ('HR', 'ADMIN')
    )
  );

-- 3. Update User Roles Policy to use the helper function
DROP POLICY IF EXISTS "Admins can view all user roles" ON public.user_roles;

CREATE POLICY "Admins can view all user roles"
  ON public.user_roles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM get_my_role_names() role
      WHERE role = 'ADMIN'
    )
  );

-- 4. Ensure "Users can view own roles" is still there (it's safe)
-- (No change needed, but good to verify)
