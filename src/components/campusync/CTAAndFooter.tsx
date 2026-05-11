"use client";

import React from "react";
import { motion } from "framer-motion";

export const CTASection: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="w-full py-8xl bg-ink text-white">
      <motion.div
        className="container flex flex-col items-center text-center gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h2
          variants={itemVariants}
          className="font-serif text-h1 text-white"
        >
          Ready to optimize your AI spend?
        </motion.h2>

        <motion.p
          variants={itemVariants}
          className="text-body text-stone max-w-2xl"
        >
          Stop overpaying for tools you don&apos;t need. Run your first audit in
          under 60 seconds and join 500+ engineering teams saving on AI.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
        >
          <button className="px-lg py-md bg-white text-ink text-body font-medium rounded-pill hover:bg-accent hover:text-white transition-all duration-fast">
            Start Your Free Audit
          </button>
          <button className="px-lg py-md border border-white text-white text-body font-medium rounded-pill hover:bg-white hover:bg-opacity-10 transition-all duration-fast">
            View Sample Audit
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white border-t border-stone py-6 md:py-8">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left - Logo */}
          <div className="text-h4 font-serif text-ink">SpendLens</div>

          {/* Center - Links */}
          <div className="flex items-center gap-6 text-sm text-mid">
            <a href="#" className="hover:text-ink transition-colors">
              Pricing Data
            </a>
            <a href="#" className="hover:text-ink transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-ink transition-colors">
              Contact
            </a>
          </div>

          {/* Right - Copyright */}
          <div className="text-xs text-mid">
            © {currentYear} SpendLens. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
