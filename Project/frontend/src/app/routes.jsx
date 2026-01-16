import { Routes, Route, Navigate } from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import LandingPage from "../modules/landing/LandingPage";
import Login from "../modules/auth/Login";
import EmployeeList from "../modules/employee/EmployeeList";
import AdminUsers from "../modules/admin/AdminUsers";
import ManagerDashboard from "../modules/manager/ManagerDashboard";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<DashboardLayout />}>
        <Route path="/employees" element={<EmployeeList />} />
        <Route path="/admin" element={<AdminUsers />} />
        <Route path="/manager" element={<ManagerDashboard />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
