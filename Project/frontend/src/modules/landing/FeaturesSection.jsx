import { motion } from "framer-motion";
import {
  FiUsers,
  FiClock,
  FiDollarSign,
  FiShield
} from "react-icons/fi";
import "./styles/FeatureSection.css";

const features = [
  {
    icon: <FiUsers />,
    title: "Employee Management",
    desc: "Manage employee records, roles, onboarding, and lifecycle from one place."
  },
  {
    icon: <FiClock />,
    title: "Attendance & Leave",
    desc: "Track attendance, shifts, holidays, and leave policies with ease."
  },
  {
    icon: <FiDollarSign />,
    title: "Payroll Automation",
    desc: "Automate payroll, payslips, tax deductions, and compliance effortlessly."
  },
  {
    icon: <FiShield />,
    title: "Compliance & Security",
    desc: "Stay compliant with labor laws and keep employee data secure."
  }
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15 }
  }),
  hover: {
    y: -14,
    rotateX: 6,
    rotateY: -6,
    scale: 1.03,
    transition: { type: "spring", stiffness: 260 }
  }
};

const FeaturesSection = () => {
  return (
    <section id="features" className="features-section">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        Everything your HR team needs
      </motion.h2>

      <div className="features-grid">
        {features.map((f, i) => (
          <motion.div
            key={i}
            className="feature-card"
            custom={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            whileHover="hover"
            viewport={{ once: true }}
          >
            <motion.span
              className="feature-icon"
              whileHover={{ scale: 1.2, rotate: 8 }}
            >
              {f.icon}
            </motion.span>

            <h3>{f.title}</h3>

            <motion.p
              className="feature-desc"
              initial={{ opacity: 0, height: 0 }}
              whileHover={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
            >
              {f.desc}
            </motion.p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
