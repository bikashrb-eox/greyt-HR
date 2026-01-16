import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AuthModal from "../auth/AuthModal.jsx";
import {
  FiMenu,
  FiX,
  FiMoon,
  FiSun,
  FiUser
} from "react-icons/fi";
import "../styles/LandingHeader.css";
import { useTheme } from "../../hooks/useTheme.jsx";

const NAV_ITEMS = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" }
];

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  // Navbar scroll effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = () => {
    setMobileOpen(false);
  };

  return (
    <>
      <header className={`navbar ${scrolled ? "shrink" : ""}`}>
        <div className="logo">greytHR</div>

        {/* Desktop Navigation */}
        <nav className="nav-links">
          {NAV_ITEMS.map(({ label, href }) => (
            <a key={label} href={href} className="nav-item">
              {label}
              <span />
            </a>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="nav-actions">
          <button
            className="icon-btn"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <FiSun /> : <FiMoon />}
          </button>

          {/* DESKTOP LOGIN */}
          <button
            className="login-btn"
            onClick={() => setShowAuth(true)}
          >
            <FiUser /> Login
          </button>

          {/* MOBILE HAMBURGER */}
          <button
            className="hamburger"
            onClick={() => setMobileOpen(true)}
          >
            <FiMenu />
          </button>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            className="mobile-menu"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <button
              className="close-btn"
              onClick={() => setMobileOpen(false)}
            >
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

            {/* MOBILE LOGIN */}
            <button
              className="mobile-login"
              onClick={() => {
                setMobileOpen(false);
                setShowAuth(true);
              }}
            >
              Login
            </button>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* AUTH MODAL */}
      <AnimatePresence>
        {showAuth && (
          <AuthModal onClose={() => setShowAuth(false)} />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
