import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import usePermission from "../../hooks/usePermission";

export default function AdminUsers() {
  const { isAdmin } = usePermission();

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    if (!isAdmin()) return;

    loadUsers();
    loadRoles();
  }, []);

  const loadUsers = async () => {
    const { data } = await supabase
      .from("profiles")
      .select(`
        id, 
        email,
        user_roles (
          role_id,
          roles:role_id (
            name
          )
        )
      `);

    setUsers(data || []);
  };

  const loadRoles = async () => {
    const { data } = await supabase.from("roles").select("*");
    setRoles(data || []);
  };

  const removeRole = async (userId, roleId) => {
    const { error } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", userId)
      .eq("role_id", roleId);

    if (error) {
      alert("Error removing role: " + error.message);
    } else {
      alert("Role removed");
      loadUsers(); // Reload to update UI
    }
  };

  const assignRole = async (userId, roleId) => {
    const { error } = await supabase.from("user_roles").upsert({
      user_id: userId,
      role_id: roleId,
    });

    if (error) {
      alert("Error assigning role: " + error.message);
    } else {
      alert("Role assigned");
      loadUsers(); // Reload to update UI
    }
  };

  if (!isAdmin()) {
    return <h2>Access Denied</h2>;
  }

  return (
    <div>
      <h2>User Role Management</h2>

      {users.map((user) => (
        <div key={user.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
          <h3>{user.email}</h3>
          <p>Current Roles: {user.user_roles?.map(ur => ur.roles?.name).join(', ') || 'None'}</p>
          
          <select
            onChange={(e) => {
              if (e.target.value) {
                assignRole(user.id, e.target.value);
                e.target.value = ''; // Reset select
              }
            }}
          >
            <option value="">Assign Role</option>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>

          {user.user_roles?.map(ur => (
            <button 
              key={ur.role_id} 
              onClick={() => removeRole(user.id, ur.role_id)}
              style={{ margin: '5px' }}
            >
              Remove {ur.roles?.name}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}