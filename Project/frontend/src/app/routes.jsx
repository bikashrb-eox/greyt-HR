import { Routes, Route, Navigate } from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import LandingPage from "../modules/landing/LandingPage";
import Login from "../modules/auth/Login";
import Home from "../pages/Home";
import EmployeeList from "../modules/employee/EmployeeList";
import AdminUsers from "../modules/admin/Dashboard/AdminUsers";
import ManagerDashboard from "../modules/manager/ManagerDashboard";
import Engage from "../modules/engage/Engage.jsx";
import Todo from "../modules/todo/Todo.jsx";
import TaskSection from "../modules/todo/TaskSection.jsx";
import ReviewSection from "../modules/todo/ReviewSection.jsx";

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
        <Route path="/home" element={<Home />} />
        <Route path="/employees" element={<EmployeeList />} />
        <Route path="/admin" element={<AdminUsers />} />
        <Route path="/manager" element={<ManagerDashboard />} />
        <Route path="/engage" element={<Engage />} />
        <Route path="/todo" element={<Todo />}>
          <Route index element={<TaskSection />} />
          <Route path="tasks" element={<TaskSection />} />
          <Route path="review" element={<ReviewSection />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
