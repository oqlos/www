import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import SharedNav from "../components/SharedNav";
import { useI18n } from "../i18n/I18nProvider";
import { mockFetch } from "../mocks/api";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL;

const ENDPOINTS = {
  oql: "/nlp/to-oql",
  iql: "/nlp/to-iql",
  devops: "/nlp/devops",
};

const PLACEHOLDERS = {
  oql: "e.g. Test pump at 2 l/min for 2 seconds then reverse",
  iql: "e.g. Test that GET /api/v1/hardware/health returns 200",
  devops: "e.g. Restart the staging docker container",
};

function getEndpoint(targetLang) {
  return ENDPOINTS[targetLang] || ENDPOINTS.oql;
}

function getPlaceholder(targetLang) {
  return PLACEHOLDERS[targetLang] || PLACEHOLDERS.oql;
}

export default function NlpConsole() {
  const { user, jwt, logout } = useAuth();
  const { t } = useI18n();
  const [prompt, setPrompt] = useState("");
  const [targetLang, setTargetLang] = useState("oql");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    setOutput("");

    try {
      const endpoint = getEndpoint(targetLang);
      const url = BACKEND_URL ? `${BACKEND_URL}${endpoint}` : endpoint;
      const res = await mockFetch(url, {
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
      setOutput(`Error: NLP service not connected. Backend URL: ${BACKEND_URL || "not configured"}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dashboard">
      <SharedNav user={user} onLogout={logout} />

      <div className="dash-content">
        <div className="section-label">NLP Console</div>
        <h2>{t("nlp_console.title")}</h2>
        <p className="section-desc">
          {t("nlp_console.subtitle")}
        </p>

        <div className="nlp-console">
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            {[
              { id: "oql", label: "⚙ → OQL" },
              { id: "iql", label: "🧪 → IQL" },
              { id: "devops", label: "🔧 → DevOps" },
            ].map((tab) => (
              <button
                key={tab.id}
                className={`install-tab ${targetLang === tab.id ? "active" : ""}`}
                onClick={() => setTargetLang(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="nlp-input-row">
            <input
              type="text"
              placeholder={getPlaceholder(targetLang)}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? t("nlp_console.generating") : t("nlp_console.generate")}
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
