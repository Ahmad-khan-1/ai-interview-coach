"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function QuestionCard({
  questionNumber,
  totalQuestions,
  question,
  answer,
  onAnswerChange,
  onNext,
  isLast,
}) {
  return (
    <motion.div
      key={questionNumber}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.35 }}
    >
      <span
        className="text-sm font-mono tracking-wider"
        style={{ color: "var(--color-accent)" }}
      >
        QUESTION {questionNumber} OF {totalQuestions}
      </span>

      <h2
        className="text-xl sm:text-2xl font-semibold mt-3 mb-6 leading-snug"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {question}
      </h2>

      <textarea
        value={answer}
        onChange={(e) => onAnswerChange(e.target.value)}
        placeholder="Type your answer here..."
        rows={6}
        className="w-full min-h-[180px] sm:min-h-[220px] rounded-2xl p-4 sm:p-5 outline-none resize-y text-sm sm:text-base transition-all duration-300"
        style={{
          background: "var(--color-surface)",
          border:
            "1px solid color-mix(in srgb, var(--color-text-muted) 25%, transparent)",
          color: "var(--color-text-primary)",
        }}
      />

      <motion.button
        onClick={onNext}
        disabled={!answer.trim()}
        whileHover={answer.trim() ? { scale: 1.02 } : {}}
        whileTap={answer.trim() ? { scale: 0.98 } : {}}
        className="w-full min-h-[48px] rounded-2xl py-4 mt-4 font-medium flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
        style={{
          background: answer.trim()
            ? "linear-gradient(90deg, var(--color-accent), var(--color-accent-secondary))"
            : "var(--color-surface)",
          color: answer.trim() ? "#fff" : "var(--color-text-muted)",
          boxShadow: answer.trim()
            ? "0 8px 30px -8px var(--color-accent)"
            : "none",
        }}
      >
        {isLast ? "Finish interview" : "Next question"}
        <ArrowRight size={18} />
      </motion.button>
    </motion.div>
  );
}
