

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import usePermission from "../../../hooks/usePermission";
import "./AdminUsers.css";

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
      loadUsers();
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
      loadUsers();
    }
  };

  // Temporarily comment out permission check for testing
  // if (!isAdmin()) {
  //   return <h2>Access Denied</h2>;
  // }

  const adminModules = [
    { name: "Employee Management", icon: "people", desc: "Manage employees and details" },
    { name: "Role Management", icon: "security", desc: "Assign roles and permissions" },
    { name: "Attendance", icon: "schedule", desc: "Attendance & shifts" },
    { name: "Leave Management", icon: "calendar_month", desc: "Leaves & holidays" },
    { name: "Payroll", icon: "payments", desc: "Salary and payslips" },
    { name: "Organization", icon: "apartment", desc: "Departments & structure" },
    { name: "Reports", icon: "bar_chart", desc: "Analytics & reports" },
    { name: "Documents", icon: "folder", desc: "Company documents" },
    { name: "Performance", icon: "trending_up", desc: "Reviews & goals" },
    { name: "Settings", icon: "settings", desc: "System configurations" },
  ];

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Centralized control panel for HRMS administration</p>
      </div>

      <div className="admin-card-grid">
        {adminModules.map((mod, index) => (
          <div className="admin-module-card" key={index}>
            <span className="material-icons module-icon">{mod.icon}</span>
            <h3>{mod.name}</h3>
            <p>{mod.desc}</p>
            <button className="start-btn">Open</button>
          </div>
        ))}
      </div>

      <div className="role-management-section">
        <h2>User Role Management</h2>

        <div className="users-grid">
          {users.map((user) => (
            <div key={user.id} className="user-card">
              <div className="user-header">
                <span className="material-icons user-icon">person</span>
                <h3>{user.email}</h3>
              </div>

              <div className="role-section">
                <p className="current-role">
                  Current Roles:{" "}
                  <span>
                    {user.user_roles
                      ?.map((ur) => ur.roles?.name)
                      .join(", ") || "None"}
                  </span>
                </p>

                <select
                  className="role-select"
                  onChange={(e) => {
                    if (e.target.value) {
                      assignRole(user.id, e.target.value);
                      e.target.value = "";
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

                <div className="remove-role-actions">
                  {user.user_roles?.map((ur) => (
                    <button
                      key={ur.role_id}
                      className="remove-role-btn"
                      onClick={() => removeRole(user.id, ur.role_id)}
                    >
                      Remove {ur.roles?.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
