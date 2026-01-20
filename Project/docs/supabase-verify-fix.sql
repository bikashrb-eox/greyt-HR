-- =====================================================
-- VERIFICATION: Check if the fix was applied
-- =====================================================
-- Run this in Supabase SQL Editor to verify the fix was applied correctly

-- 1. Check if the function exists
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public' 
  AND routine_name = 'get_my_role_names';

-- Expected: Should return 1 row showing the function exists

-- 2. Check current policies on employees table
SELECT policyname, cmd, qual
FROM pg_policies
WHERE tablename = 'employees'
  AND cmd = 'SELECT';

-- Expected: Should show "HR and Admin can read all employees" policy
-- The qual should contain 'get_my_role_names()' NOT 'user_role_view'

-- 3. Check current policies on user_roles table
SELECT policyname, cmd, qual
FROM pg_policies
WHERE tablename = 'user_roles'
  AND cmd = 'SELECT';

-- Expected: Should show policies including "Admins can view all user roles"
-- The qual should contain 'get_my_role_names()' NOT a subquery to user_roles

-- =====================================================
-- If the function doesn't exist or policies still reference
-- user_role_view or have subqueries to user_roles, 
-- the fix was NOT applied correctly.
-- =====================================================
