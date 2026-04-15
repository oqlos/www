import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/global.css";

const MOCK_OQL = `SCENARIO: "NLP Generated Test"
DEVICE_TYPE: "BA"

GOAL: Auto-generated from NLP
  SET 'pompa 1' '2 l/min'
  WAIT 2000ms
  SET 'pompa 1' '0'
  SAVE 'AI01'`;

export default function NlpConsole() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const jwt = localStorage.getItem("jwt");
  const [prompt, setPrompt] = useState("");
  const [targetLang, setTargetLang] = useState("oql");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  if (!jwt) {
    navigate("/login");
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    setOutput("");

    try {
      const endpoint = targetLang === "oql" ? "/nlp/to-oql" : targetLang === "iql" ? "/nlp/to-iql" : "/nlp/devops";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (res.ok) {
        setOutput(data.oql || data.iql || data.commands?.join("\n") || JSON.stringify(data, null, 2));
      } else {
        setOutput(`Error: ${data.detail || "NLP service unavailable"}`);
      }
    } catch {
      setOutput(MOCK_OQL + "\n\n# ⚠ NLP service not connected — showing mock output");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dashboard">
      <nav className="nav">
        <Link to="/" className="nav-logo"><em>OqlOS</em></Link>
        <div className="nav-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/scenarios">Scenarios</Link>
          <Link to="/billing">Billing</Link>
          <span style={{ color: "var(--text-muted)", fontSize: 13 }}>{user.email}</span>
        </div>
      </nav>

      <div className="dash-content">
        <div className="section-label">NLP Console</div>
        <h2>Natural Language → DSL</h2>
        <p className="section-desc">
          Describe what you want in plain language. The system converts it to OQL, IQL, or DevOps commands.
        </p>

        <div className="nlp-console">
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            {[
              { id: "oql", label: "⚙ → OQL" },
              { id: "iql", label: "🧪 → IQL" },
              { id: "devops", label: "🔧 → DevOps" },
            ].map((t) => (
              <button
                key={t.id}
                className={`install-tab ${targetLang === t.id ? "active" : ""}`}
                onClick={() => setTargetLang(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="nlp-input-row">
            <input
              type="text"
              placeholder={
                targetLang === "oql"
                  ? "e.g. Test pump at 2 l/min for 2 seconds then reverse"
                  : targetLang === "iql"
                  ? "e.g. Test that GET /api/v1/hardware/health returns 200"
                  : "e.g. Restart the staging docker container"
              }
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Generating…" : "Generate"}
            </button>
          </form>

          <div className="nlp-output">
            {output || "// Generated code will appear here…"}
          </div>
        </div>
      </div>
    </div>
  );
}
