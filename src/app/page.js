"use client";

import { motion } from "framer-motion";
import { ArrowRight, Upload, MessageSquare, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "@/components/ui/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle";

const SAMPLE_QUESTIONS = [
  "Tell me about a time you handled conflicting priorities.",
  "Walk me through how you'd design a rate limiter.",
  "Why do you want to work here?",
];

function TypingCard() {
  const [qIndex, setQIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState("typing"); // typing | pausing | deleting

  useEffect(() => {
    const current = SAMPLE_QUESTIONS[qIndex];
    let timeout;

    if (phase === "typing") {
      if (displayed.length < current.length) {
        timeout = setTimeout(
          () => setDisplayed(current.slice(0, displayed.length + 1)),
          28,
        );
      } else {
        timeout = setTimeout(() => setPhase("pausing"), 1400);
      }
    } else if (phase === "pausing") {
      timeout = setTimeout(() => setPhase("deleting"), 600);
    } else if (phase === "deleting") {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 14);
      } else {
        setQIndex((i) => (i + 1) % SAMPLE_QUESTIONS.length);
        setPhase("typing");
      }
    }
    return () => clearTimeout(timeout);
  }, [displayed, phase, qIndex]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, rotate: -2 }}
      animate={{ opacity: 1, y: 0, rotate: -2 }}
      transition={{ duration: 0.7, delay: 0.3 }}
      whileHover={{ rotate: 0, scale: 1.02 }}
      className="mx-auto rounded-2xl p-5 sm:p-6 w-full max-w-[22rem] sm:max-w-sm"
      style={{
        background: "var(--color-surface)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 20px 60px -20px rgba(0,0,0,0.5)",
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <span
          className="w-2 h-2 rounded-full"
          style={{ background: "var(--color-accent)" }}
        />
        <span className="text-xs tracking-wide text-[var(--color-text-muted)]">
          AI INTERVIEWER
        </span>
      </div>

      <p className="text-sm sm:text-base leading-relaxed min-h-[72px]">
        {displayed}
        <span className="inline-block w-[2px] h-4 ml-0.5 align-middle animate-pulse bg-current" />
      </p>

      <div
        className="mt-5 pt-4 flex items-center justify-between"
        style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
      >
        <span className="text-xs text-[var(--color-text-muted)]">
          Feedback ready in seconds
        </span>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "var(--color-accent-secondary)" }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

const STEPS = [
  {
    icon: Upload,
    label: "01",
    title: "Upload",
    desc: "Drop in your resume and the job description you're targeting.",
  },
  {
    icon: MessageSquare,
    label: "02",
    title: "Practice",
    desc: "Answer questions generated specifically for that role.",
  },
  {
    icon: TrendingUp,
    label: "03",
    title: "Improve",
    desc: "Get instant, specific feedback on every answer you give.",
  },
];

export default function LandingPage() {
  const router = useRouter();

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div
        className="ambient-blob w-96 h-96"
        style={{ background: "var(--color-accent)", top: "-10%", left: "-10%" }}
      />
      <div
        className="ambient-blob w-80 h-80"
        style={{
          background: "var(--color-accent-secondary)",
          top: "20%",
          right: "-5%",
          animationDelay: "3s",
        }}
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <header className="flex flex-wrap items-center justify-between gap-3 mb-12 sm:mb-16 md:mb-24">
          <Logo />
          <ThemeToggle />
        </header>

        {/* Hero */}
        <section className="grid gap-10 md:grid-cols-2 md:gap-12 items-center mb-20 sm:mb-28 md:mb-32">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-xs tracking-widest mb-4 text-[var(--color-text-muted)]">
              PRACTICE · FEEDBACK · CONFIDENCE
            </span>
            <h1
              className="text-3xl sm:text-4xl md:text-5xl leading-tight font-semibold mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Your next offer{" "}
              <span
                style={{
                  background:
                    "linear-gradient(90deg, var(--color-accent), var(--color-accent-secondary))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                starts here.
              </span>
            </h1>
            <p className="text-[var(--color-text-muted)] mb-8 sm:mb-10 text-base sm:text-lg">
              Upload your resume and job description. Get personalized interview
              questions, practice your answers, and receive instant AI feedback.
            </p>

            <motion.button
              onClick={() => router.push("/dashboard")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto min-h-[48px] rounded-2xl px-6 sm:px-8 py-4 font-medium flex items-center justify-center sm:justify-start gap-2"
              style={{
                background:
                  "linear-gradient(90deg, var(--color-accent), var(--color-accent-secondary))",
                color: "#fff",
                boxShadow: "0 8px 30px -8px var(--color-accent)",
              }}
            >
              Get started
              <ArrowRight size={18} />
            </motion.button>
          </motion.div>

          <div className="flex justify-center md:justify-end">
            <TypingCard />
          </div>
        </section>

        {/* How it works */}
        <section className="mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="text-xl sm:text-2xl font-semibold mb-8 sm:mb-10"
            style={{ fontFamily: "var(--font-display)" }}
          >
            How it works
          </motion.h2>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="rounded-2xl p-5 sm:p-6"
                style={{
                  background: "var(--color-surface)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <step.icon
                    size={20}
                    style={{ color: "var(--color-accent)" }}
                  />
                  <span className="text-xs text-[var(--color-text-muted)]">
                    {step.label}
                  </span>
                </div>
                <h3 className="font-medium mb-2">{step.title}</h3>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
