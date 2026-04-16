import { useState, useCallback } from "react";
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
  
  // Store edited code for each scenario separately
  const [scenarioCodes, setScenarioCodes] = useState(() => {
    const initial = {};
    Object.keys(OQL_EXAMPLES).forEach((key) => {
      initial[key] = OQL_EXAMPLES[key].code;
    });
    return initial;
  });
  
  const exampleKeys = Object.keys(OQL_EXAMPLES);
  const currentScenario = OQL_EXAMPLES[activeExample];
  const currentCode = scenarioCodes[activeExample];

  const handleCodeChange = useCallback((newCode) => {
    setScenarioCodes((prev) => ({
      ...prev,
      [activeExample]: newCode,
    }));
  }, [activeExample]);

  const handleTabChange = useCallback((key) => {
    setActiveExample(key);
  }, []);

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
                onClick={() => handleTabChange(k)}
              >
                {OQL_EXAMPLES[k].title}
              </button>
            ))}
          </div>
          <CodeEditor 
            example={currentScenario} 
            value={currentCode}
            onChange={handleCodeChange}
          />
        </div>

        <TerminalSim 
          scenarioData={currentScenario}
          code={currentCode}
        />
      </div>
    </div>
  );
}
