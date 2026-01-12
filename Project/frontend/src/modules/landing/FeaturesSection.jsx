import { motion } from "framer-motion";
import { FiUsers, FiClock, FiDollarSign, FiShield } from "react-icons/fi";

const features = [
  { icon: <FiUsers />, title: "Employee Management" },
  { icon: <FiClock />, title: "Attendance & Leave" },
  { icon: <FiDollarSign />, title: "Payroll Automation" },
  { icon: <FiShield />, title: "Compliance & Security" }
];

const FeaturesSection = () => {
  return (
    <section id="features" style={styles.section}>
      <h2>Everything your HR team needs</h2>

      <div style={styles.grid}>
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            viewport={{ once: true }}
            style={styles.card}
          >
            <span style={styles.icon}>{f.icon}</span>
            <p>{f.title}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const styles = {
  section: { padding: "80px 40px", background: "#f9fafb" },
  grid: {
    marginTop: "40px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "24px"
  },
  card: {
    background: "#fff",
    padding: "32px",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)"
  },
  icon: { fontSize: "28px", marginBottom: "12px" }
};

export default FeaturesSection;
