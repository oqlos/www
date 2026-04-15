import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { OQL_EXAMPLES } from "../components/oql-examples";
import CodeEditor from "../components/CodeEditor";
import TerminalSim from "../components/TerminalSim";
import "../styles/global.css";

export default function Scenarios() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const jwt = localStorage.getItem("jwt");
  const [activeExample, setActiveExample] = useState("pump-test");
  const exampleKeys = Object.keys(OQL_EXAMPLES);

  if (!jwt) {
    navigate("/login");
    return null;
  }

  return (
    <div className="dashboard">
      <nav className="nav">
        <Link to="/" className="nav-logo"><em>OqlOS</em></Link>
        <div className="nav-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/nlp">NLP Console</Link>
          <Link to="/billing">Billing</Link>
          <span style={{ color: "var(--text-muted)", fontSize: 13 }}>{user.email}</span>
        </div>
      </nav>

      <div className="dash-content">
        <div className="section-label">Scenarios</div>
        <h2>OQL / TestQL Editor</h2>
        <p className="section-desc">
          Create, edit, and run test scenarios. Choose an example or write your own.
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
      </div>
    </div>
  );
}
