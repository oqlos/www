import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { OQL_EXAMPLES } from "../components/oql-examples";
import CodeEditor from "../components/CodeEditor";
import TerminalSim from "../components/TerminalSim";
import PricingCards from "../components/PricingCards";
import ArchDiagram from "../components/ArchDiagram";
import logger from "../utils/logger";
import { INSTALL_DOCKER, INSTALL_PIP, INSTALL_RPI } from "../data/install-commands";
import { config } from "../config";

export default function Landing() {
  const [activeExample, setActiveExample] = useState("pump-test");
  const [activeTab, setActiveTab] = useState("docker");
  const [copiedTab, setCopiedTab] = useState(null);
  const exampleKeys = Object.keys(OQL_EXAMPLES);

  useEffect(() => {
    logger.info("Landing page loaded", "Landing", { exampleCount: exampleKeys.length });
  }, [exampleKeys.length]);

  const handleExampleChange = (key) => {
    setActiveExample(key);
    logger.debug(`Example changed to: ${key}`, "Landing", { key });
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    logger.debug(`Tab changed to: ${tabId}`, "Landing", { tabId });
  };

  const handleCopy = (tab, code) => {
    navigator.clipboard.writeText(code);
    setCopiedTab(tab);
    logger.info(`Code copied for tab: ${tab}`, "Landing", { tab });
    setTimeout(() => setCopiedTab(null), 2000);
  };

  return (
    <div className="oqlos-root">
      {/* ═══ NAV ═══ */}
      <nav className="nav">
        <Link to="/" className="nav-logo"><em>OqlOS</em></Link>
        <div className="nav-links">
          <a href="#editor">Editor</a>
          <a href="#install">Install</a>
          <a href="#api">API</a>
          <Link to="/login">Login</Link>
        </div>
      </nav>

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
        <h2>Od pliku .oql do pomiaru na sensorze</h2>
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
            <button
              className="copy-btn"
              onClick={() => handleCopy('docker', INSTALL_DOCKER({ repo: config.github, apiUrl: config.api, ideUrl: config.ide, traefikUrl: config.traefik }))}
            >
              {copiedTab === 'docker' ? '✓ Skopiowane!' : '📋 Kopiuj'}
            </button>
            <span className="cm"># Clone the monorepo</span>{"\n"}
            <span className="kw">git clone</span> <span className="str">{config.github}</span>{"\n"}
            <span className="kw">cd</span> oqlos{"\n\n"}
            <span className="cm"># Development mode (API + IDE + Traefik)</span>{"\n"}
            <span className="kw">docker-compose</span> <span className="fl">-f infra/docker/dev/docker-compose.dev.yml</span> up{"\n\n"}
            <span className="cm"># Access points:</span>{"\n"}
            <span className="cm">#   API:       {config.api}</span>{"\n"}
            <span className="cm">#   IDE:       {config.ide}</span>{"\n"}
            <span className="cm">#   Traefik:   {config.traefik}</span>{"\n\n"}
            <span className="cm"># Production mode (TLS + Let's Encrypt)</span>{"\n"}
            <span className="kw">docker-compose</span> <span className="fl">-f infra/docker/prod/docker-compose.prod.yml</span> up -d{"\n"}
          </div>
        )}
        {activeTab === "pip" && (
          <div className="install-code">
            <button
              className="copy-btn"
              onClick={() => handleCopy('pip', INSTALL_PIP)}
            >
              {copiedTab === 'pip' ? '✓ Skopiowane!' : '📋 Kopiuj'}
            </button>
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
            <button
              className="copy-btn"
              onClick={() => handleCopy('rpi', INSTALL_RPI({ usbDevice: config.usb, i2cBus: config.i2c, wsUrl: config.wsUrl, dockerImage: config.docker, hwMode: config.hwMode, modbusPort: config.modbus, agentPort: config.agentPort }))}
            >
              {copiedTab === 'rpi' ? '✓ Skopiowane!' : '📋 Kopiuj'}
            </button>
            <span className="cm"># On Raspberry Pi 3B+ / 4 / 5</span>{"\n\n"}
            <span className="cm"># Option A: Docker agent</span>{"\n"}
            <span className="kw">docker run</span> -d \{"\n"}
            {"  "}<span className="fl">--device={config.usb}</span> \{"\n"}
            {"  "}<span className="fl">--device={config.i2c}</span> \{"\n"}
            {"  "}<span className="fl">-e AGENT_ID=rpi-node-01</span> \{"\n"}
            {"  "}<span className="fl">-e API_WS_URL={config.wsUrl}</span> \{"\n"}
            {"  "}<span className="fl">-e HARDWARE_MODE=rpi</span> \{"\n"}
            {"  "}<span className="str">{config.docker}</span>{"\n\n"}
            <span className="cm"># Option B: Native install</span>{"\n"}
            <span className="kw">pip install</span> oqlos oql{"\n"}
            <span className="kw">export</span> OQLOS_HARDWARE_MODE={config.hwMode}{"\n"}
            <span className="kw">export</span> MODBUS_SERIAL_PORT={config.modbus}{"\n"}
            <span className="kw">oqlos-server</span> <span className="fl">--port {config.agentPort}</span>{"\n\n"}
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
        <PricingCards onSubscribe={(plan) => window.location.href = `/login?plan=${plan}`} />
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="footer">
        <p>
          OqlOS © {config.copyright} · <a href="{config.github}">GitHub</a> · Apache 2.0 ·
          Python 3.10+ · FastAPI · React · Docker
        </p>
        <p style={{marginTop:8}}>
          96 tests passing · 3 scenarios (12/12 goals) · CC̄≤15 · 0 violations
        </p>
      </footer>
    </div>
  );
}
