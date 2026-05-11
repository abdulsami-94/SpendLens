"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Cpu,
  Layers,
  Trash2,
  ArrowRightLeft,
  FileCheck,
  Zap,
} from "lucide-react";

interface Feature {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
  iconColor: string;
}

const features: Feature[] = [
  {
    id: "ai-audit",
    icon: <Cpu size={32} />,
    title: "AI Audit Engine",
    description:
      "Our AI analyzes your tool stack against thousands of data points to find optimization opportunities.",
    bgColor: "bg-accent-soft",
    iconColor: "text-accent",
  },
  {
    id: "plan-comparison",
    icon: <Layers size={32} />,
    title: "Plan Comparison",
    description:
      "We compare your current plans across vendors to ensure you're on the most cost-effective tier.",
    bgColor: "bg-icon-orange",
    iconColor: "text-warn",
  },
  {
    id: "waste-detection",
    icon: <Trash2 size={32} />,
    title: "Waste Detection",
    description:
      "Identify duplicate subscriptions, unused seats, and overlapping tool features instantly.",
    bgColor: "bg-icon-green",
    iconColor: "text-green",
  },
  {
    id: "competing-tools",
    icon: <ArrowRightLeft size={32} />,
    title: "Competing Tools",
    description:
      "Get recommendations for alternative tools that provide better value for your specific use cases.",
    bgColor: "bg-icon-purple",
    iconColor: "text-accent",
  },
  {
    id: "verified-pricing",
    icon: <FileCheck size={32} />,
    title: "Verified Pricing",
    description:
      "Every recommendation is backed by our database of official, manually verified vendor pricing.",
    bgColor: "bg-status-pending",
    iconColor: "text-warn",
  },
  {
    id: "instant-results",
    icon: <Zap size={32} />,
    title: "Instant Results",
    description:
      "No complex integrations or API keys required. Enter your tools and get results in 60 seconds.",
    bgColor: "bg-icon-red",
    iconColor: "text-red-600",
  },
];

export const FeaturesGrid: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="w-full py-8xl bg-white" id="features">
      <div
        className="flex flex-col gap-8 md:gap-12"
        style={{ maxWidth: "var(--max-width-features)", margin: "0 auto" }}
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
            Stop guessing your AI spend
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-body text-mid max-w-2xl mx-auto"
          >
            SpendLens gives you the clarity you need to optimize your team&apos;s
            AI tool stack with data-driven recommendations.
          </motion.p>
        </div>

        {/* Features Grid */}
        <motion.div
          className="px-lg md:px-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.id}
              variants={itemVariants}
              className="flex flex-col gap-4 p-2xl bg-white border border-stone rounded-base hover:shadow-md transition-all duration-normal group"
            >
              {/* Icon Container */}
              <div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-md ${feature.bgColor} ${feature.iconColor} group-hover:scale-110 transition-transform duration-normal`}
              >
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="font-serif text-h3 text-ink">{feature.title}</h3>
              <p className="text-body text-mid leading-relaxed flex-grow">
                {feature.description}
              </p>

              {/* Learn More Link */}
              <a
                href="#"
                className="text-sm font-medium text-accent hover:text-ink transition-colors duration-fast inline-flex items-center gap-2"
              >
                Learn more →
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
