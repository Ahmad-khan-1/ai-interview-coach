"use client";

import { useState } from "react";

export default function JobDescriptionInput({ value, onChange }) {
  const [focused, setFocused] = useState(false);

  return (
    <div>
      <label className="block mb-2 font-medium text-sm sm:text-base">
        Job Description
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Paste the job description here..."
        rows={7}
        maxLength={5000}
        className="w-full min-h-[180px] sm:min-h-[220px] rounded-2xl p-4 sm:p-5 outline-none resize-y text-sm sm:text-base transition-all duration-300"
        style={{
          background: "var(--color-surface)",
          border: `1px solid ${focused ? "var(--color-accent)" : "color-mix(in srgb, var(--color-text-muted) 25%, transparent)"}`,
          boxShadow: focused
            ? "0 0 0 4px color-mix(in srgb, var(--color-accent) 15%, transparent)"
            : "none",
        }}
      />
    </div>
  );
}
