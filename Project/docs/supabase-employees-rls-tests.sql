-- =====================================================
-- Employee RLS Policy Test Cases
-- =====================================================
-- These test cases validate Row Level Security policies
-- for the employees table
-- =====================================================

-- =====================================================
-- SETUP: Create Test Users and Assign Roles
-- =====================================================

-- Note: You'll need to create these users in Supabase Auth first
-- and replace the UUIDs below with actual user IDs

-- Test User IDs (replace with actual UUIDs from your Supabase Auth)
-- HR User: <hr_user_id>
-- Admin User: <admin_user_id>
-- Employee User: <employee_user_id>

-- Assign HR role to HR user
-- INSERT INTO public.user_roles (user_id, role_id)
-- SELECT '<hr_user_id>', id FROM public.roles WHERE name = 'HR'
-- ON CONFLICT DO NOTHING;

-- Assign ADMIN role to Admin user
-- INSERT INTO public.user_roles (user_id, role_id)
-- SELECT '<admin_user_id>', id FROM public.roles WHERE name = 'ADMIN'
-- ON CONFLICT DO NOTHING;

-- Assign EMPLOYEE role to Employee user
-- INSERT INTO public.user_roles (user_id, role_id)
-- SELECT '<employee_user_id>', id FROM public.roles WHERE name = 'EMPLOYEE'
-- ON CONFLICT DO NOTHING;

-- =====================================================
-- TEST CASE 1: HR/Admin Can Create Employee
-- =====================================================

-- Test 1a: HR user can create employee
-- Run this as HR user (set auth.uid() to hr_user_id)
-- Expected: SUCCESS

/*
INSERT INTO public.employees (
  user_id,
  profile_id,
  department,
  designation,
  status
) VALUES (
  '<new_employee_user_id>',
  '<new_employee_profile_id>',
  'Engineering',
  'Software Developer',
  'active'
);

-- Verify creation
SELECT * FROM public.employees 
WHERE user_id = '<new_employee_user_id>';

-- Expected: 1 row returned with the new employee
*/

-- Test 1b: Admin user can create employee
-- Run this as Admin user (set auth.uid() to admin_user_id)
-- Expected: SUCCESS

/*
INSERT INTO public.employees (
  user_id,
  profile_id,
  department,
  designation,
  status
) VALUES (
  '<another_employee_user_id>',
  '<another_employee_profile_id>',
  'Human Resources',
  'HR Specialist',
  'active'
);

-- Verify creation
SELECT * FROM public.employees 
WHERE user_id = '<another_employee_user_id>';

-- Expected: 1 row returned with the new employee
*/

-- =====================================================
-- TEST CASE 2: Employee Cannot Create Employee
-- =====================================================

-- Test 2: Regular employee tries to create employee
-- Run this as Employee user (set auth.uid() to employee_user_id)
-- Expected: FAILURE (RLS policy violation)

/*
INSERT INTO public.employees (
  user_id,
  profile_id,
  department,
  designation,
  status
) VALUES (
  '<unauthorized_employee_user_id>',
  '<unauthorized_employee_profile_id>',
  'Finance',
  'Accountant',
  'active'
);

-- Expected: ERROR - new row violates row-level security policy
-- Error message: "new row violates row-level security policy for table 'employees'"
*/

-- =====================================================
-- TEST CASE 3: Employee Sees Only Own Record
-- =====================================================

-- Test 3a: Employee queries all employees
-- Run this as Employee user (set auth.uid() to employee_user_id)
-- Expected: Only sees their own record

/*
SELECT 
  id,
  user_id,
  department,
  designation,
  status
FROM public.employees;

-- Expected: Only 1 row returned (the employee's own record)
-- WHERE user_id = auth.uid()
*/

-- Test 3b: Employee tries to query specific other employee
-- Run this as Employee user (set auth.uid() to employee_user_id)
-- Expected: No results

/*
SELECT 
  id,
  user_id,
  department,
  designation,
  status
FROM public.employees
WHERE user_id = '<other_employee_user_id>';

-- Expected: 0 rows returned (cannot see other employees)
*/

-- Test 3c: HR user queries all employees
-- Run this as HR user (set auth.uid() to hr_user_id)
-- Expected: Sees all employee records

/*
SELECT 
  id,
  user_id,
  department,
  designation,
  status
FROM public.employees;

-- Expected: All employee records returned
*/

