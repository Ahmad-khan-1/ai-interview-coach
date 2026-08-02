"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import Logo from "@/components/ui/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { UserButton, Show } from "@clerk/nextjs";
import ProgressBar from "@/components/interview/ProgressBar";
import QuestionCard from "@/components/interview/QuestionCard";

export default function InterviewPage() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const resumeText = sessionStorage.getItem("resumeText");
    const jobDescription = sessionStorage.getItem("jobDescription");

    if (!resumeText || !jobDescription) {
      router.push("/");
      return;
    }

    fetch("/api/generate-questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeText, jobDescription }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setQuestions(data.questions);
        setAnswers(new Array(data.questions.length).fill(""));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [router]);

  const handleAnswerChange = (value) => {
    const updated = [...answers];
    updated[currentIndex] = value;
    setAnswers(updated);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Interview complete — save answers and go to results
      sessionStorage.setItem("questions", JSON.stringify(questions));
      sessionStorage.setItem("answers", JSON.stringify(answers));
      router.push("/results");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 sm:px-6">
        <div className="text-center">
          <div
            className="w-10 h-10 rounded-full mx-auto mb-4 animate-spin border-4 border-t-transparent"
            style={{
              borderColor: "var(--color-accent)",
              borderTopColor: "transparent",
            }}
          />
          <p style={{ color: "var(--color-text-muted)" }}>
            Preparing your personalized questions...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 sm:px-6 text-center">
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
        style={{ background: "var(--color-accent)", top: "-10%", left: "-10%" }}
      />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <header className="flex flex-wrap items-center justify-between gap-3 mb-8 sm:mb-10">
          <Logo />
          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            <ThemeToggle />
            <Show when="signed-in">
              <UserButton />
            </Show>
          </div>
        </header>

        <ProgressBar current={currentIndex} total={questions.length} />

        <div className="mt-10">
          <AnimatePresence mode="wait">
            <QuestionCard
              questionNumber={currentIndex + 1}
              totalQuestions={questions.length}
              question={questions[currentIndex]}
              answer={answers[currentIndex]}
              onAnswerChange={handleAnswerChange}
              onNext={handleNext}
              isLast={currentIndex === questions.length - 1}
            />
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
