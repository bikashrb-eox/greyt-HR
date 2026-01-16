import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiUsers,
  FiClock,
  FiDollarSign,
  FiShield
} from "react-icons/fi";

import "./styles/CTASection.css";

const FEATURES = [
  {
    icon: <FiUsers />,
    text: "Centralized employee management with role-based access"
  },
  {
    icon: <FiClock />,
    text: "Automated attendance, leave, shifts, and approvals"
  },
  {
    icon: <FiDollarSign />,
    text: "Accurate payroll processing with statutory compliance"
  },
  {
    icon: <FiShield />,
    text: "Enterprise-grade security and data protection"
  }
];

const CTASection = () => {
  return (
    <section className="cta-section">
      <motion.div
        className="cta-content"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <h2>Ready to modernize HR?</h2>
        <p>
          greytHR gives you everything you need to manage people,
          payroll, and compliance in one unified platform.
        </p>

        {/* SINGLE BULLET LIST */}
        <ul className="feature-bullets">
          {FEATURES.map((item, i) => (
            <li key={i}>
              <span className="bullet-icon">{item.icon}</span>
              <span className="bullet-text">{item.text}</span>
            </li>
          ))}
        </ul>

        <Link to="/login">
          <motion.button
            className="cta-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign In Now
          </motion.button>
        </Link>
      </motion.div>
    </section>
  );
};

export default CTASection;
