"use client";

import React from "react";
import { motion } from "framer-motion";

interface Step {
  number: number;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    number: 1,
    title: "Select your tools",
    description:
      "Choose from over 8+ covered AI tools including Cursor, GitHub Copilot, Claude, and ChatGPT.",
  },
  {
    number: 2,
    title: "Enter your details",
    description:
      "Provide your current plan and seat counts. No API keys or credit card access required.",
  },
  {
    number: 3,
    title: "Run the AI audit",
    description:
      "Our AI engine analyzes your spend against official pricing data in under 60 seconds.",
  },
  {
    number: 4,
    title: "Save & optimize",
    description:
      "Receive specific, data-backed recommendations to cut waste and switch to more cost-effective plans.",
  },
];

export const HowItWorks: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6 },
    },
  };

  const numberVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="w-full py-8xl bg-white" id="how-it-works">
      <div
        className="flex flex-col gap-12"
        style={{ maxWidth: "var(--max-width-flow)", margin: "0 auto" }}
      >
        {/* Section Header */}
        <div className="px-lg md:px-5xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="font-serif text-h2 text-ink mb-4"
          >
            How it works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-body text-mid max-w-xl mx-auto"
          >
            Find out how to optimize your AI tool spend in four simple steps.
            It takes less than 2 minutes to get your first audit.
          </motion.p>
        </div>

        {/* Steps */}
        <motion.div
          className="px-lg md:px-5xl flex flex-col gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              variants={itemVariants}
              className="flex flex-col md:flex-row gap-6 md:gap-8 items-start"
            >
              {/* Number Badge */}
              <motion.div
                variants={numberVariants}
                className="flex-shrink-0"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-accent-soft border-2 border-accent flex items-center justify-center flex-shrink-0">
                  <span className="font-serif text-h2 font-normal text-accent">
                    {step.number}
                  </span>
                </div>
              </motion.div>

              {/* Content */}
              <div className="flex-1 pt-2 md:pt-4">
                <h3 className="font-serif text-h3 text-ink mb-3">
                  {step.title}
                </h3>
                <p className="text-body text-mid leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Connector Line (Desktop Only) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-0.5 h-24 bg-gradient-to-b from-accent to-transparent"
                  style={{
                    top: `${160 + index * 200}px`,
                  }}
                ></div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          className="px-lg md:px-5xl text-center pt-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <a
            href="#audit"
            className="inline-block px-lg py-md bg-ink text-white text-body font-medium rounded-pill hover:bg-accent hover:shadow-hover transition-all duration-fast"
          >
            Start Your Free Audit →
          </a>
        </motion.div>
      </div>
    </section>
  );
};
