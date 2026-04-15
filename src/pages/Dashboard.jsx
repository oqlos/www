import { useAuth } from "../hooks/useAuth";
import SharedNav from "../components/SharedNav";
import { useI18n } from "../i18n/I18nProvider";

export default function Dashboard() {
  const { user, logout, navigate } = useAuth();
  const { t } = useI18n();

  return (
    <div className="dashboard">
      <SharedNav user={user} onLogout={logout} />

      <div className="dash-content">
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
