import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import SharedNav from "../components/SharedNav";
import { useI18n } from "../i18n/I18nProvider";
import { MOCK_STATUS } from "../mocks/api";

export default function Status() {
  const { user, logout } = useAuth();
  const { t } = useI18n();
  const status = MOCK_STATUS;
  const [copied, setCopied] = useState(false);

  const getStatusColor = (enabled) => enabled ? "#dc2626" : "#16a34a";
  const getStatusBg = (enabled) => enabled ? "#fef2f2" : "#f0fdf4";
  const getStatusBorder = (enabled) => enabled ? "#fecaca" : "#bbf7d0";

  const copyAsYaml = () => {
    let yaml = `# OqlOS Status
# Generated at: ${new Date().toISOString()}

global:
  mock_enabled: ${status.globalEnabled}
  backend_url: ${status.backendUrl || 'null'}
  force_mock_all: ${status.forceMockAll}

endpoints:`;
    Object.entries(status.endpoints).forEach(([key, endpoint]) => {
      yaml += `\n  ${key}:`;
      yaml += `\n    mocked: ${endpoint.mocked}`;
      yaml += `\n    path: ${endpoint.path}`;
      yaml += `\n    description: ${endpoint.description}`;
    });

    yaml += `\n\nenvironment_variables:\n`;
    yaml += `  VITE_FORCE_MOCK_API: ${import.meta.env.VITE_FORCE_MOCK_API || 'not set'}\n`;
    yaml += `  VITE_MOCK_AUTH: ${import.meta.env.VITE_MOCK_AUTH || 'auto'}\n`;
    yaml += `  VITE_MOCK_USER_API: ${import.meta.env.VITE_MOCK_USER_API || 'auto'}\n`;
    yaml += `  VITE_MOCK_SCENARIOS: ${import.meta.env.VITE_MOCK_SCENARIOS || 'auto'}\n`;
    yaml += `  VITE_MOCK_BILLING: ${import.meta.env.VITE_MOCK_BILLING || 'auto'}\n`;
    yaml += `  VITE_MOCK_NLP: ${import.meta.env.VITE_MOCK_NLP || 'auto'}`;

    navigator.clipboard.writeText(yaml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="dashboard">
      <SharedNav user={user} onLogout={logout} />

      <div className="dash-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <h2 style={{ margin: 0 }}>{t("status.title")}</h2>
          <button
            onClick={copyAsYaml}
            style={{
              padding: '8px 16px',
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid var(--border)',
              borderRadius: 6,
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontSize: 13
            }}
          >
            {copied ? t("status.yaml_copied") : t("status.copy_yaml")}
          </button>
        </div>
        <p className="section-desc">{t("status.subtitle")}</p>

        {/* Global Status */}
        <div style={{
          background: status.globalEnabled ? "#fef3c7" : "#f0fdf4",
          border: `1px solid ${status.globalEnabled ? "#fbbf24" : "#bbf7d0"}`,
          borderRadius: 8,
          padding: 16,
          marginBottom: 24
        }}>
          <h4 style={{ margin: "0 0 12px 0", color: status.globalEnabled ? "#92400e" : "#166534" }}>
            {status.globalEnabled ? "⚠️ " + t("status.mock_active") : "✅ " + t("status.mock_inactive")}
          </h4>
          <div style={{ fontSize: 14, color: status.globalEnabled ? "#78350f" : "#166534" }}>
            <strong>{t("status.backend_url")}:</strong> {status.backendUrl || t("status.not_configured")}
          </div>
          <div style={{ fontSize: 14, color: status.globalEnabled ? "#78350f" : "#166534", marginTop: 8 }}>
            <strong>{t("status.force_mock_all")}:</strong> {status.forceMockAll ? t("status.yes") : t("status.no")}
          </div>
        </div>

        {/* Endpoints Status */}
        <h3 style={{ marginBottom: 16 }}>{t("status.endpoints_title")}</h3>
        <div style={{ display: "grid", gap: 12, marginBottom: 32 }}>
          {Object.entries(status.endpoints).map(([key, endpoint]) => (
            <div key={key} style={{
              background: getStatusBg(endpoint.mocked),
              border: `1px solid ${getStatusBorder(endpoint.mocked)}`,
              borderRadius: 8,
              padding: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div>
                <div style={{ fontWeight: 600, color: "#1f2937", marginBottom: 4 }}>
                  {endpoint.description}
                </div>
                <code style={{
                  background: endpoint.mocked ? "#fecaca" : "#bbf7d0",
                  padding: "2px 8px",
                  borderRadius: 4,
                  fontSize: 13,
                  color: "#374151"
                }}>
                  {endpoint.path}
                </code>
              </div>
              <div style={{
                background: getStatusColor(endpoint.mocked),
                color: "white",
                padding: "4px 12px",
                borderRadius: 4,
                fontSize: 13,
                fontWeight: 500
              }}>
                {endpoint.mocked ? t("status.mocked") : t("status.real")}
              </div>
            </div>
          ))}
        </div>

        {/* Environment Variables */}
        <h3 style={{ marginBottom: 16 }}>{t("status.env_title")}</h3>
        <div style={{
          background: "#f9fafb",
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          padding: 16,
          fontFamily: "monospace",
          fontSize: 13
        }}>
          <div style={{ marginBottom: 8 }}>
            <span style={{ color: "#6b7280" }}>VITE_FORCE_MOCK_API=</span>
            <span style={{ color: import.meta.env.VITE_FORCE_MOCK_API === "true" ? "#dc2626" : "#16a34a" }}>
              {import.meta.env.VITE_FORCE_MOCK_API || "not set"}
            </span>
          </div>
          <div style={{ marginBottom: 8 }}>
            <span style={{ color: "#6b7280" }}>VITE_MOCK_AUTH=</span>
            <span style={{ color: status.endpoints.auth.mocked ? "#dc2626" : "#16a34a" }}>
              {import.meta.env.VITE_MOCK_AUTH || "auto"}
            </span>
          </div>
          <div style={{ marginBottom: 8 }}>
            <span style={{ color: "#6b7280" }}>VITE_MOCK_USER_API=</span>
            <span style={{ color: status.endpoints.userApi.mocked ? "#dc2626" : "#16a34a" }}>
              {import.meta.env.VITE_MOCK_USER_API || "auto"}
            </span>
          </div>
          <div style={{ marginBottom: 8 }}>
            <span style={{ color: "#6b7280" }}>VITE_MOCK_SCENARIOS=</span>
            <span style={{ color: status.endpoints.scenarios.mocked ? "#dc2626" : "#16a34a" }}>
              {import.meta.env.VITE_MOCK_SCENARIOS || "auto"}
            </span>
          </div>
          <div style={{ marginBottom: 8 }}>
            <span style={{ color: "#6b7280" }}>VITE_MOCK_BILLING=</span>
            <span style={{ color: status.endpoints.billing.mocked ? "#dc2626" : "#16a34a" }}>
              {import.meta.env.VITE_MOCK_BILLING || "auto"}
            </span>
          </div>
          <div>
            <span style={{ color: "#6b7280" }}>VITE_MOCK_NLP=</span>
            <span style={{ color: status.endpoints.nlp.mocked ? "#dc2626" : "#16a34a" }}>
              {import.meta.env.VITE_MOCK_NLP || "auto"}
            </span>
          </div>
        </div>

        {/* Documentation Link */}
        <div style={{ marginTop: 24, padding: 16, background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 8 }}>
          <p style={{ margin: 0, fontSize: 14, color: "#1e40af" }}>
            📚 <strong>{t("status.docs_title")}:</strong> {t("status.docs_text")}
          </p>
        </div>
      </div>
    </div>
  );
}
