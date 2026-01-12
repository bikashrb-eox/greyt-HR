
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

  // Scroll shrink effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = () => {
    setMobileOpen(false); // close mobile menu after click
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

          <button className="login-btn">
            <FiUser /> Login
          </button>

          <button
            className="hamburger"
            onClick={() => setMobileOpen(true)}
          >
            <FiMenu />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
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

            <button className="mobile-login">
              Login
            </button>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
