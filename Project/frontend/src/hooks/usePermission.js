import { useAuth } from "../context/AuthContext";

export default function usePermission() {
  const { hasRole, hasAnyRole, roles } = useAuth();

  // Check if user has a specific role
  const has = (roleName) => {
    if (!roles || roles.length === 0) return false;
    return hasRole(roleName);
  };

  // Check if user has any of the specified roles
  const hasAny = (roleNames) => {
    if (!roles || roles.length === 0) return false;
    return hasAnyRole(roleNames);
  };

  // Check if user is admin
  const isAdmin = () => has("ADMIN");

  // Check if user is manager or admin
  const isManager = () => has("MANAGER");

  // Check if user is employee (or any role)
  const isEmployee = () => hasAny(["ADMIN", "MANAGER", "EMPLOYEE"]);

  return {
    has,
    hasAny,
    isAdmin,
    isManager,
    isEmployee,
    roles,
  };
}
