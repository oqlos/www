import { useState, useEffect, useRef } from "react";

const OQL_EXAMPLES = {
  "pump-test": {
    title: "Test Pompy / Pump Test",
    lang: "oql",
    code: `SCENARIO: "Pump Flow Test"
DEVICE_TYPE: "BA"
DEVICE_MODEL: "PSS 7000"
MANUFACTURER: "Dräger"

GOAL: Test przepływu
  # 1. Start pump at 2 l/min
    SET 'pompa 1' '2 l/min'
    WAIT 2000ms
  # 2. Reverse flow direction
    SET 'pompa 1' '-2 l/min'
    WAIT 2000ms
  # 3. Stop pump
    SET 'pompa 1' '0'`,
  },
  "mask-leak": {
    title: "Test Szczelności / Leak Test",
    lang: "oql",
    code: `SCENARIO: "Mask Leak Test"
DEVICE_TYPE: "BA"
DEVICE_MODEL: "FPS 7000"
MANUFACTURER: "Dräger"

GOAL: Pressure Seal Verification
  SET 'PUMP' 'off'
  SET 'zawór 2' '1'
  SET 'PUMP' '5 l'
  WAIT 7000ms
  MIN 'AI01' '-11.0 mbar'
  VAL 'AI01' 'mbar'
  IF 'AI01' < '-11.0 mbar' ELSE ERROR 'Vacuum too low'
  SAVE 'AI01'

GOAL: Overpressure Check
  MAX 'AI01' '-9.0 mbar'
  IF 'AI01' > '-9.0 mbar' ELSE ERROR 'Seal failure'
  SAVE 'AI01'
  SET 'PUMP' '10 l'
  WAIT 5000ms
  MIN 'AI01' '4.2 mbar'
  MAX 'AI01' '6.0 mbar'
  SAVE 'AI01'`,
  },
  "hw-diagnostics": {
    title: "Diagnostyka HW / Diagnostics",
    lang: "oql",
    code: `SCENARIO: "Hardware Diagnostics"
DEVICE_TYPE: "TEST_EQUIPMENT"

GOAL: Detect and validate hardware
  LOG "Detecting USB/serial peripherals..."
  EXPECT_DEVICE "/dev/ttyACM0" "CH340" "Modbus RTU"
  EXPECT_I2C_BUS "/dev/i2c-1"
  EXPECT_I2C_CHIP "0x48" "ADS1115 ADC"

  API_GET "/api/v1/hardware/health"
  ASSERT_STATUS 200
  ASSERT_JSON "mode" "real"
  ASSERT_JSON "piadc" "ok"
  ASSERT_JSON "motor" "ok"

  # Test pump
  SET "pompa" "2"
  WAIT 500ms
  ASSERT_SENSOR "sc-sensor" ">" "1" "mbar"
  SET "pompa" "0"

  # Test valves
  SET "zawor NC" "ON"
  WAIT 200ms
  ASSERT_VALVE "valve-nc" "True"
  SET "zawor NC" "OFF"

  LOG "Hardware diagnostics complete!"`,
  },
  "api-test": {
    title: "Test API / TestQL",
    lang: "iql",
    code: `# TestQL — API & GUI Test Scenario
SET api_url "http://localhost:8101"

LOG "Starting API test suite"

# Test device listing
API GET "\${api_url}/api/v3/data/devices"
ASSERT_STATUS 200
ASSERT_CONTAINS "device"
ASSERT_JSON data.length > 0

# Test scenario registration
API POST "\${api_url}/api/v3/scenarios" {
  "id": "ts-pump-001",
  "name": "Pump Flow Test"
}
ASSERT_STATUS 201

# GUI Navigation Test
NAVIGATE "/connect-workshop"
WAIT 500
CLICK "[data-action='search']"
INPUT "#search-input" "drager"
ASSERT_VISIBLE "[data-testid='results']"
ASSERT_TEXT "#status" "Connected"`,
  },
  "session-record": {
    title: "Nagrywanie Sesji / Record",
    lang: "iql",
    code: `# Session Recording & Replay
RECORD_START "demo-session-001"
LOG "Recording started" {"level": "info"}

# Device identification
NAVIGATE "/connect-id/device-rfid"
SELECT_DEVICE "d-demo-001" {
  "type": "PSS-7000",
  "serial": "PS12345"
}

# Start test interval
NAVIGATE "/connect-test/testing"
SELECT_INTERVAL "3m" {
  "code": "periodic_3m",
  "description": "3 miesiące"
}

# Execute test steps
START_TEST "ts-demo" {"name": "Demo", "steps": 3}
STEP_COMPLETE "step-1" {"name": "Init", "status": "passed"}
WAIT 200
STEP_COMPLETE "step-2" {
  "name": "Pressure",
  "status": "passed",
  "value": "15.2 mbar"
}
STEP_COMPLETE "step-3" {"name": "Final", "status": "passed"}

RECORD_STOP
# REPLAY "session-id" {"variables": {...}}`,
  },
};

