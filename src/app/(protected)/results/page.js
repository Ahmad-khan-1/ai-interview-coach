"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw } from "lucide-react";
import Logo from "@/components/ui/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle";
import FeedbackCard from "@/components/results/FeedbackCard";
import SummaryCard from "@/components/results/SummaryCard";

export default function ResultsPage() {
  const [feedback, setFeedback] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedQuestions = JSON.parse(
      sessionStorage.getItem("questions") || "[]",
    );
    const storedAnswers = JSON.parse(sessionStorage.getItem("answers") || "[]");
    const jobDescription = sessionStorage.getItem("jobDescription");

    if (!storedQuestions.length || !jobDescription) {
      router.push("/");
      return;
    }

    setQuestions(storedQuestions);
    setAnswers(storedAnswers);

    fetch("/api/generate-feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        questions: storedQuestions,
        answers: storedAnswers,
        jobDescription,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setFeedback(data);

        // Database mein save karna
        fetch("/api/save-interview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jobDescription,
            questions: storedQuestions,
            answers: storedAnswers,
            perQuestionFeedback: data.perQuestionFeedback,
            overallSummary: data.overallSummary,
          }),
        }).catch((err) =>
          console.error("Save failed (non-critical):", err.message),
        );
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [router]);

  const handleRestart = () => {
    sessionStorage.clear();
    router.push("/");
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div
            className="w-10 h-10 rounded-full mx-auto mb-4 animate-spin border-4 border-t-transparent"
            style={{
              borderColor: "var(--color-accent)",
              borderTopColor: "transparent",
            }}
          />
          <p style={{ color: "var(--color-text-muted)" }}>
            Analyzing your answers...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 text-center">
        <div>
          <p style={{ color: "var(--color-accent)" }} className="mb-4">
            {error}
          </p>
          <button onClick={() => router.push("/")} className="underline">
            Go back
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div
        className="ambient-blob w-96 h-96"
        style={{
          background: "var(--color-accent-secondary)",
          top: "-10%",
          right: "-10%",
        }}
      />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <header className="flex flex-wrap items-center justify-between gap-3 mb-8 sm:mb-10">
          <Logo />
          <ThemeToggle />
        </header>

        <h1
          className="text-2xl sm:text-3xl font-semibold mb-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Your interview results
        </h1>
        <p className="text-sm sm:text-base text-[var(--color-text-muted)] mb-8">
          Here's how you did, question by question.
        </p>

        <SummaryCard summary={feedback.overallSummary} />

        <div className="space-y-4 mb-8">
          {questions.map((q, i) => (
            <FeedbackCard
              key={i}
              index={i}
              question={q}
              answer={answers[i]}
              feedback={feedback.perQuestionFeedback[i]}
            />
          ))}
        </div>

        <button
          onClick={handleRestart}
          className="w-full min-h-[48px] rounded-2xl py-4 font-medium flex items-center justify-center gap-2"
          style={{
            background: "var(--color-surface)",
            border:
              "1px solid color-mix(in srgb, var(--color-text-muted) 30%, transparent)",
          }}
        >
          <RotateCcw size={18} />
          Practice again
        </button>
      </div>
    </main>
  );
}
