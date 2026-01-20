-- =====================================================
-- Enforce Soft Delete on Employees Table
-- =====================================================
-- This ensures:
-- 1. Only HR/Admin can change employees.status
-- 2. No delete policies exist (soft delete only)
-- 3. Status changes are the only way to "delete" employees
-- =====================================================

-- Remove any existing delete policies to enforce soft delete
DROP POLICY IF EXISTS "Admins can delete employees" ON public.employees;
DROP POLICY IF EXISTS "HR can delete employees" ON public.employees;

-- Verify no delete policies exist
-- This query should return 0 rows
-- SELECT policyname FROM pg_policies 
-- WHERE tablename = 'employees' AND cmd = 'DELETE';

-- Note: The update policies already created ensure that:
-- 1. HR/Admin can update any employee record (including status)
--    via "HR and Admin can update any employee" policy
-- 2. Regular employees cannot update status field
--    via "Employees can update own non-HR fields" policy
--    which prevents changes to: department, designation, manager_id, status

-- =====================================================
-- Soft Delete Best Practices
-- =====================================================
-- To "delete" an employee, HR/Admin should:
-- UPDATE employees SET status = 'inactive' WHERE id = <employee_id>;

-- To "restore" an employee, HR/Admin should:
-- UPDATE employees SET status = 'active' WHERE id = <employee_id>;

-- =====================================================
-- Verification Queries
-- =====================================================

-- Confirm no delete policies exist
-- SELECT COUNT(*) as delete_policy_count
-- FROM pg_policies 
-- WHERE tablename = 'employees' AND cmd = 'DELETE';
-- Expected result: 0

-- View all policies on employees table
-- SELECT policyname, cmd, 
--   CASE 
--     WHEN cmd = 'SELECT' THEN 'Read'
--     WHEN cmd = 'INSERT' THEN 'Create'
--     WHEN cmd = 'UPDATE' THEN 'Update'
--     WHEN cmd = 'DELETE' THEN 'Delete'
--   END as operation
-- FROM pg_policies
-- WHERE tablename = 'employees'
-- ORDER BY cmd, policyname;

-- Test soft delete (HR/Admin only)
-- UPDATE employees 
-- SET status = 'inactive' 
-- WHERE id = '<employee_id>';

-- Query active employees only
-- SELECT * FROM employees WHERE status = 'active';

-- Query all employees (including inactive)
-- SELECT * FROM employees;
