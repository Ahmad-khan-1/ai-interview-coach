export default function Logo() {
  return (
    <div className="flex items-center gap-2.5 sm:gap-3.5 p-1 min-w-0">
      {/* 
        Updated Icon Style: 
        A larger (36px) and more abstract fusion of a stylized 'A' 
        intertwined with a sophisticated voice waveform.
      */}
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        className="shrink-0 w-8 h-8 sm:w-9 sm:h-9"
      >
        <defs>
          <linearGradient id="logoGradient" x1="0" y1="0" x2="36" y2="36">
            <stop offset="0%" stopColor="var(--color-accent)" />
            <stop offset="100%" stopColor="var(--color-accent-secondary)" />
          </linearGradient>

          {/* Subtle glow filter to make it look impressive */}
          <filter id="aiGlow" x="-15%" y="-15%" width="130%" height="130%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer stylized wave-ribbon forming an 'A' */}
        <path
          d="M6 22.5C6 16.15 10.15 11 16 11C21.85 11 26 16.15 26 22.5"
          stroke="url(#logoGradient)"
          strokeWidth="3.5"
          strokeLinecap="round"
          filter="url(#aiGlow)"
        />

        {/* Core AI/Waveform structure */}
        <path
          d="M16 4V16"
          stroke="url(#logoGradient)"
          strokeWidth="3.5"
          strokeLinecap="round"
          filter="url(#aiGlow)"
        />

        <path
          d="M11 15C11 10.5 13.5 7 16 7C18.5 7 21 10.5 21 15"
          stroke="url(#logoGradient)"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Precision waveform dots at the bottom */}
        <circle cx="16" cy="31" r="2.5" fill="url(#logoGradient)" />
        <circle cx="24" cy="27" r="2" fill="url(#logoGradient)" />
        <circle cx="8" cy="27" r="2" fill="url(#logoGradient)" />
      </svg>

      {/* 
        Upscaled Text Style:
        Slightly larger (text-base), heavier (font-semibold) sans-serif 
        for a cleaner, premium brand feel.
      */}
      <span
        className="text-sm sm:text-base font-semibold tracking-tight font-sans whitespace-nowrap"
        style={{ color: "var(--color-text-primary)" }}
      >
        INTERVIEW
        <span
          className="ml-1 text-xs sm:text-sm font-bold opacity-90"
          style={{ color: "var(--color-accent)" }}
        >
          AI
        </span>
      </span>
    </div>
  );
}