-- =====================================================
-- TEST CASE 4: HR/Admin Can Deactivate Employee
-- =====================================================

-- Test 4a: HR user can deactivate employee
-- Run this as HR user (set auth.uid() to hr_user_id)
-- Expected: SUCCESS

/*
UPDATE public.employees
SET status = 'inactive'
WHERE user_id = '<employee_to_deactivate_user_id>';

-- Verify deactivation
SELECT user_id, status 
FROM public.employees 
WHERE user_id = '<employee_to_deactivate_user_id>';

-- Expected: status = 'inactive'
*/

-- Test 4b: Admin user can deactivate employee
-- Run this as Admin user (set auth.uid() to admin_user_id)
-- Expected: SUCCESS

/*
UPDATE public.employees
SET status = 'inactive'
WHERE user_id = '<another_employee_to_deactivate_user_id>';

-- Verify deactivation
SELECT user_id, status 
FROM public.employees 
WHERE user_id = '<another_employee_to_deactivate_user_id>';

-- Expected: status = 'inactive'
*/

-- Test 4c: Employee cannot deactivate themselves
-- Run this as Employee user (set auth.uid() to employee_user_id)
-- Expected: FAILURE (cannot update status field)

/*
UPDATE public.employees
SET status = 'inactive'
WHERE user_id = auth.uid();

-- Expected: ERROR - new row violates row-level security policy
-- The "Employees can update own non-HR fields" policy prevents status changes
*/

-- Test 4d: Employee cannot deactivate other employees
-- Run this as Employee user (set auth.uid() to employee_user_id)
-- Expected: FAILURE (cannot see other employees)

/*
UPDATE public.employees
SET status = 'inactive'
WHERE user_id = '<other_employee_user_id>';

-- Expected: 0 rows updated (cannot access other employee records)
*/

-- =====================================================
-- ADDITIONAL TEST CASES
-- =====================================================

-- Test 5: Verify no delete operations are allowed
-- Run this as any user
-- Expected: FAILURE (no delete policy exists)

/*
DELETE FROM public.employees
WHERE user_id = '<any_employee_user_id>';

-- Expected: ERROR - no policy allows DELETE
-- Error message: "new row violates row-level security policy for table 'employees'"
*/

-- Test 6: Verify audit fields are auto-populated
-- Run this as HR user
-- Expected: created_by and updated_by are set automatically

/*
INSERT INTO public.employees (
  user_id,
  profile_id,
  department,
  designation,
  status
) VALUES (
  '<test_audit_user_id>',
  '<test_audit_profile_id>',
  'Marketing',
  'Marketing Manager',
  'active'
);

-- Check audit fields (internal query, not exposed to frontend)
SELECT 
  user_id,
  created_by,
  updated_by,
  created_at,
  updated_at
FROM public.employees
WHERE user_id = '<test_audit_user_id>';

-- Expected: created_by = auth.uid() (HR user)
-- Expected: updated_by = auth.uid() (HR user)
*/

-- =====================================================
-- CLEANUP (Optional)
-- =====================================================

-- Remove test employees
-- DELETE FROM public.employees WHERE department = 'Test Department';

-- =====================================================
-- SUMMARY OF EXPECTED RESULTS
-- =====================================================

/*
TEST CASE 1: HR/Admin Can Create Employee
  - Test 1a (HR creates): ✓ SUCCESS
  - Test 1b (Admin creates): ✓ SUCCESS

TEST CASE 2: Employee Cannot Create Employee
  - Test 2 (Employee creates): ✗ FAILURE (RLS violation)

TEST CASE 3: Employee Sees Only Own Record
  - Test 3a (Employee queries all): ✓ Returns only own record
  - Test 3b (Employee queries other): ✓ Returns 0 rows
  - Test 3c (HR queries all): ✓ Returns all records

TEST CASE 4: HR/Admin Can Deactivate Employee
  - Test 4a (HR deactivates): ✓ SUCCESS
  - Test 4b (Admin deactivates): ✓ SUCCESS
  - Test 4c (Employee deactivates self): ✗ FAILURE (cannot update status)
  - Test 4d (Employee deactivates other): ✗ FAILURE (cannot access)

ADDITIONAL TESTS:
  - Test 5 (Delete operation): ✗ FAILURE (no delete policy)
  - Test 6 (Audit tracking): ✓ Auto-populated correctly
*/
