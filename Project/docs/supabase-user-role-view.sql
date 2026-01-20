-- =====================================================
-- User Role View
-- =====================================================
-- This view exposes user_id and role_name by joining
-- user_roles and roles tables
-- =====================================================

-- Create or replace the user_role_view
CREATE OR REPLACE VIEW public.user_role_view AS
SELECT 
  ur.user_id,
  r.name AS role_name
FROM public.user_roles ur
INNER JOIN public.roles r ON ur.role_id = r.id;

-- Grant SELECT permission to authenticated users
GRANT SELECT ON public.user_role_view TO authenticated;

-- =====================================================
-- Verification Queries
-- =====================================================

-- Check if view exists
-- SELECT table_name, table_type 
-- FROM information_schema.tables 
-- WHERE table_schema = 'public' AND table_name = 'user_role_view';

-- View all user roles
-- SELECT * FROM public.user_role_view;

-- View roles for a specific user
-- SELECT role_name 
-- FROM public.user_role_view 
-- WHERE user_id = auth.uid();

-- Count users per role
-- SELECT role_name, COUNT(*) as user_count
-- FROM public.user_role_view
-- GROUP BY role_name;
