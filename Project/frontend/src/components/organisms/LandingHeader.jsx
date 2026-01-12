import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { FiUser, FiLogOut } from "react-icons/fi";

const LandingHeader = () => {
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={styles.header}
    >
      <div style={styles.logo}>greytHR</div>

      <nav style={styles.nav}>
        <a href="#features">Features</a>
        <a href="#pricing">Pricing</a>
        <a href="#contact">Contact</a>

        <div style={{ position: "relative" }}>
          <button
            onClick={() => setOpen(!open)}
            style={styles.signInBtn}
          >
            <FiUser /> Sign In
          </button>

          {open && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              style={styles.dropdown}
            >
              <Link to="/login">Login</Link>
              <button style={styles.logoutBtn}>
                <FiLogOut /> Logout
              </button>
            </motion.div>
          )}
        </div>
      </nav>
    </motion.header>
  );
};

const styles = {
  header: {
    position: "sticky",
    top: 0,
    zIndex: 100,
    background: "#ffffff",
    padding: "16px 40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
  },
  logo: {
    fontSize: "22px",
    fontWeight: 700,
    color: "#2563eb"
  },
  nav: {
    display: "flex",
    alignItems: "center",
    gap: "24px"
  },
  signInBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 16px",
    borderRadius: "8px",
    background: "#2563eb",
    color: "#fff",
    border: "none"
  },
  dropdown: {
    position: "absolute",
    right: 0,
    top: "44px",
    background: "#fff",
    borderRadius: "8px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  logoutBtn: {
    background: "transparent",
    border: "none",
    display: "flex",
    alignItems: "center",
    gap: "6px"
  }
};

export default LandingHeader;
