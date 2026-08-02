"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  History,
  FileText,
  Briefcase,
} from "lucide-react";
import { UserButton, Show } from "@clerk/nextjs";
import Logo from "@/components/ui/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle";
import ResumeUploader from "@/components/upload/ResumeUploader";
import JobDescriptionInput from "@/components/upload/JobDescriptionInput";
import Link from "next/link";

function StepMarker({ done, active, number }) {
  return (
    <div className="relative flex flex-col items-center">
      <motion.div
        animate={{
          scale: done ? [1, 1.15, 1] : 1,
        }}
        transition={{ duration: 0.35 }}
        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 z-10"
        style={{
          background: done
            ? "linear-gradient(135deg, var(--color-accent), var(--color-accent-secondary))"
            : "var(--color-surface)",
          border: done
            ? "none"
            : active
              ? "1px solid var(--color-accent)"
              : "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <AnimatePresence mode="wait">
          {done ? (
            <motion.div
              key="check"
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
            >
              <CheckCircle2 size={18} color="#fff" />
            </motion.div>
          ) : (
            <motion.span
              key="num"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm font-medium"
              style={{
                color: active
                  ? "var(--color-accent)"
                  : "var(--color-text-muted)",
              }}
            >
              {number}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default function Dashboard() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [generating, setGenerating] = useState(false);
  const router = useRouter();

  const resumeDone = !!resumeText;
  const jdDone = jobDescription.trim().length > 20;
  const canGenerate = resumeDone && jdDone;
  const doneCount = [resumeDone, jdDone].filter(Boolean).length;

  const handleGenerate = async () => {
    setGenerating(true);
    sessionStorage.setItem("resumeText", resumeText);
    sessionStorage.setItem("jobDescription", jobDescription);
    router.push("/interview");
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div
        className="ambient-blob w-96 h-96"
        style={{ background: "var(--color-accent)", top: "-10%", left: "-10%" }}
      />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <header className="flex flex-wrap items-center justify-between gap-3 mb-10 sm:mb-16">
          <Logo />
          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            <Link href="/history">
              <History size={20} style={{ color: "var(--color-text-muted)" }} />
            </Link>
            <ThemeToggle />
            <Show when="signed-in">
              <UserButton />
            </Show>
          </div>
        </header>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-8 sm:mb-10">
          <div>
            <h2
              className="text-2xl sm:text-3xl font-semibold mb-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Start a new practice session
            </h2>
            <p className="text-[var(--color-text-muted)]">
              Two things, then you're ready.
            </p>
          </div>
          <div
            className="self-start sm:self-auto shrink-0 rounded-full px-3 py-1.5 text-xs font-medium"
            style={{
              background: "var(--color-surface)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: canGenerate
                ? "var(--color-accent)"
                : "var(--color-text-muted)",
            }}
          >
            {doneCount}/2 ready
          </div>
        </div>

        {/* Step 1: Resume */}
        <div className="flex gap-4">
          <div className="flex flex-col items-center">
            <StepMarker done={resumeDone} active={!resumeDone} number={1} />
            <div
              className="w-px flex-1 my-1"
              style={{
                background: resumeDone
                  ? "var(--color-accent)"
                  : "rgba(255,255,255,0.1)",
                minHeight: "24px",
              }}
            />
          </div>
          <div className="flex-1 pb-8">
            <div className="flex items-center gap-2 mb-3">
              <FileText
                size={15}
                style={{ color: "var(--color-text-muted)" }}
              />
              <span className="text-sm font-medium">Your resume</span>
            </div>
            <ResumeUploader onTextExtracted={setResumeText} />
          </div>
        </div>

        {/* Step 2: Job description */}
        <div className="flex gap-4">
          <div className="flex flex-col items-center">
            <StepMarker
              done={jdDone}
              active={resumeDone && !jdDone}
              number={2}
            />
            <div
              className="w-px flex-1 my-1"
              style={{
                background: "transparent",
                minHeight: "24px",
              }}
            />
          </div>
          <div className="flex-1 pb-8">
            <div className="flex items-center gap-2 mb-3">
              <Briefcase
                size={15}
                style={{ color: "var(--color-text-muted)" }}
              />
              <span className="text-sm font-medium">Job description</span>
            </div>
            <JobDescriptionInput
              value={jobDescription}
              onChange={setJobDescription}
            />
          </div>
        </div>

        {/* CTA */}
        <motion.button
          onClick={handleGenerate}
          disabled={!canGenerate || generating}
          whileHover={canGenerate ? { scale: 1.02 } : {}}
          whileTap={canGenerate ? { scale: 0.98 } : {}}
          animate={
            canGenerate && !generating
              ? {
                  boxShadow: [
                    "0 8px 30px -8px var(--color-accent)",
                    "0 8px 40px -6px var(--color-accent)",
                    "0 8px 30px -8px var(--color-accent)",
                  ],
                }
              : {}
          }
          transition={
            canGenerate ? { boxShadow: { duration: 2, repeat: Infinity } } : {}
          }
          className="w-full min-h-[48px] rounded-2xl py-4 font-medium flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            background: canGenerate
              ? "linear-gradient(90deg, var(--color-accent), var(--color-accent-secondary))"
              : "var(--color-surface)",
            color: canGenerate ? "#fff" : "var(--color-text-muted)",
          }}
        >
          {generating ? "Preparing your questions..." : "Start interview"}
          {!generating && <ArrowRight size={18} />}
        </motion.button>
      </div>
    </main>
  );
}
