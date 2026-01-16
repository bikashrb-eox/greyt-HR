import usePermission from "../../hooks/usePermission";

export default function ManagerDashboard() {
  const { isManager } = usePermission();

  if (!isManager()) {
    return <h2>Only Manager or Admin can access</h2>;
  }

  return <div>Manager Area</div>;
}