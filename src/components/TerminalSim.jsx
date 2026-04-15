import { useState, useRef } from "react";

export default function TerminalSim() {
  const [lines, setLines] = useState([]);
  const [running, setRunning] = useState(false);
  const termRef = useRef(null);

  const termLines = [
    { text: "$ oqlctl run test-pompy.oql --mode dry-run", type: "cmd" },
    { text: "", type: "blank" },
    { text: "╭─ OQL Scenario: Pump Flow Test ─╮", type: "header" },
    { text: "│  Device: PSS 7000 (Dräger)      │", type: "header" },
    { text: "│  Mode:   dry-run (simulated)     │", type: "header" },
    { text: "╰──────────────────────────────────╯", type: "header" },
    { text: "", type: "blank" },
    { text: "▶ GOAL: Test przepływu", type: "goal" },
    { text: "  ├─ SET pompa 1 → 2 l/min          ✓", type: "pass" },
    { text: "  ├─ WAIT 2000ms                     ✓", type: "pass" },
    { text: "  ├─ SET pompa 1 → -2 l/min          ✓", type: "pass" },
    { text: "  ├─ WAIT 2000ms                     ✓", type: "pass" },
    { text: "  └─ SET pompa 1 → 0                 ✓", type: "pass" },
    { text: "", type: "blank" },
    { text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", type: "divider" },
    { text: "  Result: PASS  │  Steps: 5/5  │  0 errors", type: "result" },
    { text: "  Duration: 4.02s (simulated)", type: "info" },
    { text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", type: "divider" },
  ];

  const runSim = () => {
    if (running) return;
    setRunning(true);
    setLines([]);
    let idx = 0;
    const iv = setInterval(() => {
      if (idx < termLines.length) {
        setLines((p) => [...p, termLines[idx]]);
        idx++;
        if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight;
      } else {
        clearInterval(iv);
        setRunning(false);
      }
    }, 180);
  };

  const colorMap = {
    cmd: "#6ee7b7",
    header: "#94a3b8",
    goal: "#f59e0b",
    pass: "#34d399",
    fail: "#f87171",
    result: "#a78bfa",
    info: "#60a5fa",
    divider: "#475569",
    blank: "transparent",
  };

  return (
    <div className="terminal-wrapper">
      <div className="terminal-bar">
        <div className="terminal-dots">
          <span className="dot dot-r" />
          <span className="dot dot-y" />
          <span className="dot dot-g" />
        </div>
        <span className="terminal-title">oqlctl — dry-run simulation</span>
        <button className="run-btn" onClick={runSim} disabled={running}>
          {running ? "Running..." : "▶ Run"}
        </button>
      </div>
      <div className="terminal-body" ref={termRef}>
        {lines.length === 0 && (
          <div style={{ color: "#64748b", fontStyle: "italic" }}>
            Click "▶ Run" to simulate an OQL scenario execution…
          </div>
        )}
        {lines.map((l, i) => (
          <div key={i} style={{ color: colorMap[l?.type] || "#cbd5e1", minHeight: "1.4em" }}>
            {l?.text || ""}
          </div>
        ))}
        {running && <span className="cursor-blink">█</span>}
      </div>
    </div>
  );
}
