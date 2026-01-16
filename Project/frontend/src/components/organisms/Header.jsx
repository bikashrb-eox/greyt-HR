import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <header style={{ padding: '10px', borderBottom: '1px solid #ccc', display: 'flex', justifyContent: 'space-between' }}>
      <h1>Employee Management System</h1>
      {user && (
        <div>
          <span>Welcome, {user.email}</span>
          <button onClick={handleLogout} style={{ marginLeft: '10px' }}>Logout</button>
        </div>
      )}
    </header>
  );
}

export default Header;