"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, ChevronRight, Trash2 } from "lucide-react";
import Logo from "@/components/ui/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Shimmer from "@/components/ui/Shimmer";
import { UserButton, Show } from "@clerk/nextjs";

export default function HistoryPage() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetch("/api/get-history")
      .then((res) => res.json())
      .then((data) => setInterviews(data.interviews || []))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Delete this interview from your history?",
    );
    if (!confirmed) return;

    setDeletingId(id);

    try {
      const res = await fetch(`/api/delete-interview/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete interview");
      }

      setInterviews((prev) => prev.filter((interview) => interview._id !== id));
    } catch (error) {
      console.error("Delete interview error:", error.message);
      alert("Could not delete this interview.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
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

        <h1
          className="text-2xl sm:text-3xl font-semibold mb-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Your practice history
        </h1>
        <p className="text-[var(--color-text-muted)] mb-8">
          Review your past interview sessions.
        </p>

        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="rounded-2xl p-4 sm:p-5"
                style={{
                  background: "var(--color-surface)",
                  border:
                    "1px solid color-mix(in srgb, var(--color-text-muted) 20%, transparent)",
                }}
              >
                <Shimmer width="65%" height="14px" className="mb-3" />
                <Shimmer width="50%" height="12px" className="mb-4" />
                <div className="flex items-center gap-3">
                  <Shimmer width="32px" height="32px" borderRadius="999px" />
                  <Shimmer width="25%" height="12px" />
                </div>
              </div>
            ))}
          </div>
        ) : interviews.length === 0 ? (
          <div
            className="rounded-2xl p-8 text-center"
            style={{ background: "var(--color-surface)" }}
          >
            <p style={{ color: "var(--color-text-muted)" }}>
              No practice sessions yet.
            </p>
            <Link
              href="/dashboard"
              className="inline-block mt-4 underline"
              style={{ color: "var(--color-accent)" }}
            >
              Start your first interview
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {interviews.map((interview, i) => (
              <Link
                key={interview._id}
                href={`/history/${interview._id}`}
                className="block"
              >
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-2xl p-4 sm:p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between cursor-pointer hover:opacity-80 transition-opacity"
                  style={{
                    background: "var(--color-surface)",
                    border:
                      "1px solid color-mix(in srgb, var(--color-text-muted) 20%, transparent)",
                  }}
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium mb-1 line-clamp-1">
                      {interview.jobDescription.slice(0, 60)}...
                    </p>
                    <div
                      className="flex items-center gap-1.5 text-xs"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      <Calendar size={12} />
                      {new Date(interview.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:ml-3 sm:self-auto">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        handleDelete(interview._id);
                      }}
                      disabled={deletingId === interview._id}
                      className="rounded-full p-2 transition-colors disabled:opacity-50"
                      style={{
                        background:
                          "color-mix(in srgb, var(--color-accent) 12%, transparent)",
                        color: "var(--color-accent)",
                      }}
                      aria-label="Delete interview"
                    >
                      <Trash2 size={16} />
                    </button>
                    <ChevronRight
                      size={18}
                      style={{ color: "var(--color-text-muted)" }}
                    />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
