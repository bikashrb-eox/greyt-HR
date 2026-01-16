import { Link } from "react-router-dom";
import usePermission from "../../hooks/usePermission";

function Sidebar() {
  const { isAdmin, isManager } = usePermission();

  return (
    <div style={{ width: '200px', padding: '20px', borderRight: '1px solid #ccc' }}>
      <nav>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li><Link to="/">Home</Link></li>
          {isManager() && <li><Link to="/manager">Manager Panel</Link></li>}
          {isAdmin() && <li><Link to="/admin">Admin Panel</Link></li>}
          <li><Link to="/employees">Employees</Link></li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;