import { useAuth } from "../hooks/useAuth";
import SharedNav from "../components/SharedNav";
import { useI18n } from "../i18n/I18nProvider";

const MOCK_ENABLED = import.meta.env.VITE_FORCE_MOCK_API === 'true' || !import.meta.env.VITE_BACKEND_URL;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL;

const MOCK_ENDPOINTS = [
  { path: "/auth/login", name: "Authentication" },
  { path: "/auth/verify", name: "Token Verification" },
  { path: "/api/user", name: "User API" },
  { path: "/api/scenarios", name: "Scenarios API" },
  { path: "/billing/subscribe", name: "Billing Subscribe" },
  { path: "/billing/subscription", name: "Billing Subscription" },
];

function MockStatus() {
  const { t } = useI18n();
  if (!MOCK_ENABLED) return null;

  return (
    <div style={{ 
      background: "#fef3c7", 
      border: "1px solid #f59e0b", 
      borderRadius: 8, 
      padding: 16, 
      marginBottom: 24 
    }}>
      <h4 style={{ margin: "0 0 12px 0", color: "#92400e" }}>
        ⚠️ {t("dashboard.mock_mode_title")}
      </h4>
      <p style={{ margin: "0 0 12px 0", color: "#78350f", fontSize: 14 }}>
        {t("dashboard.mock_mode_desc")}
      </p>
      <div style={{ fontSize: 13, color: "#92400e" }}>
        <strong>{t("dashboard.backend_url")}:</strong> {BACKEND_URL || t("dashboard.not_configured")}
      </div>
      <div style={{ marginTop: 12 }}>
        <strong style={{ fontSize: 13, color: "#92400e" }}>{t("dashboard.mocked_endpoints")}:</strong>
        <ul style={{ margin: "8px 0", paddingLeft: 20, fontSize: 13, color: "#78350f" }}>
          {MOCK_ENDPOINTS.map(ep => (
            <li key={ep.path}>{ep.name} <code style={{ background: "#fde68a", padding: "2px 4px", borderRadius: 4 }}>{ep.path}</code></li>
          ))}
        </ul>
      </div>
      <div style={{ marginTop: 12, fontSize: 12, color: "#92400e", borderTop: "1px solid #fbbf24", paddingTop: 8 }}>
        <strong>{t("dashboard.not_mocked")}:</strong> NLP/LLM API
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user, logout, navigate } = useAuth();
  const { t } = useI18n();

  return (
    <div className="dashboard">
      <SharedNav user={user} onLogout={logout} />

      <div className="dash-content">
        <MockStatus />
        <h2 style={{ marginBottom: 8 }}>{t("dashboard.title")}</h2>
        <p className="section-desc">{t("dashboard.subtitle")}</p>

        <div className="dash-grid">
          <div className="dash-stat">
            <h4>{t("dashboard.scenarios")}</h4>
            <div className="value blue">3</div>
          </div>
          <div className="dash-stat">
            <h4>{t("dashboard.devices")}</h4>
            <div className="value green">2</div>
          </div>
          <div className="dash-stat">
            <h4>Tests Run</h4>
            <div className="value amber">47</div>
          </div>
          <div className="dash-stat">
            <h4>Pass Rate</h4>
            <div className="value purple">98%</div>
          </div>
        </div>

        <section className="section" style={{ padding: 0 }}>
          <div className="section-label">Quick Actions</div>
          <h2>What would you like to do?</h2>
          <div className="features-grid" style={{ marginTop: 24 }}>
            <div className="feature-card" style={{ cursor: "pointer" }} onClick={() => navigate("/scenarios")}>
              <div className="feature-icon">⚙</div>
              <h3>Write OQL Scenario</h3>
              <p>Create or edit hardware test scenarios with syntax highlighting and live preview.</p>
            </div>
            <div className="feature-card" style={{ cursor: "pointer" }} onClick={() => navigate("/nlp")}>
              <div className="feature-icon">💬</div>
              <h3>NLP → OQL/IQL</h3>
              <p>Describe what you want in natural language and get a ready-made scenario.</p>
            </div>
            <div className="feature-card" style={{ cursor: "pointer" }} onClick={() => navigate("/billing")}>
              <div className="feature-icon">💳</div>
              <h3>Manage Plan</h3>
              <p>Upgrade to Pro for fleet management, reports, and compliance features.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
