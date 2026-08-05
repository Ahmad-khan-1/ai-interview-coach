export default function Shimmer({
  width = "100%",
  height = "1rem",
  borderRadius = "1rem",
  className = "",
  style = {},
}) {
  const toCssValue = (value) =>
    typeof value === "number" ? `${value}px` : value;

  return (
    <div
      className={`shimmer ${className}`}
      aria-hidden="true"
      style={{
        width: toCssValue(width),
        height: toCssValue(height),
        borderRadius: toCssValue(borderRadius),
        ...style,
      }}
    />
  );
}