// ─── Syntax Highlighting ───
function highlightOQL(code) {
  return code.split("\n").map((line, i) => {
    let html = line
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // comments
    html = html.replace(/(#.*)$/, '<span class="syn-comment">$1</span>');

    // strings
    html = html.replace(
      /("[^"]*"|'[^']*')/g,
      '<span class="syn-string">$1</span>'
    );

    // keywords
    html = html.replace(
      /\b(SCENARIO|DEVICE_TYPE|DEVICE_MODEL|MANUFACTURER|GOAL|SET|WAIT|SAVE|MIN|MAX|VAL|IF|ELSE|ERROR|PUMP|LOG|ASSERT_STATUS|ASSERT_JSON|ASSERT_SENSOR|ASSERT_VALVE|API_GET|EXPECT_DEVICE|EXPECT_I2C_BUS|EXPECT_I2C_CHIP|SHELL_EXPORT)\b/g,
      '<span class="syn-keyword">$1</span>'
    );

    // arrows
    html = html.replace(/→/g, '<span class="syn-arrow">→</span>');

    // numbers with units
    html = html.replace(
      /\b(\d+\.?\d*)\s*(ms|mbar|bar|l\/min|l|s)\b/g,
      '<span class="syn-number">$1</span><span class="syn-unit">$2</span>'
    );
    // plain numbers
    html = html.replace(
      /(?<!class=")\b(\d+\.?\d*)\b(?!["<])/g,
      '<span class="syn-number">$1</span>'
    );

    return `<span class="line-num">${String(i + 1).padStart(3)}</span>${html}`;
  });
}

function highlightIQL(code) {
  return code.split("\n").map((line, i) => {
    let html = line
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    html = html.replace(/(#.*)$/, '<span class="syn-comment">$1</span>');
    html = html.replace(
      /("[^"]*")/g,
      '<span class="syn-string">$1</span>'
    );
    html = html.replace(
      /\b(SET|LOG|API|GET|POST|PUT|DELETE|ASSERT_STATUS|ASSERT_OK|ASSERT_CONTAINS|ASSERT_JSON|ASSERT_VISIBLE|ASSERT_TEXT|NAVIGATE|WAIT|CLICK|INPUT|SELECT_DEVICE|SELECT_INTERVAL|START_TEST|STEP_COMPLETE|RECORD_START|RECORD_STOP|REPLAY|INCLUDE|ENCODER_ON|ENCODER_OFF|ENCODER_CLICK|ENCODER_SCROLL|ENCODER_FOCUS)\b/g,
      '<span class="syn-keyword">$1</span>'
    );
    html = html.replace(
      /\$\{[^}]+\}/g,
      '<span class="syn-interp">$&</span>'
    );
    html = html.replace(
      /(?<!class=")\b(\d+\.?\d*)\b(?!["<])/g,
      '<span class="syn-number">$1</span>'
    );
    return `<span class="line-num">${String(i + 1).padStart(3)}</span>${html}`;
  });
}

// ─── Terminal Simulation ───
function TerminalSim() {
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
          <div key={i} style={{ color: colorMap[l.type] || "#cbd5e1", minHeight: "1.4em" }}>
            {l.text}
          </div>
        ))}
        {running && <span className="cursor-blink">█</span>}
      </div>
    </div>
  );
}

