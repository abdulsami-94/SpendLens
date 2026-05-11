"use client";

import React from "react";
import { motion } from "framer-motion";

interface Stat {
  value: string;
  label: string;
}

const stats: Stat[] = [
  { value: "500+", label: "Audits run" },
  { value: "$280/mo", label: "Avg. savings identified" },
  { value: "8", label: "AI tools covered" },
  { value: "60s", label: "Time to audit" },
];

export const StatsBar: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section
      className="w-full bg-off py-7xl md:py-8xl border-b border-stone"
      id="stats"
    >
      <div className="container">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex flex-col gap-2"
            >
              <div className="text-h2 font-serif font-normal text-ink">
                {stat.value}
              </div>
              <div className="text-xs text-mid font-normal uppercase tracking-widest">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
