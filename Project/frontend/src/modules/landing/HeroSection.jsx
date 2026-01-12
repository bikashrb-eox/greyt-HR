import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const AnimatedCounter = ({ target = 0, duration = 1500 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    if (!target) return;
    const stepTime = Math.max(Math.floor(duration / target), 20);
    const interval = setInterval(() => {
      start += Math.ceil(target / (duration / stepTime));
      if (start >= target) {
        setCount(target);
        clearInterval(interval);
      } else setCount(start);
    }, stepTime);

    return () => clearInterval(interval);
  }, [target, duration]);

  return <span className="counter">{count}</span>;
};

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-inner">
        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Build happier teams with modern HR tooling
        </motion.h1>

        <motion.p
          className="hero-sub"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          All your people operations in a single, delightful experience — fast, secure and human.
        </motion.p>

        <motion.div
          className="hero-cta"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Link to="/login" className="btn btn-primary">Get started</Link>
          <a className="btn btn-ghost" href="#features">Learn more</a>
        </motion.div>

        <motion.div
          className="hero-stats"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="stat">
            <AnimatedCounter target={2500} duration={1800} />
            <div className="stat-sub">Teams onboarded</div>
          </div>
          <div className="stat">
            <AnimatedCounter target={98000} duration={1800} />
            <div className="stat-sub">Monthly actions</div>
          </div>
          <div className="stat">
            <AnimatedCounter target={99} duration={1200} />
            <div className="stat-sub">% Uptime</div>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="blob blob-1"
        animate={{ y: [0, -18, 0], x: [0, 12, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="blob blob-2"
        animate={{ y: [0, -10, 0], x: [0, -16, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
    </section>
  );
}
