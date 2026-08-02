"use client";

import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";

export default function FeedbackCard({ index, question, answer, feedback }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="rounded-2xl p-4 sm:p-5"
      style={{
        background: "var(--color-surface)",
        border:
          "1px solid color-mix(in srgb, var(--color-text-muted) 20%, transparent)",
      }}
    >
      <span
        className="text-xs font-mono tracking-wider"
        style={{ color: "var(--color-accent)" }}
      >
        QUESTION {index + 1}
      </span>
      <h3 className="font-semibold mt-1 mb-3 leading-snug text-base sm:text-lg">
        {question}
      </h3>

      <div
        className="rounded-xl p-3 sm:p-4 mb-3 text-sm break-words"
        style={{
          background:
            "color-mix(in srgb, var(--color-text-muted) 8%, transparent)",
          color: "var(--color-text-muted)",
        }}
      >
        {answer}
      </div>

      <div className="flex gap-2">
        <MessageSquare
          size={16}
          className="shrink-0 mt-0.5"
          style={{ color: "var(--color-accent-secondary)" }}
        />
        <p className="text-sm leading-relaxed break-words">{feedback}</p>
      </div>
    </motion.div>
  );
}
