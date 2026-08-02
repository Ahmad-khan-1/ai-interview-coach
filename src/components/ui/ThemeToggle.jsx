"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light") {
      setIsLight(true);
      document.body.classList.add("light");
    }
  }, []);

  const toggleTheme = () => {
    const newIsLight = !isLight;
    setIsLight(newIsLight);
    document.body.classList.toggle("light", newIsLight);
    localStorage.setItem("theme", newIsLight ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="relative w-10 h-10 shrink-0 rounded-full flex items-center justify-center overflow-hidden transition-colors"
      style={{
        background: "var(--color-surface)",
        border:
          "1px solid color-mix(in srgb, var(--color-text-muted) 30%, transparent)",
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isLight ? (
          <motion.span
            key="sun"
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.25 }}
            className="absolute"
          >
            <Sun size={18} style={{ color: "var(--color-accent)" }} />
          </motion.span>
        ) : (
          <motion.span
            key="moon"
            initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.25 }}
            className="absolute"
          >
            <Moon
              size={18}
              style={{ color: "var(--color-accent-secondary)" }}
            />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
