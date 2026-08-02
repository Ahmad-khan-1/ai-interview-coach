"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileCheck, Loader2 } from "lucide-react";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

export default function ResumeUploader({ onTextExtracted }) {
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const processFile = async (file) => {
    if (!file) return;

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError("Resume file is too large. Please upload a PDF under 5MB.");
      return;
    }

    if (file.type && file.type !== "application/pdf") {
      setError("Only PDF files are supported.");
      return;
    }
    setFileName(file.name);
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/parse-resume", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Upload fail hua");
      onTextExtracted(data.text);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    processFile(e.dataTransfer.files[0]);
  };

  const isDone = fileName && !loading && !error;

  return (
    <div>
      <label
        htmlFor="resume-upload"
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className="block cursor-pointer rounded-2xl border-2 p-6 sm:p-8 md:p-10 text-center transition-all duration-300 min-h-[180px] sm:min-h-[220px]"
        style={{
          borderStyle: "dashed",
          borderColor: dragActive
            ? "var(--color-accent)"
            : "color-mix(in srgb, var(--color-text-muted) 40%, transparent)",
          background: dragActive
            ? "color-mix(in srgb, var(--color-accent) 8%, transparent)"
            : "var(--color-surface)",
        }}
      >
        <motion.div
          animate={dragActive ? { scale: 1.1 } : { scale: 1 }}
          className="flex justify-center mb-3"
        >
          {loading ? (
            <Loader2
              className="animate-spin"
              style={{ color: "var(--color-accent)" }}
              size={28}
            />
          ) : isDone ? (
            <FileCheck
              style={{ color: "var(--color-accent-secondary)" }}
              size={28}
            />
          ) : (
            <Upload style={{ color: "var(--color-text-muted)" }} size={28} />
          )}
        </motion.div>

        <p className="font-medium text-sm sm:text-base break-words">
          {fileName || "Drop your resume PDF here"}
        </p>
        <p className="text-sm mt-1 text-[var(--color-text-muted)] break-words">
          {loading
            ? "Processing..."
            : isDone
              ? "Successfully uploaded"
              : "Or click to browse"}
        </p>

        <input
          id="resume-upload"
          type="file"
          accept=".pdf"
          onChange={(e) => processFile(e.target.files[0])}
          className="hidden"
        />
      </label>
      {error && (
        <p className="text-[var(--color-accent)] text-sm mt-2">{error}</p>
      )}
    </div>
  );
}
