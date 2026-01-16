

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AuthModal from "../auth/AuthModal.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  FiMenu,
  FiX,
  FiMoon,
  FiSun,
  FiUser,
  FiLogOut,
  FiEdit,
} from "react-icons/fi";
import "../styles/LandingHeader.css";
import { useTheme } from "../../hooks/useTheme.jsx";

const NAV_ITEMS = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // ===== USE AUTH CONTEXT PROPERLY =====
  const { user, roles, signOut } = useAuth();

  const profileRef = useRef();

  // ===== LOGOUT USING CONTEXT =====
  const handleLogout = async () => {
    console.log("Logout button clicked");
    try {
      await signOut();
      console.log("Logout completed");
      setShowProfile(false);
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // ===== SCROLL EFFECT =====
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ===== CLOSE DROPDOWN WHEN CLICK OUTSIDE =====
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavClick = () => {
    setMobileOpen(false);
  };

  return (
    <>
      <header className={`navbar ${scrolled ? "shrink" : ""}`}>
        <div className="logo">greytHR</div>

        <nav className="nav-links">
          {NAV_ITEMS.map(({ label, href }) => (
            <a key={label} href={href} className="nav-item">
              {label}
              <span />
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          <button className="icon-btn" onClick={toggleTheme}>
            {theme === "dark" ? <FiSun /> : <FiMoon />}
          </button>

          {/* ===== PROFILE SECTION ===== */}
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
              <button className="login-btn" onClick={() => setShowAuth(true)}>
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

                      {/* ROLE DIRECTLY FROM CONTEXT */}
                      <p>{roles[0] || "EMPLOYEE"}</p>
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

          <button className="hamburger" onClick={() => setMobileOpen(true)}>
            <FiMenu />
          </button>
        </div>
      </header>

      {/* ===== MOBILE MENU ===== */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            className="mobile-menu"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
          >
            <button className="close-btn" onClick={() => setMobileOpen(false)}>
              <FiX />
            </button>

            {NAV_ITEMS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="mobile-link"
                onClick={handleNavClick}
              >
                {label}
              </a>
            ))}

            {!user && (
              <button
                className="mobile-login"
                onClick={() => {
                  setMobileOpen(false);
                  setShowAuth(true);
                }}
              >
                Login
              </button>
            )}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* AUTH MODAL */}
      <AnimatePresence>
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
