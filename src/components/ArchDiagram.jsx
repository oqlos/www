export default function ArchDiagram() {
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
        <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#94a3b8" />
        </marker>
      </defs>

      {/* DSL Layer */}
      <rect x="20" y="20" width="180" height="120" rx="12" fill="url(#gBlue)" filter="url(#shadow)" />
      <text x="110" y="55" textAnchor="middle" fill="white" fontWeight="700" fontSize="15">.oql / .testql</text>
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
    </svg>
  );
}
