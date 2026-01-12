import {
  FiMail,
  FiPhone,
  FiMapPin
} from "react-icons/fi";
import {
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaXTwitter
} from "react-icons/fa6";

import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer id="contact" className="footer">
      <div className="footer-container">

        {/* Brand */}
        <div className="footer-brand">
          <h3>greytHR</h3>
          <p>
            Modern HRMS platform helping fast-growing teams manage people,
            payroll, compliance, and performance with ease.
          </p>

          <div className="social-links">
            <a href="#" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" aria-label="Facebook"><FaFacebookF /></a>
            <a href="#" aria-label="LinkedIn"><FaLinkedinIn /></a>
            <a href="#" aria-label="Twitter"><FaXTwitter /></a>
          </div>
        </div>

        {/* Contact */}
        <div className="footer-section">
          <h4>Contact</h4>
          <p><FiMail /> support@greythr.com</p>
          <p><FiPhone /> +91 98765 43210</p>
        </div>

        {/* Address */}
        <div className="footer-section">
          <h4>Office</h4>
          <p>
            <FiMapPin />
            greytHR India Pvt. Ltd.<br />
            3rd Floor, Tech Park<br />
            Bengaluru, Karnataka 560103<br />
            India
          </p>
        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} greytHR. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
