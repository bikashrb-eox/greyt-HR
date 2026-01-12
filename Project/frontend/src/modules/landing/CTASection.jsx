import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={styles.section}
    >
      <h2>Ready to modernize HR?</h2>
      <Link to="/login">
        <button style={styles.btn}>Sign In Now</button>
      </Link>
    </motion.section>
  );
};

const styles = {
  section: {
    padding: "80px",
    textAlign: "center"
  },
  btn: {
    marginTop: "20px",
    padding: "14px 36px",
    borderRadius: "8px",
    background: "#2563eb",
    color: "#fff"
  }
};

export default CTASection;
