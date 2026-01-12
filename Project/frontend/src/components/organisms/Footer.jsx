const Footer = () => {
  return (
    <footer id="contact" style={styles.footer}>
      <div>
        <h4>greytHR</h4>
        <p>Modern HRMS for fast-growing teams</p>
      </div>

      <div>
        <p>Email: support@greythr.com</p>
        <p>Phone: +91 98765 43210</p>
      </div>

      <p style={{ marginTop: "20px", fontSize: "14px" }}>
        © {new Date().getFullYear()} greytHR. All rights reserved.
      </p>
    </footer>
  );
};

const styles = {
  footer: {
    padding: "40px",
    background: "#111827",
    color: "#fff",
    textAlign: "center"
  }
};

export default Footer;
