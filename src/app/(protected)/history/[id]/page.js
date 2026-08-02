"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Logo from "@/components/ui/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle";
import FeedbackCard from "@/components/results/FeedbackCard";
import SummaryCard from "@/components/results/SummaryCard";

export default function HistoryDetailPage() {
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/get-interview/${id}`)
      .then((res) => res.json())
      .then((data) => setInterview(data.interview))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p style={{ color: "var(--color-text-muted)" }}>Loading...</p>
      </main>
    );
  }

  if (!interview) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p style={{ color: "var(--color-accent)" }}>Interview not found.</p>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <header className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <Logo />
          <ThemeToggle />
        </header>

        <button
          onClick={() => router.push("/history")}
          className="flex min-h-[44px] items-center gap-1.5 text-sm mb-6"
          style={{ color: "var(--color-text-muted)" }}
        >
          <ArrowLeft size={16} />
          Back to history
        </button>

        <SummaryCard summary={interview.overallSummary} />

        <div className="space-y-4">
          {interview.questions.map((q, i) => (
            <FeedbackCard
              key={i}
              index={i}
              question={q}
              answer={interview.answers[i]}
              feedback={interview.perQuestionFeedback[i]}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
