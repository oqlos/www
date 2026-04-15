import { useState } from "react";
import { OQL_EXAMPLES } from "../components/oql-examples";
import CodeEditor from "../components/CodeEditor";
import TerminalSim from "../components/TerminalSim";
import { useAuth } from "../hooks/useAuth";
import SharedNav from "../components/SharedNav";
import { useI18n } from "../i18n/I18nProvider";

export default function Scenarios() {
  const { user, logout } = useAuth();
  const { t } = useI18n();
  const [activeExample, setActiveExample] = useState("pump-test");
  const exampleKeys = Object.keys(OQL_EXAMPLES);

  return (
    <div className="dashboard">
      <SharedNav user={user} onLogout={logout} />

      <div className="dash-content">
        <div className="section-label">Scenarios</div>
        <h2>{t("scenarios.title")}</h2>
        <p className="section-desc">
          {t("scenarios.subtitle")}
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
