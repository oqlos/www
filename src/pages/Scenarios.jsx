import { useState } from "react";
import { OQL_EXAMPLES } from "../components/oql-examples";
import CodeEditor from "../components/CodeEditor";
import TerminalSim from "../components/TerminalSim";
import { useAuth } from "../hooks/useAuth";
import SharedNav from "../components/SharedNav";

export default function Scenarios() {
  const { user, logout } = useAuth();
  const [activeExample, setActiveExample] = useState("pump-test");
  const exampleKeys = Object.keys(OQL_EXAMPLES);

  return (
    <div className="dashboard">
      <SharedNav user={user} onLogout={logout} />

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
