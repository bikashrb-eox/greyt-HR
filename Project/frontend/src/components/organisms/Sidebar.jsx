
import { useState } from "react";
import { Link } from "react-router-dom";
import usePermission from "../../hooks/usePermission";
import "../styles/Sidebar.css";

const GIcon = ({ name }) => (
  <span className="material-icons">{name}</span>
);

function Sidebar() {
  const [openMenu, setOpenMenu] = useState("");

  const { isAdmin, isManager } = usePermission();

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? "" : menu);
  };

  const Arrow = ({ menu }) => (
    <GIcon
      name={openMenu === menu ? "keyboard_arrow_up" : "keyboard_arrow_down"}
    />
  );

  return (
    <div className="sidebar">
      {/* HOME */}
      <Link to="/home" className="menu-item">
        <div className="menu-left">
          <GIcon name="home" /> Home
        </div>
      </Link>

      {/* ENGAGE */}
      <div className="menu-item">
        <div className="menu-left">
          <GIcon name="groups" /> Engage
        </div>
      </div>

      {/* TO DO */}
      <div className="menu-item" onClick={() => toggleMenu("todo")}>
        <div className="menu-left">
          <GIcon name="task" /> To Do
        </div>
        <Arrow menu="todo" />
      </div>

      {openMenu === "todo" && (
        <div className="submenu">
          <p>Tasks</p>
          <p>Review</p>
        </div>
      )}

      {/* SALARY */}
      <div className="menu-item" onClick={() => toggleMenu("salary")}>
        <div className="menu-left">
          <GIcon name="payments" /> Salary
        </div>
        <Arrow menu="salary" />
      </div>

      {openMenu === "salary" && (
        <div className="submenu">
          <p>Payslips</p>
          <p>YTD Reports</p>
          <p>IT Statement</p>
          <p>IT Declaration</p>
          <p>Reimbursement</p>
          <p>Proof Of Investment</p>
          <p>Salary Revision</p>
        </div>
      )}

      {/* LEAVE */}
      <div className="menu-item" onClick={() => toggleMenu("leave")}>
        <div className="menu-left">
          <GIcon name="calendar_month" /> Leave
        </div>
        <Arrow menu="leave" />
      </div>

      {openMenu === "leave" && (
        <div className="submenu">
          <p>Leave Apply</p>
          <p>Leave Balances</p>
          <p>Leave Calendar</p>
          <p>Holiday Calendar</p>
        </div>
      )}

      {/* ATTENDANCE */}
      <div className="menu-item" onClick={() => toggleMenu("attendance")}>
        <div className="menu-left">
          <GIcon name="schedule" /> Attendance
        </div>
        <Arrow menu="attendance" />
      </div>

      {openMenu === "attendance" && (
        <div className="submenu">
          <p>Attendance Info</p>
          <p>Regularization & Permission</p>
        </div>
      )}

      {/* DOCUMENT CENTER */}
      <div className="menu-item">
        <div className="menu-left">
          <GIcon name="folder" /> Document Center
        </div>
      </div>

      {/* PEOPLE */}
      <div className="menu-item">
        <div className="menu-left">
          <GIcon name="people" /> People
        </div>
      </div>

      {/* EMPLOYEE MANAGEMENT */}
      <Link to="/employee-management" className="menu-item">
        <div className="menu-left">
          <GIcon name="badge" /> Employee Management
        </div>
      </Link>

      {/* HELPDESK */}
      <div className="menu-item">
        <div className="menu-left">
          <GIcon name="help" /> HelpDesk
        </div>
      </div>

      {/* REQUEST HUB */}
      <div className="menu-item">
        <div className="menu-left">
          <GIcon name="hub" /> Request Hub
        </div>
      </div>

      {/* ROLE BASED PANELS */}
      {isManager() && (
        <Link to="/manager" className="menu-item role">
          <div className="menu-left">
            <GIcon name="admin_panel_settings" />
            Manager Panel
          </div>
        </Link>
      )}

      {isAdmin() && (
        <Link to="/admin" className="menu-item role">
          <div className="menu-left">
            <GIcon name="security" />
            Admin Panel
          </div>
        </Link>
      )}
    </div>
  );
}

export default Sidebar;