// ─── Code Editor ───
function CodeEditor({ example }) {
  const [code, setCode] = useState(example.code);
  const [highlighted, setHighlighted] = useState([]);
  const textareaRef = useRef(null);
  const preRef = useRef(null);

  useEffect(() => {
    setCode(example.code);
  }, [example]);

  useEffect(() => {
    const fn = example.lang === "oql" ? highlightOQL : highlightIQL;
    setHighlighted(fn(code));
  }, [code, example.lang]);

  const handleScroll = () => {
    if (preRef.current && textareaRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  return (
    <div className="editor-wrapper">
      <div className="editor-header">
        <span className="file-badge">{example.lang === "oql" ? "⚙ .oql" : "🧪 .iql / .tql"}</span>
        <span className="file-title">{example.title}</span>
      </div>
      <div className="editor-body">
        <pre
          ref={preRef}
          className="editor-highlight"
          dangerouslySetInnerHTML={{ __html: highlighted.join("\n") }}
        />
        <textarea
          ref={textareaRef}
          className="editor-textarea"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onScroll={handleScroll}
          spellCheck={false}
        />
      </div>
    </div>
  );
}

// ─── Architecture Diagram ───
function ArchDiagram() {
  return (
    <svg viewBox="0 0 800 320" className="arch-svg">
      <defs>
        <linearGradient id="gBlue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <linearGradient id="gGreen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="gAmber" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="gPurple" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#6d28d9" />
        </linearGradient>
        <filter id="shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* DSL Layer */}
      <rect x="20" y="20" width="180" height="120" rx="12" fill="url(#gBlue)" filter="url(#shadow)" />
      <text x="110" y="55" textAnchor="middle" fill="white" fontWeight="700" fontSize="15">.oql / .iql</text>
      <text x="110" y="78" textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="11">Declarative DSL</text>
      <text x="110" y="96" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="10">SCENARIO → GOAL</text>
      <text x="110" y="112" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="10">→ SET / WAIT / IF</text>
      <text x="110" y="128" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="10">→ SAVE / ASSERT</text>

      {/* OqlOS Core */}
      <rect x="260" y="20" width="280" height="120" rx="12" fill="url(#gGreen)" filter="url(#shadow)" />
      <text x="400" y="52" textAnchor="middle" fill="white" fontWeight="700" fontSize="16">OqlOS Runtime</text>
      <text x="310" y="78" textAnchor="start" fill="rgba(255,255,255,0.8)" fontSize="11">◆ Parser + Interpreter</text>
      <text x="310" y="96" textAnchor="start" fill="rgba(255,255,255,0.8)" fontSize="11">◆ FastAPI REST + SSE</text>
      <text x="310" y="114" textAnchor="start" fill="rgba(255,255,255,0.8)" fontSize="11">◆ Hardware Abstraction</text>
      <text x="440" y="78" textAnchor="start" fill="rgba(255,255,255,0.6)" fontSize="11">◆ Event Store</text>
      <text x="440" y="96" textAnchor="start" fill="rgba(255,255,255,0.6)" fontSize="11">◆ Docker / Podman</text>
      <text x="440" y="114" textAnchor="start" fill="rgba(255,255,255,0.6)" fontSize="11">◆ CLI (oqlctl)</text>

      {/* Hardware Layer */}
      <rect x="600" y="20" width="180" height="120" rx="12" fill="url(#gAmber)" filter="url(#shadow)" />
      <text x="690" y="52" textAnchor="middle" fill="white" fontWeight="700" fontSize="14">Hardware</text>
      <text x="690" y="76" textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="11">Modbus RTU</text>
      <text x="690" y="94" textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="11">GPIO / I²C / USB</text>
      <text x="690" y="112" textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="11">Sensors / Valves</text>
      <text x="690" y="128" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="10">ADS1115 / DRI0050</text>

      {/* Arrows */}
      <line x1="200" y1="80" x2="258" y2="80" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrowhead)" />
      <line x1="540" y1="80" x2="598" y2="80" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrowhead)" />

      {/* Platform row */}
      <rect x="20" y="180" width="230" height="120" rx="12" fill="url(#gPurple)" filter="url(#shadow)" opacity="0.9" />
      <text x="135" y="212" textAnchor="middle" fill="white" fontWeight="700" fontSize="14">🐳 Docker / PC</text>
      <text x="135" y="235" textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="11">docker-compose up</text>
      <text x="135" y="255" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="10">Traefik + API + IDE</text>
      <text x="135" y="275" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="10">Windows / Linux / macOS</text>

      <rect x="285" y="180" width="230" height="120" rx="12" fill="url(#gPurple)" filter="url(#shadow)" opacity="0.9" />
      <text x="400" y="212" textAnchor="middle" fill="white" fontWeight="700" fontSize="14">🍓 Raspberry Pi</text>
      <text x="400" y="235" textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="11">oqlagent (Edge Node)</text>
      <text x="400" y="255" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="10">WebSocket → API</text>
      <text x="400" y="275" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="10">RPi 3B+ / 4 / 5</text>

      <rect x="550" y="180" width="230" height="120" rx="12" fill="url(#gPurple)" filter="url(#shadow)" opacity="0.9" />
      <text x="665" y="212" textAnchor="middle" fill="white" fontWeight="700" fontSize="14">🌐 SaaS / Cloud</text>
      <text x="665" y="235" textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="11">OqlOS Pro / Enterprise</text>
      <text x="665" y="255" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="10">Fleet management</text>
      <text x="665" y="275" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="10">Reports + Compliance</text>

      {/* Vertical connectors */}
      <line x1="135" y1="142" x2="135" y2="178" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4" />
      <line x1="400" y1="142" x2="400" y2="178" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4" />
      <line x1="665" y1="142" x2="665" y2="178" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4" />

      <defs>
        <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#94a3b8" />
        </marker>
      </defs>
    </svg>
  );
}

