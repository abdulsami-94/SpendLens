"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  AlertCircle,
  CheckCircle,
  Clock,
  Menu,
  X,
} from "lucide-react";

export const AdminPreview: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <section className="w-full py-8xl bg-off" id="admin">
      <div className="container">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="font-serif text-h2 text-ink mb-4">
            See your savings in action
          </h2>
          <p className="text-body text-mid max-w-2xl mx-auto">
            Get a clear, actionable breakdown of your AI tool spend. No more
            guessing — just data-backed recommendations to optimize your budget.
          </p>
        </motion.div>

        {/* Browser Frame */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          {/* Browser Chrome */}
          <div className="bg-stone h-12 flex items-center px-4 gap-3 border-b border-mid">
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            </div>
            <div className="flex-1 text-center text-xs text-mid">
              spend-lens.app/audit/results
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="p-6 md:p-8 bg-white">
            {/* Header Bar */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-stone">
              <h3 className="font-serif text-h3 text-ink">Audit Summary</h3>
              <div className="flex items-center gap-2 text-sm text-mid">
                <Clock size={16} /> Generated 2 minutes ago
              </div>
            </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Stat Card 1 */}
              <div className="bg-accent-soft p-6 rounded-base border border-accent">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs text-mid uppercase tracking-wider mb-2">
                      Monthly Waste
                    </p>
                    <p className="text-h2 font-serif text-accent font-normal">
                      $340
                    </p>
                  </div>
                  <AlertCircle
                    size={28}
                    className="text-accent opacity-50"
                  />
                </div>
                <p className="text-xs text-mid">Identified in 4 tools</p>
              </div>

              {/* Stat Card 2 */}
              <div className="bg-status-resolved p-6 rounded-base border border-green">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs text-mid uppercase tracking-wider mb-2">
                      Annual Savings
                    </p>
                    <p className="text-h2 font-serif text-green font-normal">
                      $4,080
                    </p>
                  </div>
                  <CheckCircle
                    size={28}
                    className="text-green opacity-50"
                  />
                </div>
                <p className="text-xs text-mid">Projected yearly total</p>
              </div>

              {/* Stat Card 3 */}
              <div className="bg-status-progress p-6 rounded-base border border-blue-400">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs text-mid uppercase tracking-wider mb-2">
                      Health Score
                    </p>
                    <p className="text-h2 font-serif text-blue-600 font-normal">
                      64%
                    </p>
                  </div>
                  <BarChart3 size={28} className="text-blue-600 opacity-50" />
                </div>
                <p className="text-xs text-mid">Needs optimization</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
