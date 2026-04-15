import { Link, useNavigate } from "react-router-dom";
import "../styles/global.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const jwt = localStorage.getItem("jwt");

  if (!jwt) {
    navigate("/login");
    return null;
  }

  function logout() {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    navigate("/");
  }

  return (
    <div className="dashboard">
      <nav className="nav">
        <Link to="/" className="nav-logo"><em>OqlOS</em></Link>
        <div className="nav-links">
          <Link to="/scenarios">Scenarios</Link>
          <Link to="/nlp">NLP Console</Link>
          <Link to="/billing">Billing</Link>
          <span style={{ color: "var(--text-muted)", fontSize: 13 }}>{user.email}</span>
          <button className="btn btn-outline btn-sm" onClick={logout}>Logout</button>
        </div>
      </nav>

      <div className="dash-content">
        <h2 style={{ marginBottom: 8 }}>Dashboard</h2>
        <p className="section-desc">Overview of your OqlOS environment.</p>

        <div className="dash-grid">
          <div className="dash-stat">
            <h4>Scenarios</h4>
            <div className="value blue">3</div>
          </div>
          <div className="dash-stat">
            <h4>Devices</h4>
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
