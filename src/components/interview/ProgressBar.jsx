export default function ProgressBar({ current, total }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="h-1.5 flex-1 rounded-full transition-all duration-500"
          style={{
            background:
              i < current
                ? "linear-gradient(90deg, var(--color-accent), var(--color-accent-secondary))"
                : "color-mix(in srgb, var(--color-text-muted) 20%, transparent)",
          }}
        />
      ))}
    </div>
  );
}
