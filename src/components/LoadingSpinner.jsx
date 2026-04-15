export default function LoadingSpinner({ text = "Loading…", size = 40 }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", minHeight: "40vh", gap: 16,
    }}>
      <div style={{
        width: size, height: size,
        border: "3px solid var(--border-color, #333)",
        borderTopColor: "var(--accent, #00e5ff)",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }} />
      <span style={{ color: "var(--text-muted, #888)", fontSize: 14 }}>{text}</span>
    </div>
  );
}
