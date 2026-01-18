import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FiUser, FiLogOut, FiEdit, FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "../../hooks/useTheme.jsx";
import AuthModal from "../auth/AuthModal.jsx";

import "../styles/LandingHeader.css";   // <-- IMPORTANT: use same navbar css

function Header() {
  const { user, roles, signOut } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [showAuth, setShowAuth] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const profileRef = useRef();

  const handleLogout = async () => {
    try {
      await signOut();
      setShowProfile(false);

      // ensure redirect after logout
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 100);
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/", { replace: true });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="navbar">
        {/* LOGO - SAME AS NAVBAR */}
        <div className="logo">greytHR</div>

        <div className="nav-actions">
          {/* THEME TOGGLE */}
          <button className="icon-btn" onClick={toggleTheme}>
            {theme === "dark" ? <FiSun /> : <FiMoon />}
          </button>

          {/* PROFILE SECTION - SAME STYLE AS NAVBAR */}
          <div className="profile-wrapper" ref={profileRef}>
            {user ? (
              <button
                className="user-btn"
                onClick={() => setShowProfile(!showProfile)}
              >
                <FiUser className="user-icon" />
                <span className="username">
                  {user?.email?.split("@")[0]}
                </span>
              </button>
            ) : (
              <button
                className="login-btn"
                onClick={() => setShowAuth(true)}
              >
                <FiUser /> Login
              </button>
            )}

            <AnimatePresence>
              {showProfile && user && (
                <motion.div
                  className="profile-dropdown"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="profile-header">
                    <div className="avatar">
                      <FiUser />
                    </div>

                    <div className="profile-info">
                      <h4>{user.email}</h4>
                      <p>{roles?.[0] || "EMPLOYEE"}</p>
                    </div>
                  </div>

                  <div className="profile-actions">
                    <button className="profile-option">
                      <FiEdit /> Update Profile
                    </button>

                    <button
                      className="profile-option logout"
                      onClick={handleLogout}
                    >
                      <FiLogOut /> Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      </AnimatePresence>
    </>
  );
}

export default Header;
