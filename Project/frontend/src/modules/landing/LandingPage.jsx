import Navbar from "../../components/organisms/LandingHeader";
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import CTASection from "./CTASection";
import Footer from "../../components/organisms/Footer";
import "../../styles/landing.css";

export default function LandingPage() {
  return (
    <div className="landing-page-bg">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </div>
  );
}

