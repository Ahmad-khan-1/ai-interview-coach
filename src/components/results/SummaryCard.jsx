"use client";

import { motion } from "framer-motion";
import { TrendingUp, Target, Lightbulb } from "lucide-react";

export default function SummaryCard({ summary }) {
  const items = [
    {
      icon: TrendingUp,
      label: "Strengths",
      text: summary.strengths,
      color: "var(--color-accent-secondary)",
    },
    {
      icon: Target,
      label: "Areas to improve",
      text: summary.improvements,
      color: "var(--color-accent)",
    },
    {
      icon: Lightbulb,
      label: "Actionable tip",
      text: summary.actionableTip,
      color: "var(--color-accent-secondary)",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl p-5 sm:p-6 mb-8"
      style={{
        background:
          "linear-gradient(135deg, color-mix(in srgb, var(--color-accent) 12%, var(--color-surface)), color-mix(in srgb, var(--color-accent-secondary) 12%, var(--color-surface)))",
        border:
          "1px solid color-mix(in srgb, var(--color-accent) 30%, transparent)",
      }}
    >
      <h2
        className="text-lg sm:text-xl font-semibold mb-4"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Overall summary
      </h2>
      <div className="space-y-4">
        {items.map(({ icon: Icon, label, text, color }) => (
          <div key={label} className="flex gap-3">
            <Icon size={18} className="shrink-0 mt-0.5" style={{ color }} />
            <div>
              <span className="text-sm font-medium block mb-0.5">{label}</span>
              <p
                className="text-sm leading-relaxed break-words"
                style={{ color: "var(--color-text-muted)" }}
              >
                {text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