// ─── Main App ───
export default function OqlOSLanding() {
  const [activeExample, setActiveExample] = useState("pump-test");
  const [activeTab, setActiveTab] = useState("docker");

  const exampleKeys = Object.keys(OQL_EXAMPLES);

  return (
    <div className="oqlos-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Sora:wght@300;400;600;700;800&display=swap');

        .oqlos-root {
          --bg-deep: #0a0f1a;
          --bg-card: #111827;
          --bg-card-hover: #1a2335;
          --border: #1e293b;
          --text-primary: #e2e8f0;
          --text-secondary: #94a3b8;
          --text-muted: #64748b;
          --accent-blue: #3b82f6;
          --accent-green: #10b981;
          --accent-amber: #f59e0b;
          --accent-purple: #8b5cf6;
          --accent-red: #ef4444;
          --font-display: 'Sora', sans-serif;
          --font-mono: 'JetBrains Mono', monospace;
          font-family: var(--font-display);
          background: var(--bg-deep);
          color: var(--text-primary);
          line-height: 1.6;
          overflow-x: hidden;
        }

        /* ── Hero ── */
        .hero {
          padding: 80px 32px 60px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .hero::before {
          content: '';
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 600px 400px at 30% 20%, rgba(59,130,246,0.08), transparent),
            radial-gradient(ellipse 500px 300px at 70% 60%, rgba(139,92,246,0.06), transparent);
          pointer-events: none;
        }
        .hero-badge {
          display: inline-block;
          padding: 6px 16px;
          border-radius: 999px;
          border: 1px solid rgba(59,130,246,0.3);
          background: rgba(59,130,246,0.08);
          color: var(--accent-blue);
          font-size: 12px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          font-weight: 600;
          margin-bottom: 24px;
        }
        .hero h1 {
          font-size: clamp(36px, 6vw, 64px);
          font-weight: 800;
          letter-spacing: -1.5px;
          line-height: 1.1;
          margin: 0 0 20px;
          background: linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero h1 em {
          font-style: normal;
          background: linear-gradient(135deg, var(--accent-blue) 0%, var(--accent-purple) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-sub {
          max-width: 680px;
          margin: 0 auto 36px;
          font-size: 18px;
          color: var(--text-secondary);
          font-weight: 300;
        }
        .hero-actions {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 28px;
          border-radius: 10px;
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 15px;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-primary {
          background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
          color: white;
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(59,130,246,0.3); }
        .btn-outline {
          background: transparent;
          color: var(--text-primary);
          border: 1px solid var(--border);
        }
        .btn-outline:hover { border-color: var(--accent-blue); background: rgba(59,130,246,0.05); }

        /* ── Section ── */
        .section {
          max-width: 1100px;
          margin: 0 auto;
          padding: 64px 24px;
        }
        .section-label {
          font-size: 12px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--accent-green);
          font-weight: 600;
          margin-bottom: 8px;
        }
        .section h2 {
          font-size: 32px;
          font-weight: 700;
          letter-spacing: -0.5px;
          margin: 0 0 12px;
        }
        .section-desc {
          color: var(--text-secondary);
          font-size: 16px;
          max-width: 640px;
          margin-bottom: 40px;
        }

        /* ── Features Grid ── */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }
        .feature-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 28px;
          transition: all 0.25s;
        }
        .feature-card:hover {
          background: var(--bg-card-hover);
          border-color: rgba(59,130,246,0.3);
          transform: translateY(-3px);
        }
        .feature-icon {
          font-size: 28px;
          margin-bottom: 14px;
        }
        .feature-card h3 {
          font-size: 18px;
          font-weight: 700;
          margin: 0 0 8px;
        }
        .feature-card p {
          color: var(--text-secondary);
          font-size: 14px;
          margin: 0;
          line-height: 1.6;
        }

        /* ── Editor ── */
        .editor-section {
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
          background: var(--bg-card);
        }
        .example-tabs {
          display: flex;
          gap: 0;
          border-bottom: 1px solid var(--border);
          overflow-x: auto;
        }
        .example-tab {
          padding: 12px 20px;
          font-size: 13px;
          font-family: var(--font-mono);
          border: none;
          background: transparent;
          color: var(--text-muted);
          cursor: pointer;
          white-space: nowrap;
          border-bottom: 2px solid transparent;
          transition: all 0.2s;
        }
        .example-tab:hover { color: var(--text-secondary); }
        .example-tab.active {
          color: var(--accent-blue);
          border-bottom-color: var(--accent-blue);
          background: rgba(59,130,246,0.05);
        }
        .editor-wrapper { position: relative; }
        .editor-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 16px;
          border-bottom: 1px solid var(--border);
          background: rgba(0,0,0,0.2);
        }
        .file-badge {
          font-size: 11px;
          padding: 3px 10px;
          border-radius: 6px;
          background: rgba(59,130,246,0.15);
          color: var(--accent-blue);
          font-family: var(--font-mono);
          font-weight: 600;
        }
        .file-title {
          font-size: 13px;
          color: var(--text-secondary);
          font-weight: 500;
        }
        .editor-body {
          position: relative;
          min-height: 360px;
          max-height: 440px;
          overflow: auto;
        }
        .editor-highlight, .editor-textarea {
          font-family: var(--font-mono);
          font-size: 13px;
          line-height: 1.7;
          padding: 16px;
          margin: 0;
          white-space: pre;
          tab-size: 2;
        }
        .editor-highlight {
          pointer-events: none;
          position: absolute;
          inset: 0;
          overflow: hidden;
          color: var(--text-primary);
        }
        .editor-textarea {
          position: relative;
          width: 100%;
          min-height: 360px;
          background: transparent;
          color: transparent;
          caret-color: var(--accent-green);
          border: none;
          outline: none;
          resize: vertical;
          z-index: 1;
        }
        .line-num {
          display: inline-block;
          width: 36px;
          margin-right: 16px;
          color: var(--text-muted);
          text-align: right;
          user-select: none;
          opacity: 0.5;
        }
        .syn-keyword { color: #c084fc; font-weight: 600; }
        .syn-string { color: #34d399; }
        .syn-comment { color: #64748b; font-style: italic; }
        .syn-number { color: #fbbf24; }
        .syn-unit { color: #fb923c; font-style: italic; }
        .syn-arrow { color: #f472b6; font-weight: 700; }
        .syn-interp { color: #60a5fa; }

        /* ── Terminal ── */
        .terminal-wrapper {
          border-radius: 14px;
          overflow: hidden;
          border: 1px solid var(--border);
          background: #0d1117;
          margin-top: 32px;
        }
        .terminal-bar {
          display: flex;
          align-items: center;
          padding: 10px 16px;
          background: #161b22;
          border-bottom: 1px solid var(--border);
        }
        .terminal-dots { display: flex; gap: 6px; margin-right: 16px; }
        .dot { width: 12px; height: 12px; border-radius: 50%; }
        .dot-r { background: #f87171; }
        .dot-y { background: #fbbf24; }
        .dot-g { background: #34d399; }
        .terminal-title {
          flex: 1;
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--text-muted);
        }
        .run-btn {
          padding: 6px 18px;
          border-radius: 8px;
          border: 1px solid var(--accent-green);
          background: rgba(16,185,129,0.1);
          color: var(--accent-green);
          font-family: var(--font-mono);
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .run-btn:hover:not(:disabled) { background: rgba(16,185,129,0.2); }
        .run-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .terminal-body {
          padding: 16px;
          font-family: var(--font-mono);
          font-size: 13px;
          line-height: 1.7;
          min-height: 200px;
          max-height: 380px;
          overflow-y: auto;
        }
        .cursor-blink { animation: blink 1s step-end infinite; }
        @keyframes blink { 50% { opacity: 0; } }

        /* ── Install Tabs ── */
        .install-tabs {
          display: flex;
          gap: 0;
          border-bottom: 1px solid var(--border);
          margin-bottom: 24px;
        }
        .install-tab {
          padding: 12px 24px;
          border: none;
          background: transparent;
          color: var(--text-muted);
          font-family: var(--font-display);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.2s;
        }
        .install-tab:hover { color: var(--text-secondary); }
        .install-tab.active {
          color: var(--accent-green);
          border-bottom-color: var(--accent-green);
        }
        .install-code {
          background: #0d1117;
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 20px;
          font-family: var(--font-mono);
          font-size: 13px;
          line-height: 1.8;
          color: var(--text-primary);
          overflow-x: auto;
        }
        .install-code .cm { color: #64748b; }
        .install-code .kw { color: #c084fc; }
        .install-code .str { color: #34d399; }
        .install-code .fl { color: #60a5fa; }

        /* ── Pricing ── */
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }
        .price-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 32px 24px;
          text-align: center;
          transition: all 0.25s;
        }
        .price-card:hover { transform: translateY(-3px); }
        .price-card.featured {
          border-color: var(--accent-blue);
          box-shadow: 0 0 40px rgba(59,130,246,0.1);
        }
        .price-label {
          font-size: 12px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: var(--accent-blue);
          font-weight: 600;
          margin-bottom: 8px;
        }
        .price-card h3 { font-size: 22px; margin: 0 0 4px; }
        .price-amount {
          font-size: 36px;
          font-weight: 800;
          margin: 16px 0 4px;
        }
        .price-period {
          font-size: 13px;
          color: var(--text-muted);
          margin-bottom: 20px;
        }
        .price-features {
          text-align: left;
          list-style: none;
          padding: 0;
          margin: 0 0 24px;
        }
        .price-features li {
          padding: 6px 0;
          font-size: 14px;
          color: var(--text-secondary);
        }
        .price-features li::before {
          content: '✓ ';
          color: var(--accent-green);
          font-weight: 700;
        }

        /* ── Architecture ── */
        .arch-svg {
          width: 100%;
          max-width: 840px;
          margin: 0 auto;
          display: block;
        }

        /* ── API Section ── */
        .api-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
          gap: 16px;
        }
        .api-item {
          display: flex;
          align-items: baseline;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 8px;
          background: rgba(0,0,0,0.2);
          font-family: var(--font-mono);
          font-size: 12px;
        }
        .api-method {
          padding: 2px 8px;
          border-radius: 4px;
          font-weight: 700;
          font-size: 10px;
          letter-spacing: 0.5px;
        }
        .api-method.get { background: rgba(59,130,246,0.2); color: var(--accent-blue); }
        .api-method.post { background: rgba(16,185,129,0.2); color: var(--accent-green); }
        .api-method.put { background: rgba(245,158,11,0.2); color: var(--accent-amber); }
        .api-path { color: var(--text-secondary); }

        /* ── Footer ── */
        .footer {
          text-align: center;
          padding: 40px 24px;
          border-top: 1px solid var(--border);
          color: var(--text-muted);
          font-size: 13px;
        }
        .footer a { color: var(--accent-blue); text-decoration: none; }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .hero { padding: 48px 16px 40px; }
          .section { padding: 40px 16px; }
          .features-grid, .pricing-grid { grid-template-columns: 1fr; }
          .api-grid { grid-template-columns: 1fr; }
          .hero-actions { flex-direction: column; align-items: center; }
        }
      `}</style>

      {/* ═══ HERO ═══ */}
      <header className="hero">
        <div className="hero-badge">Open Source · Apache 2.0</div>
        <h1>
          <em>OqlOS</em> + TestQL
        </h1>
        <p className="hero-sub">
          Automatyzacja testów sprzętu przemysłowego w deklaratywnym DSL.
          Uruchom na Dockerze, Raspberry Pi lub w chmurze — od aparatów oddechowych po systemy IoT.
        </p>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={() => document.getElementById('install')?.scrollIntoView({behavior:'smooth'})}>
            🐳 Docker Quick Start
          </button>
          <button className="btn btn-outline" onClick={() => document.getElementById('editor')?.scrollIntoView({behavior:'smooth'})}>
            ⚙ Wypróbuj OQL Live
          </button>
          <button className="btn btn-outline" onClick={() => document.getElementById('api')?.scrollIntoView({behavior:'smooth'})}>
            📡 REST API
          </button>
        </div>
      </header>

      {/* ═══ FEATURES ═══ */}
      <section className="section">
        <div className="section-label">Ekosystem</div>
        <h2>Jeden system — dwa języki DSL</h2>
        <p className="section-desc">
          OQL kontroluje hardware (zawory, pompy, sensory). TestQL/IQL testuje API i GUI. 
          Razem pokrywają cały pipeline: od testu ciśnieniowego po raport certyfikacyjny.
        </p>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">⚙</div>
            <h3>OQL — Hardware DSL</h3>
            <p>
              Deklaratywne scenariusze testowe dla sprzętu: SET, WAIT, MIN/MAX, IF/ELSE, SAVE.
              Sterowanie zaworami Modbus, pompami DRI0050, sensorami ADS1115.
              Pliki .oql wersjonowane w Git.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🧪</div>
            <h3>TestQL/IQL — API & GUI DSL</h3>
            <p>
              Testowanie REST API (GET/POST/PUT/DELETE), asercje JSON,
              nawigacja GUI przez Playwright, sterowanie enkoderem sprzętowym.
              Zero kodu — czytelna składnia dla operatorów i QA.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🐳</div>
            <h3>Docker & Podman</h3>
            <p>
              docker-compose up — i masz pełny stack: API (FastAPI), IDE (React),
              Traefik reverse proxy. Tryb dev i prod z TLS. Gotowy w minuty.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🍓</div>
            <h3>Raspberry Pi Agent</h3>
            <p>
              oqlagent działa na RPi 3B+/4/5 jako edge node. Łączy się z centralnym API
              przez WebSocket. Obsługa GPIO, I²C, USB, Modbus RTU bezpośrednio.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📡</div>
            <h3>REST API + SSE</h3>
            <p>
              Pełne API: /scenarios, /execution/start|step|pause|stop,
              /hardware/identify, /sensor/read. Server-Sent Events do streamowania
              wyników w czasie rzeczywistym.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📋</div>
            <h3>Raporty & Certyfikaty</h3>
            <p>
              Eksport wyników do CSV, PDF, protokołów certyfikacyjnych (EN 137, GxP).
              Event Store z pełną historią. Integracja ERP/LIMS.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ ARCHITECTURE ═══ */}
      <section className="section">
        <div className="section-label">Architektura</div>
        <h2>Od pliku .oql do pomiaru na sensorie</h2>
        <p className="section-desc">
          Deklaratywny DSL → Parser → Interpreter → Hardware Abstraction → Modbus/GPIO/I²C.
          Uruchom lokalnie, na Raspberry Pi lub jako serwis Docker.
        </p>
        <ArchDiagram />
      </section>

      {/* ═══ LIVE EDITOR ═══ */}
      <section className="section" id="editor">
        <div className="section-label">Edytor live</div>
        <h2>Pisz i edytuj scenariusze OQL / TestQL</h2>
        <p className="section-desc">
          Interaktywny edytor z kolorowaniem składni. Wybierz przykład lub pisz własny scenariusz.
          Obsługuje zarówno pliki .oql (hardware) jak i .iql/.tql (API/GUI).
        </p>
        <div className="editor-section">
          <div className="example-tabs">
            {exampleKeys.map((k) => (
              <button
                key={k}
                className={`example-tab ${activeExample === k ? "active" : ""}`}
                onClick={() => setActiveExample(k)}
              >
                {OQL_EXAMPLES[k].title}
              </button>
            ))}
          </div>
          <CodeEditor example={OQL_EXAMPLES[activeExample]} />
        </div>

        <TerminalSim />
      </section>

      {/* ═══ INSTALL ═══ */}
      <section className="section" id="install">
        <div className="section-label">Instalacja</div>
        <h2>Uruchom w 3 minuty</h2>
        <p className="section-desc">
          Wybierz platformę docelową. Docker dla szybkiego startu, pip dla integracji,
          RPi dla produkcyjnych węzłów testowych.
        </p>

        <div className="install-tabs">
          {[
            { id: "docker", label: "🐳 Docker" },
            { id: "pip", label: "🐍 pip install" },
            { id: "rpi", label: "🍓 Raspberry Pi" },
          ].map((t) => (
            <button
              key={t.id}
              className={`install-tab ${activeTab === t.id ? "active" : ""}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === "docker" && (
          <div className="install-code">
            <span className="cm"># Clone the monorepo</span>{"\n"}
            <span className="kw">git clone</span> <span className="str">https://github.com/softreck/oqlos.git</span>{"\n"}
            <span className="kw">cd</span> oqlos{"\n\n"}
            <span className="cm"># Development mode (API + IDE + Traefik)</span>{"\n"}
            <span className="kw">docker-compose</span> <span className="fl">-f infra/docker/dev/docker-compose.dev.yml</span> up{"\n\n"}
            <span className="cm"># Access points:</span>{"\n"}
            <span className="cm">#   API:       http://api.oqlos.localhost</span>{"\n"}
            <span className="cm">#   IDE:       http://ide.oqlos.localhost</span>{"\n"}
            <span className="cm">#   Traefik:   http://localhost:8080</span>{"\n\n"}
            <span className="cm"># Production mode (TLS + Let's Encrypt)</span>{"\n"}
            <span className="kw">docker-compose</span> <span className="fl">-f infra/docker/prod/docker-compose.prod.yml</span> up -d{"\n"}
          </div>
        )}
        {activeTab === "pip" && (
          <div className="install-code">
            <span className="cm"># Install OqlOS runtime</span>{"\n"}
            <span className="kw">pip install</span> oqlos{"\n\n"}
            <span className="cm"># Install CLI tool</span>{"\n"}
            <span className="kw">pip install</span> oql{"\n\n"}
            <span className="cm"># Install TestQL for API/GUI testing</span>{"\n"}
            <span className="kw">pip install</span> testql{"\n\n"}
            <span className="cm"># Verify installation</span>{"\n"}
            <span className="kw">oqlctl</span> --version{"\n"}
            <span className="kw">testql</span> --version{"\n\n"}
            <span className="cm"># Run a scenario in dry-run (no hardware needed)</span>{"\n"}
            <span className="kw">oqlctl run</span> test-pompy.oql <span className="fl">--mode dry-run</span>{"\n\n"}
            <span className="cm"># Start interactive REPL</span>{"\n"}
            <span className="kw">oqlctl shell</span>{"\n"}
          </div>
        )}
        {activeTab === "rpi" && (
          <div className="install-code">
            <span className="cm"># On Raspberry Pi 3B+ / 4 / 5</span>{"\n\n"}
            <span className="cm"># Option A: Docker agent</span>{"\n"}
            <span className="kw">docker run</span> -d \{"\n"}
            {"  "}<span className="fl">--device=/dev/ttyACM0</span> \{"\n"}
            {"  "}<span className="fl">--device=/dev/i2c-1</span> \{"\n"}
            {"  "}<span className="fl">-e AGENT_ID=rpi-node-01</span> \{"\n"}
            {"  "}<span className="fl">-e API_WS_URL=wss://api.oqlos.io/ws/agent</span> \{"\n"}
            {"  "}<span className="fl">-e HARDWARE_MODE=rpi</span> \{"\n"}
            {"  "}<span className="str">ghcr.io/softreck/oqlagent:latest</span>{"\n\n"}
            <span className="cm"># Option B: Native install</span>{"\n"}
            <span className="kw">pip install</span> oqlos oql{"\n"}
            <span className="kw">export</span> OQLOS_HARDWARE_MODE=real{"\n"}
            <span className="kw">export</span> MODBUS_SERIAL_PORT=/dev/ttyACM1{"\n"}
            <span className="kw">oqlos-server</span> <span className="fl">--port 8200</span>{"\n\n"}
            <span className="cm"># Hardware diagnostics</span>{"\n"}
            <span className="kw">python -m</span> oqlos.tools.hardware_diagnose <span className="fl">--diagnose</span>{"\n"}
          </div>
        )}
      </section>

      {/* ═══ API REFERENCE ═══ */}
      <section className="section" id="api">
        <div className="section-label">REST API</div>
        <h2>Pełne API sterowania</h2>
        <p className="section-desc">
          FastAPI z automatyczną dokumentacją OpenAPI. Scenariusze, egzekucja, hardware — wszystko przez HTTP.
        </p>
        <div className="api-grid">
          <div className="api-item"><span className="api-method get">GET</span><span className="api-path">/api/v1/scenarios</span></div>
          <div className="api-item"><span className="api-method post">POST</span><span className="api-path">/api/v1/scenarios/register</span></div>
          <div className="api-item"><span className="api-method post">POST</span><span className="api-path">/api/v1/execution/start</span></div>
          <div className="api-item"><span className="api-method post">POST</span><span className="api-path">/api/v1/execution/step</span></div>
          <div className="api-item"><span className="api-method post">POST</span><span className="api-path">/api/v1/execution/pause</span></div>
          <div className="api-item"><span className="api-method post">POST</span><span className="api-path">/api/v1/execution/stop</span></div>
          <div className="api-item"><span className="api-method get">GET</span><span className="api-path">/api/v1/execution/status</span></div>
          <div className="api-item"><span className="api-method get">GET</span><span className="api-path">/api/v1/execution/stream (SSE)</span></div>
          <div className="api-item"><span className="api-method get">GET</span><span className="api-path">/api/v1/hardware/health</span></div>
          <div className="api-item"><span className="api-method get">GET</span><span className="api-path">/api/v1/hardware/identify</span></div>
          <div className="api-item"><span className="api-method put">PUT</span><span className="api-path">/api/v1/hardware/{"{id}"}</span></div>
          <div className="api-item"><span className="api-method get">GET</span><span className="api-path">/api/v1/hardware/sensor/{"{id}"}</span></div>
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section className="section">
        <div className="section-label">Plany</div>
        <h2>Dopasowany do skali</h2>
        <p className="section-desc">
          Zacznij za darmo z open-source core. Skaluj do floty urządzeń z Pro lub Enterprise.
        </p>
        <div className="pricing-grid">
          <div className="price-card">
            <div className="price-label">Open Source</div>
            <h3>OqlOS Free</h3>
            <div className="price-amount">€0</div>
            <div className="price-period">Apache 2.0 — na zawsze</div>
            <ul className="price-features">
              <li>oql-core parser + interpreter</li>
              <li>oql-cli (oqlctl)</li>
              <li>TestQL runner</li>
              <li>Jedno urządzenie, lokalnie</li>
              <li>Docker compose (dev)</li>
              <li>Community support</li>
            </ul>
            <button className="btn btn-outline" style={{width:'100%',justifyContent:'center'}}>Pobierz z GitHub</button>
          </div>
          <div className="price-card featured">
            <div className="price-label">Rekomendowany</div>
            <h3>OqlOS Pro</h3>
            <div className="price-amount">€49<span style={{fontSize:16,fontWeight:400,color:'var(--text-muted)'}}>/mies.</span></div>
            <div className="price-period">per organizacja</div>
            <ul className="price-features">
              <li>Wszystko z Free +</li>
              <li>Multi-device fleet management</li>
              <li>OqlIDE (web editor)</li>
              <li>Biblioteka scenariuszy</li>
              <li>Raporty PDF + compliance</li>
              <li>Docker prod z TLS</li>
              <li>Email support</li>
            </ul>
            <button className="btn btn-primary" style={{width:'100%',justifyContent:'center'}}>Rozpocznij trial</button>
          </div>
          <div className="price-card">
            <div className="price-label">Dla dużych firm</div>
            <h3>Enterprise</h3>
            <div className="price-amount" style={{fontSize:28}}>Indywidualnie</div>
            <div className="price-period">custom pricing</div>
            <ul className="price-features">
              <li>Wszystko z Pro +</li>
              <li>On-premise deployment</li>
              <li>White-label branding</li>
              <li>Custom hardware drivers</li>
              <li>Integracja ERP / LIMS</li>
              <li>SLA + dedicated support</li>
              <li>Szkolenia on-site</li>
            </ul>
            <button className="btn btn-outline" style={{width:'100%',justifyContent:'center'}}>Kontakt</button>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="footer">
        <p>
          OqlOS © 2024–2026 · <a href="https://github.com/softreck/oqlos">GitHub</a> · Apache 2.0 · 
          Python 3.10+ · FastAPI · React · Docker
        </p>
        <p style={{marginTop:8}}>
          96 tests passing · 3 scenarios (12/12 goals) · CC̄≤15 · 0 violations
        </p>
      </footer>
    </div>
  );
}
