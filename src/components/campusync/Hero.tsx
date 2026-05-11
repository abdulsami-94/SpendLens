"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export const Hero: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
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

  const scrollVariants = {
    animate: {
      y: [0, 8, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
      },
    },
  };

  return (
    <section
      className="relative w-full min-h-screen flex items-center justify-center pt-[var(--nav-height)] bg-white"
      id="hero"
    >
      <div className="container">
        <motion.div
          className="flex flex-col items-center text-center gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div variants={itemVariants}>
            <span className="inline-block px-lg py-sm bg-accent-soft text-accent text-xs font-medium rounded-pill uppercase tracking-wider">
              🎯 60-second AI spend audit
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1 variants={itemVariants} className="font-serif text-h1">
            Find out how much your team is{" "}
            <span className="text-accent font-serif">wasting</span> on AI tools.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="max-w-prose text-body text-mid leading-relaxed"
          >
            Most engineering teams are paying for the wrong plans, duplicating
            tools, and leaving cheaper alternatives on the table. SpendLens
            audits your AI spend in 60 seconds.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2"
          >
            <a
              href="#audit"
              className="px-lg py-md bg-ink text-white text-body font-medium rounded-pill hover:bg-accent hover:shadow-hover transition-all duration-fast inline-block"
            >
              Audit My Team&apos;s Spend →
            </a>
            <a
              href="#how-it-works"
              className="px-lg py-md border border-stone text-ink text-body font-medium rounded-pill hover:bg-off transition-all duration-fast inline-block"
            >
              See how it works
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        variants={scrollVariants}
        animate="animate"
      >
        <ChevronDown
          size={32}
          className="text-stone"
          strokeWidth={1.5}
        />
      </motion.div>
    </section>
  );
};
