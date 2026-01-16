
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/organisms/Sidebar";
import Header from "../components/organisms/Header";

export default function DashboardLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main style={{ flex: 1, padding: '20px' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}