import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import usePermission from "../../hooks/usePermission";
import "../styles/Sidebar.css";

const GIcon = ({ name }) => <span className="material-icons">{name}</span>;

function Sidebar() {
  const [openMenu, setOpenMenu] = useState("");
  const [activeMenu, setActiveMenu] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const { isAdmin, isManager } = usePermission();

  // Debug admin panel visibility
  console.log("Sidebar - isAdmin():", isAdmin());
  console.log("Sidebar - isManager():", isManager());

  // Set active menu based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path === "/home") {
      setActiveMenu("home");
    } else if (path === "/engage") {
      setActiveMenu("engage");
    } else if (path === "/admin") {
      setActiveMenu("admin");
    } else if (path === "/manager") {
      setActiveMenu("manager");
    } else if (path.includes("/todo") || path.includes("/tasks") || path.includes("/review")) {
      setActiveMenu("todo");
    } else if (path.includes("/salary") || path.includes("/payslip")) {
      setActiveMenu("salary");
    } else if (path.includes("/leave")) {
      setActiveMenu("leave");
    } else if (path.includes("/attendance")) {
      setActiveMenu("attendance");
    } else {
      setActiveMenu("");
    }
  }, [location.pathname]);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? "" : menu);
    setActiveMenu(menu);
  };

  const getMenuClass = (menu) =>
    activeMenu === menu ? "menu-item active" : "menu-item";

  const handleMenuClick = (menu, path) => {
    setActiveMenu(menu);
    setOpenMenu(openMenu === menu ? "" : menu);
    if (path) {
      navigate(path);
    }
  };

  const Arrow = ({ menu }) => (
    <GIcon
      name={openMenu === menu ? "keyboard_arrow_up" : "keyboard_arrow_down"}
    />
  );

  return (
    <div className="sidebar">
      {/* HOME */}
      <div className={getMenuClass("home")} onClick={() => handleMenuClick("home", "/home")}>
        <div className="menu-left">
          <GIcon name="home" /> Home
        </div>
      </div>

      {/* ENGAGE */}
      <div className={getMenuClass("engage")} onClick={() => handleMenuClick("engage", "/engage")}>
        <div className="menu-left">
          <GIcon name="groups" /> Engage
        </div>
      </div>

      {/* TO DO */}
      <div className={getMenuClass("todo")} onClick={() => handleMenuClick("todo")}>
        <div className="menu-left">
          <GIcon name="task" /> To Do
        </div>
        <Arrow menu="todo" />
      </div>

      {openMenu === "todo" && (
        <div className="submenu">
          <p onClick={() => setActiveMenu("todo")}>Tasks</p>
          <p onClick={() => setActiveMenu("todo")}>Review</p>
        </div>
      )}

      {/* SALARY */}
      <div
        className={getMenuClass("salary")}
        onClick={() => handleMenuClick("salary")}
      >
        <div className="menu-left">
          <GIcon name="payments" /> Salary
        </div>
        <Arrow menu="salary" />
      </div>

      {openMenu === "salary" && (
        <div className="submenu">
          <p onClick={() => setActiveMenu("salary")}>Payslips</p>
          <p onClick={() => setActiveMenu("salary")}>YTD Reports</p>
          <p onClick={() => setActiveMenu("salary")}>IT Statement</p>
          <p onClick={() => setActiveMenu("salary")}>IT Declaration</p>
          <p onClick={() => setActiveMenu("salary")}>Reimbursement</p>
          <p onClick={() => setActiveMenu("salary")}>Proof Of Investment</p>
          <p onClick={() => setActiveMenu("salary")}>Salary Revision</p>
        </div>
      )}

      {/* LEAVE */}
      <div className={getMenuClass("leave")} onClick={() => handleMenuClick("leave")}>
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
      <div className={getMenuClass("attendance")} onClick={() => handleMenuClick("attendance")}>
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
      <div className={getMenuClass("documents")} onClick={() => handleMenuClick("documents")}>
        <div className="menu-left">
          <GIcon name="folder" /> Document Center
        </div>
      </div>

      {/* PEOPLE */}
      <div className={getMenuClass("people")} onClick={() => handleMenuClick("people")}>
        <div className="menu-left">
          <GIcon name="people" /> People
        </div>
      </div>

      {/* HELPDESK */}
      <div className={getMenuClass("helpdesk")} onClick={() => handleMenuClick("helpdesk")}>
        <div className="menu-left">
          <GIcon name="help" /> HelpDesk
        </div>
      </div>

      {/* REQUEST HUB */}
      <div className={getMenuClass("requests")} onClick={() => handleMenuClick("requests")}>
        <div className="menu-left">
          <GIcon name="hub" /> Request Hub
        </div>
      </div>

      {/* ROLE BASED PANELS */}
      {isManager() && (
        <div className={getMenuClass("manager")} onClick={() => handleMenuClick("manager", "/manager")}>
          <div className="menu-left">
            <GIcon name="admin_panel_settings" />
            Manager Panel
          </div>
        </div>
      )}

      {/* Temporarily always show admin panel for testing */}
      {/* {isAdmin() && ( */}
        <div className={getMenuClass("admin")} onClick={() => handleMenuClick("admin", "/admin")}>
          <div className="menu-left">
            <GIcon name="security" />
            Admin Panel
          </div>
        </div>
      {/* )} */}
    </div>
  );
}

export default Sidebar;
